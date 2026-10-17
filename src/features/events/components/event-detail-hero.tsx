import { CalendarDays, Clock, MapPin } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { SpinningShape } from "@/components/shapes";
import { Button } from "@/components/ui/button";
import { ZoomableImage } from "@/components/zoomable-image";
import type { Locale } from "@/i18n/routing";
import { localize } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { categoryStyles } from "../category";
import { type EventItem, eventStart } from "../data";
import { CategoryIcon } from "./category-label";
import { LiveCountdown } from "./live-countdown";
import { ShareButton } from "./share-button";

/** Detay sayfasının üst kısmı: durum, başlık, temel bilgiler, geri sayım, kayıt ve afiş. */
export function EventDetailHero({ event }: { event: EventItem }) {
  const t = useTranslations("events.detail");
  const ts = useTranslations("events.spotlight");
  const tc = useTranslations("common.categories");
  const locale = useLocale() as Locale;
  const format = useFormatter();
  const style = categoryStyles[event.category];
  const start = eventStart(event);
  const upcoming = event.status === "upcoming";
  const title = localize(event.title, locale);
  const time = event.endTime ? `${event.startTime}–${event.endTime}` : event.startTime;
  const registration = upcoming ? event.registration : undefined;

  const facts = [
    {
      key: "date",
      Icon: CalendarDays,
      value: format.dateTime(start, {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "long",
      }),
    },
    { key: "time", Icon: Clock, value: time },
    { key: "location", Icon: MapPin, value: localize(event.location, locale) },
  ] as const;

  return (
    <header
      className={cn(
        "relative isolate mt-6 overflow-hidden rounded-4xl px-5 py-8 sm:px-10 sm:py-12 lg:px-14",
        style.soft,
      )}
    >
      <SpinningShape
        kind="flower"
        duration={60}
        className={cn("absolute -bottom-32 -left-24 -z-10 size-80 opacity-15", style.text)}
      />

      <div className="grid gap-10 md:grid-cols-[1fr_minmax(0,19rem)] md:items-center lg:gap-16">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium text-sm",
                upcoming ? "bg-g-red text-white" : "bg-background/70 text-muted-foreground",
              )}
            >
              {upcoming ? (
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75 motion-reduce:hidden" />
                  <span className="relative inline-flex size-2 rounded-full bg-white" />
                </span>
              ) : null}
              {t(`status.${event.status}`)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background/70 px-3 py-1 text-sm">
              <CategoryIcon category={event.category} className={style.text} />
              {tc(event.category)}
            </span>
          </div>

          <h1 className="mt-5 text-headline sm:text-[3.25rem]">{title}</h1>
          <p className="mt-4 max-w-prose text-lg text-muted-foreground">
            {localize(event.summary, locale)}
          </p>

          <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {facts.map(({ key, Icon, value }) => (
              <div key={key} className="flex items-center gap-2">
                <dt className="sr-only">{t(key)}</dt>
                <Icon className={cn("size-4 shrink-0", style.text)} aria-hidden />
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          {upcoming ? (
            <div className="mt-8">
              <p className="mb-3 font-medium text-sm">{ts("startsIn")}</p>
              <LiveCountdown start={start.toISOString()} />
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            {registration ? (
              registration.open ? (
                <Button asChild size="lg">
                  <a href={registration.url}>
                    {registration.label ? localize(registration.label, locale) : t("register")}
                  </a>
                </Button>
              ) : (
                <Button size="lg" disabled>
                  {t("registrationClosed")}
                </Button>
              )
            ) : null}
            <div className="w-full max-w-44">
              <ShareButton title={title} />
            </div>
          </div>
        </div>

        {event.image ? (
          <div className="relative mx-auto w-full max-w-64 md:max-w-none">
            <SpinningShape
              kind="cookie"
              duration={40}
              className={cn("absolute -inset-6 -z-10", style.text)}
            />
            <ZoomableImage
              src={event.image}
              alt={t("posterAlt", { title })}
              priority
              sizes="(min-width: 768px) 19rem, 16rem"
              className="aspect-4/5 w-full -rotate-3 rounded-3xl shadow-2xl ring-4 ring-background transition-transform duration-500 hover:rotate-0"
            />
          </div>
        ) : null}
      </div>
    </header>
  );
}
