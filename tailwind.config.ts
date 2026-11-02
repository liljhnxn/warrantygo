import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#090a0d",
          900: "#0e1015",
          850: "#13161d",
          800: "#1a1e27",
          700: "#242936",
          600: "#32394a",
          500: "#4b556b",
        },
        brand: {
          purple: {
            light: "#c084fc",
            DEFAULT: "#9333ea",
            muted: "#7e22ce",
            dark: "#581c87",
            glow: "rgba(147, 51, 234, 0.25)",
          },
          green: {
            light: "#34d399",
            DEFAULT: "#10b981",
            muted: "#059669",
            dark: "#064e3b",
            glow: "rgba(16, 185, 129, 0.25)",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

