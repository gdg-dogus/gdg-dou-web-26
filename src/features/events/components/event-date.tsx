import { useFormatter } from "next-intl";
import { cn } from "@/lib/utils";

/** Takvim yaprağı gibi tarih bloğu: büyük gün numarası, altında ay ve gün adı. */
export function EventDate({
  date,
  className,
  numberClassName,
}: {
  date: string;
  className?: string;
  /** Gün numarasının rengi, ör. kategori rengi */
  numberClassName?: string;
}) {
  const format = useFormatter();
  const d = new Date(`${date}T12:00:00+03:00`);
  return (
    <time dateTime={date} className={cn("flex flex-col leading-none", className)}>
      <span
        className={cn(
          "font-medium text-4xl tabular-nums tracking-tight [font-variation-settings:'ROND'_100]",
          numberClassName,
        )}
      >
        {format.dateTime(d, { day: "numeric" })}
      </span>
      <span className="mt-1.5 text-sm">
        {format.dateTime(d, { month: "short", year: "numeric" })}
      </span>
      <span className="mt-1 text-muted-foreground text-sm">
        {format.dateTime(d, { weekday: "long" })}
      </span>
    </time>
  );
}
