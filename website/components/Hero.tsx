"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue, useSpring, useTransform, useMotionTemplate,
} from "framer-motion";
import Link from "next/link";
import { Emblem } from "./Emblem";

function useCountUp(target: number, duration = 1800, delay = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setCount(Math.floor(ease * target));
        if (p < 1) requestAnimationFrame(tick);
        else setCount(target);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [target, duration, delay]);
  return count;
}

const IMGS = [
  { src: "/images/DVlTcSViQFS.jpg", alt: "White saree, red rose",         breathDuration: 9,  breathDelay: 0   },
  { src: "/images/DTRqLvyCVT4.jpg", alt: "Bridal gown at window",          breathDuration: 11, breathDelay: 2.5 },
  { src: "/images/DVSo-AEiY1i.jpg", alt: "Pink tulle gown",                breathDuration: 8,  breathDelay: 5   },
];

/* Floating ring ornaments — thin gold circles that drift + parallax */
const RINGS = [
  { size: 72,  top: "10%", left: "60%", depth: 1.8,  floatY: -12, dur: 8,  delay: 0   },
  { size: 40,  top: "72%", left: "80%", depth: 2.6,  floatY: 9,   dur: 11, delay: 3   },
  { size: 24,  top: "42%", left: "50%", depth: 1.1,  floatY: -7,  dur: 9,  delay: 1.5 },
];

