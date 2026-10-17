"use client";

import { useReducedMotion } from "motion/react";
import { type RefObject, useEffect, useRef } from "react";

type Dot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  r: number;
  color: string;
  /** Parantezin parçası değil, arkada süzülen nokta */
  free: boolean;
  phase: number;
};

const COLORS = ["--g-blue", "--g-red", "--g-yellow", "--g-green"] as const;
/** Arkada süzülen nokta yoğunluğu: her bu kadar piksel karesine bir nokta. */
const AREA_PER_DOT = 8000;
const REPEL_RADIUS = 110;

/**
 * Hero'nun arka planı: yüzlerce renkli nokta her yerden uçup GDG logosundaki iki parantezi çizer.
 * Fare (ya da parmak) yaklaşınca noktalar kaçar, sonra yerlerine döner. Parantezler `around`
 * öğesinin iki yanına yerleşir. Hareket azaltma açıksa noktalar baştan yerinde ve sabittir.
 */
export function DotField({ around }: { around: RefObject<HTMLElement | null> }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const cv = canvas.current;
    const box = cv?.parentElement;
    const ctx = cv?.getContext("2d");
    if (!cv || !box || !ctx) return;

    const css = getComputedStyle(document.documentElement);
    const [blue, red, yellow, green] = COLORS.map((name) => css.getPropertyValue(name).trim());
    let width = 0;
    let height = 0;
    let dots: Dot[] = [];
    let pointer = { x: -1e4, y: -1e4 };

    /** Parantez çizgilerini noktalarla doldurur: her çizgi boyunca birkaç sıra nokta. */
    const targets = () => {
      const text = around.current?.getBoundingClientRect();
      const rect = box.getBoundingClientRect();
      const cx = text ? text.left - rect.left + text.width / 2 : width / 2;
      const cy = text ? text.top - rect.top + text.height / 2 : height / 2;
      const half = Math.min((text?.width ?? 300) / 2 + width * 0.07 + 30, width / 2 - 24);
      const tall = Math.min(width < 640 ? 72 : 110, height * 0.17);
      const lean = tall * 0.56;
      const segments: [number, number, number, number, string][] = [
        [cx - half + lean, cy - tall, cx - half, cy, red],
        [cx - half, cy, cx - half + lean, cy + tall, blue],
        [cx + half - lean, cy - tall, cx + half, cy, green],
        [cx + half, cy, cx + half - lean, cy + tall, yellow],
      ];
      const spacing = width < 640 ? 6 : 7;
      const thickness = width < 640 ? 6 : 9;
      const points: { x: number; y: number; color: string }[] = [];
      for (const [x1, y1, x2, y2, color] of segments) {
        const len = Math.hypot(x2 - x1, y2 - y1);
        const nx = -(y2 - y1) / len;
        const ny = (x2 - x1) / len;
        for (let s = 0; s <= len; s += spacing) {
          for (let o = -thickness; o <= thickness; o += spacing) {
            const t = s / len;
            points.push({ x: x1 + (x2 - x1) * t + nx * o, y: y1 + (y2 - y1) * t + ny * o, color });
          }
        }
      }
      return points;
    };

    const layout = () => {
      const dpr = window.devicePixelRatio || 1;
      width = box.clientWidth;
      height = box.clientHeight;
      cv.width = width * dpr;
      cv.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const bracket = targets();
      const palette = [blue, red, yellow, green];
      const next: Dot[] = [];
      bracket.forEach((p, i) => {
        const old = dots[i];
        next.push({
          x: old?.x ?? Math.random() * width,
          y: old?.y ?? Math.random() * height,
          vx: 0,
          vy: 0,
          tx: p.x,
          ty: p.y,
          r: width < 640 ? 2.1 : 2.6,
          color: p.color,
          free: false,
          phase: 0,
        });
      });
      const free = Math.round(Math.min(280, Math.max(60, (width * height) / AREA_PER_DOT)));
      for (let i = 0; i < free; i++) {
        const tx = Math.random() * width;
        const ty = Math.random() * height;
        next.push({
          x: reduce ? tx : Math.random() * width,
          y: reduce ? ty : Math.random() * height,
          vx: 0,
          vy: 0,
          tx,
          ty,
          r: 1.3 + Math.random() * 1.7,
          color: palette[i % palette.length],
          free: true,
          phase: Math.random() * Math.PI * 2,
        });
      }
      if (reduce) for (const d of next) Object.assign(d, { x: d.tx, y: d.ty });
      dots = next;
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const d of dots) {
        if (!reduce) {
          let tx = d.tx;
          let ty = d.ty;
          if (d.free) {
            tx += Math.sin(time / 2000 + d.phase) * 14;
            ty += Math.cos(time / 2600 + d.phase) * 14;
          }
          const dx = d.x - pointer.x;
          const dy = d.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < REPEL_RADIUS && dist > 0) {
            const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * 3.2;
            d.vx += (dx / dist) * force;
            d.vy += (dy / dist) * force;
          }
          d.vx = (d.vx + (tx - d.x) * 0.02) * 0.86;
          d.vy = (d.vy + (ty - d.y) * 0.02) * 0.86;
          d.x += d.vx;
          d.y += d.vy;
        }
        ctx.globalAlpha = d.free ? 0.5 : 1;
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    layout();
    const resize = new ResizeObserver(() => {
      layout();
      if (reduce) draw(0);
    });
    resize.observe(box);

    if (reduce) {
      draw(0);
      return () => resize.disconnect();
    }

    // Ekranda değilken çizimi durdur.
    let visible = true;
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    seen.observe(box);

    let frame = 0;
    const loop = (time: number) => {
      if (visible) draw(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    const move = (e: PointerEvent) => {
      const rect = box.getBoundingClientRect();
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const leave = () => {
      pointer = { x: -1e4, y: -1e4 };
    };
    box.addEventListener("pointermove", move);
    box.addEventListener("pointerleave", leave);

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      seen.disconnect();
      box.removeEventListener("pointermove", move);
      box.removeEventListener("pointerleave", leave);
    };
  }, [around, reduce]);

  return <canvas ref={canvas} aria-hidden className="absolute inset-0 -z-10 size-full" />;
}
