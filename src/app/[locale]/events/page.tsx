import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EventBrowser } from "@/features/events/components/event-browser";
import { EventSpotlight } from "@/features/events/components/event-spotlight";
import { EventsHero } from "@/features/events/components/events-hero";
import { StayUpdated } from "@/features/events/components/stay-updated";
import { getEventStats, getEvents, toEventView } from "@/features/events/data";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "events.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function EventsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const items = await getEvents();
  const events = items.map((e) => toEventView(e, locale));
  // Liste yeniden eskiye sıralı: sıradaki etkinlik yaklaşanların sonuncusu.
  const featured = events.filter((e) => e.status === "upcoming").at(-1) ?? events[0];

  return (
    <>
      <EventsHero stats={getEventStats(items)} />
      {featured ? (
        <div className="mb-16">
          <EventSpotlight event={featured} />
        </div>
      ) : null}
      <EventBrowser events={events} />
      <StayUpdated />
    </>
  );
}
