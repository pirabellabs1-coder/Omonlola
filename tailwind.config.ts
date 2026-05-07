import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", '"Plus Jakarta Sans"', "sans-serif"],
        display: ["var(--font-display)", '"Space Grotesk"', "sans-serif"]
      },
      colors: {
        dark: {
          DEFAULT: "#030303",
          card: "#0A0A0A",
          border: "#1A1A1A"
        },
        surface: "#0A0A0A",
        sidebar: "#050505",
        brand: {
          DEFAULT: "#0066FF",
          light: "#3385FF",
          glow: "rgba(0, 102, 255, 0.4)"
        },
        danger: {
          DEFAULT: "#FF3366",
          glow: "rgba(255, 51, 102, 0.3)"
        },
        text: {
          main: "#FFFFFF",
          muted: "#A1A1AA"
        }
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #0066FF 0%, #00C6FF 100%)",
        "gradient-danger": "linear-gradient(135deg, #FF3366 0%, #FF6B33 100%)"
      }
    }
  },
  plugins: []
};

export default config;
