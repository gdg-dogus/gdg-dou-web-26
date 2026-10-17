import { useTranslations } from "next-intl";
import { accents } from "@/components/accents";
import { Shape, type ShapeKind } from "@/components/shapes";
import { cn } from "@/lib/utils";

const markers: ShapeKind[] = ["cookie", "square", "clover", "flower"];

export type AgendaItem = { time: string; title: string; speaker?: string };

/** Program akışı: dikey çizgi üzerinde her oturum bir renkli Material şekli. */
export function EventAgenda({ items }: { items: AgendaItem[] }) {
  const t = useTranslations("events.detail");

  return (
    <section aria-labelledby="agenda-title">
      <h2 id="agenda-title" className="font-medium text-2xl">
        {t("agenda")}
      </h2>
      <ol className="mt-6 space-y-7 border-border border-l-2 border-dashed pl-8">
        {items.map((item, i) => {
          const accent = accents[i % accents.length];
          return (
            <li key={`${item.time}-${item.title}`} className="relative">
              <Shape
                kind={markers[i % markers.length]}
                className={cn("absolute top-0 -left-[43px] size-5", accent.shape)}
              />
              <p className={cn("font-medium text-sm tabular-nums", accent.text)}>{item.time}</p>
              <p className="mt-1 font-medium text-lg leading-snug">{item.title}</p>
              {item.speaker ? (
                <p className="mt-0.5 text-muted-foreground text-sm">{item.speaker}</p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
