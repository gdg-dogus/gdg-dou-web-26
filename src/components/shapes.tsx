"use client";

import {
  animate,
  MotionConfig,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Material 3'ün yuvarlak şekilleri (cookie, clover, flower...). Kutupsal bir eğriden üretilir:
 * yarıçap, açıya göre `points` kez dalgalanır. Hepsi 100×100'lük kutuya sığar.
 */
function polarPath(points: number, depth: number) {
  const steps = 180;
  const coords = Array.from({ length: steps }, (_, i) => {
    const t = (i / steps) * Math.PI * 2;
    const r = 50 - 50 * depth * ((1 - Math.cos(points * t)) / 2);
    return `${(50 + r * Math.cos(t)).toFixed(2)} ${(50 + r * Math.sin(t)).toFixed(2)}`;
  });
  return `M${coords.join("L")}Z`;
}

const paths = {
  cookie: polarPath(9, 0.12),
  clover: polarPath(4, 0.32),
  flower: polarPath(6, 0.22),
  circle: "M50 0a50 50 0 1 1 0 100a50 50 0 1 1 0-100Z",
  square:
    "M28 0h44a28 28 0 0 1 28 28v44a28 28 0 0 1-28 28H28A28 28 0 0 1 0 72V28A28 28 0 0 1 28 0Z",
  pill: "M25 22h50a28 28 0 0 1 0 56H25a28 28 0 0 1 0-56Z",
} as const;

export type ShapeKind = keyof typeof paths;

/** Tek bir şekil. Renk `className` ile verilir: `fill-g-blue` gibi. */
export function Shape({ kind, className }: { kind: ShapeKind; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={cn("block", className)}>
      <path d={paths[kind]} />
    </svg>
  );
}

/** Yavaşça kendi etrafında dönen şekil (vitrindeki afişin arkasında). */
export function SpinningShape({
  kind,
  className,
  duration = 30,
}: {
  kind: ShapeKind;
  className?: string;
  duration?: number;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        aria-hidden
        className={className}
        animate={{ rotate: 360 }}
        transition={{ duration, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
      >
        <Shape kind={kind} className="size-full fill-current" />
      </motion.div>
    </MotionConfig>
  );
}

type Floating = {
  kind: ShapeKind;
  color: string;
  /** Kutudaki yeri ve boyutu (yüzde) */
  className: string;
  rotate?: number;
  spin?: boolean;
};

const cluster: Floating[] = [
  { kind: "cookie", color: "fill-g-blue", className: "top-[4%] left-[6%] w-[42%]", spin: true },
  { kind: "square", color: "fill-g-red", className: "top-0 right-[4%] w-[30%]", rotate: 14 },
  { kind: "pill", color: "fill-g-yellow", className: "bottom-[2%] left-[2%] w-[44%]", rotate: -18 },
  {
    kind: "clover",
    color: "fill-g-green",
    className: "right-[6%] bottom-[6%] w-[36%]",
    spin: true,
  },
  { kind: "circle", color: "fill-foreground/10", className: "top-[44%] left-[46%] w-[12%]" },
];

/** Etkinlikler sayfasının başlığındaki süzülen şekiller. Tamamen dekoratif. */
export function ShapeCluster({ className }: { className?: string }) {
  return (
    <MotionConfig reducedMotion="user">
      <div aria-hidden className={cn("relative aspect-square", className)}>
        {cluster.map((s, i) => (
          <motion.div
            key={s.kind}
            className={cn("absolute", s.className)}
            initial={{ scale: 0, rotate: (s.rotate ?? 0) - 40 }}
            animate={{ scale: 1, rotate: s.rotate ?? 0, y: [0, -10, 0] }}
            transition={{
              scale: { type: "spring", stiffness: 260, damping: 16, delay: 0.1 + i * 0.12 },
              rotate: { type: "spring", stiffness: 120, damping: 14, delay: 0.1 + i * 0.12 },
              y: {
                duration: 4 + i * 0.7,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
                delay: 0.8 + i * 0.3,
              },
            }}
          >
            {s.spin ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 26 + i * 6,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              >
                <Shape kind={s.kind} className={s.color} />
              </motion.div>
            ) : (
              <Shape kind={s.kind} className={s.color} />
            )}
          </motion.div>
        ))}
      </div>
    </MotionConfig>
  );
}

/** Görünür olunca 0'dan hedefe sayan rakam. Sunucu HTML'inde son değer yazılıdır. */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(value);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const controls = animate(count, value, { from: 0, duration: 1.4, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, count, value]);

  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  );
}
