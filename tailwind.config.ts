import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        med: {
          bg: "#F8FAFC",
          bgDark: "#0B1120",
          cardDark: "#111827",
          primary: "#0F4C81",
          primaryHover: "#0A355C",
          primaryLight: "#EBF3FB",
          secondary: "#2563EB",
          secondaryLight: "#EFF6FF",
          textEn: "#172033",
          textAr: "#334155",
          terms: "#7C3AED",
          termsLight: "#F5F3FF",
          success: "#15803D",
          successLight: "#F0FDF4",
          warning: "#B45309",
          warningLight: "#FFFBEB",
          error: "#B91C1C",
          errorLight: "#FEF2F2",
          border: "#E2E8F0",
          borderDark: "#1F2937",
        },
      },
      fontFamily: {
        cairo: ["var(--font-cairo)", "Cairo", "Tajawal", "sans-serif"],
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
