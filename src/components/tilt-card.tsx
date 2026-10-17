"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

/** Fareyle üzerinde gezinince imlece doğru 3B eğilen kutu (afişler için). Dokunmatikte durur. */
export function TiltCard({
  children,
  className,
  max = 12,
}: {
  children: React.ReactNode;
  className?: string;
  /** En fazla kaç derece eğilir */
  max?: number;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 220, damping: 20 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), spring);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), spring);

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
