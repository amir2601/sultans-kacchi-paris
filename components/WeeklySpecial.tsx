"use client";

import Image from "next/image";
import { MenuItem } from "@/lib/supabase/types";
import { useCart } from "@/lib/context/cart-context";
import { useLanguage } from "@/lib/context/language-context";
import { Plus, Check, Crown } from "lucide-react";
import { useState } from "react";

interface WeeklySpecialProps {
  specialItem: MenuItem;
}

export default function WeeklySpecial({ specialItem }: WeeklySpecialProps) {
  const { addItem } = useCart();
  const { t, language } = useLanguage();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    addItem(specialItem, false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const displayName = language === "fr" && specialItem.name_fr ? specialItem.name_fr : specialItem.name;
  const displayDesc = language === "fr" && specialItem.description_fr ? specialItem.description_fr : specialItem.description;

  return (
    <section id="weekly-special" className="border-b border-rule bg-paper-3/50 py-10 sm:py-16">
      <div className="container">
        <div className="luxury-card overflow-hidden p-5 sm:p-8 md:p-10 lg:p-12 border-gold/50 shadow-md transition-colors duration-short hover:border-gold group">
          <div className="grid grid-cols-1 items-center gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12">
            
            {/* Visual presentation */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-card)] border border-gold/40 shadow-sm">
              <Image
                src={specialItem.image_url || "/images/biryani-mouton.jpg"}
                alt={displayName}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white shadow-sm">
                <Crown className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                <span>{t("weekly.chefBadge")}</span>
              </div>
            </div>

            {/* Information & Action */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gold-dark">
                  {t("weekly.maisonSelection")}
                </span>
                <span className="h-1 w-1 rounded-full bg-gold" aria-hidden="true" />
                <span className="text-xs font-medium text-muted">{t("weekly.oldDhakaRecipe")}</span>
              </div>

              <h2 className="mt-2 font-display text-2xl sm:text-3xl lg:text-section-head font-bold text-accent">
                {displayName}
              </h2>

              <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-ink-2 max-w-[55ch]">
                {displayDesc ||
                  "Aged basmati rice sealed with tender spring lamb, caramelized potato, saffron ghee, and whole spices in a traditional sealed deg."}
              </p>

              <div className="mt-5 sm:mt-6 flex flex-wrap items-baseline gap-2">
                <span className="font-display text-2xl sm:text-3xl font-bold text-accent">
                  €{Number(specialItem.price).toFixed(2)}
                </span>
                <span className="text-xs text-muted font-medium">
                  {t("weekly.tvaNotice")}
                </span>
              </div>

              <div className="mt-6 sm:mt-8 flex items-center gap-4 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!specialItem.is_available}
                  className="btn-primary w-full sm:w-auto justify-center min-h-[44px]"
                >
                  {justAdded ? (
                    <span className="whitespace-nowrap flex items-center gap-1.5">
                      <Check className="h-4 w-4" aria-hidden="true" />
                      <span>{t("weekly.addedToBag")}</span>
                    </span>
                  ) : (
                    <span className="whitespace-nowrap flex items-center gap-1.5">
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      <span>{t("weekly.orderButton")}</span>
                    </span>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
