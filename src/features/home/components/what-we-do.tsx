import { useTranslations } from "next-intl";
import { Shape, type ShapeKind } from "@/components/shapes";
import { categoryStyles } from "@/features/events/category";
import type { EventCategory } from "@/features/events/schema";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";

const kinds = [
  {
    category: "workshop",
    shape: "clover",
    hover: "hover:bg-g-green/10 focus-visible:bg-g-green/10",
  },
  { category: "tech_talk", shape: "cookie", hover: "hover:bg-g-red/10 focus-visible:bg-g-red/10" },
  { category: "summit", shape: "flower", hover: "hover:bg-g-blue/10 focus-visible:bg-g-blue/10" },
  { category: "trip", shape: "square", hover: "hover:bg-g-yellow/10 focus-visible:bg-g-yellow/10" },
] as const satisfies readonly { category: EventCategory; shape: ShapeKind; hover: string }[];

export type CategoryCounts = Partial<Record<EventCategory, number>>;

/**
 * Dört etkinlik türü. Üzerine gelince şekil yaylanarak döner ve açıklama açılır.
 * Fareyle gezinilemeyen cihazlarda (telefon) açıklama hep açıktır.
 */
export function WhatWeDo({ counts }: { counts: CategoryCounts }) {
  const t = useTranslations("home.what");
  const tc = useTranslations("common.categories");

  return (
    <section aria-labelledby="what-title" className="mt-32">
      <SectionHeading id="what-title" title={t("title")} body={t("body")} />

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kinds.map(({ category, shape, hover }) => {
          const style = categoryStyles[category];
          const Icon = style.icon;
          return (
            <li key={category}>
              <Link
                href="/events"
                className={cn(
                  "group flex h-full flex-col justify-between gap-8 rounded-4xl border bg-card p-6 outline-none transition-colors duration-300 focus-visible:ring-4 focus-visible:ring-ring [@media(hover:hover)]:h-72",
                  hover,
                )}
              >
                <div className="relative size-16">
                  <Shape
                    kind={shape}
                    className={cn(
                      "size-full transition-transform duration-700 ease-[cubic-bezier(.2,.9,.3,1.5)] group-hover:rotate-[120deg] group-hover:scale-110 group-focus-visible:rotate-[120deg] motion-reduce:transition-none",
                      style.shape,
                    )}
                  />
                  <Icon aria-hidden className={cn("absolute inset-0 m-auto size-6", style.on)} />
                </div>
                <div>
                  <h3 className="font-medium text-2xl">{tc(category)}</h3>
                  <p className="mt-1 font-medium text-muted-foreground text-sm">
                    {t("count", { count: counts[category] ?? 0 })}
                  </p>
                  <div className="grid transition-[grid-template-rows] duration-500 [@media(hover:hover)]:grid-rows-[0fr] [@media(hover:hover)]:group-focus-visible:grid-rows-[1fr] [@media(hover:hover)]:group-hover:grid-rows-[1fr]">
                    <p className="overflow-hidden pt-3 text-muted-foreground">
                      {t(`items.${category}`)}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
