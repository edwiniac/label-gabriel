export function Footer() {
  return (
    <footer className="bg-ivory border-t border-linen px-8 py-14">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 text-center">
        <div>
          <p className="font-display italic text-3xl text-ink">Label Gabriel</p>
          <p className="font-ui text-[9px] tracking-[0.4em] text-stone uppercase mt-1">
            The Premium Designer Studio
          </p>
        </div>

        <div className="w-8 h-px bg-gold" />

        <p className="font-ui text-[10px] tracking-[0.2em] text-stone uppercase">
          Alakode, Kerala, India
        </p>

        <div className="flex gap-8 items-center">
          <a
            href="https://www.instagram.com/label_gabriel/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-ui text-[10px] tracking-[0.3em] text-stone uppercase hover:text-gold transition-colors"
          >
            @label_gabriel
          </a>
          <span className="text-linen">·</span>
          <span className="font-ui text-[10px] tracking-[0.3em] text-stone uppercase">
            DM to order
          </span>
        </div>

        <p className="font-ui text-[9px] tracking-widest text-stone/50 uppercase mt-4">
          © {new Date().getFullYear()} Label Gabriel. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
