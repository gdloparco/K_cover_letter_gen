import { Permanent_Marker } from "next/font/google";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        // Ubuntu: ['"Ubuntu"', "sans-serif"],
        // Prompt: ['"Prompt"', "sans-serif"],
        Permanent_Marker: ['"Permanent_Marker"', "sans-serif"],
        // Pacifico: ['"Pacifico"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
