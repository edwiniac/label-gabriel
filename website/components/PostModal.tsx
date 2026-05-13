"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import type { PostData } from "@/lib/posts";

interface PostModalProps {
  post: PostData | null;
  allPosts: PostData[];
  onClose: () => void;
  onSelectPost: (post: PostData) => void;
}

export function PostModal({
  post,
  allPosts,
  onClose,
  onSelectPost,
}: PostModalProps) {
  const router = useRouter();

  const currentIndex = post
    ? allPosts.findIndex((p) => p.id === post.id)
    : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allPosts.length - 1;

  const goPrev = useCallback(() => {
    if (hasPrev) onSelectPost(allPosts[currentIndex - 1]);
  }, [hasPrev, allPosts, currentIndex, onSelectPost]);

  const goNext = useCallback(() => {
    if (hasNext) onSelectPost(allPosts[currentIndex + 1]);
  }, [hasNext, allPosts, currentIndex, onSelectPost]);

  useEffect(() => {
    if (!post) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [post, onClose, goPrev, goNext]);

  const handleShare = async () => {
    const url = `https://www.instagram.com/p/${post?.id}/`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.open(url, "_blank");
    }
  };

  const bodyText = post?.caption
    .replace(/#\w+/g, "")
    .replace(/@\w+/g, "")
    .trim() ?? "";

  return (
    <AnimatePresence>
      {post && (
        <>
          {/* Backdrop — warm cream wash with heavy blur */}
          <motion.div
            className="fixed inset-0 bg-ink/40 z-50 backdrop-blur-xl"
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
              <motion.img
                key={post.id}
                src={post.imagePath}
                alt={bodyText.slice(0, 80) || "Label Gabriel"}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Gold gradient at bottom for text readability */}
              <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-ink/40 via-ink/10 to-transparent pointer-events-none md:hidden" />

              {/* Navigation arrows */}
              {hasPrev && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-parchment/80 backdrop-blur-sm border border-linen flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300"
                  aria-label="Previous image"
                >
                  <span className="text-stone text-sm">←</span>
                </button>
              )}
              {hasNext && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-parchment/80 backdrop-blur-sm border border-linen flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300"
                  aria-label="Next image"
                >
                  <span className="text-stone text-sm">→</span>
                </button>
              )}

              {/* Counter badge */}
              <div className="absolute top-3 left-3 bg-parchment/90 backdrop-blur-sm px-2.5 py-1 border border-linen/60">
                <span className="font-ui text-[9px] tracking-[0.2em] text-stone uppercase tabular-nums">
                  {currentIndex + 1} / {allPosts.length}
                </span>
              </div>
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
                {post.date.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>

              {/* Divider */}
              <div className="w-8 h-px bg-gold mb-6" />

              {/* Caption */}
              {bodyText && (
                <p className="font-display italic text-base text-ink leading-relaxed mb-8">
                  {bodyText.slice(0, 280)}
                  {bodyText.length > 280 ? "…" : ""}
                </p>
              )}

              {/* Clickable hashtags */}
              {post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-auto">
                  {post.hashtags.slice(0, 12).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        onClose();
                        router.push(`/gallery?tag=${tag.toLowerCase()}`);
                      }}
                      className="font-ui text-[9px] tracking-[0.2em] text-stone uppercase border border-linen px-2 py-0.5 hover:border-gold hover:text-gold transition-all duration-300"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              {/* Bottom actions */}
              <div className="pt-8 mt-4 border-t border-linen flex items-center gap-4">
                <a
                  href={`https://www.instagram.com/p/${post.id}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-ui text-[10px] tracking-[0.3em] text-gold uppercase hover:text-ink transition-colors"
                >
                  View on Instagram ↗
                </a>
                <button
                  onClick={handleShare}
                  className="font-ui text-[10px] tracking-[0.3em] text-stone uppercase hover:text-gold transition-colors ml-auto"
                  title="Copy link to clipboard"
                >
                  Copy Link ⬑
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
