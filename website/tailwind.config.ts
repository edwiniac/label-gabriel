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
    },
  },
  plugins: [],
};

export default config;
