import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        text: "text 5s ease infinite",
      },
      keyframes: {
        text: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
      },
      colors: {
        textHover: "#3dff8b",
        buttonBg: "#074707",
        buttonBgHover: "#65ef65",
      },
      backgroundImage: {},
      fontFamily: {
        montserrat: ["var(--font-montserrat)"],
      },
    },
  },
  daisyui: {
    themes: [],
  },
  plugins: [require("daisyui")],
};
export default config;
