"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PostData } from "@/lib/posts";

interface PostCardProps {
  post: PostData;
  index: number;
  onClick: (post: PostData) => void;
}

// Widest grid layout (2xl) — stagger resets per visual row so cards
// reveal as a quick left-to-right wave instead of a long global queue.
const MAX_COLS = 4;
const STEP = 0.06;

export function PostCard({ post, index, onClick }: PostCardProps) {
  const reduced = useReducedMotion();
  const bodyText = post.caption.replace(/#\w+/g, "").replace(/@\w+/g, "").trim();
  const firstLine = bodyText.split(/\n|\./)[0].trim();

  // Column position within the row — caps delay at ~0.18s regardless of
  // how many cards precede it, fixing the old `index * 0.05` pile-up.
  const delay = reduced ? 0 : (index % MAX_COLS) * STEP;

  return (
    <motion.article
      className="relative group cursor-none border border-transparent hover:border-gold/30 transition-colors duration-500"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: reduced ? 0.3 : 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={() => onClick(post)}
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-ivory">
        <img
          src={post.imagePath}
          alt={firstLine || "Label Gabriel creation"}
          className="w-full h-full object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.02]"
          loading="lazy"
        />

        {/* Warm overlay on hover — cream fade from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-parchment/80 via-parchment/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Caption reveal */}
        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
          {firstLine && (
            <p className="font-display italic text-sm text-ink leading-snug line-clamp-2 mb-2">
              {firstLine}
            </p>
          )}
          {post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.hashtags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="font-ui text-[9px] tracking-widest text-gold uppercase"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* View indicator */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-7 h-7 bg-parchment/90 border border-linen flex items-center justify-center">
            <span className="text-gold text-xs">✦</span>
          </div>
        </div>
      </div>

      {/* Date below image */}
      <div className="pt-2.5 pb-5 border-b border-linen/60">
        <time className="font-ui text-[9px] tracking-[0.25em] text-stone uppercase">
          {post.date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </time>
      </div>
    </motion.article>
  );
}
