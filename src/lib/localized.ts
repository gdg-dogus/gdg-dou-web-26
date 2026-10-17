import { z } from "zod";
import type { Locale } from "@/i18n/routing";

/**
 * İçerik dosyalarında iki dilli alanlar bu şekilde tutulur:
 *   "title": { "tr": "Atölye", "en": "Workshop" }
 * Türkçe zorunludur; İngilizce yoksa Türkçe gösterilir.
 */
export const localizedString = z.object({
  tr: z.string().trim().min(1),
  en: z.string().trim().min(1).optional(),
});

export const localizedList = z.object({
  tr: z.array(z.string().trim().min(1)),
  en: z.array(z.string().trim().min(1)).optional(),
});

export type LocalizedString = z.infer<typeof localizedString>;
export type LocalizedList = z.infer<typeof localizedList>;

/** İki dilli bir alandan istenen dili seçer, yoksa Türkçeye düşer. */
export function localize<T>(value: { tr: T; en?: T }, locale: Locale): T {
  return value[locale] ?? value.tr;
}
