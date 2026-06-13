"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame,
  useReducedMotion,
} from "framer-motion";
import { useScrollVelocity } from "@/components/scroll/useScrollVelocity";

const ITEMS = [
  "Bridal",
  "Baptism",
  "Kids",
  "Custom Wear",
  "Ethnic",
  "Home Salon",
];

const track = Array(4).fill(ITEMS).flat();

export function Marquee() {
  const reduced = useReducedMotion();
  const { skew, factor } = useScrollVelocity();
  const paused = useRef(false);

  // Manual drift (% of doubled track per second) so scroll velocity can
  // nudge the speed while keeping the always-on motion + hover-pause.
  const pct = useMotionValue(0);
  const baseSpeed = 7; // %/s at rest

  useAnimationFrame((_, delta) => {
    if (reduced || paused.current) return;
    const moved = (factor.get() * baseSpeed * delta) / 1000;
    let next = pct.get() - moved;
    if (next <= -50) next += 50; // seamless wrap on doubled track
    pct.set(next);
  });

  const transform = useMotionTemplate`translateX(${pct}%) skewX(${skew}deg)`;

  return (
    <div className="overflow-hidden bg-ink py-5 border-y border-gold/15">
      <motion.div
        className="flex whitespace-nowrap will-change-transform"
        style={{ transform: reduced ? "translateX(0%)" : transform }}
        onHoverStart={() => (paused.current = true)}
        onHoverEnd={() => (paused.current = false)}
      >
        {[...track, ...track].map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span
              className={`font-ui text-[10px] tracking-[0.45em] uppercase px-7 ${
                i % 2 === 0 ? "text-gold/80" : "text-parchment/50"
              }`}
            >
              {item}
            </span>
            <span
              className={`text-xs ${
                i % 2 === 0 ? "text-gold/30" : "text-parchment/15"
              }`}
            >
              ✦
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
