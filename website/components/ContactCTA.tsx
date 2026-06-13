"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

export function ContactCTA() {
  return (
    <section className="bg-ink px-8 py-28 text-center">
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Gold decorative line + diamond */}
        <motion.div
          className="flex justify-center items-center gap-3 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="w-8 h-px bg-gold/40" />
          <span className="text-gold/30 text-[6px]">◆</span>
          <div className="w-8 h-px bg-gold/40" />
        </motion.div>

        {/* HD logo */}
        <motion.div
          className="flex justify-center mb-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15 }}
        >
          <img
            src="/logo-hd.png"
            alt="Label Gabriel"
            className="h-12 w-auto select-none mix-blend-screen opacity-90"
            draggable={false}
          />
        </motion.div>

        <p className="font-ui text-[9px] tracking-[0.5em] text-gold/70 uppercase mb-6">
          Begin your story
        </p>
        <h2 className="font-display italic text-4xl md:text-6xl text-parchment leading-[1.1] mb-4">
          Let&apos;s make something
          <br />
          <span className="font-light not-italic text-stone">
            extraordinary.
          </span>
        </h2>
        <div className="w-10 h-px bg-gold mx-auto my-10" />
        <p className="font-ui text-[13px] text-stone leading-[1.8] mb-12 max-w-md mx-auto">
          Tell us your vision — bridal, baptism, custom wear, or anything in
          between. DM us on Instagram to start the conversation.
        </p>

        {/* Magnetic CTA button */}
        <MagneticCTAButton />

        {/* Bottom diamond accent */}
        <div className="flex justify-center items-center gap-3 mt-10">
          <div className="w-4 h-px bg-gold/20" />
          <span className="text-gold/20 text-[6px]">◆</span>
          <div className="w-4 h-px bg-gold/20" />
        </div>

        <p className="font-ui text-[9px] tracking-[0.25em] text-stone/40 uppercase mt-6">
          @label_gabriel
        </p>
      </motion.div>
    </section>
  );
}

function MagneticCTAButton() {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.3);
    y.set((e.clientY - r.top - r.height / 2) * 0.3);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href="https://www.instagram.com/label_gabriel/"
      target="_blank"
      rel="noopener noreferrer"
      data-cursor
      style={reduce ? undefined : { x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={reduce ? undefined : { scale: 1.02 }}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="inline-block font-ui text-[10px] tracking-[0.4em] text-ink uppercase bg-gold px-12 py-4 hover:bg-gold/90 transition-colors duration-300"
    >
      DM on Instagram
    </motion.a>
  );
}
