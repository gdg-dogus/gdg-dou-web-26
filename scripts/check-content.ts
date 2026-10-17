/**
 * İçerik ve çeviri kontrolü: pnpm check:content
 *
 * - content/ altındaki tüm dosyaları şemalara göre doğrular
 * - messages/tr ve messages/en dosyalarında aynı anahtarların olduğunu kontrol eder
 *
 * CI'da her PR'da çalışır. CMS'den ya da elle girilen hatalı veri buradan geçemez.
 */
import fs from "node:fs";
import path from "node:path";
import { getPosts } from "@/features/blog/data";
import { getEvents } from "@/features/events/data";
import { getOffers } from "@/features/offers/data";
import { getProjects } from "@/features/projects/data";
import { getTeams } from "@/features/team/data";
import { namespaces } from "@/i18n/namespaces";
import { routing } from "@/i18n/routing";

process.env.COMMUNITY_EVENTS ??= "off";

let failed = false;
const ok = (msg: string) => console.log(`✓ ${msg}`);
const fail = (msg: string) => {
  failed = true;
  console.error(`✗ ${msg}`);
};

async function run(label: string, fn: () => unknown | Promise<unknown>) {
  try {
    const result = await fn();
    ok(`${label}${Array.isArray(result) ? ` (${result.length})` : ""}`);
  } catch (error) {
    fail(`${label}\n${error instanceof Error ? error.message : String(error)}`);
  }
}

function keysOf(obj: unknown, prefix = ""): string[] {
  if (obj === null || typeof obj !== "object") return [prefix];
  return Object.entries(obj).flatMap(([k, v]) => keysOf(v, prefix ? `${prefix}.${k}` : k));
}

async function main() {
  await run("Etkinlikler", getEvents);
  await run("Ekipler ve üyeler", getTeams);
  await run("Öğrenci teklifleri", getOffers);
  await run("Projeler", getProjects);
  for (const locale of routing.locales)
    await run(`Blog yazıları (${locale})`, () => getPosts(locale));

  for (const ns of namespaces) {
    const read = (locale: string) =>
      JSON.parse(fs.readFileSync(path.join("messages", locale, `${ns}.json`), "utf8"));
    const [source, ...others] = routing.locales;
    const sourceKeys = new Set(keysOf(read(source)));
    for (const locale of others) {
      const keys = new Set(keysOf(read(locale)));
      const missing = [...sourceKeys].filter((k) => !keys.has(k));
      const extra = [...keys].filter((k) => !sourceKeys.has(k));
      if (missing.length || extra.length) {
        fail(
          `messages/${locale}/${ns}.json uyumsuz` +
            (missing.length ? `\n  eksik: ${missing.join(", ")}` : "") +
            (extra.length ? `\n  fazla: ${extra.join(", ")}` : ""),
        );
      } else {
        ok(`Çeviriler: ${ns}`);
      }
    }
  }

  if (failed) process.exit(1);
}

main();
