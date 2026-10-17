"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { Shape, type ShapeKind } from "@/components/shapes";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type Piece = { kind: ShapeKind; color: string; size: number; x: number; mobileX: number };

/** Düşen şekiller. `x` geniş ekranda, `mobileX` telefonda kartın genişliğine oranla yatay yer. */
const pieces: Piece[] = [
  { kind: "cookie", color: "fill-g-red", size: 96, x: 0.56, mobileX: 0.02 },
  { kind: "clover", color: "fill-g-yellow", size: 80, x: 0.66, mobileX: 0.26 },
  { kind: "square", color: "fill-g-green", size: 88, x: 0.75, mobileX: 0.46 },
  { kind: "flower", color: "fill-white", size: 72, x: 0.84, mobileX: 0.68 },
  { kind: "circle", color: "fill-g-yellow", size: 44, x: 0.92, mobileX: 0.86 },
  { kind: "pill", color: "fill-g-red", size: 104, x: 0.62, mobileX: 0.12 },
];

const GRAVITY = 2600; // piksel/saniye²
const BOUNCE = 0.42;

/**
 * Sayfanın sonundaki katılım kartı. Kart görününce Material şekilleri yukarıdan düşer,
 * birkaç kez zıplayıp kartın dibinde durur. Hareket azaltma açıksa şekiller baştan yerindedir.
 */
export function JoinCta() {
  const t = useTranslations("home.join");
  const card = useRef<HTMLElement>(null);
  const shapes = useRef<(HTMLDivElement | null)[]>([]);
  const inView = useInView(card, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = card.current;
    if (!el || (!inView && !reduce)) return;
    const width = el.clientWidth;
    const height = el.clientHeight;
    const narrow = width < 640;

    const state = pieces.map((p, i) => {
      const floor = height - p.size - (i % 2 ? 14 : 4);
      return {
        x: (narrow ? p.mobileX : p.x) * width,
        y: reduce ? floor : -p.size - 40 - i * 110,
        vy: 0,
        rot: (i * 47) % 90,
        vr: reduce ? 0 : ((i % 3) - 1) * 180,
        floor,
        done: reduce,
      };
    });

    const draw = () => {
      state.forEach((s, i) => {
        const node = shapes.current[i];
        if (node) node.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${s.rot}deg)`;
      });
    };
    draw();
    if (reduce) return;

    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      for (const s of state) {
        if (s.done) continue;
        s.vy += GRAVITY * dt;
        s.y += s.vy * dt;
        s.rot += s.vr * dt;
        if (s.y >= s.floor) {
          s.y = s.floor;
          s.vy *= -BOUNCE;
          s.vr *= 0.6;
          if (Math.abs(s.vy) < 90) {
            s.vy = 0;
            s.done = true;
          }
        }
      }
      draw();
      if (state.some((s) => !s.done)) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduce]);

  return (
    <section
      ref={card}
      aria-labelledby="join-title"
      className="relative isolate mt-32 min-h-[28rem] overflow-hidden rounded-4xl bg-g-blue px-6 pt-12 pb-44 text-white sm:px-12 sm:py-16"
    >
      {pieces.map((p, i) => (
        <div
          key={`${p.kind}-${p.x}`}
          ref={(node) => {
            shapes.current[i] = node;
          }}
          aria-hidden
          className="absolute top-0 left-0 -z-10"
          // Kart görünene kadar şekiller kartın üstünde, görünmez yerde bekler.
          style={{ width: p.size, height: p.size, transform: "translateY(-120%)" }}
        >
          <Shape kind={p.kind} className={cn("size-full", p.color)} />
        </div>
      ))}

      <h2 id="join-title" className="max-w-lg text-headline">
        {t("title")}
      </h2>
      <p className="mt-4 max-w-md text-white/85">{t("body")}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="lg" className="bg-white text-g-blue hover:bg-white/90">
          <a href={siteConfig.socials.whatsapp}>{t("whatsapp")}</a>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-white/60 bg-transparent text-white hover:bg-white/10 hover:text-white dark:border-white/60 dark:bg-transparent dark:hover:bg-white/10"
        >
          <a href={siteConfig.socials.instagram}>{t("instagram")}</a>
        </Button>
      </div>
    </section>
  );
}
