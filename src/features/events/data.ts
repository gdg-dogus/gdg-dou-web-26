import type { Locale } from "@/i18n/routing";
import { readJsonDir } from "@/lib/content";
import { localize } from "@/lib/localized";
import { fetchCommunityEvents } from "./community";
import { type EventCategory, type EventData, eventSchema } from "./schema";

export type EventStatus = "upcoming" | "past";

export type EventItem = EventData & {
  status: EventStatus;
  /** gdg.community.dev'deki etkinlik sayfası */
  communityUrl?: string;
};

/** Client bileşenlerine gönderilen, tek dile çevrilmiş sade etkinlik nesnesi. */
export type EventView = {
  slug: string;
  category: EventCategory;
  date: string;
  startTime: string;
  endTime?: string;
  title: string;
  summary: string;
  location: string;
  image?: string;
  status: EventStatus;
  /** Sadece yaklaşan ve kaydı açık etkinliklerde dolu */
  registrationUrl?: string;
  registrationLabel?: string;
};

// Türkiye 2016'dan beri sabit UTC+3 kullanıyor.
export function eventStart(e: Pick<EventData, "date" | "startTime">) {
  return new Date(`${e.date}T${e.startTime}:00+03:00`);
}
export function eventEnd(e: Pick<EventData, "date" | "startTime" | "endTime">) {
  return new Date(`${e.date}T${e.endTime ?? e.startTime}:00+03:00`);
}

// API her sayfa için yeniden çağrılmasın diye sadece onun sonucu saklanır.
// content/events her seferinde okunur; böylece `pnpm dev` açıkken eklenen dosya hemen görünür.
let remoteCache: ReturnType<typeof fetchCommunityEvents> | undefined;

/**
 * Tüm etkinlikler: content/events + gdg.community.dev.
 * Aynı gdgId'ye sahip yerel dosya varsa yerel bilgiler önceliklidir;
 * API sadece eksik kayıt linkini ve görseli tamamlar.
 * Durum (yaklaşan/geçmiş) build anına göre hesaplanır; site her gün yeniden build edilir.
 */
export async function getEvents(): Promise<EventItem[]> {
  const local = readJsonDir("events", eventSchema);
  remoteCache ??= fetchCommunityEvents();
  const remote = await remoteCache;
  const remoteById = new Map(remote.map((r) => [r.event.gdgId, r]));
  const localIds = new Set(local.map((e) => e.gdgId).filter(Boolean));

  const merged = [
    ...local.map((e) => {
      const r = e.gdgId ? remoteById.get(e.gdgId) : undefined;
      return {
        ...e,
        image: e.image ?? r?.event.image,
        registration: e.registration ?? r?.event.registration,
        communityUrl: r?.communityUrl,
      };
    }),
    ...remote
      .filter((r) => !localIds.has(r.event.gdgId))
      .map((r) => ({ ...r.event, communityUrl: r.communityUrl })),
  ];

  const slugs = new Set<string>();
  for (const e of merged) {
    if (slugs.has(e.slug)) throw new Error(`Aynı slug iki kez kullanılmış: ${e.slug}`);
    slugs.add(e.slug);
  }

  const now = Date.now();
  return merged
    .map((e) => ({
      ...e,
      status: (eventEnd(e).getTime() >= now ? "upcoming" : "past") as EventStatus,
    }))
    .sort((a, b) => eventStart(b).getTime() - eventStart(a).getTime());
}

export async function getEvent(slug: string) {
  return (await getEvents()).find((e) => e.slug === slug);
}

/** Detay sayfasının altındaki "Diğer etkinlikler": tarihe en yakın olanlar, yeniden eskiye. */
export async function getRelatedEvents(slug: string, count = 3) {
  const events = await getEvents();
  const current = events.find((e) => e.slug === slug);
  if (!current) return [];
  const start = eventStart(current).getTime();
  return events
    .filter((e) => e.slug !== slug)
    .sort(
      (a, b) =>
        Math.abs(eventStart(a).getTime() - start) - Math.abs(eventStart(b).getTime() - start),
    )
    .slice(0, count)
    .sort((a, b) => eventStart(b).getTime() - eventStart(a).getTime());
}

/** Etkinlikler sayfasının başlığındaki sayaçlar: toplam ve dört ana kategori. */
export function getEventStats(events: EventItem[]) {
  const categories = ["summit", "tech_talk", "trip", "workshop"] as const;
  const years = events.map((e) => Number(e.date.slice(0, 4)));
  return {
    total: events.length,
    since: years.length > 0 ? Math.min(...years) : new Date().getFullYear(),
    byCategory: categories.map((category) => ({
      category,
      count: events.filter((e) => e.category === category).length,
    })),
  };
}

export function toEventView(e: EventItem, locale: Locale): EventView {
  return {
    slug: e.slug,
    category: e.category,
    date: e.date,
    startTime: e.startTime,
    endTime: e.endTime,
    title: localize(e.title, locale),
    summary: localize(e.summary, locale),
    location: localize(e.location, locale),
    image: e.image,
    status: e.status,
    ...(e.status === "upcoming" && e.registration?.open
      ? {
          registrationUrl: e.registration.url,
          registrationLabel: e.registration.label
            ? localize(e.registration.label, locale)
            : undefined,
        }
      : {}),
  };
}
