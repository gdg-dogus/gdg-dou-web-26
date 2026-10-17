import { z } from "zod";
import { localizedString } from "@/lib/localized";

export const eventCategories = [
  "summit",
  "workshop",
  "tech_talk",
  "trip",
  "info_session",
  "design",
] as const;
export type EventCategory = (typeof eventCategories)[number];

const time = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Saat SS:DD biçiminde olmalı, ör. 13:00");

/**
 * content/events/<slug>.json dosyalarının şeması.
 * `.strict()` sayesinde yanlış yazılmış ya da bilinmeyen bir alan build'i durdurur.
 */
export const eventSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug küçük harf, rakam ve tire içermeli"),
    /** gdg.community.dev'deki etkinlik numarası. Varsa kayıt linki ve görsel oradan tamamlanır. */
    gdgId: z.string().regex(/^\d+$/).optional(),
    category: z.enum(eventCategories),
    date: z.iso.date(),
    startTime: time,
    endTime: time.optional(),
    title: localizedString,
    summary: localizedString,
    description: localizedString,
    location: localizedString,
    speakers: z
      .array(
        z
          .object({
            name: z.string().trim().min(1),
            role: localizedString.optional(),
            /** Kare fotoğraf, ör. /images/events/speakers/ad-soyad.webp */
            photo: z.string().optional(),
            /** LinkedIn ya da kişisel sayfa */
            link: z.url().optional(),
          })
          .strict(),
      )
      .default([]),
    /** Saat saat program akışı (zirveler, uzun atölyeler) */
    agenda: z
      .array(
        z
          .object({
            time,
            title: localizedString,
            /** O oturumun konuşmacısı */
            speaker: z.string().trim().min(1).optional(),
          })
          .strict(),
      )
      .default([]),
    image: z.string().optional(),
    /** Etkinlikten fotoğraflar; geçmiş etkinliklerin detay sayfasında gösterilir */
    gallery: z.array(z.string()).default([]),
    registration: z
      .object({
        url: z.url(),
        open: z.boolean().default(true),
        label: localizedString.optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export type EventData = z.infer<typeof eventSchema>;
