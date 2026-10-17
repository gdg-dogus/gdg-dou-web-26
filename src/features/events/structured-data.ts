import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";
import { localize } from "@/lib/localized";
import { asset } from "@/lib/utils";
import { ONLINE_LOCATION } from "./community";
import type { EventItem } from "./data";

/**
 * Google'ın "Etkinlik" zengin sonucu için schema.org verisi (JSON-LD).
 * Arama sonuçlarında tarih ve konumla birlikte etkinlik kartı olarak görünebilmeyi sağlar.
 * Doğrulamak için: https://search.google.com/test/rich-results
 */
export function eventJsonLd(e: EventItem, locale: Locale) {
  const url = `${siteConfig.url}/${locale}/events/${e.slug}/`;
  const online = e.location.tr === ONLINE_LOCATION;
  const image = e.image
    ? new URL(asset(e.image), siteConfig.url).toString()
    : new URL(asset("/images/logo.webp"), siteConfig.url).toString();

  const data = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: localize(e.title, locale),
    description: localize(e.summary, locale),
    startDate: `${e.date}T${e.startTime}:00+03:00`,
    endDate: e.endTime ? `${e.date}T${e.endTime}:00+03:00` : undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: online
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    location: online
      ? { "@type": "VirtualLocation", url: e.communityUrl ?? url }
      : {
          "@type": "Place",
          name: localize(e.location, locale),
          address: localize(e.location, locale),
        },
    image: [image],
    url,
    inLanguage: locale,
    organizer: { "@type": "Organization", name: "GDG on Campus DOU", url: siteConfig.url },
    performer: e.speakers.map((s) => ({ "@type": "Person", name: s.name })),
    offers: e.registration
      ? {
          "@type": "Offer",
          url: e.registration.url,
          price: 0,
          priceCurrency: "TRY",
          availability:
            e.status === "upcoming" && e.registration.open
              ? "https://schema.org/InStock"
              : "https://schema.org/SoldOut",
        }
      : undefined,
  };

  // </script> kapanışı JSON'un içinden HTML'i bozamasın diye "<" kaçışlanır.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
