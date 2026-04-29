"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

interface SplitHeadingProps {
  children: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3";
}

const EASE = [0.16, 1, 0.3, 1] as const;

function wordVariants(i: number) {
  return {
    hidden: { opacity: 0, y: 36, skewY: 2 },
    show: {
      opacity: 1,
      y: 0,
      skewY: 0,
      transition: { duration: 0.75, delay: i * 0.07, ease: EASE },
    },
  };
}

export function SplitHeading({
  children,
  className = "",
  delay = 0,
  as: Tag = "h2",
}: SplitHeadingProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const words = children.split(" ");

  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} className={`${className} overflow-hidden`} style={{ perspective: "800px" }}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em] last:mr-0">
          <motion.span
            className="inline-block"
            variants={wordVariants(i + Math.round(delay / 0.07))}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