export function Hero() {
  /* ── Raw mouse → spring for collage parallax ── */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const softCfg = { stiffness: 55, damping: 22, mass: 1 };
  const mx = useSpring(rawX, softCfg);
  const my = useSpring(rawY, softCfg);

  /* Four image layers — parallax depth creates clear sense of space */
  const x0 = useTransform(mx, (v) => v * 0.28);
  const y0 = useTransform(my, (v) => v * 0.22);
  const x1 = useTransform(mx, (v) => v * -0.48);
  const y1 = useTransform(my, (v) => v * -0.38);
  const x2 = useTransform(mx, (v) => v * 0.38);
  const y2 = useTransform(my, (v) => v * 0.30);

  /* Left-panel text subtly follows mouse */
  const textX = useTransform(mx, (v) => v * 0.06);
  const textY = useTransform(my, (v) => v * 0.04);

  /* Ring ornament parallax */
  const rx0 = useTransform(mx, (v) => v * -RINGS[0].depth * 0.9);
  const ry0 = useTransform(my, (v) => v * -RINGS[0].depth * 0.7);
  const rx1 = useTransform(mx, (v) => v * -RINGS[1].depth * 0.9);
  const ry1 = useTransform(my, (v) => v * -RINGS[1].depth * 0.7);
  const rx2 = useTransform(mx, (v) => v * -RINGS[2].depth * 0.9);
  const ry2 = useTransform(my, (v) => v * -RINGS[2].depth * 0.7);
  const ringXY = [[rx0, ry0], [rx1, ry1], [rx2, ry2]];

  /* Cursor glow: tracks mouse within the right panel */
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const sGlowX = useSpring(glowX, { stiffness: 30, damping: 20 });
  const sGlowY = useSpring(glowY, { stiffness: 30, damping: 20 });
  const glowBg = useMotionTemplate`radial-gradient(circle 420px at ${sGlowX}% ${sGlowY}%, rgba(196,163,90,0.10) 0%, transparent 68%)`;

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 55);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 40);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [rawX, rawY]);

  const onPanelMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    glowX.set(((e.clientX - r.left) / r.width) * 100);
    glowY.set(((e.clientY - r.top) / r.height) * 100);
  };

  return (
    <section className="relative h-screen flex overflow-hidden bg-parchment">

      {/* ── LEFT PANEL ── */}
      <motion.div
        className="relative z-10 flex flex-col h-full px-10 md:px-14 lg:px-20 w-full md:w-[46%] shrink-0"
        style={{ x: textX, y: textY }}
      >

        {/* ── LOGO ZONE — anchored top, owns its space ── */}
        <motion.div
          className="pt-[16vh] relative z-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src="/logo-hd.png"
            alt="Label Gabriel"
            className="w-full max-w-[520px] h-auto select-none ml-2 lg:ml-5"
            draggable={false}
          />
        </motion.div>

        {/* ── TEXT ZONE — sits 8vh below logo ── */}
        <div className="mt-[13vh] flex flex-col">

          {/* Location */}
          <motion.p
            className="relative z-10 font-ui text-[10px] tracking-[0.45em] text-gold uppercase mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.span
              className="inline-block"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              ✦
            </motion.span>
            {" "}Alakode, Kerala · Est. 2024
          </motion.p>

          {/* Headline */}
          <motion.h1
            className="relative z-10 font-display leading-[1.07] text-ink mb-6"
            style={{ fontSize: "clamp(2rem, 3.8vw, 3.8rem)" }}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="italic block">They dreamed it.</span>
            <span className="font-light not-italic text-stone block">We crafted it.</span>
          </motion.h1>

          {/* Animated gold rule */}
          <motion.div
            className="relative z-10 flex items-center gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.85 }}
          >
            <motion.div
              className="h-px bg-gold shrink-0"
              initial={{ width: 0 }}
              animate={{ width: 40 }}
              transition={{ duration: 0.9, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
            />
            <span className="font-ui text-[10px] tracking-[0.28em] text-stone uppercase">
              Bridal · Baptism · Custom Wear
            </span>
          </motion.div>

          {/* Magnetic CTA */}
          <div className="relative z-10">
            <MagneticLink href="/gallery">
              Explore Collection
              <span className="ml-3">↗</span>
            </MagneticLink>
          </div>

        </div>
      </motion.div>

      {/* ── RIGHT PANEL: editorial grid collage ── */}
      <div
        className="hidden md:block absolute right-0 top-0 bottom-0 left-[46%] overflow-hidden"
        onMouseMove={onPanelMove}
      >
        {/* Left-edge parchment fade */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-parchment via-parchment/40 to-transparent z-30 pointer-events-none" />

        {/* Cursor glow overlay */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ background: glowBg }}
        />

        {/* Floating gold ring ornaments */}
        {RINGS.map((ring, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-gold/20 pointer-events-none"
            style={{
              width: ring.size, height: ring.size,
              top: ring.top, left: ring.left,
              x: ringXY[i][0], y: ringXY[i][1],
              zIndex: 25,
            }}
            animate={{ y: [0, ring.floatY, 0] }}
            transition={{ duration: ring.dur, repeat: Infinity, ease: "easeInOut", delay: ring.delay }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          />
        ))}

        {/* ── img0: Left column — full-height anchor (white saree) ── */}
        <motion.div
          className="absolute overflow-hidden"
          style={{ top: "3%", left: "2%", width: "51%", height: "94%", x: x0, y: y0 }}
          initial={{ opacity: 0, scale: 0.97, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.img
            src={IMGS[0].src} alt={IMGS[0].alt}
            className="w-full h-full object-cover object-center"
            animate={{ scale: [1, 1.015, 1] }}
            transition={{ duration: IMGS[0].breathDuration, repeat: Infinity, ease: "easeInOut", delay: IMGS[0].breathDelay }}
          />
          <div className="absolute inset-0 shadow-[inset_0_0_36px_rgba(28,23,20,0.08)] pointer-events-none" />
        </motion.div>

        {/* ── img1: Right column top — bridal at window ── */}
        <motion.div
          className="absolute overflow-hidden border border-linen/50"
          style={{ top: "3%", right: "2%", width: "43%", height: "47%", x: x1, y: y1, zIndex: 2 }}
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.img
            src={IMGS[1].src} alt={IMGS[1].alt}
            className="w-full h-full object-cover object-top"
            animate={{ scale: [1, 1.013, 1] }}
            transition={{ duration: IMGS[1].breathDuration, repeat: Infinity, ease: "easeInOut", delay: IMGS[1].breathDelay }}
          />
          <div className="absolute inset-0 shadow-[inset_0_0_24px_rgba(28,23,20,0.08)] pointer-events-none" />
        </motion.div>

        {/* ── img2: Right column bottom — pink tulle ── */}
        <motion.div
          className="absolute overflow-hidden border border-linen/50"
          style={{ bottom: "3%", right: "2%", width: "43%", height: "45%", x: x2, y: y2, zIndex: 2 }}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.img
            src={IMGS[2].src} alt={IMGS[2].alt}
            className="w-full h-full object-cover object-top"
            animate={{ scale: [1, 1.012, 1] }}
            transition={{ duration: IMGS[2].breathDuration, repeat: Infinity, ease: "easeInOut", delay: IMGS[2].breathDelay }}
          />
          <div className="absolute inset-0 shadow-[inset_0_0_24px_rgba(28,23,20,0.08)] pointer-events-none" />
        </motion.div>

        {/* 490+ badge with count-up */}
        <CountBadge />
      </div>

      {/* Mobile fallback */}
      <div className="absolute inset-0 -z-10 md:hidden">
        <img src={IMGS[0].src} alt="Label Gabriel" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-parchment via-parchment/70 to-parchment/30" />
      </div>
    </section>
  );
}

function CountBadge() {
  const count = useCountUp(490, 1600, 1400);
  return (
    <motion.div
      className="absolute bottom-[5%] left-[3%] z-20 bg-parchment/90 backdrop-blur-sm px-4 py-3 border border-gold/30"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 1.4 }}
    >
      <p className="font-display italic text-2xl text-ink leading-none tabular-nums">
        {count}+
      </p>
      <p className="font-ui text-[8px] tracking-[0.35em] text-stone uppercase mt-0.5">
        pieces crafted
      </p>
    </motion.div>
  );
}

function MagneticLink({ href, children }: { href: string; children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.35);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-block"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.05 }}
    >
      <Link
        href={href}
        className="inline-flex items-center font-ui text-[10px] tracking-[0.38em] text-ink uppercase border border-ink/50 px-9 py-4 hover:bg-ink hover:text-parchment hover:border-ink transition-all duration-300"
      >
        {children}
      </Link>
    </motion.div>
  );
}
