import { Code, type LucideIcon, Presentation, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { accents } from "@/components/accents";
import { Shape, type ShapeKind } from "@/components/shapes";
import { cn } from "@/lib/utils";

const cards = [
  {
    key: "learning",
    icon: Presentation,
    shape: "cookie",
    hover: "hover:bg-g-blue/10",
  },
  { key: "community", icon: Users, shape: "clover", hover: "hover:bg-g-red/10" },
  { key: "projects", icon: Code, shape: "flower", hover: "hover:bg-g-yellow/10" },
] as const satisfies readonly { key: string; icon: LucideIcon; shape: ShapeKind; hover: string }[];

/** "Biz kimiz?": kısa tanıtım ve topluluğun üç odağı. Üzerine gelince şekil döner. */
export function WhoWeAre() {
  const t = useTranslations("about.who");

  return (
    <section aria-labelledby="who-title" className="mt-16">
      <div className="grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-12">
        <div>
          <p className="font-medium text-primary text-sm">{t("eyebrow")}</p>
          <h2 id="who-title" className="mt-3 text-headline">
            {t("title")}
          </h2>
        </div>
        <p className="text-lg text-muted-foreground md:pt-9">{t("body")}</p>
      </div>

      <ul className="mt-12 grid gap-4 md:grid-cols-3">
        {cards.map(({ key, icon: Icon, shape, hover }, i) => {
          const accent = accents[i % accents.length];
          return (
            <li
              key={key}
              className={cn(
                "group rounded-3xl border bg-card p-6 transition-colors duration-300",
                hover,
              )}
            >
              <div className="relative size-14">
                <Shape
                  kind={shape}
                  className={cn(
                    "size-full transition-transform duration-700 ease-[cubic-bezier(.2,.9,.3,1.5)] group-hover:rotate-[120deg] group-hover:scale-110 motion-reduce:transition-none",
                    accent.shape,
                  )}
                />
                <Icon aria-hidden className={cn("absolute inset-0 m-auto size-6", accent.on)} />
              </div>
              <h3 className="mt-6 font-medium text-xl">{t(`cards.${key}.title`)}</h3>
              <p className="mt-2 text-muted-foreground">{t(`cards.${key}.body`)}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
