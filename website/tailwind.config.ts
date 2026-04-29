import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
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
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        ui: ["var(--font-dm-sans)", "sans-serif"],
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        "marquee-slow": "marquee 50s linear infinite",
        "strip-left": "stripLeft 55s linear infinite",
        "strip-right": "stripRight 65s linear infinite",
      },
      keyframes: {
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
      },
    },
  },
  plugins: [],
};

export default config;
