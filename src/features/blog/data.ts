import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import type { Locale } from "@/i18n/routing";
import { CONTENT_DIR } from "@/lib/content";
import { type PostFrontmatter, postFrontmatterSchema } from "./schema";

export type Post = PostFrontmatter & {
  slug: string;
  locale: Locale;
  /** Markdown gövdesi (HTML'e çevrilmemiş) */
  body: string;
  readingMinutes: number;
};

const BLOG_DIR = path.join(CONTENT_DIR, "blog");
const FILE = /^(?<slug>[a-z0-9-]+)\.(?<locale>tr|en)\.md$/;

function readPost(file: string): Post {
  const match = FILE.exec(file);
  if (!match?.groups) throw new Error(`Blog dosya adı hatalı: ${file} (beklenen: slug.tr.md)`);
  const { data, content } = matter(fs.readFileSync(path.join(BLOG_DIR, file), "utf8"));
  const result = postFrontmatterSchema.safeParse(data);
  if (!result.success) throw new Error(`content/blog/${file}\n${z.prettifyError(result.error)}`);
  return {
    ...result.data,
    slug: match.groups.slug,
    locale: match.groups.locale as Locale,
    body: content,
    readingMinutes: Math.max(1, Math.round(content.split(/\s+/).length / 200)),
  };
}

/** İstenen dildeki yazılar; o dilde çevirisi olmayan yazı Türkçe gösterilir. En yeni önce. */
export function getPosts(locale: Locale): Post[] {
  const all = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(readPost);
  const bySlug = new Map<string, Post>();
  for (const p of all) {
    const current = bySlug.get(p.slug);
    if (!current || p.locale === locale) bySlug.set(p.slug, p);
  }
  return [...bySlug.values()].sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getPost(slug: string, locale: Locale) {
  return getPosts(locale).find((p) => p.slug === slug);
}
