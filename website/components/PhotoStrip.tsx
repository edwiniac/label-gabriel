"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// Curated portrait & editorial shots — two rows scrolling opposite directions
const ROW_1 = [
  "/images/DVlTcSViQFS.jpg",
  "/images/DTRqLvyCVT4.jpg",
  "/images/DVSo-AEiY1i.jpg",
  "/images/DKgoCXmBn4U.jpg",
  "/images/DALP4a9hEEt.jpg",
  "/images/DAQu6O8hFzT.jpg",
  "/images/DTGQCDkkh4s.jpg",
  "/images/DBtlAuQhvOJ.jpg",
];

const ROW_2 = [
  "/images/DSNP4O9ibAj.jpg",
  "/images/DF924HpBbvs.jpg",
  "/images/DAYv-oMhces.jpg",
  "/images/DKgk5a0Bf3l.jpg",
  "/images/DBGSwvfyXSL.jpg",
  "/images/DTiZs3hiVyf.jpg",
  "/images/DCv9xy_hePu.jpg",
  "/images/DG0BbRphmob.jpg",
];

function PhotoRow({
  photos,
  direction = "left",
  speed = "45s",
}: {
  photos: string[];
  direction?: "left" | "right";
  speed?: string;
}) {
  const track = [...photos, ...photos];
  const animClass = direction === "left" ? "animate-strip-left" : "animate-strip-right";

  return (
    <div className="overflow-hidden">
      <div className={`flex gap-3 ${animClass} will-change-transform`} style={{ animationDuration: speed }}>
        {track.map((src, i) => (
          <div
            key={i}
            className="relative shrink-0 overflow-hidden group"
            style={{ width: "240px", height: "320px" }}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/15 transition-colors duration-500" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PhotoStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-parchment py-16 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        className="space-y-3"
      >
        {/* Label */}
        <motion.div
          className="px-8 md:px-14 mb-8 flex items-center gap-5"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-8 h-px bg-gold" />
          <span className="font-ui text-[9px] tracking-[0.45em] text-gold uppercase">
            From Our Studio
          </span>
        </motion.div>

        <PhotoRow photos={ROW_1} direction="left" speed="55s" />
        <PhotoRow photos={ROW_2} direction="right" speed="65s" />
      </motion.div>
    </section>
  );
}
