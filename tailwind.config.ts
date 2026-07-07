import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ink: "#3D3350",
        cream: "#FFFEFC",
        lavender: "#ADA0CB",
        teal: "#7FB2A6",
      },
      animation: {
        "spin-slow": "spin 18s linear infinite",
        "spin-slower": "spin 26s linear infinite",
        "spin-slow-reverse": "spin 22s linear infinite reverse",
      },
    },
  },
  plugins: [],
};

export default config;
