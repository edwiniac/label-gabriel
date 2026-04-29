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
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-screen overflow-hidden flex items-end"
    >
      {/* Parallax image */}
      <motion.div className="absolute inset-0 scale-110" style={{ y }}>
        <img
          src={featuredImage}
          alt="Label Gabriel — featured creation"
          className="w-full h-full object-cover"
        />
        {/* Warm gradient — light at top, soft cream fade at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-parchment via-parchment/20 to-transparent" />
        {/* Subtle light vignette on sides */}
        <div className="absolute inset-0 bg-gradient-to-r from-parchment/30 via-transparent to-parchment/30" />
      </motion.div>

      {/* Brand statement */}
      <motion.div
        className="relative z-10 w-full px-8 pb-16 md:pb-20"
        style={{ opacity }}
      >
        <motion.p
          className="font-ui text-[10px] tracking-[0.45em] text-gold uppercase mb-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          Alakode, Kerala ✦ Est. 2024
        </motion.p>

        <motion.h1
          className="font-display text-5xl md:text-7xl lg:text-8xl leading-[1.05] text-ink mb-4"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="italic">They dreamed it.</span>
          <br />
          <span className="font-light not-italic text-stone">We crafted it.</span>
        </motion.h1>

        <motion.div
          className="flex items-center gap-4 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <div className="w-10 h-px bg-gold" />
          <span className="font-ui text-[10px] tracking-[0.3em] text-stone uppercase">
            Bridal · Baptism · Custom Wear
          </span>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-6 right-8 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
      >
        <div className="w-px h-10 bg-stone/30 relative overflow-hidden">
          <motion.div
            className="absolute inset-x-0 top-0 h-full bg-gold"
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
