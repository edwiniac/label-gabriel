"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, label, [data-cursor]';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  /* ── Only enable on fine-pointer (mouse) devices ── */
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setEnabled(mq.matches);
    const handler = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let rafId: number;
    let ringX = 0;
    let ringY = 0;
    let targetX = 0;
    let targetY = 0;
    let scale = 1;
    let targetScale = 1;
    let hasMoved = false;

    const dot = dotRef.current;
    const ring = ringRef.current;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!hasMoved) {
        // Snap ring to first position to avoid a fly-in from 0,0.
        ringX = targetX;
        ringY = targetY;
        hasMoved = true;
        dot?.classList.remove("is-hidden");
        ring?.classList.remove("is-hidden");
      }
      if (dot) {
        dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      }
    };

    /* ── Interactive hover detection via event delegation ── */
    const setActive = (active: boolean) => {
      targetScale = active ? 1.9 : 1;
      dot?.classList.toggle("is-active", active);
      ring?.classList.toggle("is-active", active);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (target?.closest(INTERACTIVE_SELECTOR)) setActive(true);
    };
    const onOut = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const related = e.relatedTarget as Element | null;
      // Only reset when leaving an interactive element for a non-interactive one.
      if (
        target?.closest(INTERACTIVE_SELECTOR) &&
        !related?.closest(INTERACTIVE_SELECTOR)
      ) {
        setActive(false);
      }
    };

    /* ── Hide when pointer leaves the window ── */
    const onLeaveWindow = () => {
      dot?.classList.add("is-hidden");
      ring?.classList.add("is-hidden");
    };
    const onEnterWindow = () => {
      if (hasMoved) {
        dot?.classList.remove("is-hidden");
        ring?.classList.remove("is-hidden");
      }
    };

    const animate = () => {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      scale += (targetScale - scale) * 0.18;
      if (ring) {
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale})`;
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mouseout", onOut, { passive: true });
    document.addEventListener("mouseleave", onLeaveWindow);
    document.addEventListener("mouseenter", onEnterWindow);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseleave", onLeaveWindow);
      document.removeEventListener("mouseenter", onEnterWindow);
      cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  // Render nothing on coarse-pointer / touch devices.
  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="cursor is-hidden" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring is-hidden" aria-hidden="true" />
    </>
  );
}
