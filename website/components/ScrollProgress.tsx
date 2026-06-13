"use client";

import { useScroll, useSpring, motion, useReducedMotion } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();

  // Under reduced-motion, bind directly to scroll (no spring easing) so the
  // bar still tracks progress but without the spring "catch-up" motion.
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] bg-gold origin-left z-[9999] pointer-events-none"
      style={{ scaleX: reduce ? scrollYProgress : scaleX }}
    />
  );
}
