"use client";

import { useLanguage } from "@/lib/context/language-context";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "compact" | "detailed";
}

export default function LanguageSwitcher({
  className = "",
  variant = "compact",
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  if (variant === "detailed") {
    return (
      <div className={`flex items-center gap-1.5 p-1 rounded-[var(--radius-card)] border border-rule bg-paper-2 ${className}`}>
        <button
          type="button"
          onClick={() => setLanguage("en")}
          aria-label="Switch to English"
          className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 ${
            language === "en"
              ? "bg-accent text-white shadow-xs"
              : "text-muted hover:text-ink hover:bg-paper-3"
          }`}
        >
          <span>🇬🇧</span>
          <span>English</span>
        </button>
        <button
          type="button"
          onClick={() => setLanguage("fr")}
          aria-label="Passer au Français"
          className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 ${
            language === "fr"
              ? "bg-accent text-white shadow-xs"
              : "text-muted hover:text-ink hover:bg-paper-3"
          }`}
        >
          <span>🇫🇷</span>
          <span>Français</span>
        </button>
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Language selector"
      className={`inline-flex items-center rounded-[var(--radius-card)] border border-rule bg-paper-2 p-0.5 text-xs font-semibold shadow-xs ${className}`}
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-label="Switch to English"
        className={`px-2 py-1 rounded transition-all duration-200 active:scale-95 ${
          language === "en"
            ? "bg-accent text-white shadow-xs"
            : "text-muted hover:text-ink hover:bg-paper-3"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("fr")}
        aria-label="Changer vers le Français"
        className={`px-2 py-1 rounded transition-all duration-200 active:scale-95 ${
          language === "fr"
            ? "bg-accent text-white shadow-xs"
            : "text-muted hover:text-ink hover:bg-paper-3"
        }`}
      >
        FR
      </button>
    </div>
  );
}
