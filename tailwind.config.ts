import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        candy: {
          pink: "#FFC7DE",
          peach: "#FFD7C7",
          sky: "#C7E9FF",
          mint: "#C7FFE4",
          cream: "#FFF5E1",
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 8px 20px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
} satisfies Config;
