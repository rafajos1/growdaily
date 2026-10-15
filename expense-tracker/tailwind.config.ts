import type { Config } from "tailwindcss";

// "Pace" theme: a deliberately dark interface. Amber is the single accent;
// up/down are semantic (spending more / less) and never used as decoration.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0d1520",
        panel: "#131e2c",
        raised: "#1e2d42",
        sunken: "#0f1a27",
        line: "#22324a",
        hairline: "#1b293b",
        fg: "#e8eef5",
        soft: "#cdd8e5",
        muted: "#8a9bb2",
        dim: "#6f829b",
        amber: { DEFAULT: "#f2b54b", hover: "#f6c56d", ink: "#1b1408" },
        up: "#f2846b",
        down: "#53cfa0",
        heat: { 0: "#172638", 1: "#1d4466", 2: "#246a96", 3: "#3a97c4", 4: "#8fd3ef" },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-dm-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 150ms ease-out",
        "slide-up": "slide-up 200ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
