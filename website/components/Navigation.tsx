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
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-8 py-4 flex items-center justify-between border-b transition-all duration-700 ${
        scrolled || isGallery
          ? "backdrop-blur-xl bg-parchment/80 border-linen/60 shadow-[0_1px_0_rgba(196,163,90,0.06)]"
          : "bg-transparent border-transparent"
      }`}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Logo — left side, ~120px wide */}
      <Link href="/" aria-label="Label Gabriel — home" className="flex-shrink-0 rounded-sm">
        <img
          src="/logo-hd.png"
          alt="Label Gabriel"
          className="h-6 w-auto select-none transition-opacity duration-300 hover:opacity-80"
          style={{ maxWidth: "120px" }}
          draggable={false}
        />
      </Link>

      {/* Links — right side */}
      <div className="flex items-center gap-8">
        <Link
          href="/gallery"
          aria-current={isGallery ? "page" : undefined}
          className={`group relative font-ui text-[10px] tracking-[0.25em] uppercase transition-colors duration-300 pb-1 rounded-sm ${
            isGallery ? "text-gold" : "text-stone hover:text-gold"
          }`}
        >
          Collection
          {/* Hover underline — animates in from center; hidden when active */}
          {!isGallery && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px origin-center scale-x-0 bg-gold transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
            />
          )}
          {/* Active underline — shared layout animation */}
          {isGallery && (
            <motion.span
              aria-hidden="true"
              className="absolute -bottom-0.5 left-0 right-0 h-px bg-gold"
              layoutId="nav-underline"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          )}
        </Link>
        <a
          href="https://www.instagram.com/label_gabriel/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative font-ui text-[10px] tracking-[0.25em] text-stone uppercase hover:text-gold transition-colors duration-300 pb-1 rounded-sm"
        >
          ✦ Instagram
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px origin-center scale-x-0 bg-gold transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
          />
        </a>
      </div>
    </motion.nav>
  );
}
