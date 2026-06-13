"use client";

import type { Ref } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParallax } from "@/components/scroll/Parallax";
import type { PostData } from "@/lib/posts";

interface LookbookTeaserProps {
  bridal: PostData | undefined;
  baptism: PostData | undefined;
  ethnic: PostData | undefined;
  custom: PostData | undefined;
}

const STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const CELL = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE },
  },
};

/**
 * A single lookbook cell. Wraps the image in a scroll-parallax layer so
 * the grid feels layered — tall cells drift more than short ones. The
 * stagger-in reveal stays on the outer motion.div (variant `y`), while
 * the parallax `y` lives on an inner wrapper to avoid clobbering it.
 */
function LookbookCell({
  post,
  label,
  tall,
}: {
  post: PostData;
  label: string;
  tall: boolean;
}) {
  // Tall cells travel further for a deeper parallax sense of depth.
  const { ref, y } = useParallax(tall ? 70 : 40);

  return (
    <motion.div
      ref={ref as Ref<HTMLDivElement>}
      className={`relative overflow-hidden group ${tall ? "row-span-2" : ""}`}
      style={{ aspectRatio: tall ? "3/5" : "4/3" }}
      variants={CELL}
    >
      {/* Parallax layer — over-scaled so drift never exposes edges. */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src={post.imagePath}
          alt={label}
          className="w-full h-[112%] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </motion.div>

      {/* Gold-tinted overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/15 transition-colors duration-500" />

      {/* Label reveal on hover */}
      <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-400">
        <span className="font-ui text-[9px] tracking-[0.35em] text-parchment uppercase">
          {label}
        </span>
      </div>

      {/* Gold border on hover */}
      <div className="absolute inset-0 border border-transparent group-hover:border-gold/20 transition-colors duration-500 pointer-events-none" />
    </motion.div>
  );
}

export function LookbookTeaser({
  bridal,
  baptism,
  ethnic,
  custom,
}: LookbookTeaserProps) {
  const images = [
    { post: bridal, label: "Bridal", tall: true },
    { post: ethnic, label: "Ethnic", tall: false },
    { post: baptism, label: "Baptism", tall: false },
    { post: custom, label: "Custom", tall: true },
  ].filter((x) => x.post);

  return (
    <section className="bg-ivory border-t border-linen px-8 md:px-14 py-20">
      {/* Header */}
      <motion.div
        className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div>
          <p className="font-ui text-[9px] tracking-[0.45em] text-gold uppercase mb-3">
            Lookbook
          </p>
          <h2 className="font-display italic text-4xl md:text-5xl text-ink leading-tight">
            A glimpse of
            <br />
            <span className="font-light not-italic text-stone">
              what we craft.
            </span>
          </h2>
        </div>
        <Link
          href="/gallery"
          className="group inline-flex items-center gap-3 font-ui text-[10px] tracking-[0.35em] text-stone uppercase hover:text-gold transition-colors duration-300"
        >
          <span>View Full Collection</span>
          <span className="w-8 h-px bg-stone group-hover:bg-gold transition-colors duration-300 inline-block" />
          <span>↗</span>
        </Link>
      </motion.div>

      {/* Staggered grid — 2 cols, alternating heights */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        variants={STAGGER}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {images.map(({ post, label, tall }) => (
          <LookbookCell
            key={post!.id}
            post={post!}
            label={label}
            tall={tall}
          />
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        className="text-center mt-14"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <Link
          href="/gallery"
          className="inline-block font-ui text-[10px] tracking-[0.4em] text-stone uppercase border border-linen px-10 py-4 hover:border-gold hover:text-gold transition-all duration-300"
        >
          Explore 490+ Pieces
        </Link>
      </motion.div>
    </section>
  );
}
