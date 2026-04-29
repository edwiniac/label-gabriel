"use client";

import { motion } from "framer-motion";

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
        {/* HD logo — gold on dark is stunning */}
        <motion.div
          className="flex justify-center mb-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1 }}
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
          <span className="font-light not-italic text-stone">extraordinary.</span>
        </h2>
        <div className="w-10 h-px bg-gold mx-auto my-10" />
        <p className="font-ui text-[13px] text-stone leading-[1.8] mb-12 max-w-md mx-auto">
          Tell us your vision — bridal, baptism, custom wear, or anything in between. DM us on Instagram to start the conversation.
        </p>
        <a
          href="https://www.instagram.com/label_gabriel/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-ui text-[10px] tracking-[0.4em] text-ink uppercase bg-gold px-12 py-4 hover:bg-gold/90 transition-colors duration-300"
        >
          DM on Instagram
        </a>
        <p className="font-ui text-[9px] tracking-[0.25em] text-stone/40 uppercase mt-8">
          @label_gabriel
        </p>
      </motion.div>
    </section>
  );
}
