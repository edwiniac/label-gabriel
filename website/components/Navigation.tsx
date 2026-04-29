"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isGallery = pathname === "/gallery";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-end transition-all duration-500 ${
        scrolled || isGallery
          ? "backdrop-blur-md bg-parchment/90 border-b border-linen shadow-sm"
          : "bg-transparent"
      }`}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center gap-8">
        <Link
          href="/gallery"
          className={`font-ui text-[10px] tracking-[0.25em] uppercase transition-colors duration-300 ${
            isGallery ? "text-gold" : "text-stone hover:text-gold"
          }`}
        >
          Collection
        </Link>
        <a
          href="https://www.instagram.com/label_gabriel/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-ui text-[10px] tracking-[0.25em] text-stone uppercase hover:text-gold transition-colors duration-300"
        >
          ✦ Instagram
        </a>
      </div>
    </motion.nav>
  );
}
