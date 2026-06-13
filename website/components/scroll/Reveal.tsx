"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

/* ============================================================
   Reveal toolkit — reduced-motion-safe entrance animations.
   When the user prefers reduced motion, transforms/blur are
   dropped and only a gentle opacity fade remains (no
   vestibular risk).
   ============================================================ */

const EASE = [0.16, 1, 0.3, 1] as const;

const directionOffsets = {
  up: { y: 36, x: 0 },
  down: { y: -36, x: 0 },
  left: { x: 36, y: 0 },
  right: { x: -36, y: 0 },
  none: { x: 0, y: 0 },
} as const;

interface RevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: keyof typeof directionOffsets;
  /** Add a subtle blur-in (skipped under reduced motion). */
  blur?: boolean;
  className?: string;
  once?: boolean;
}

/**
 * Single-element scroll reveal. Fades + slides toward its
 * resting position when it enters the viewport.
 */
export function Reveal({
  children,
  delay = 0,
  duration = 0.8,
  direction = "up",
  blur = true,
  className,
  once = true,
}: RevealProps) {
  const reduced = useReducedMotion();
  const offset = reduced ? directionOffsets.none : directionOffsets[direction];

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        ...offset,
        filter: blur && !reduced ? "blur(10px)" : "blur(0px)",
      }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ---- Staggered groups ---- */

interface RevealGroupProps {
  children: ReactNode;
  /** Seconds between each child. */
  stagger?: number;
  delayChildren?: number;
  className?: string;
  once?: boolean;
}

const containerVariants = (stagger: number, delayChildren: number): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

export function RevealGroup({
  children,
  stagger = 0.1,
  delayChildren = 0,
  className,
  once = true,
}: RevealGroupProps) {
  return (
    <motion.div
      className={className}
      variants={containerVariants(stagger, delayChildren)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

interface RevealItemProps {
  children: ReactNode;
  direction?: keyof typeof directionOffsets;
  className?: string;
}

/** Child of <RevealGroup>. Inherits the group's stagger timing. */
export function RevealItem({
  children,
  direction = "up",
  className,
}: RevealItemProps) {
  const reduced = useReducedMotion();
  const offset = reduced ? directionOffsets.none : directionOffsets[direction];

  const variants: Variants = {
    hidden: { opacity: 0, ...offset },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.8, ease: EASE },
    },
  };

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
