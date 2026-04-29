import { Emblem } from "./Emblem";

export function Footer() {
  return (
    <footer className="bg-ivory border-t border-linen px-8 py-16">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-7 text-center">

        <Emblem size="md" />

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
            className="font-ui text-[10px] tracking-[0.3em] text-stone uppercase hover:text-gold transition-colors duration-300"
          >
            @label_gabriel
          </a>
          <span className="text-linen">·</span>
          <span className="font-ui text-[10px] tracking-[0.3em] text-stone uppercase">
            DM to order
          </span>
        </div>

        <p className="font-ui text-[9px] tracking-widest text-stone/40 uppercase mt-2">
          © {new Date().getFullYear()} Label Gabriel. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
