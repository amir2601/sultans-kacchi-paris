"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/context/language-context";

export default function HeritageStory() {
  const { t } = useLanguage();

  return (
    <section id="heritage" className="border-b border-rule bg-paper py-12 sm:py-16 lg:py-20">
      <div className="container">
        <div className="grid grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-2">
          
          {/* Photographic Presentation */}
          <div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-card)] border border-gold/50 bg-paper-2 shadow-md"
          >
            <Image
              src="/images/2026-11-03-taj-mahal7409450.jpg"
              alt="Mughal architectural heritage inspiring Sultan's Kacchi Paris culinary craft"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"
              aria-hidden="true"
            />
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 rounded-[var(--radius-card)] border border-gold/30 bg-white/95 p-3 sm:p-4 backdrop-blur-md shadow-sm">
              <span className="font-display text-xs sm:text-sm font-bold text-accent block">
                {t("heritage.dumPukht")}
              </span>
              <p className="mt-1 text-[11px] sm:text-xs text-muted leading-relaxed">
                {t("heritage.dumPukhtDesc")}
              </p>
            </div>
          </div>

          {/* Editorial Text */}
          <div className="flex flex-col items-start">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-section-head font-bold text-accent">
              {t("heritage.headline")}
            </h2>

            <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-ink-2 max-w-[55ch]">
              {t("heritage.p1")}
            </p>

            <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-ink-2 max-w-[55ch]">
              {t("heritage.p2")}
            </p>

            <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-6 border-t border-rule pt-5 sm:pt-6 w-full">
              <div className="luxury-card p-3 sm:p-4 bg-paper-2">
                <span className="text-[11px] sm:text-xs text-muted block font-medium">{t("heritage.grainTitle")}</span>
                <span className="font-display text-sm sm:text-base font-bold text-accent mt-0.5 sm:mt-1 block">{t("heritage.grainVal")}</span>
              </div>
              <div className="luxury-card p-3 sm:p-4 bg-paper-2">
                <span className="text-[11px] sm:text-xs text-muted block font-medium">{t("heritage.halalTitle")}</span>
                <span className="font-display text-sm sm:text-base font-bold text-accent mt-0.5 sm:mt-1 block">{t("heritage.halalVal")}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
