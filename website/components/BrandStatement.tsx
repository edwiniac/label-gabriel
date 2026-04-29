"use client";

import { motion } from "framer-motion";
import { SplitHeading } from "./SplitHeading";

export function BrandStatement() {
  return (
    <section className="bg-parchment border-b border-linen px-8 md:px-16 py-24 md:py-32">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-start">
        {/* Left: large pull quote */}
        <div className="md:w-[60%]">
          <SplitHeading
            as="h2"
            className="font-display italic text-4xl md:text-5xl lg:text-6xl text-ink leading-[1.1]"
          >
            They dreamed it. We crafted it. And it was perfect.
          </SplitHeading>
        </div>

        {/* Right: brand description */}
        <motion.div
          className="md:w-[40%] flex flex-col justify-center"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-8 h-px bg-gold mb-8" />
          <p className="font-ui text-[13px] leading-[1.9] text-stone mb-6">
            Label Gabriel is a bespoke designer studio rooted in Alakode, Kerala — where every garment begins as a conversation and ends as an heirloom. Since 2024, we have dressed brides, blessed babies, and given families something beautiful to remember.
          </p>
          <p className="font-ui text-[13px] leading-[1.9] text-stone">
            Every stitch is considered. Every silhouette is personal. Every piece carries the weight of a moment that mattered.
          </p>
          <div className="mt-10">
            <p className="font-ui text-[9px] tracking-[0.4em] text-gold uppercase">
              Alakode, Kerala, India
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
