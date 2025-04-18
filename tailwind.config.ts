
import { type Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#5E17EB",
          foreground: "#FFFFFF",
          blue: "#4A7CFE",
          purple: "#6E59A5",
        },
        secondary: {
          DEFAULT: "#7E69AB",
          foreground: "#FFFFFF",
          purple: "#7E69AB",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "inuma-purple": "#5E17EB",
        "inuma-light-purple": "#9b87f5",
        "inuma-dark-purple": "#3B0F9E",
        "chart-green": "#10B981",
        "chart-red": "#EF4444",
        "chart-blue": "#3B82F6",
        "chart-purple": "#8B5CF6",
        "chart-orange": "#F59E0B",
        "dark-card": "#1A1F2C",
        "client": "#3B82F6",
        "phoner": "#F59E0B",
        "visio": "#10B981",
        "supervisor": "#8B5CF6",
        "manager": "#EF4444",
        "inuma-blue": "#3B82F6",
        "inuma-lightBlue": "#93C5FD",
        "inuma-lightRed": "#FCA5A5",
      },
      backgroundImage: {
        "header-gradient": "linear-gradient(to right, #5E17EB, #9b87f5)",
        "sidebar-gradient": "linear-gradient(to bottom, #5E17EB, #3B0F9E)",
        "card-gradient": "linear-gradient(to bottom right, #ffffff, #f5f5f5)",
        "primary-gradient": "linear-gradient(to right, #5E17EB, #9b87f5)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
