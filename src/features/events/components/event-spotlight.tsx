import { ArrowRight, CalendarDays, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { SpinningShape } from "@/components/shapes";
import { TiltCard } from "@/components/tilt-card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { asset, cn } from "@/lib/utils";
import { categoryStyles } from "../category";
import { type EventView, eventStart } from "../data";
import { CategoryIcon } from "./category-label";
import { LiveCountdown } from "./live-countdown";

/** Etkinlikler sayfasının vitrini: sıradaki etkinlik canlı geri sayımla, yoksa en son etkinlik. */
export function EventSpotlight({ event }: { event: EventView }) {
  const t = useTranslations("events.spotlight");
  const tc = useTranslations("common.categories");
  const td = useTranslations("events.detail");
  const format = useFormatter();
  const style = categoryStyles[event.category];
  const start = eventStart(event);
  const upcoming = event.status === "upcoming";
  const time = event.endTime ? `${event.startTime}–${event.endTime}` : event.startTime;

  return (
    <section
      aria-labelledby="spotlight-title"
      className={cn(
        "relative isolate overflow-hidden rounded-4xl px-5 py-8 sm:px-10 sm:py-12 lg:px-14",
        style.soft,
      )}
    >
      <SpinningShape
        kind="flower"
        duration={60}
        className={cn("absolute -right-24 -bottom-28 -z-10 size-80 opacity-15", style.text)}
      />

      <div className="grid gap-10 md:grid-cols-[minmax(0,19rem)_1fr] md:items-center lg:gap-16">
        {event.image ? (
          <div className="relative mx-auto w-full max-w-72 md:max-w-none">
            <SpinningShape
              kind="cookie"
              duration={40}
              className={cn("absolute -inset-6 -z-10", style.text)}
            />
            <TiltCard>
              <div className="relative aspect-4/5 -rotate-3 overflow-hidden rounded-3xl shadow-2xl ring-4 ring-background transition-transform duration-500 hover:rotate-0">
                <Image
                  src={asset(event.image)}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 768px) 19rem, 18rem"
                  className="object-cover"
                />
              </div>
            </TiltCard>
          </div>
        ) : null}

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium text-sm text-white",
                upcoming ? "bg-g-red" : "bg-foreground/70",
              )}
            >
              {upcoming ? (
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75 motion-reduce:hidden" />
                  <span className="relative inline-flex size-2 rounded-full bg-white" />
                </span>
              ) : null}
              {upcoming ? t("upcoming") : t("latest")}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background/70 px-3 py-1 text-sm">
              <CategoryIcon category={event.category} className={style.text} />
              {tc(event.category)}
            </span>
          </div>

          <h2 id="spotlight-title" className="mt-5 text-headline">
            {event.title}
          </h2>
          <p className="mt-4 max-w-prose text-muted-foreground">{event.summary}</p>

          <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center gap-2">
              <dt className="sr-only">{td("date")}</dt>
              <CalendarDays className={cn("size-4", style.text)} aria-hidden />
              <dd>
                {format.dateTime(start, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  weekday: "long",
                })}
              </dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="sr-only">{td("time")}</dt>
              <Clock className={cn("size-4", style.text)} aria-hidden />
              <dd>{time}</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="sr-only">{td("location")}</dt>
              <MapPin className={cn("size-4", style.text)} aria-hidden />
              <dd>{event.location}</dd>
            </div>
          </dl>

          {upcoming ? (
            <div className="mt-8">
              <p className="mb-3 font-medium text-sm">{t("startsIn")}</p>
              <LiveCountdown start={start.toISOString()} />
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            {event.registrationUrl ? (
              <Button asChild size="lg">
                <a href={event.registrationUrl}>{event.registrationLabel ?? td("register")}</a>
              </Button>
            ) : null}
            <Button
              asChild
              size="lg"
              variant={event.registrationUrl ? "outline" : "default"}
              className="group"
            >
              <Link href={`/events/${event.slug}`}>
                {t("details")}
                <ArrowRight
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
