import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        gold: {
          DEFAULT: "#D4AF37",
          foreground: "#FFFFFF",
          light: "#F9E79F",
          dark: "#996515",
        },
        black: "#000000",
        white: "#FFFFFF",
      },
      boxShadow: {
        "gold-sm": "0 1px 2px 0 rgba(212, 175, 55, 0.05)",
        "gold-md": "0 4px 6px -1px rgba(212, 175, 55, 0.1), 0 2px 4px -1px rgba(212, 175, 55, 0.06)",
        "gold-lg": "0 10px 15px -3px rgba(212, 175, 55, 0.15), 0 4px 6px -2px rgba(212, 175, 55, 0.05)",
      },
      backgroundImage: {
        "gold-metallic": "linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #B38728 100%)",
        "dark-surface": "linear-gradient(to bottom, #111111, #000000)",
      },
      borderWidth: {
        DEFAULT: "1px",
        0: "0",
        2: "2px",
        premium: "1px",
      },
      borderColor: {
        "gold-subtle": "rgba(212, 175, 55, 0.2)",
      },
      borderRadius: {
        md: "0.5rem",
      },
    },
  },
};

export default config;
