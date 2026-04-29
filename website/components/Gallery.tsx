"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PostCard } from "./PostCard";
import { PostModal } from "./PostModal";
import type { PostData } from "@/lib/posts";

interface GalleryProps {
  posts: PostData[];
}

export function Gallery({ posts }: GalleryProps) {
  const [selected, setSelected] = useState<PostData | null>(null);

  return (
    <section className="px-4 md:px-8 pb-24">
      {/* Section header */}
      <motion.div
        className="flex items-center gap-8 mb-12 pt-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <span className="font-ui text-xs tracking-[0.35em] text-muted uppercase">
          Collection
        </span>
        <div className="flex-1 h-px bg-cream/10" />
        <span className="font-ui text-xs tracking-[0.35em] text-muted uppercase">
          {posts.length} pieces
        </span>
      </motion.div>

      {/* 3-column editorial grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {posts.map((post, i) => (
          <PostCard
            key={post.id}
            post={post}
            index={i}
            onClick={setSelected}
          />
        ))}
      </div>

      <PostModal post={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
