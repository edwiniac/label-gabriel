import { Emblem } from "./Emblem";

export function Footer() {
  return (
    <footer className="bg-ivory px-8 py-16">
      {/* Gold rule line at top */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto flex flex-col items-center gap-8 text-center">
        <Emblem size="md" />

        {/* Brand — larger display name */}
        <p className="font-display italic text-2xl text-ink">Label Gabriel</p>
        <p className="font-ui text-[10px] tracking-[0.25em] text-stone uppercase -mt-5">
          The Premium Designer Studio
        </p>

        <div className="flex items-center gap-5">
          <div className="w-8 h-px bg-linen" />
          <span className="text-gold/40 text-xs">✦</span>
          <div className="w-8 h-px bg-linen" />
        </div>

        <p className="font-ui text-[10px] tracking-[0.25em] text-stone uppercase">
          Alakode, Kerala, India
        </p>

        <div className="flex gap-8 items-center">
          <a
            href="https://www.instagram.com/label_gabriel/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative font-ui text-[10px] tracking-[0.3em] text-stone uppercase hover:text-gold transition-colors duration-300 rounded-sm pb-1"
          >
            @label_gabriel
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-px origin-center scale-x-0 bg-gold transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
            />
          </a>
          <span className="text-linen">·</span>
          <span className="font-ui text-[10px] tracking-[0.3em] text-stone uppercase">
            DM to order
          </span>
        </div>

        {/* Est. line */}
        <p className="font-ui text-[9px] tracking-widest text-stone/50 uppercase mt-2">
          Est. 2024 · Alakode, Kerala
        </p>

        <p className="font-ui text-[9px] tracking-widest text-stone/30 uppercase">
          © {new Date().getFullYear()} Label Gabriel. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
