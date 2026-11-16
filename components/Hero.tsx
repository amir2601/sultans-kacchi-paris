"use client";

import Image from "next/image";
import { useCart } from "@/lib/context/cart-context";
import { useSettings } from "@/lib/context/settings-context";
import { ArrowDown, ShoppingBag, Crown, CheckCircle } from "lucide-react";

export default function Hero() {
  const { openCart } = useCart();
  const { settings } = useSettings();

  return (
    <section className="relative overflow-hidden border-b border-rule bg-paper py-12 lg:py-16">
      <div className="container">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
          
          {/* Hero Text Block - Fits 1280x800 without scrolling */}
          <div className="flex flex-col items-start">
            
            {/* Halal badge */}
            {settings.isHalalCertified && (
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-paper-2 px-3.5 py-1 text-xs font-semibold text-accent shadow-xs mb-4">
                <Crown className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                <span>100% Halal Authenticated · Paris 10e</span>
              </div>
            )}

            <h1 className="font-display text-display-hero font-bold text-accent">
              Royal Mughal Kacchi Banquet in Paris
            </h1>

            <p className="mt-4 text-lead text-ink-2 max-w-[54ch] font-normal leading-relaxed">
              Authentic slow-dum biryani infused with pure saffron, ghee, and twenty-one royal spices.
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={openCart}
                className="btn-primary"
              >
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                <span className="whitespace-nowrap">Order for pickup</span>
              </button>
              
              <a
                href="#menu"
                className="btn-outline"
              >
                <span className="whitespace-nowrap">Explore Paris menu</span>
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            {/* Factual Paris Branch Note */}
            <div className="mt-8 border-t border-rule pt-4 text-xs text-muted flex flex-wrap items-center gap-3">
              <span className="font-semibold text-ink">Service continuously:</span>
              <span>{settings.openingHoursWeekdays} at {settings.address.split(",")[0]}.</span>
            </div>
          </div>

          {/* Hero Visual Block */}
          <div
            data-slot="hero"
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
                  Signature Mutton Kacchi
                </span>
                <span className="text-[11px] text-muted">
                  Aged basmati & tender mutton
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
