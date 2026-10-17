import { CalendarDays, GraduationCap, UsersRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { accents } from "@/components/accents";
import { cn } from "@/lib/utils";

const items = [
  { key: "events", icon: CalendarDays },
  { key: "teams", icon: UsersRound },
  { key: "resources", icon: GraduationCap },
] as const;

/** "Neler yapıyoruz?": solda başlık, sağda sade liste satırları. */
export function WhatWeDo() {
  const t = useTranslations("about.work");

  return (
    <section
      aria-labelledby="work-title"
      className="mt-32 grid gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-12"
    >
      <div>
        <p className="font-medium text-primary text-sm">{t("eyebrow")}</p>
        <h2 id="work-title" className="mt-3 text-headline">
          {t("title")}
        </h2>
      </div>
      <ul>
        {items.map(({ key, icon: Icon }, i) => (
          <li key={key} className="flex items-start gap-4 border-t py-6 last:border-b">
            <Icon
              aria-hidden
              className={cn("mt-0.5 size-6 shrink-0", accents[(i + 1) % accents.length].text)}
            />
            <p className="text-lg">{t(`items.${key}`)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
