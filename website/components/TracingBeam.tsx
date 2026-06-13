"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function SimpleTracingBeam({ children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 20%", "end 80%"],
  });
  /* Buttery beam fill — spring-smoothed scroll progress */
  const scaleY = useSpring(scrollYProgress, { stiffness: 200, damping: 60 });

  /* The leading dot rides the bottom of the gold fill: an absolutely
     positioned wrapper spans the exact track height, and the dot is pinned
     to the wrapper's bottom which we scaleY in lockstep with the fill. */
  const dotScale = useTransform(
    scaleY,
    [0, 0.5, 1],
    reduced ? [1, 1, 1] : [0.85, 1.18, 1]
  );
  /* Glow intensity scrubs with progress — subtle at rest, brighter mid-scroll */
  const glowSpread = useTransform(scaleY, [0, 0.5, 1], [4, 14, 9]);
  const glowAlpha = useTransform(scaleY, [0, 0.5, 1], [0.45, 0.85, 0.6]);
  const dotShadow = useMotionTemplate`0 0 ${glowSpread}px rgba(196,163,90,${glowAlpha})`;
  /* Track height the dot travels: same as the fill (full height minus 80px pad) */
  const dotY = useTransform(scaleY, (v) => v * 100);
  const dotTop = useMotionTemplate`calc(40px + (100% - 80px) * ${dotY} / 100)`;

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Track */}
      <div className="absolute left-[28px] top-10 bottom-10 w-px bg-linen hidden lg:block pointer-events-none" />
      {/* Animated fill */}
      <motion.div
        className="absolute left-[28px] top-10 w-px bg-gold hidden lg:block origin-top pointer-events-none"
        style={{ scaleY, height: "calc(100% - 80px)" }}
      />
      {/* Leading dot — rides the fill, glow + scale react to scroll progress.
          `y: "-50%"` centers it on its computed top (framer's transform would
          otherwise override a Tailwind -translate-y class). */}
      <motion.div
        className="absolute left-[22px] w-3.5 h-3.5 rounded-full border-2 border-gold bg-parchment hidden lg:block pointer-events-none"
        style={{
          top: dotTop,
          y: "-50%",
          scale: dotScale,
          boxShadow: dotShadow,
          willChange: "transform, box-shadow",
        }}
      />

      <div className="lg:pl-16">
        {children}
      </div>
    </div>
  );
}
