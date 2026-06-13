"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { PostCard } from "./PostCard";
import { PostModal } from "./PostModal";
import type { PostData } from "@/lib/posts";

interface GalleryProps {
  posts: PostData[];
  initialTag?: string;
}

const CATEGORIES = [
  { label: "All", tags: [] },
  { label: "Bridal", tags: ["bridalsaree", "keralabride", "bridalwear", "weddingdress", "bridalgown", "weddingdresskerala"] },
  { label: "Baptism", tags: ["baptismdress", "christeningoutfit", "baptismday", "babybaptism"] },
  { label: "Kids", tags: ["kidsboutique", "kidsbirthday", "kidsfashion"] },
  { label: "Custom", tags: ["custommade", "custombridal", "handcrafted", "handwork"] },
  { label: "Ethnic", tags: ["indianfashion", "ethnicwear", "traditionalelegance", "pattayasalwar"] },
];

function useCountUp(target: number) {
  const [display, setDisplay] = useState(target);
  const prevTarget = useRef(target);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (target === prevTarget.current) {
      setDisplay(target);
      return;
    }
    const startVal = prevTarget.current;
    prevTarget.current = target;
    const diff = target - startVal;
    const start = performance.now();
    const dur = 600;

    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(startVal + diff * ease));
      if (p < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
      }
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target]);

  return display;
}

export function Gallery({ posts, initialTag }: GalleryProps) {
  const [selected, setSelected] = useState<PostData | null>(null);
  const [activeCategory, setActiveCategory] = useState(() => {
    if (!initialTag) return 0;
    const idx = CATEGORIES.findIndex((c) =>
      c.tags.includes(initialTag.toLowerCase())
    );
    return idx > 0 ? idx : 0;
  });
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    const { tags } = CATEGORIES[activeCategory];
    if (tags.length === 0) return posts;
    return posts.filter((p) =>
      p.hashtags.some((h) => tags.includes(h.toLowerCase()))
    );
  }, [posts, activeCategory]);

  const visible = showAll ? filtered : filtered.slice(0, 48);
  const displayCount = useCountUp(filtered.length);

  return (
    <section className="px-4 md:px-8 pb-24 bg-parchment">
      {/* Section header */}
      <motion.div
        className="pt-20 pb-10 text-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p className="font-ui text-[9px] tracking-[0.45em] text-gold uppercase mb-3">
          Our Work
        </p>
        <h2 className="font-display italic text-4xl md:text-5xl text-ink">
          Crafted for Every Beautiful Moment
        </h2>
        <div className="w-10 h-px bg-gold mx-auto mt-5" />
      </motion.div>

      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.label}
            onClick={() => {
              setActiveCategory(i);
              setShowAll(false);
            }}
            className={`font-ui text-[10px] tracking-[0.25em] uppercase px-4 py-2 border transition-all duration-300 hover:-translate-y-0.5 ${
              activeCategory === i
                ? "bg-gold border-gold text-parchment"
                : "border-linen text-stone hover:border-gold hover:text-gold"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Count with animated number */}
      <p className="font-ui text-[9px] tracking-[0.3em] text-stone uppercase text-center mb-10 tabular-nums">
        {displayCount} pieces
      </p>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <motion.div
          className="text-center py-24"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-display italic text-2xl md:text-3xl text-stone mb-4">
            No pieces in this collection yet
          </p>
          <div className="w-10 h-px bg-gold mx-auto mb-4" />
          <p className="font-ui text-[10px] tracking-[0.25em] text-stone/50 uppercase">
            Check back soon — we&apos;re always crafting
          </p>
        </motion.div>
      ) : (
        <>
          {/* Grid — per-row stagger via capped PostCard delay */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-5 gap-y-8 lg:gap-x-6 lg:gap-y-10 2xl:gap-x-8 2xl:gap-y-12">
            {visible.map((post, i) => (
              <PostCard
                key={post.id}
                post={post}
                index={i}
                onClick={setSelected}
              />
            ))}
          </div>

          {/* Show more */}
          {!showAll && filtered.length > 48 && (
            <div className="text-center mt-14">
              <button
                onClick={() => setShowAll(true)}
                className="font-ui text-[10px] tracking-[0.35em] text-stone uppercase border border-linen px-8 py-3 hover:border-gold hover:text-gold transition-all duration-300 hover:-translate-y-0.5"
              >
                View All {filtered.length} Pieces
              </button>
            </div>
          )}
        </>
      )}

      <PostModal
        post={selected}
        allPosts={filtered}
        onClose={() => setSelected(null)}
        onSelectPost={setSelected}
      />
    </section>
  );
}
