"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface HeroProps {
  featuredImage: string;
}

export function Hero({ featuredImage }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-screen overflow-hidden flex items-end pb-16 px-8"
    >
      {/* Parallax background */}
      <motion.div className="absolute inset-0 scale-110" style={{ y }}>
        <img
          src={featuredImage}
          alt="Label Gabriel — featured look"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
      </motion.div>

      {/* Brand text */}
      <motion.div className="relative z-10 max-w-3xl" style={{ opacity }}>
        <motion.p
          className="font-ui text-xs tracking-[0.4em] text-gold uppercase mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          Collection
        </motion.p>

        <motion.h1
          className="font-display italic text-6xl md:text-8xl leading-none text-cream mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Label
          <br />
          <span className="not-italic font-light">Gabriel</span>
        </motion.h1>

        <motion.div
          className="w-12 h-px bg-gold"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ originX: 0 }}
        />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 right-8 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className="font-ui text-[10px] tracking-[0.3em] text-muted uppercase [writing-mode:vertical-rl]">
          Scroll
        </span>
        <div className="w-px h-12 bg-muted/40 relative overflow-hidden">
          <motion.div
            className="absolute inset-x-0 top-0 h-full bg-gold"
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
