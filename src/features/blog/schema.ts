import { z } from "zod";

export const blogCategories = ["ai", "cloud", "development", "design", "community"] as const;

/** content/blog/<slug>.<dil>.md dosyalarının üst bilgisi (frontmatter) */
export const postFrontmatterSchema = z
  .object({
    title: z.string().trim().min(1),
    date: z.coerce.date(),
    author: z.string().trim().min(1),
    category: z.enum(blogCategories),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    excerpt: z.string().trim().min(1),
  })
  .strict();

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;
