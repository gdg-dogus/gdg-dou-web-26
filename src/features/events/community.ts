import { z } from "zod";
import { siteConfig } from "@/config/site";
import type { EventCategory, EventData } from "./schema";

/**
 * gdg.community.dev API'si.
 * Build sırasında çağrılır; API'ye ulaşılamazsa sadece content/events kullanılır.
 * Yerelde API'yi kapatmak için: COMMUNITY_EVENTS=off pnpm dev
 */
const API_BASE = `https://gdg.community.dev/api/event_slim/for_chapter/${siteConfig.communityChapterId}/`;
const TIME_ZONE = "Europe/Istanbul";

/** API'de mekân bilgisi olmayan (çevrim içi) etkinliklerin konumu. Bu etkinliklerde harita gösterilmez. */
export const ONLINE_LOCATION = "GDG Community";

const nullableString = z.string().nullish();
const apiEventSchema = z.looseObject({
  id: z.number(),
  title: z.string(),
  start_date: z.string(),
  end_date: nullableString,
  description: nullableString,
  description_short: nullableString,
  event_type_title: nullableString,
  cropped_picture_url: nullableString,
  cropped_banner_url: nullableString,
  url: nullableString,
  static_url: nullableString,
  cohost_registration_url: nullableString,
  venue_name: nullableString,
  venue_address: nullableString,
  venue_city: nullableString,
});
const apiResponseSchema = z.looseObject({ results: z.array(apiEventSchema) });
type ApiEvent = z.infer<typeof apiEventSchema>;

export type CommunityEvent = {
  event: EventData;
  communityUrl?: string;
};

const FIELDS = Object.keys(apiEventSchema.shape).join(",");

function buildUrl(status: "Live" | "Completed") {
  const params = new URLSearchParams({
    page_size: "100",
    status,
    include_cohosted_events: "true",
    visible_on_parent_chapter_only: "true",
    order: status === "Live" ? "start_date" : "-start_date",
    fields: FIELDS,
  });
  return `${API_BASE}?${params}`;
}

function toPlainText(html?: string | null) {
  return (html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function istanbulParts(iso: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(iso))
      .map((p) => [p.type, p.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
  };
}

function mapCategory(e: ApiEvent): EventCategory {
  const title = e.title.toLocaleLowerCase("tr-TR");
  if (/gezi|trip|tour/.test(title)) return "trip";
  const type = (e.event_type_title ?? "").toLowerCase();
  if (type.includes("conference")) return "summit";
  if (type.includes("workshop") || type.includes("study")) return "workshop";
  if (type.includes("info")) return "info_session";
  return "tech_talk";
}

function normalize(e: ApiEvent): CommunityEvent {
  const start = istanbulParts(e.start_date);
  const end = e.end_date ? istanbulParts(e.end_date) : undefined;
  const description = toPlainText(e.description) || toPlainText(e.description_short) || e.title;
  const summary = toPlainText(e.description_short) || description;
  const location =
    [e.venue_name, e.venue_address, e.venue_city].map(toPlainText).filter(Boolean).join(", ") ||
    ONLINE_LOCATION;
  const communityUrl = e.url ?? e.static_url ?? undefined;
  const registrationUrl = e.cohost_registration_url ?? communityUrl;

  return {
    communityUrl,
    event: {
      slug: `gdg-${e.id}`,
      gdgId: String(e.id),
      category: mapCategory(e),
      date: start.date,
      startTime: start.time,
      endTime: end && end.date === start.date ? end.time : undefined,
      title: { tr: e.title },
      summary: { tr: summary },
      description: { tr: description },
      location: { tr: location },
      speakers: [],
      agenda: [],
      gallery: [],
      image: e.cropped_picture_url ?? e.cropped_banner_url ?? undefined,
      registration: registrationUrl ? { url: registrationUrl, open: true } : undefined,
    },
  };
}

async function fetchStatus(status: "Live" | "Completed") {
  const res = await fetch(buildUrl(status), {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return apiResponseSchema.parse(await res.json()).results.map(normalize);
}

export async function fetchCommunityEvents(): Promise<CommunityEvent[]> {
  if (process.env.COMMUNITY_EVENTS === "off") return [];
  try {
    const [live, completed] = await Promise.all([fetchStatus("Live"), fetchStatus("Completed")]);
    return [...live, ...completed];
  } catch (error) {
    console.warn(
      `⚠ GDG Community etkinlikleri alınamadı, sadece content/events kullanılıyor. (${String(error)})`,
    );
    return [];
  }
}
