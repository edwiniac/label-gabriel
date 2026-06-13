"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: reduce ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduce ? 0 : -8 }}
        transition={{
          duration: reduce ? 0.2 : 0.45,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {/* Subtle gold wipe — sweeps once on each route change.
            Transform-only (scaleX), GPU-composited, and skipped under
            reduced-motion. Pointer-transparent so it never blocks input. */}
        {!reduce && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[60] origin-left bg-gold/10"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
