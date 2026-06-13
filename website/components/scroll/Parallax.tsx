"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

/* ============================================================
   Scroll-animation foundation — Label Gabriel
   ------------------------------------------------------------
   One shared, reduced-motion-safe toolkit so every section
   animates on a consistent rhythm. All hooks gracefully
   collapse to a no-op when the user prefers reduced motion.
   ============================================================ */

const SPRING = { stiffness: 140, damping: 34, mass: 0.35 } as const;

/**
 * Scroll-scrubbed vertical translation tied to an element's
 * progress through the viewport. Returns a ref to attach and a
 * spring-smoothed `y` MotionValue (in px).
 *
 * `distance` is the total travel: the element drifts from
 * `0` (entering — natural position, no server-render shift)
 * to `-distance` (leaving — drifts upward out of view).
 */
export function useParallax(distance = 80) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const raw = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [0, -distance]
  );
  const y = useSpring(raw, SPRING);
  return { ref, y } as const;
}

/**
 * Raw scroll progress (0→1) of an element through the viewport,
 * spring-smoothed. Useful for opacity / scale scrubbing.
 */
export function useScrollProgress(
  offset: [string, string] = ["start end", "end start"]
) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // framer-motion's offset type is a narrow union of literal strings;
    // our callers pass runtime strings that always conform to the expected
    // "start end" / "end start" / etc. keywords.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    offset: offset as any,
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  return { ref, progress } as const;
}

interface ParallaxProps {
  children: ReactNode;
  /** Total vertical travel in px (default 80). */
  distance?: number;
  className?: string;
  as?: ElementType;
}

/**
 * Generic wrapper that applies scroll-scrubbed parallax to its
 * children. Drop around captions, numerals, decorative marks.
 */
export function Parallax({
  children,
  distance = 80,
  className,
  as = "div",
}: ParallaxProps) {
  const { ref, y } = useParallax(distance);
  const MotionTag = motion(as as ElementType);
  return (
    <MotionTag ref={ref} className={className} style={{ y }}>
      {children}
    </MotionTag>
  );
}

interface ParallaxImageProps {
  src: string;
  alt: string;
  /** Outer container classes (controls the visible frame). */
  className?: string;
  /** Extra classes for the <img> (object-fit etc.). */
  imgClassName?: string;
  /** CSS object-position value — defaults to "50% 30%" so fashion
   *  subjects (faces/garments in the upper portion) stay in frame. */
  objectPosition?: string;
  /** Travel in px the image drifts within its frame (default 70). */
  distance?: number;
  priority?: boolean;
  sizes?: string;
}

/**
 * An image that drifts inside an overflow-hidden frame as the
 * page scrolls — the classic editorial parallax. The <img> is
 * over-scaled so the drift never exposes empty edges.
 */

const objectPositionClasses: Record<string, string> = {
  "50% 30%": "object-[50%_30%]",
  "top": "object-top",
  "center": "object-center",
  "50% 50%": "object-center",
};

export function ParallaxImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  objectPosition = "50% 30%",
  distance = 70,
  priority = false,
  sizes,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const raw = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ["0px", "0px"] : ["0px", `${-distance}px`]
  );
  const y = useSpring(raw, SPRING);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        sizes={sizes}
        draggable={false}
        style={{ y, scale: reduced ? 1 : 1.12 }}
        className={`absolute inset-0 h-full w-full object-cover ${objectPositionClasses[objectPosition] ?? ""} ${imgClassName}`}
      />
    </div>
  );
}

export type { MotionValue };
