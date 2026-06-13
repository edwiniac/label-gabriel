"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete?: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<"loading" | "exiting" | "done">("loading");
  const [skip, setSkip] = useState(false);

  /* ── Respect reduced-motion: skip entire animation ── */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setSkip(true);
        setPhase("done");
        onComplete?.();
      }
    };
    if (mq.matches) {
      setSkip(true);
      setPhase("done");
      onComplete?.();
      return;
    }
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [onComplete]);

  /* ── Timeline: 1.8 s loading → 0.6 s fade-out → unmount ── */
  useEffect(() => {
    if (skip) return;
    const exitTimer = setTimeout(() => setPhase("exiting"), 1800);
    const doneTimer = setTimeout(() => {
      setPhase("done");
      onComplete?.();
    }, 2400);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [skip, onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-parchment"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "exiting" ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          aria-hidden="true"
        >
          {/* ── Centered logo mark ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <img
              src="/logo-hd.png"
              alt="Label Gabriel"
              className="w-[260px] md:w-[340px] h-auto select-none"
              draggable={false}
            />
          </motion.div>

          {/* ── Gold progress line at bottom ── */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-linen/20">
            <motion.div
              className="h-full bg-gold origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
