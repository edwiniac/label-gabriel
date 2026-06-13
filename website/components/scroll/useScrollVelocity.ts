"use client";

import {
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

/* ============================================================
   Scroll-velocity hook — lets marquees / strips react to how
   fast the user is scrolling (skew + speed-up). Returns
   spring-smoothed MotionValues. Collapses to neutral values
   under reduced motion.
   ============================================================ */

interface ScrollVelocityResult {
  /** Spring-smoothed raw velocity (px/s). */
  velocity: MotionValue<number>;
  /** Small skewX (deg) proportional to velocity — for motion blur feel. */
  skew: MotionValue<number>;
  /** Speed multiplier (~1 at rest, grows with velocity) for marquee scrubbing. */
  factor: MotionValue<number>;
}

export function useScrollVelocity(maxSkew = 4): ScrollVelocityResult {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const rawVelocity = useVelocity(scrollY);

  const velocity = useSpring(rawVelocity, {
    stiffness: 200,
    damping: 50,
    mass: 0.4,
  });

  const skew = useTransform(
    velocity,
    [-2000, 0, 2000],
    reduced ? [0, 0, 0] : [-maxSkew, 0, maxSkew],
    { clamp: true }
  );

  const factor = useTransform(
    velocity,
    [-3000, 0, 3000],
    reduced ? [1, 1, 1] : [4, 1, 4],
    { clamp: true }
  );

  return { velocity, skew, factor };
}
