import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        sme: {
          blue: "#0E7FA8",
          navy: "#0A3149",
          "navy-700": "#0E466A",
          "blue-soft": "#E3F1F7",
          yellow: "#FFC400",
          gold: "#E8A800",
          red: "#D4202C",
          green: "#138A36",
          ink: "#0E2233",
          muted: "#5C7186",
          line: "#E6ECF2",
          surface: "#F4F7FA"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-ui)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      borderRadius: {
        xl: "14px",
        "2xl": "16px"
      },
      boxShadow: {
        soft: "0 18px 48px rgba(10,49,73,.12)",
        "soft-sm": "0 2px 10px rgba(10,49,73,.06)"
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        rise: "rise .4s ease both"
      }
    }
  },
  plugins: []
};

export default config;
