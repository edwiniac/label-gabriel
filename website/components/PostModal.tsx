"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PostData } from "@/lib/posts";

interface PostModalProps {
  post: PostData | null;
  onClose: () => void;
}

export function PostModal({ post, onClose }: PostModalProps) {
  useEffect(() => {
    if (!post) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [post, onClose]);

  const bodyText = post?.caption.replace(/#\w+/g, "").replace(/@\w+/g, "").trim() ?? "";

  return (
    <AnimatePresence>
      {post && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-void/90 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed inset-4 md:inset-12 z-50 flex flex-col md:flex-row bg-surface border border-cream/5 overflow-hidden"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Image */}
            <div className="h-64 md:h-auto md:flex-1 relative overflow-hidden">
              <img
                src={post.imagePath}
                alt={bodyText.slice(0, 80) || "Label Gabriel"}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info panel */}
            <div className="w-full md:w-80 lg:w-96 flex flex-col p-8 border-t md:border-t-0 md:border-l border-cream/5 overflow-y-auto">
              <button
                onClick={onClose}
                className="self-end font-ui text-xs tracking-widest text-muted uppercase hover:text-cream transition-colors mb-12"
              >
                Close ✕
              </button>

              <span className="font-display italic text-2xl text-cream mb-8">
                Label Gabriel
              </span>

              <time className="font-ui text-[10px] tracking-[0.25em] text-gold uppercase mb-6">
                {post.date.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>

              {bodyText && (
                <p className="font-ui text-sm text-cream/70 leading-relaxed mb-8">
                  {bodyText}
                </p>
              )}

              {post.hashtags.length > 0 && (
                <>
                  <div className="w-8 h-px bg-gold/40 mb-8" />
                  <div className="flex flex-wrap gap-2">
                    {post.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="font-ui text-[10px] tracking-[0.2em] text-muted uppercase"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </>
              )}

              <div className="mt-auto pt-8">
                <a
                  href={`https://www.instagram.com/p/${post.id}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-ui text-xs tracking-[0.25em] text-gold uppercase hover:text-cream transition-colors"
                >
                  View on Instagram ↗
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
