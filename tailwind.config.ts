import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}",
    "./types/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        void: "#03040b",
        ink: "#080b1a",
        panel: "rgba(12, 16, 38, 0.72)",
        pulse: "#9f5cff",
        plasma: "#7a35ff",
        cyan: "#32e6ff",
        mint: "#42ffba",
        warning: "#ffca5f",
        danger: "#ff4fd8"
      },
      fontFamily: {
        display: ["var(--font-orbitron)", "var(--font-inter)", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        neon: "0 0 18px rgba(159, 92, 255, 0.7), 0 0 60px rgba(122, 53, 255, 0.35)",
        cyan: "0 0 16px rgba(50, 230, 255, 0.55), 0 0 44px rgba(50, 230, 255, 0.2)",
        insetGlow: "inset 0 0 26px rgba(159, 92, 255, 0.18)"
      },
      backgroundImage: {
        "radial-grid":
          "radial-gradient(circle at 50% 0%, rgba(159,92,255,.34), transparent 32%), linear-gradient(rgba(132, 92, 255, .09) 1px, transparent 1px), linear-gradient(90deg, rgba(132, 92, 255, .08) 1px, transparent 1px)",
        "scan-lines":
          "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px)"
      },
      animation: {
        "pulse-glow": "pulseGlow 2.8s ease-in-out infinite",
        "scan": "scan 6s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "spin-slow": "spin 16s linear infinite"
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: ".72", filter: "drop-shadow(0 0 12px rgba(159,92,255,.8))" },
          "50%": { opacity: "1", filter: "drop-shadow(0 0 28px rgba(50,230,255,.55))" }
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
