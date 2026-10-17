"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { categoryStyles } from "@/features/events/category";
import type { EventCategory } from "@/features/events/schema";
import { Link } from "@/i18n/navigation";
import { asset, cn } from "@/lib/utils";

export type FlowEvent = {
  slug: string;
  title: string;
  category: EventCategory;
  /** Sunucuda biçimlenmiş tarih ("20 Ekim 2026") */
  dateLabel: string;
  image?: string;
};

const INTERVAL = 3500;

/**
 * "Bugüne kadar yaptıklarımız": afişler 3B bir kapak akışında sırayla öne çıkar, yanında
 * bilgisi durur. Afişi olmayan etkinlikler altta isim olarak akar; böylece görsel tekrar etmez.
 * Üzerine gelince ya da odaklanınca akış durur. Hareket azaltma açıksa kendiliğinden ilerlemez.
 */
export function EventCoverflow({ posters, all }: { posters: FlowEvent[]; all: FlowEvent[] }) {
  const t = useTranslations("home.posters");
  const tc = useTranslations("common.categories");
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = posters.length;

  useEffect(() => {
    if (reduce || paused || count < 2) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % count), INTERVAL);
    return () => clearInterval(timer);
  }, [reduce, paused, count]);

  if (count === 0) return null;
  const go = (step: number) => setCurrent((c) => (c + step + count) % count);
  const event = posters[current];
  const style = categoryStyles[event.category];

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: sadece otomatik ilerlemeyi durdurur
    <div
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-6">
        <div className="relative h-80 overflow-x-clip [perspective:1100px] sm:h-[27rem]">
          {posters.map((poster, i) => {
            let offset = i - current;
            if (offset > count / 2) offset -= count;
            if (offset < -count / 2) offset += count;
            const away = Math.abs(offset);
            const front = offset === 0;
            const card = (
              <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-muted shadow-2xl">
                <Image
                  src={asset(poster.image ?? "")}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 15rem, 12rem"
                  priority={front}
                  className="object-cover"
                />
              </div>
            );
            return (
              <div
                key={poster.slug}
                className={cn(
                  "absolute top-1/2 left-1/2 w-48 transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none sm:w-60",
                  away > 2 && "pointer-events-none opacity-0",
                  !front && "brightness-[.55]",
                )}
                style={{
                  transform: `translate(-50%, -50%) translateX(${offset * 50}%) translateZ(${-away * 160}px) rotateY(${-offset * 32}deg)`,
                  zIndex: 10 - away,
                }}
              >
                {front ? (
                  <Link
                    href={`/events/${poster.slug}`}
                    aria-label={t("open", { title: poster.title })}
                    className="block rounded-3xl outline-none focus-visible:ring-4 focus-visible:ring-ring"
                  >
                    {card}
                  </Link>
                ) : (
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-hidden
                    onClick={() => setCurrent(i)}
                    className="block w-full cursor-pointer"
                  >
                    {card}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div>
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-1 font-medium text-sm",
              style.soft,
            )}
          >
            <span className={cn("size-2 rounded-full", style.fill)} />
            {tc(event.category)}
          </span>
          <h3 className="mt-4 text-headline">{event.title}</h3>
          <p className="mt-2 text-muted-foreground">{event.dateLabel}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href={`/events/${event.slug}`}>
                {t("details")}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="size-10 rounded-full"
              aria-label={t("prev")}
              onClick={() => go(-1)}
            >
              <ChevronLeft aria-hidden />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="size-10 rounded-full"
              aria-label={t("next")}
              onClick={() => go(1)}
            >
              <ChevronRight aria-hidden />
            </Button>
          </div>

          <div aria-hidden className="mt-8 flex gap-1.5">
            {posters.map((poster, i) => (
              <span
                key={poster.slug}
                className={cn(
                  "h-2 rounded-full transition-all duration-500",
                  i === current ? "w-7 bg-primary" : "w-2 bg-foreground/20",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <Ticker events={all} />
    </div>
  );
}

/** Bütün etkinliklerin adları, renkli kategori noktasıyla sonsuz akar. Üzerine gelince durur. */
function Ticker({ events }: { events: FlowEvent[] }) {
  const reduce = useReducedMotion();
  const track = useRef<HTMLUListElement>(null);
  const x = useMotionValue(0);
  const paused = useRef(false);
  const speed = useRef(1);
  // Dikişsiz döngü için liste iki kez yazılır. Sunucu ve tarayıcı aynı HTML'i üretsin diye
  // hareket azaltma açıkken de öyle kalır; o durumda sadece akmaz, elle kaydırılır.
  const items = [...events, ...events];

  useAnimationFrame((_, delta) => {
    if (reduce || !track.current) return;
    speed.current += ((paused.current ? 0 : 1) - speed.current) * 0.06;
    const half = track.current.scrollWidth / 2;
    let next = x.get() - speed.current * 40 * (delta / 1000);
    if (next <= -half) next += half;
    x.set(next);
  });

  return (
    <div
      className={cn(
        "mt-14 overflow-hidden border-y py-4 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] motion-reduce:overflow-x-auto",
      )}
      onPointerEnter={() => {
        paused.current = true;
      }}
      onPointerLeave={() => {
        paused.current = false;
      }}
    >
      <motion.ul ref={track} style={{ x }} className="flex w-max">
        {items.map((event, i) => {
          const copy = i >= events.length;
          return (
            <li key={`${event.slug}-${copy ? "b" : "a"}`} aria-hidden={copy || undefined}>
              <Link
                href={`/events/${event.slug}`}
                tabIndex={copy ? -1 : undefined}
                className="flex items-center gap-2.5 whitespace-nowrap rounded-full px-5 py-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                <span
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    categoryStyles[event.category].fill,
                  )}
                />
                {event.title}
              </Link>
            </li>
          );
        })}
      </motion.ul>
    </div>
  );
}
