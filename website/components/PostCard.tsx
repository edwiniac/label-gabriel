"use client";

import { motion } from "framer-motion";
import type { PostData } from "@/lib/posts";

interface PostCardProps {
  post: PostData;
  index: number;
  onClick: (post: PostData) => void;
}

export function PostCard({ post, index, onClick }: PostCardProps) {
  const bodyText = post.caption.replace(/#\w+/g, "").replace(/@\w+/g, "").trim();

  return (
    <motion.article
      className="relative group cursor-none overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.8,
        delay: (index % 3) * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={() => onClick(post)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-surface">
        <img
          src={post.imagePath}
          alt={bodyText.slice(0, 80) || "Label Gabriel"}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-void/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
          {bodyText && (
            <p className="font-ui text-xs text-cream/80 leading-relaxed line-clamp-3 mb-3">
              {bodyText}
            </p>
          )}

          {post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.hashtags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="font-ui text-[9px] tracking-widest text-gold uppercase"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="absolute top-4 right-4 w-6 h-6 border border-cream/40 rounded-full flex items-center justify-center">
            <span className="text-cream text-xs">↗</span>
          </div>
        </div>
      </div>

      {/* Date */}
      <div className="pt-2 pb-4">
        <time className="font-ui text-[10px] tracking-[0.2em] text-muted uppercase">
          {post.date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </time>
      </div>
    </motion.article>
  );
}
