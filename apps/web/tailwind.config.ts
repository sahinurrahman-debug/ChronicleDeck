import type { Config } from "tailwindcss";

// Every colour comes from a CSS variable (see globals.css) so light and dark themes swap in one place.
const rgb = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: rgb("background"),
        foreground: rgb("foreground"),
        card: rgb("card"),
        border: rgb("border"),
        muted: { DEFAULT: rgb("muted"), foreground: rgb("muted-foreground") },
        primary: { DEFAULT: rgb("primary"), foreground: rgb("primary-foreground") },
        // Status colours: muted on purpose so they sit inside the cream and brown palette.
        ok: rgb("ok"),
        warn: rgb("warn"),
        danger: rgb("danger"),
        info: rgb("info"),
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      boxShadow: { soft: "var(--shadow-soft)", lift: "var(--shadow-lift)" },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: { "fade-up": "fade-up 0.4s ease-out both" },
    },
  },
  plugins: [],
};

export default config;
