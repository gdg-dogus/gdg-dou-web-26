import { z } from "zod";
import { localizedString } from "@/lib/localized";

export const projectPlatforms = ["android", "ios", "web", "windows", "macos", "linux"] as const;
export type ProjectPlatform = (typeof projectPlatforms)[number];

/** content/projects/<slug>.json */
export const projectSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug küçük harf, rakam ve tire içermeli"),
    title: z.string().trim().min(1),
    /** teams.json içindeki bir ekip anahtarı (ör. "game") */
    team: z.string(),
    year: z.number().int().min(2015),
    summary: localizedString,
    /** 16:9 kapak görseli */
    cover: z.string(),
    platforms: z.array(z.enum(projectPlatforms)).min(1),
    /** Kullanılan motor ve araçlar, ör. Unity, Blender */
    tools: z.array(z.string().trim().min(1)).default([]),
    /** Projeyi geliştirenlerin adları */
    credits: z.array(z.string().trim().min(1)).min(1),
    links: z
      .object({
        /** Projenin oynanabildiği ya da indirilebildiği sayfa (itch.io, Google Play, web sitesi) */
        page: z.url().optional(),
        source: z.url().optional(),
        video: z.url().optional(),
      })
      .strict()
      .default({}),
  })
  .strict();

export type Project = z.infer<typeof projectSchema>;
