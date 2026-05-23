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
        soft: "0 12px 32px rgba(7, 89, 133, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
