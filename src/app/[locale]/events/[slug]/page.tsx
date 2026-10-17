import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ONLINE_LOCATION } from "@/features/events/community";
import { EventAgenda } from "@/features/events/components/event-agenda";
import { EventDetailHero } from "@/features/events/components/event-detail-hero";
import { EventGallery } from "@/features/events/components/event-gallery";
import { EventInfoCard } from "@/features/events/components/event-info-card";
import { EventMap } from "@/features/events/components/event-map";
import { EventRow } from "@/features/events/components/event-row";
import { EventSpeakers } from "@/features/events/components/event-speakers";
import { MobileRegisterBar } from "@/features/events/components/mobile-register-bar";
import { getEvent, getEvents, getRelatedEvents, toEventView } from "@/features/events/data";
import { eventJsonLd } from "@/features/events/structured-data";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { localize } from "@/lib/localized";
import { asset, cn } from "@/lib/utils";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getEvents()).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const event = await getEvent(slug);
  if (!event) return {};
  return {
    title: localize(event.title, locale),
    description: localize(event.summary, locale),
    openGraph: {
      type: "article",
      title: localize(event.title, locale),
      description: localize(event.summary, locale),
      images: event.image ? [asset(event.image)] : undefined,
    },
  };
}

export default async function EventPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const event = await getEvent(slug);
  if (!event) notFound();

  const t = await getTranslations("events.detail");
  const related = await getRelatedEvents(slug);
  const title = localize(event.title, locale);
  const signup =
    event.status === "upcoming" && event.registration?.open ? event.registration : undefined;
  const online = event.location.tr === ONLINE_LOCATION;

  return (
    <article className={cn("pt-8 sm:pt-12", signup && "max-lg:pb-20")}>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: içerik dosyalarından üretilen, "<" karakteri kaçışlanmış JSON
        dangerouslySetInnerHTML={{ __html: eventJsonLd(event, locale) }}
      />

      <Link
        href="/events"
        className="group inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
      >
        <ArrowLeft
          className="size-4 transition-transform group-hover:-translate-x-0.5"
          aria-hidden
        />
        {t("back")}
      </Link>

      <EventDetailHero event={event} />

      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
        <div className="min-w-0 space-y-14">
          <section aria-labelledby="about-title">
            <h2 id="about-title" className="font-medium text-2xl">
              {t("about")}
            </h2>
            <p className="mt-4 max-w-prose whitespace-pre-line text-lg leading-relaxed">
              {localize(event.description, locale)}
            </p>
          </section>

          {event.agenda.length > 0 ? (
            <EventAgenda
              items={event.agenda.map((a) => ({
                time: a.time,
                title: localize(a.title, locale),
                speaker: a.speaker,
              }))}
            />
          ) : null}

          {event.speakers.length > 0 ? (
            <EventSpeakers
              speakers={event.speakers.map((s) => ({
                name: s.name,
                role: s.role ? localize(s.role, locale) : undefined,
                photo: s.photo,
                link: s.link,
              }))}
            />
          ) : null}

          {event.gallery.length > 0 ? <EventGallery title={title} photos={event.gallery} /> : null}

          {online ? null : (
            <section aria-labelledby="location-title">
              <h2 id="location-title" className="font-medium text-2xl">
                {t("location")}
              </h2>
              <p className="mt-2 text-muted-foreground">{localize(event.location, locale)}</p>
              <div className="mt-5">
                <EventMap query={event.location.tr} label={localize(event.location, locale)} />
              </div>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <EventInfoCard event={event} />
        </aside>
      </div>

      {related.length > 0 ? (
        <section aria-labelledby="related-title" className="mt-24">
          <h2 id="related-title" className="text-headline">
            {t("related")}
          </h2>
          <ol className="mt-6 divide-y border-y">
            {related.map((e) => (
              <li key={e.slug}>
                <EventRow event={toEventView(e, locale)} />
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {signup ? (
        <MobileRegisterBar
          title={title}
          url={signup.url}
          label={signup.label ? localize(signup.label, locale) : t("register")}
        />
      ) : null}
    </article>
  );
}
