"use client";

import { motion } from "framer-motion";

/* Direction → starting offset (fades in toward origin) */
const directionOffsets = {
  up:    { y: 32, x: 0 },
  down:  { y: -32, x: 0 },
  left:  { x: 32, y: 0 },
  right: { x: -32, y: 0 },
} as const;

interface ScrollRevealProps {
  children: React.ReactNode;
  /** Stagger delay in seconds (0.1, 0.2, 0.3…) */
  delay?: number;
  /** Direction to animate from */
  direction?: "up" | "down" | "left" | "right";
}

export function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
}: ScrollRevealProps) {
  const offset = directionOffsets[direction];

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...offset,
        filter: "blur(8px)",
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
