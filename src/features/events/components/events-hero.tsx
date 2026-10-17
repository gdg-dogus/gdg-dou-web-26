import { useTranslations } from "next-intl";
import { CountUp, ShapeCluster } from "@/components/shapes";
import { cn } from "@/lib/utils";
import { categoryStyles } from "../category";
import type { EventCategory } from "../schema";

export type EventStats = {
  total: number;
  since: number;
  byCategory: { category: EventCategory; count: number }[];
};

/** Etkinlikler sayfasının başlığı: başlık, sayaçlar ve süzülen Google şekilleri. */
export function EventsHero({ stats }: { stats: EventStats }) {
  const t = useTranslations("events");
  const tc = useTranslations("common.categories");

  return (
    <header className="grid items-center gap-8 pt-10 pb-14 sm:pt-16 md:grid-cols-[1fr_minmax(0,22rem)] md:gap-12">
      <div>
        <h1 className="text-display">{t("title")}</h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{t("intro")}</p>
        <p className="mt-8 font-medium text-sm">
          {t("stats.since", { count: stats.total, year: stats.since })}
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.byCategory.map(({ category, count }) => (
            <div key={category} className="rounded-2xl border bg-card px-4 py-3">
              <dt className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <span className={cn("size-2 rounded-full", categoryStyles[category].fill)} />
                {tc(category)}
              </dt>
              <dd>
                <CountUp
                  value={count}
                  className={cn(
                    "block font-medium text-4xl tabular-nums [font-variation-settings:'ROND'_100]",
                    categoryStyles[category].text,
                  )}
                />
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <ShapeCluster className="mx-auto w-56 max-md:order-first sm:w-64 md:w-full" />
    </header>
  );
}
