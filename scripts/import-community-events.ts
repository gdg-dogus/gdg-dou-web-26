/** GDG Community kayıtlarını CMS'de düzenlenebilir yerel dosyalara aktarır. */
import fs from "node:fs";
import path from "node:path";
import { fetchCommunityEvents } from "@/features/events/community";
import { eventSchema } from "@/features/events/schema";
import { readJsonDir } from "@/lib/content";

async function main() {
  const local = readJsonDir("events", eventSchema);
  const ids = new Set(local.map((event) => event.gdgId).filter(Boolean));
  const slugs = new Set(local.map((event) => event.slug));
  const remote = await fetchCommunityEvents();
  if (remote.length === 0) {
    throw new Error(
      "İçe aktarılacak veri alınamadı. Bağlantıyı ve COMMUNITY_EVENTS ayarını kontrol edin.",
    );
  }

  // Yazmaya başlamadan önce tüm yeni kayıtları doğrula. CMS'deki düzenlemeleri koru.
  const additions = [];
  for (const { event } of remote) {
    if (event.gdgId && ids.has(event.gdgId)) continue;
    const parsed = eventSchema.parse(event);
    if (slugs.has(parsed.slug)) throw new Error(`Kısa ad zaten kullanılıyor: ${parsed.slug}`);
    additions.push(parsed);
    slugs.add(parsed.slug);
    if (parsed.gdgId) ids.add(parsed.gdgId);
  }

  for (const event of additions) {
    const file = path.join(process.cwd(), "content", "events", `${event.slug}.json`);
    fs.writeFileSync(file, `${JSON.stringify(event, null, 2)}\n`, { flag: "wx" });
    console.log(`✓ ${event.title.tr} → ${event.slug}.json`);
  }
  console.log(`${additions.length} etkinlik eklendi. Mevcut etkinlikler değiştirilmedi.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
