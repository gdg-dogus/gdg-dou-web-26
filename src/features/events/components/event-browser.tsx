"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { categoryStyles } from "../category";
import type { EventStatus, EventView } from "../data";
import { type EventCategory, eventCategories } from "../schema";
import { CategoryIcon } from "./category-label";
import { EventRow } from "./event-row";

type Term = { key: string; kind: "fall" | "spring" | "summer"; year: number };

/** Akademik döneme göre gruplama: Eylül–Ocak güz, Şubat–Haziran bahar. */
function termOf(date: string): Term {
  const [y, m] = date.split("-").map(Number);
  if (m >= 9) return { key: `${y}-fall`, kind: "fall", year: y };
  if (m === 1) return { key: `${y - 1}-fall`, kind: "fall", year: y - 1 };
  if (m <= 6) return { key: `${y}-spring`, kind: "spring", year: y };
  return { key: `${y}-summer`, kind: "summer", year: y };
}

export function EventBrowser({ events }: { events: EventView[] }) {
  const t = useTranslations("events");
  const tc = useTranslations("common.categories");

  const upcoming = useMemo(() => events.filter((e) => e.status === "upcoming").reverse(), [events]);
  const past = useMemo(() => events.filter((e) => e.status === "past"), [events]);

  const [tab, setTab] = useState<EventStatus>(upcoming.length > 0 ? "upcoming" : "past");
  const [category, setCategory] = useState<EventCategory | null>(null);

  const source = tab === "upcoming" ? upcoming : past;
  const usedCategories = eventCategories.filter((c) => source.some((e) => e.category === c));
  const visible = category ? source.filter((e) => e.category === category) : source;

  const groups = useMemo(() => {
    const map = new Map<string, { term: Term; events: EventView[] }>();
    for (const e of visible) {
      const term = termOf(e.date);
      const group = map.get(term.key) ?? { term, events: [] };
      group.events.push(e);
      map.set(term.key, group);
    }
    return [...map.values()];
  }, [visible]);

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={tab}
          onValueChange={(v) => {
            setTab(v as EventStatus);
            setCategory(null);
          }}
        >
          <TabsList>
            <TabsTrigger value="upcoming">
              {t("tabs.upcoming")}{" "}
              <span className="text-muted-foreground tabular-nums">{upcoming.length}</span>
            </TabsTrigger>
            <TabsTrigger value="past">
              {t("tabs.past")}{" "}
              <span className="text-muted-foreground tabular-nums">{past.length}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {usedCategories.length > 1 ? (
          <fieldset className="flex flex-wrap gap-2">
            <legend className="sr-only">{t("filter.label")}</legend>
            <FilterChip active={category === null} onClick={() => setCategory(null)}>
              {t("filter.all")}
            </FilterChip>
            {usedCategories.map((c) => (
              <FilterChip
                key={c}
                active={category === c}
                activeClassName={cn(categoryStyles[c].soft, categoryStyles[c].ring)}
                onClick={() => setCategory(category === c ? null : c)}
              >
                <CategoryIcon category={c} className={categoryStyles[c].text} />
                {tc(c)}
              </FilterChip>
            ))}
          </fieldset>
        ) : null}
      </div>

      {visible.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed p-8">
          <p className="max-w-prose text-muted-foreground">
            {t(category ? "empty.filtered" : tab === "upcoming" ? "empty.upcoming" : "empty.past")}
          </p>
          {category ? (
            <Button variant="outline" className="mt-4" onClick={() => setCategory(null)}>
              {t("empty.clear")}
            </Button>
          ) : null}
        </div>
      ) : (
        groups.map(({ term, events: list }) => (
          <section key={term.key} className="mt-12 first:mt-10">
            <h2 className="font-medium text-muted-foreground text-sm">
              {t(`term.${term.kind}`, { year: term.year })}
            </h2>
            <ol className="mt-2 divide-y border-t">
              {list.map((e) => (
                <li key={e.slug}>
                  <EventRow event={e} />
                </li>
              ))}
            </ol>
          </section>
        ))
      )}
    </div>
  );
}

function FilterChip({
  active,
  activeClassName = "border-foreground bg-foreground text-background",
  onClick,
  children,
}: {
  active: boolean;
  /** Seçiliyken kullanılacak renkler; kategori çiplerinde kategori rengi */
  activeClassName?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm outline-none transition-all focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-95",
        active ? cn("border-2 font-medium", activeClassName) : "bg-card hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}
