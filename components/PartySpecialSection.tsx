"use client";

import Image from "next/image";
import { MenuItem } from "@/lib/supabase/types";
import { useCart } from "@/lib/context/cart-context";
import { useLanguage } from "@/lib/context/language-context";
import { Plus, Check, Users } from "lucide-react";
import { useState } from "react";

interface PartySpecialSectionProps {
  partyItems: MenuItem[];
}

export default function PartySpecialSection({ partyItems }: PartySpecialSectionProps) {
  const { addItem, items: cartItems } = useCart();
  const { t, language } = useLanguage();
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  const handleAdd = (item: MenuItem) => {
    addItem(item, false);
    setAddedMap((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  const getItemQuantityInCart = (id: string) => {
    const found = cartItems.find((i) => i.item.id === id);
    return found ? found.quantity : 0;
  };

  if (!partyItems || partyItems.length === 0) return null;

  return (
    <section id="party-special" className="border-b border-rule bg-paper-3/40 py-12 sm:py-16 lg:py-20">
      <div className="container">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-paper-2 px-3.5 py-1 text-xs font-bold text-accent shadow-xs mb-3">
            <Users className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            <span>{t("party.badge")}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-section-head font-bold text-accent">
            {t("party.headline")}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
            {t("party.description")}
          </p>
        </div>

        {/* 3 Party Banquets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {partyItems.map((item) => {
            const inCartQty = getItemQuantityInCart(item.id);
            const isJustAdded = addedMap[item.id];
            const itemName = language === "fr" && item.name_fr ? item.name_fr : item.name;
            const itemDesc = language === "fr" && item.description_fr ? item.description_fr : item.description;

            return (
              <div
                key={item.id}
                className="luxury-card overflow-hidden flex flex-col justify-between p-5 sm:p-6 md:p-8 border-gold/60 shadow-md relative group hover:border-gold transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-card)] border border-rule mb-4 sm:mb-5 bg-paper-2">
                    <Image
                      src={item.image_url || "/images/biryani-mouton.jpg"}
                      alt={itemName}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-2.5 right-2.5 rounded-[var(--radius-card)] bg-white/95 px-2.5 py-1 font-display text-sm sm:text-base font-bold text-accent shadow-xs border border-gold/40">
                      €{Number(item.price).toFixed(2)}
                    </div>
                  </div>

                  <h3 className="font-display text-base sm:text-lg font-bold text-accent leading-snug">
                    {itemName}
                  </h3>

                  <p className="mt-2 sm:mt-3 text-xs leading-relaxed text-muted">
                    {itemDesc}
                  </p>
                </div>

                <div className="mt-6 sm:mt-8 pt-4 border-t border-rule flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs text-muted font-medium">
                    {inCartQty > 0 ? `${t("menu.inBag")} (${inCartQty})` : t("party.completeBanquet")}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAdd(item)}
                    disabled={!item.is_available}
                    className="btn-primary text-xs py-2 px-3 sm:px-4 min-h-[36px]"
                  >
                    {isJustAdded ? (
                      <span className="whitespace-nowrap flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{t("party.added")}</span>
                      </span>
                    ) : (
                      <span className="whitespace-nowrap flex items-center gap-1.5">
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{t("party.orderBanquet")}</span>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
