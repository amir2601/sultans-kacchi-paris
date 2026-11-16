"use client";

import Image from "next/image";
import { useCart } from "@/lib/context/cart-context";
import { useSettings } from "@/lib/context/settings-context";
import { useLanguage } from "@/lib/context/language-context";
import { ArrowDown, ShoppingBag, Crown, CalendarDays } from "lucide-react";

export default function Hero() {
  const { openCart } = useCart();
  const { settings } = useSettings();
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden border-b border-rule bg-paper py-10 sm:py-14 lg:py-16">
      <div className="container">
        <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
          
          {/* Hero Text Block */}
          <div className="flex flex-col items-start">
            
            {/* Brand Logo & Halal badge */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative h-12 w-28 sm:h-14 sm:w-32 flex-shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Sultan's Kacchi Paris"
                  fill
                  priority
                  className="object-contain object-left"
                />
              </div>
              {settings.isHalalCertified && (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-paper-2 px-3 py-1 text-xs font-semibold text-accent shadow-xs">
                  <Crown className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                  <span>{t("hero.halalTag")}</span>
                </div>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-display-hero font-bold text-accent leading-tight sm:leading-none">
              {t("hero.headline")}
            </h1>

            <p className="mt-4 text-lead text-ink-2 max-w-[54ch] font-normal leading-relaxed text-sm sm:text-base">
              {t("hero.description")}
            </p>

            {/* Actions */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={openCart}
                className="btn-primary w-full sm:w-auto justify-center"
              >
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                <span className="whitespace-nowrap">{t("hero.orderPickup")}</span>
              </button>

              <a
                href="#reservation"
                className="btn-outline w-full sm:w-auto justify-center flex items-center gap-2 border-gold text-accent hover:bg-gold/10"
              >
                <CalendarDays className="h-4 w-4 text-gold-dark" aria-hidden="true" />
                <span className="whitespace-nowrap">{t("nav.reservation")}</span>
              </a>
              
              <a
                href="#menu"
                className="btn-outline w-full sm:w-auto justify-center"
              >
                <span className="whitespace-nowrap">{t("hero.exploreMenu")}</span>
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            {/* Factual Paris Branch Note */}
            <div className="mt-6 sm:mt-8 border-t border-rule pt-4 text-xs text-muted flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="font-semibold text-ink">{t("hero.serviceContinuously")}</span>
              <span>{settings.openingHoursWeekdays} at {settings.address.split(",")[0]}.</span>
            </div>
          </div>

          {/* Hero Visual Block */}
          <div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-card)] border border-gold/50 bg-paper-2 shadow-lg"
          >
            <Image
              src="/images/biryani-mouton.jpg"
              alt="Authentic Sultan's Kacchi Paris royal mutton kacchi biryani"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover object-center"
            />
            {/* Subtle luxury vignette */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-paper/80 via-transparent to-transparent pointer-events-none"
              aria-hidden="true"
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-[var(--radius-card)] border border-gold/40 bg-white/95 px-4 py-3 backdrop-blur-md shadow-md">
              <div>
                <span className="font-display text-sm font-bold text-accent block">
                  {t("hero.signatureTitle")}
                </span>
                <span className="text-[11px] text-muted">
                  {t("hero.signatureSubtitle")}
                </span>
              </div>
              <span className="font-display text-lg font-bold text-gold-dark">
                €9.90
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
