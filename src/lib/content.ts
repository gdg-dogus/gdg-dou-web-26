import fs from "node:fs";
import path from "node:path";
import { type ZodType, z } from "zod";

/**
 * İçerik dosyaları (content/ klasörü) build sırasında okunur.
 * Bu fonksiyonlar sadece Server Component'lerde ve features/<özellik>/data.ts
 * dosyalarında kullanılmalı; "use client" bileşenlerinde çalışmaz.
 */
export const CONTENT_DIR = path.join(process.cwd(), "content");

export class ContentError extends Error {
  constructor(file: string, error: z.ZodError) {
    super(`\n\n✗ İçerik hatası: content/${file}\n${z.prettifyError(error)}\n`);
    this.name = "ContentError";
  }
}

/** Tek bir JSON dosyasını okur ve şemaya göre doğrular. */
export function readJsonFile<T>(file: string, schema: ZodType<T>): T {
  const raw = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, file), "utf8"));
  const result = schema.safeParse(raw);
  if (!result.success) throw new ContentError(file, result.error);
  return result.data;
}

/** Bir klasördeki tüm JSON dosyalarını okur ve her birini doğrular. */
export function readJsonDir<T>(dir: string, schema: ZodType<T>): T[] {
  const full = path.join(CONTENT_DIR, dir);
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => readJsonFile(path.join(dir, f), schema));
}
