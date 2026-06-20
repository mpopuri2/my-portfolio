import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        electric: {
          DEFAULT: "#818cf8",
          light: "#a5b4fc",
          dark: "#6366f1",
        },
        bg: {
          DEFAULT: "#04040a",
          surface: "#0d0d1a",
          card: "#111120",
        },
      },
    },
  },
  plugins: [],
};

export default config;
