"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-md bg-void/80 border-b border-cream/5"
          : "bg-transparent"
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="font-display italic text-xl tracking-widest text-cream/90 uppercase">
        Label Gabriel
      </span>

      <a
        href="https://www.instagram.com/label_gabriel/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-ui text-xs tracking-[0.25em] text-muted uppercase hover:text-gold transition-colors duration-300"
      >
        Instagram ↗
      </a>
    </motion.nav>
  );
}
