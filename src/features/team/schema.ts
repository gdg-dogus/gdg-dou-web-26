import { z } from "zod";
import { localizedString } from "@/lib/localized";

export const teamSchema = z
  .object({
    key: z.string().regex(/^[a-z0-9_]+$/),
    name: localizedString,
    description: localizedString,
  })
  .strict();

export const teamsFileSchema = z.object({ teams: z.array(teamSchema).min(1) }).strict();

/** content/members/<isim-soyisim>.json */
export const memberSchema = z
  .object({
    name: z.string().trim().min(1),
    /** teams.json içindeki bir ekip anahtarı (ör. "web") */
    team: z.string(),
    role: localizedString,
    /** Kaptan, kaptan yardımcısı veya organizatör ise true */
    lead: z.boolean().default(false),
    /** Ekip içindeki sıralama; küçük sayı önce gelir */
    order: z.number().int().default(100),
    photo: z.string().optional(),
    bio: localizedString.optional(),
    links: z
      .object({
        linkedin: z.url().optional(),
        github: z.url().optional(),
        instagram: z.url().optional(),
        website: z.url().optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export type Team = z.infer<typeof teamSchema>;
export type Member = z.infer<typeof memberSchema>;
