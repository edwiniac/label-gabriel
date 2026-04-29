import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#0A0A0A",
        surface: "#141414",
        cream: "#F0EBE1",
        muted: "#6B6560",
        gold: "#C8A96E",
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
