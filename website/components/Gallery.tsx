"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { PostCard } from "./PostCard";
import { PostModal } from "./PostModal";
import type { PostData } from "@/lib/posts";

interface GalleryProps {
  posts: PostData[];
}

const CATEGORIES = [
  { label: "All", tags: [] },
  { label: "Bridal", tags: ["bridalsaree", "keralabride", "bridalwear", "weddingdress", "bridalgown", "weddingdresskerala"] },
  { label: "Baptism", tags: ["baptismdress", "christeningoutfit", "baptismday", "babybaptism"] },
  { label: "Kids", tags: ["kidsboutique", "kidsbirthday", "kidsfashion"] },
  { label: "Custom", tags: ["custommade", "custombridal", "handcrafted", "handwork"] },
  { label: "Ethnic", tags: ["indianfashion", "ethnicwear", "traditionalelegance", "pattayasalwar"] },
];

export function Gallery({ posts }: GalleryProps) {
  const [selected, setSelected] = useState<PostData | null>(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    const { tags } = CATEGORIES[activeCategory];
    if (tags.length === 0) return posts;
    return posts.filter((p) =>
      p.hashtags.some((h) => tags.includes(h.toLowerCase()))
    );
  }, [posts, activeCategory]);

  const visible = showAll ? filtered : filtered.slice(0, 48);

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
            onClick={() => { setActiveCategory(i); setShowAll(false); }}
            className={`font-ui text-[10px] tracking-[0.25em] uppercase px-4 py-2 border transition-all duration-200 ${
              activeCategory === i
                ? "bg-gold border-gold text-parchment"
                : "border-linen text-stone hover:border-gold hover:text-gold"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="font-ui text-[9px] tracking-[0.3em] text-stone uppercase text-center mb-10">
        {filtered.length} pieces
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8">
        {visible.map((post, i) => (
          <PostCard key={post.id} post={post} index={i} onClick={setSelected} />
        ))}
      </div>

      {/* Show more */}
      {!showAll && filtered.length > 48 && (
        <div className="text-center mt-14">
          <button
            onClick={() => setShowAll(true)}
            className="font-ui text-[10px] tracking-[0.35em] text-stone uppercase border border-linen px-8 py-3 hover:border-gold hover:text-gold transition-all duration-200"
          >
            View All {filtered.length} Pieces
          </button>
        </div>
      )}

      <PostModal post={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
