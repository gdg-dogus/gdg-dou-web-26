import { CalendarDays, CalendarPlus, Clock, ExternalLink, MapPin } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";
import { localize } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { googleCalendarUrl, icsDataUri } from "../calendar";
import { categoryStyles } from "../category";
import { type EventItem, eventStart } from "../data";
import { CategoryIcon } from "./category-label";

/** Detay sayfasının yan sütunu: özet bilgiler, takvime ekle ve GDG Community linki. */
export function EventInfoCard({ event }: { event: EventItem }) {
  const t = useTranslations("events.detail");
  const tc = useTranslations("common.categories");
  const locale = useLocale() as Locale;
  const format = useFormatter();
  const style = categoryStyles[event.category];
  const time = event.endTime ? `${event.startTime}–${event.endTime}` : event.startTime;

  const rows = [
    {
      key: "date",
      icon: <CalendarDays className="size-4" aria-hidden />,
      value: format.dateTime(eventStart(event), {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "long",
      }),
    },
    { key: "time", icon: <Clock className="size-4" aria-hidden />, value: time },
    {
      key: "location",
      icon: <MapPin className="size-4" aria-hidden />,
      value: localize(event.location, locale),
    },
    {
      key: "category",
      icon: <CategoryIcon category={event.category} />,
      value: tc(event.category),
    },
  ] as const;

  return (
    <div className="rounded-3xl border bg-card p-6">
      <h2 className="font-medium">{t("info")}</h2>
      <dl className="mt-5 space-y-4">
        {rows.map((row) => (
          <div key={row.key} className="flex gap-3">
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-full",
                style.soft,
                style.text,
              )}
            >
              {row.icon}
            </span>
            <div className="min-w-0">
              <dt className="text-muted-foreground text-xs">{t(row.key)}</dt>
              <dd className="text-sm">{row.value}</dd>
            </div>
          </div>
        ))}
      </dl>

      {event.status === "upcoming" ? (
        <div className="mt-6 border-t pt-5">
          <p className="flex items-center gap-2 font-medium text-sm">
            <CalendarPlus className="size-4 text-muted-foreground" aria-hidden />
            {t("calendar.label")}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={googleCalendarUrl(event, locale)}>{t("calendar.google")}</a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href={icsDataUri(event, locale)} download={`${event.slug}.ics`}>
                {t("calendar.ics")}
              </a>
            </Button>
          </div>
        </div>
      ) : null}

      {event.communityUrl ? (
        <a
          href={event.communityUrl}
          className="mt-5 inline-flex items-center gap-1.5 text-primary text-sm underline-offset-4 hover:underline"
        >
          {t("communityPage")}
          <ExternalLink className="size-3.5" aria-hidden />
        </a>
      ) : null}
    </div>
  );
}
