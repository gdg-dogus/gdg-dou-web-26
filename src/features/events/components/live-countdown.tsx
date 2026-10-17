"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const units = [
  { key: "days", ms: 86_400_000, tile: "bg-g-blue text-white" },
  { key: "hours", ms: 3_600_000, tile: "bg-g-red text-white" },
  { key: "minutes", ms: 60_000, tile: "bg-g-yellow text-neutral-900" },
  { key: "seconds", ms: 1000, tile: "bg-g-green text-white" },
] as const;

/**
 * Google I/O tarzı geri sayım: gün, saat, dakika, saniye; her biri bir Google renginde.
 * Saniyede bir tarayıcıda güncellenir. Sunucu HTML'inde "--" yazar.
 */
export function LiveCountdown({ start }: { start: string }) {
  const t = useTranslations("events.units");
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const left = now === null ? null : Date.parse(start) - now;
  if (left !== null && left <= 0) return null;

  let rest = left ?? 0;
  const values = units.map((u) => {
    const v = Math.floor(rest / u.ms);
    rest -= v * u.ms;
    return v;
  });

  return (
    <div className="grid max-w-md grid-cols-4 gap-2 sm:gap-3">
      {units.map((u, i) => (
        <div
          key={u.key}
          className={cn("overflow-hidden rounded-2xl px-2 py-3 text-center sm:py-4", u.tile)}
        >
          {/* Değer değişince span yeniden oluşur ve yukarıdan kayarak gelir (takvim yaprağı gibi). */}
          <span
            key={left === null ? "--" : values[i]}
            className="block animate-in font-medium text-3xl tabular-nums tracking-tight duration-300 [font-variation-settings:'ROND'_100] slide-in-from-top-4 fade-in motion-reduce:animate-none sm:text-4xl"
          >
            {left === null ? "--" : String(values[i]).padStart(2, "0")}
          </span>
          <span className="mt-1 block text-xs opacity-90">{t(u.key)}</span>
        </div>
      ))}
    </div>
  );
}
