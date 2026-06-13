"use client";

import { useEffect, useState } from "react";
import { LoadingScreen } from "./LoadingScreen";

const SESSION_KEY = "lg-intro-shown";

/**
 * Client-side gate for the intro LoadingScreen.
 *
 * The root layout is a server component, so this thin wrapper owns the
 * client-only decision of whether to show the intro. It shows the
 * LoadingScreen once per browser session (tracked via sessionStorage) on
 * the very first mount — it does NOT replay on client-side route changes
 * (it lives in the layout, which persists across navigations) nor on
 * subsequent refreshes within the same session.
 *
 * The LoadingScreen itself self-times (~2.4s) and skips entirely under
 * prefers-reduced-motion.
 */
export function IntroGate() {
  // null = undecided (SSR / first paint), false = skip, true = show.
  const [show, setShow] = useState<boolean | null>(null);

  useEffect(() => {
    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // sessionStorage may be unavailable (privacy mode); fall back to showing.
    }
    setShow(!alreadyShown);
  }, []);

  const handleComplete = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  if (!show) return null;

  return <LoadingScreen onComplete={handleComplete} />;
}
