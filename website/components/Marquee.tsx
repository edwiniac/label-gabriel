"use client";

const ITEMS = [
  "Bridal",
  "Baptism",
  "Kids",
  "Custom Wear",
  "Ethnic",
  "Home Salon",
];

const track = Array(4).fill(ITEMS).flat();

export function Marquee() {
  return (
    <div className="overflow-hidden bg-ink py-5 border-y border-gold/15">
      <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
        {[...track, ...track].map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span
              className={`font-ui text-[10px] tracking-[0.45em] uppercase px-7 ${
                i % 2 === 0 ? "text-gold/80" : "text-parchment/50"
              }`}
            >
              {item}
            </span>
            <span
              className={`text-xs ${
                i % 2 === 0 ? "text-gold/30" : "text-parchment/15"
              }`}
            >
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
