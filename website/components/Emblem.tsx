"use client";

import { motion, useReducedMotion } from "framer-motion";

interface EmblemProps {
  size?: "sm" | "md" | "lg" | "xl";
}

// Horizontal logo (800×195) — sizes control height, width flows naturally
const sizes = {
  sm: "h-10",   // 40 px → ~164 px wide
  md: "h-14",   // 56 px → ~230 px wide
  lg: "h-20",   // 80 px → ~328 px wide
  xl: "h-24",   // 96 px → ~394 px wide
};

export function Emblem({ size = "md" }: EmblemProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="flex items-center"
      whileHover={reduce ? undefined : { scale: 1.015, rotate: 2.5 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      <img
        src="/logo-hd.png"
        alt="Label Gabriel"
        className={`${sizes[size]} w-auto select-none`}
        draggable={false}
      />
    </motion.div>
  );
}
