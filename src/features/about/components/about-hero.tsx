import { CalendarDays, Code, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { accents } from "@/components/accents";
import { CountUp, ShapeCluster } from "@/components/shapes";
import { cn } from "@/lib/utils";

export type AboutStats = { members: number; events: number; teams: number; crew: number };

const highlights = [
  { key: "teams", icon: Users },
  { key: "projects", icon: Code },
  { key: "events", icon: CalendarDays },
] as const;

/** Hakkımızda sayfasının başlığı: tanıtım, odak alanları, sayaçlar ve süzülen Google şekilleri. */
export function AboutHero({ stats }: { stats: AboutStats }) {
  const t = useTranslations("about");
  const counters = [
    { key: "members", value: stats.members, plus: true },
    { key: "events", value: stats.events, plus: false },
    { key: "teams", value: stats.teams, plus: false },
    { key: "crew", value: stats.crew, plus: false },
  ] as const;

  return (
    <header className="grid items-center gap-8 pt-10 pb-14 sm:pt-16 md:grid-cols-[1fr_minmax(0,22rem)] md:gap-12">
      <div>
        <p className="font-medium text-primary text-sm">{t("eyebrow")}</p>
        <h1 className="mt-3 text-display">{t("title")}</h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{t("intro")}</p>

        <ul aria-label={t("highlights.label")} className="mt-8 flex flex-wrap gap-2">
          {highlights.map(({ key, icon: Icon }, i) => (
            <li
              key={key}
              className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 font-medium text-sm"
            >
              <Icon aria-hidden className={cn("size-4", accents[i % accents.length].text)} />
              {t(`highlights.${key}`)}
            </li>
          ))}
        </ul>

        <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {counters.map(({ key, value, plus }, i) => (
            <div key={key} className="rounded-2xl border bg-card px-4 py-3">
              <dt className="text-muted-foreground text-xs">{t(`stats.${key}`)}</dt>
              <dd
                className={cn(
                  "font-medium text-4xl tabular-nums [font-variation-settings:'ROND'_100]",
                  accents[i % accents.length].text,
                )}
              >
                <CountUp value={value} />
                {plus ? "+" : null}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <ShapeCluster className="mx-auto w-56 max-md:order-first sm:w-64 md:w-full" />
    </header>
  );
}
