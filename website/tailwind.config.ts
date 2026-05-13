import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      /* ============================================
         Brand Colors (preserved)
         ============================================ */
      colors: {
        parchment: "#FDFAF6",
        ivory: "#F5F0E8",
        linen: "#EDE5D8",
        stone: "#8A7F76",
        ink: "#1C1714",
        gold: "#C4A35A",
        blush: "#E8D0C0",
        sage: "#B5C4B1",
      },

      /* ============================================
         Font Families (preserved)
         ============================================ */
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        ui: ["var(--font-dm-sans)", "sans-serif"],
      },

      /* ============================================
         Letter Spacing — Editorial style
         ============================================ */
      letterSpacing: {
        wider: "0.05em",
        widest: "0.1em",
        editorial: "0.15em",
      },

      /* ============================================
         Animation Keyframes (all preserved + new)
         ============================================ */
      keyframes: {
        /* Preserved */
        marquee: {
          from: { transform: "translateX(0%)" },
          to: { transform: "translateX(-50%)" },
        },
        stripLeft: {
          from: { transform: "translateX(0%)" },
          to: { transform: "translateX(-50%)" },
        },
        stripRight: {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0%)" },
        },
        /* New — Fade-up blur dissolve */
        reveal: {
          "0%": {
            opacity: "0",
            transform: "translateY(16px)",
            filter: "blur(4px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
            filter: "blur(0px)",
          },
        },
      },

      /* ============================================
         Animation Definitions
         ============================================ */
      animation: {
        /* Preserved */
        marquee: "marquee 28s linear infinite",
        "marquee-slow": "marquee 50s linear infinite",
        "strip-left": "stripLeft 55s linear infinite",
        "strip-right": "stripRight 65s linear infinite",
        /* New — Granular duration variants */
        "strip-left-fast": "stripLeft 30s linear infinite",
        "strip-left-slow": "stripLeft 80s linear infinite",
        "strip-right-fast": "stripRight 35s linear infinite",
        "strip-right-slow": "stripRight 90s linear infinite",
        /* New — Reveal with blur dissolve */
        reveal: "reveal 0.7s var(--ease-out-expo) forwards",
        "reveal-sm": "reveal 0.3s var(--ease-out-expo) forwards",
        "reveal-md": "reveal 0.5s var(--ease-out-expo) forwards",
        "reveal-lg": "reveal 0.7s var(--ease-out-expo) forwards",
        "reveal-xl": "reveal 1s var(--ease-out-expo) forwards",
      },

      /* ============================================
         Animation Delay Utilities (stagger helper)
         ============================================ */
      transitionDelay: {
        "0": "0ms",
        "75": "75ms",
        "100": "100ms",
        "150": "150ms",
        "200": "200ms",
        "300": "300ms",
        "500": "500ms",
        "700": "700ms",
        "1000": "1000ms",
      },
    },
  },
  plugins: [],
};

export default config;
