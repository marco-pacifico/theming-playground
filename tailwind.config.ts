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
        heading: "var(--font-heading)",
        ui: "var(--font-ui)",
        inter: "var(--font-inter)",
        louize: "var(--font-louize)",
        playfair: "var(--font-playfair)",
        roobert: "var(--font-roobert)",
        spacemono: "var(--font-space-mono)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      gridTemplateRows: {
        "[auto,auto,1fr]": "auto auto 1fr",
      },
      backgroundColor: {
        "brand": "var(--color-bg-brand)",
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
export default config;
