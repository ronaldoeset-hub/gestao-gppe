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
        primary: {
          50: "hsl(var(--color-primary-50) / <alpha-value>)",
          100: "hsl(var(--color-primary-100) / <alpha-value>)",
          200: "hsl(var(--color-primary-200) / <alpha-value>)",
          300: "hsl(var(--color-primary-300) / <alpha-value>)",
          400: "hsl(var(--color-primary-400) / <alpha-value>)",
          500: "hsl(var(--color-primary-500) / <alpha-value>)",
          600: "hsl(var(--color-primary-600) / <alpha-value>)",
          700: "hsl(var(--color-primary-700) / <alpha-value>)",
          800: "hsl(var(--color-primary-800) / <alpha-value>)",
          900: "hsl(var(--color-primary-900) / <alpha-value>)"
        },
        secondary: {
          50: "hsl(var(--color-secondary-50) / <alpha-value>)",
          100: "hsl(var(--color-secondary-100) / <alpha-value>)",
          500: "hsl(var(--color-secondary-500) / <alpha-value>)",
          700: "hsl(var(--color-secondary-700) / <alpha-value>)"
        },
        neutral: {
          50: "hsl(var(--color-neutral-50) / <alpha-value>)",
          100: "hsl(var(--color-neutral-100) / <alpha-value>)",
          200: "hsl(var(--color-neutral-200) / <alpha-value>)",
          300: "hsl(var(--color-neutral-300) / <alpha-value>)",
          400: "hsl(var(--color-neutral-400) / <alpha-value>)",
          500: "hsl(var(--color-neutral-500) / <alpha-value>)",
          600: "hsl(var(--color-neutral-600) / <alpha-value>)",
          700: "hsl(var(--color-neutral-700) / <alpha-value>)",
          800: "hsl(var(--color-neutral-800) / <alpha-value>)",
          900: "hsl(var(--color-neutral-900) / <alpha-value>)"
        },
        success: "hsl(var(--color-success) / <alpha-value>)",
        warning: "hsl(var(--color-warning) / <alpha-value>)",
        danger: "hsl(var(--color-danger) / <alpha-value>)",
        info: "hsl(var(--color-info) / <alpha-value>)",
        sme: {
          blue: "#048DC1",
          navy: "#075985",
          yellow: "#FFCB00",
          red: "#E20613",
          green: "#138A36",
          ink: "#172033",
          surface: "#F4F8FB"
        }
      },
      boxShadow: {
        soft: "0 12px 32px rgba(7, 89, 133, 0.10)",
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)"
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)"
      }
    }
  },
  plugins: []
};

export default config;
