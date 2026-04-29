export function Footer() {
  return (
    <footer className="border-t border-cream/5 px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
      <span className="font-display italic text-lg text-muted">
        Label Gabriel
      </span>

      <span className="font-ui text-[10px] tracking-[0.3em] text-muted uppercase">
        {new Date().getFullYear()}
      </span>

      <a
        href="https://www.instagram.com/label_gabriel/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-ui text-[10px] tracking-[0.3em] text-muted uppercase hover:text-gold transition-colors"
      >
        @label_gabriel
      </a>
    </footer>
  );
}
