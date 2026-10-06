import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        main: "#1ED760",
        "on-main": "#06210F",
        canvas: "#0B0C0A",
        rail: "#0F110E",
        surface: "#151714",
        raised: "#1E211D",
        line: "#22261F",
        edge: "#2A2E28",
        fg: "#F2F4EF",
        subtle: "#C9CEC4",
        soft: "#B4BAAF",
        muted: "#9AA196",
        warn: "#FF9F6B",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
