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
        paper: "var(--color-paper)",
        "paper-2": "var(--color-paper-2)",
        "paper-3": "var(--color-paper-3)",
        "paper-card": "var(--color-paper-card)",
        ink: "var(--color-ink)",
        "ink-2": "var(--color-ink-2)",
        muted: "var(--color-muted)",
        rule: "var(--color-rule)",
        "rule-subtle": "var(--color-rule-subtle)",
        accent: "var(--color-accent)",
        "accent-ink": "var(--color-accent-ink)",
        "accent-light": "var(--color-accent-light)",
        "accent-dark": "var(--color-accent-dark)",
        gold: "var(--color-gold)",
        "gold-light": "var(--color-gold-light)",
        "gold-dark": "var(--color-gold-dark)",
        focus: "var(--color-focus)",
        error: "var(--color-error)",
        success: "var(--color-success)",
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
      },
      spacing: {
        "3xs": "var(--space-3xs)",
        "2xs": "var(--space-2xs)",
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        "3xl": "var(--space-3xl)",
        "4xl": "var(--space-4xl)",
      },
      borderRadius: {
        card: "var(--radius-card)",
        pill: "var(--radius-pill)",
      },
      maxWidth: {
        container: "var(--container)",
      },
      transitionTimingFunction: {
        "ease-out": "var(--ease-out)",
        "ease-in": "var(--ease-in)",
        "ease-in-out": "var(--ease-in-out)",
      },
      transitionDuration: {
        micro: "var(--dur-micro)",
        short: "var(--dur-short)",
        long: "var(--dur-long)",
      },
    },
  },
  plugins: [],
};

export default config;
