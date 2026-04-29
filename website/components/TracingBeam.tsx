"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function SimpleTracingBeam({ children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 20%", "end 80%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 200, damping: 60 });

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Track */}
      <div className="absolute left-[28px] top-10 bottom-10 w-px bg-linen hidden lg:block pointer-events-none" />
      {/* Animated fill */}
      <motion.div
        className="absolute left-[28px] top-10 w-px bg-gold hidden lg:block origin-top pointer-events-none"
        style={{ scaleY, height: "calc(100% - 80px)" }}
      />
      {/* Dot */}
      <div className="absolute left-[22px] top-10 w-3.5 h-3.5 rounded-full border-2 border-gold bg-parchment hidden lg:block shadow-[0_0_8px_rgba(196,163,90,0.5)]" />

      <div className="lg:pl-16">
        {children}
      </div>
    </div>
  );
}
