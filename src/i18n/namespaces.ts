/**
 * Çeviri dosyaları sayfa başına ayrıdır: messages/<dil>/<namespace>.json
 * Yeni bir sayfa için çeviri dosyası eklerseniz adını buraya da ekleyin
 * ve src/i18n/messages.d.ts dosyasındaki tipe ekleyin.
 */
export const namespaces = [
  "common",
  "home",
  "events",
  "team",
  "blog",
  "offers",
  "about",
  "projects",
] as const;
