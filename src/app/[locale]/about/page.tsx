import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { AboutCta } from "@/features/about/components/about-cta";
import { AboutHero } from "@/features/about/components/about-hero";
import { WhatWeDo } from "@/features/about/components/what-we-do";
import { WhoWeAre } from "@/features/about/components/who-we-are";
import { getEvents } from "@/features/events/data";
import { getTeams } from "@/features/team/data";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const events = await getEvents();
  const teams = getTeams();

  return (
    <>
      <AboutHero
        stats={{
          members: siteConfig.communityMembers,
          events: events.length,
          teams: teams.length,
          crew: teams.reduce((n, team) => n + team.members.length, 0),
        }}
      />
      <WhoWeAre />
      <WhatWeDo />
      <AboutCta />
    </>
  );
}
