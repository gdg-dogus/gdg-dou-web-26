import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { LatestPosts } from "@/features/blog/components/latest-posts";
import { getPosts } from "@/features/blog/data";
import { EventSpotlight } from "@/features/events/components/event-spotlight";
import { eventStart, getEventStats, getEvents, toEventView } from "@/features/events/data";
import { EventCoverflow, type FlowEvent } from "@/features/home/components/event-coverflow";
import { HomeHero } from "@/features/home/components/home-hero";
import { JoinCta } from "@/features/home/components/join-cta";
import { SectionHeading } from "@/features/home/components/section-heading";
import { TeamsOverview } from "@/features/home/components/teams-overview";
import { WhatWeDo } from "@/features/home/components/what-we-do";
import { getTeams } from "@/features/team/data";
import type { Locale } from "@/i18n/routing";
import { localize } from "@/lib/localized";

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const format = await getFormatter();

  // Etkinlikler yeniden eskiye sıralı: sıradaki etkinlik yaklaşanların sonuncusu.
  const events = await getEvents();
  const featured = events.filter((e) => e.status === "upcoming").at(-1) ?? events[0];
  const flow: FlowEvent[] = events.map((e) => ({
    slug: e.slug,
    // API'den gelen başlıkların sonundaki " | Google Developer Groups" kısmı atılır.
    title: localize(e.title, locale).split(" | ")[0],
    category: e.category,
    dateLabel: format.dateTime(eventStart(e), { day: "numeric", month: "long", year: "numeric" }),
    image: e.image,
  }));
  // Kapak akışında sadece kendi afişlerimiz: API'den gelen etkinliklerin görseli ortak GDG kapağı.
  const posters = flow.filter((e) => e.image?.startsWith("/"));
  const stats = getEventStats(events);

  return (
    <>
      <HomeHero />

      {featured ? (
        <div id="next" className="scroll-mt-24">
          <EventSpotlight event={toEventView(featured, locale)} />
        </div>
      ) : null}

      {posters.length > 0 ? (
        <section aria-labelledby="posters-title" className="mt-32">
          <SectionHeading
            id="posters-title"
            title={t("posters.title")}
            body={t("posters.body", { count: events.length })}
          />
          <div className="mt-10">
            <EventCoverflow posters={posters} all={flow} />
          </div>
        </section>
      ) : null}

      <WhatWeDo counts={Object.fromEntries(stats.byCategory.map((c) => [c.category, c.count]))} />

      <TeamsOverview
        teams={getTeams().map((team) => ({
          key: team.key,
          name: localize(team.name, locale),
          description: localize(team.description, locale),
          members: team.members.length,
        }))}
      />

      <LatestPosts posts={getPosts(locale).slice(0, 4)} />

      <JoinCta />
    </>
  );
}
