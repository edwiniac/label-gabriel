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
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
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
          {/* Backdrop — warm cream wash */}
          <motion.div
            className="fixed inset-0 bg-ink/30 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal panel */}
          <motion.div
            className="fixed inset-4 md:inset-10 z-50 flex flex-col md:flex-row bg-parchment border border-linen overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Image */}
            <div className="h-64 md:h-auto md:flex-1 relative overflow-hidden bg-ivory">
              <img
                src={post.imagePath}
                alt={bodyText.slice(0, 80) || "Label Gabriel"}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info panel */}
            <div className="w-full md:w-80 lg:w-[360px] flex flex-col p-8 border-t md:border-t-0 md:border-l border-linen overflow-y-auto">
              {/* Close */}
              <button
                onClick={onClose}
                className="self-end font-ui text-[10px] tracking-[0.3em] text-stone uppercase hover:text-gold transition-colors mb-10"
              >
                Close ×
              </button>

              {/* Brand */}
              <div className="mb-8">
                <p className="font-ui text-[9px] tracking-[0.4em] text-gold uppercase mb-1">
                  Label Gabriel
                </p>
                <p className="font-ui text-[9px] tracking-[0.25em] text-stone uppercase">
                  The Premium Designer Studio
                </p>
              </div>

              {/* Date */}
              <time className="font-ui text-[10px] tracking-[0.25em] text-stone uppercase mb-6 block">
                {post.date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
              </time>

              {/* Divider */}
              <div className="w-8 h-px bg-gold mb-6" />

              {/* Caption */}
              {bodyText && (
                <p className="font-display italic text-base text-ink leading-relaxed mb-8">
                  {bodyText.slice(0, 280)}{bodyText.length > 280 ? "…" : ""}
                </p>
              )}

              {/* Hashtags */}
              {post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-auto">
                  {post.hashtags.slice(0, 12).map((tag) => (
                    <span
                      key={tag}
                      className="font-ui text-[9px] tracking-[0.2em] text-stone uppercase border border-linen px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Instagram link */}
              <div className="pt-8 mt-auto border-t border-linen">
                <a
                  href={`https://www.instagram.com/p/${post.id}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-ui text-[10px] tracking-[0.3em] text-gold uppercase hover:text-ink transition-colors"
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
