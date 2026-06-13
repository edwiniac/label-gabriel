"use client";

import { motion } from "framer-motion";
import { SimpleTracingBeam } from "./TracingBeam";
import { SplitHeading } from "./SplitHeading";
import { ParallaxImage, useParallax } from "./scroll/Parallax";

interface ServiceItem {
  num: string;
  title: string;
  subtitle: string;
  body: string;
  imagePath?: string;
  imageAlt?: string;
  reverse?: boolean;
}

const SERVICES: ServiceItem[] = [
  {
    num: "01",
    title: "Bridal",
    subtitle: "Where vows become vision",
    body: "Every bride deserves a gown that feels like it was made for her alone — because it was. From Kerala sarees draped with heirloom precision to bespoke gowns carrying generations of craft, we build the dress that walks down the aisle with you.",
    imagePath: "/images/DSNP4O9ibAj.jpg",
    imageAlt: "Bridal couple, Label Gabriel",
    reverse: false,
  },
  {
    num: "02",
    title: "Baptism",
    subtitle: "A first blessing, a lasting memory",
    body: "The most tender occasions call for the most considered garments. Our christening and baptism pieces are crafted in the finest ivory and white — soft enough for a newborn, beautiful enough for a lifetime album.",
    imagePath: "/images/DVlP5UMCSfE.jpg",
    imageAlt: "Baptism family, Label Gabriel",
    reverse: true,
  },
  {
    num: "03",
    title: "Ethnic & Saree",
    subtitle: "Tradition, made yours",
    body: "From Pattaya salwars to mirror-work dupattas, we honour the richness of South Indian textile tradition while shaping each piece to the woman who will wear it. Matching sets, coordinated family looks, and statement ethnic wear designed to turn every gathering into an occasion.",
    imagePath: "/images/DR19iovCdUy.jpg",
    imageAlt: "Ethnic wear, Label Gabriel",
    reverse: false,
  },
  {
    num: "04",
    title: "Custom & Kids",
    subtitle: "Made for every beautiful moment",
    body: "Birthday dresses that feel like fairy tales. Custom silhouettes sketched from a mood board, a dream, or simply a feeling. For children who deserve to be dressed exactly right — and for families who want something that exists nowhere else in the world.",
    imagePath: "/images/DVlTcSViQFS.jpg",
    imageAlt: "Custom wear, Label Gabriel",
    reverse: true,
  },
];

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

const fadeRight = {
  hidden: { opacity: 0, x: -28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: 28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
};

export function ServicesShowcase() {
  return (
    <section className="bg-parchment">
      <SimpleTracingBeam className="px-8 md:px-0">
        {/* Section intro */}
        <motion.div
          className="pt-24 pb-16 max-w-4xl md:pl-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
        >
          <p className="font-ui text-[9px] tracking-[0.45em] text-gold uppercase mb-5">
            What We Do
          </p>
          <SplitHeading
            as="h2"
            className="font-display italic text-5xl md:text-6xl lg:text-7xl text-ink leading-[1.05]"
          >
            Five ways we tell your story.
          </SplitHeading>
        </motion.div>

        {/* Service rows */}
        {SERVICES.map((svc) => (
          <ServiceRow key={svc.num} svc={svc} />
        ))}

        {/* Home Salon — text-only, full-width */}
        <HomeSalonSection />
      </SimpleTracingBeam>
    </section>
  );
}

function ServiceRow({ svc }: { svc: ServiceItem }) {
  const imgVariants = svc.reverse ? fadeLeft : fadeRight;
  const textVariants = svc.reverse ? fadeRight : fadeLeft;

  /* Oversized numeral parallaxes at a stronger rate for editorial depth */
  const { ref: numRef, y: numY } = useParallax(140);

  return (
    <motion.div
      className={`flex flex-col ${svc.reverse ? "md:flex-row-reverse" : "md:flex-row"} border-t border-linen`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {/* Image */}
      {svc.imagePath && (
        <motion.div
          className="md:w-[55%] relative overflow-hidden"
          variants={imgVariants}
        >
          <div className="aspect-[4/3] md:aspect-auto md:h-full min-h-[340px] relative">
            {/* Image drifts within its frame on scroll for editorial parallax */}
            <ParallaxImage
              src={svc.imagePath}
              alt={svc.imageAlt ?? ""}
              className="absolute inset-0"
            />
            {/* Warm edge fade toward text */}
            <div
              className={`absolute inset-0 ${
                svc.reverse
                  ? "bg-gradient-to-l"
                  : "bg-gradient-to-r"
              } from-transparent to-parchment/20 pointer-events-none`}
            />
          </div>
        </motion.div>
      )}

      {/* Text */}
      <motion.div
        className="md:w-[45%] flex flex-col justify-center px-8 md:px-14 py-14 relative"
        variants={textVariants}
      >
        {/* Oversized number — parallaxes at a stronger rate for editorial depth */}
        <motion.span
          ref={numRef as React.RefObject<HTMLSpanElement>}
          style={{ y: numY }}
          className="absolute top-6 right-8 font-display text-[80px] leading-none text-linen/60 select-none pointer-events-none"
        >
          {svc.num}
        </motion.span>

        <p className="font-ui text-[9px] tracking-[0.4em] text-gold uppercase mb-4">
          {svc.subtitle}
        </p>
        <h3 className="font-display italic text-4xl md:text-5xl text-ink mb-5 leading-tight">
          {svc.title}
        </h3>
        <div className="w-8 h-px bg-gold mb-6" />
        <p className="font-ui text-[13px] leading-[1.8] text-stone">
          {svc.body}
        </p>
      </motion.div>
    </motion.div>
  );
}

function HomeSalonSection() {
  return (
    <motion.div
      className="border-t border-linen px-8 md:px-20 py-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-10"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <p className="font-ui text-[9px] tracking-[0.4em] text-gold uppercase mb-4">
          05 · Home Salon
        </p>
        <h3 className="font-display italic text-4xl md:text-6xl text-ink leading-[1.05] max-w-xl">
          We come{" "}
          <span className="font-light not-italic text-stone">to you.</span>
        </h3>
      </div>
      <div className="max-w-xs">
        <div className="w-8 h-px bg-gold mb-6" />
        <p className="font-ui text-[13px] leading-[1.8] text-stone">
          Fittings, trials, and final touches — all in the comfort of your home. Our home salon service brings the atelier to Alakode and beyond, for brides and families who prefer an intimate, unhurried experience.
        </p>
      </div>
    </motion.div>
  );
}
