"use client";

import Image from "next/image";
import { MenuItem } from "@/lib/supabase/types";
import { useCart } from "@/lib/context/cart-context";
import { Plus, Check, Users, Sparkles } from "lucide-react";
import { useState } from "react";

interface PartySpecialSectionProps {
  partyItems: MenuItem[];
}

export default function PartySpecialSection({ partyItems }: PartySpecialSectionProps) {
  const { addItem, items: cartItems } = useCart();
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  const handleAdd = (item: MenuItem) => {
    addItem(item);
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
    <section id="party-special" className="border-b border-rule bg-paper-3/40 py-16 lg:py-20">
      <div className="container">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-paper-2 px-3.5 py-1 text-xs font-bold text-accent shadow-xs mb-3">
            <Users className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            <span>Grand Feast & Celebrations</span>
          </div>
          <h2 className="font-display text-section-head font-bold text-accent">
            Party Special Royal Banquets
          </h2>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            All-inclusive imperial feast platters featuring authentic Kacchi or Polau, golden Chicken Roast, Jali Kabab, Beef Rezala, Borhani, dessert, and chutney.
          </p>
        </div>

        {/* 3 Party Banquets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {partyItems.map((item, idx) => {
            const inCartQty = getItemQuantityInCart(item.id);
            const isJustAdded = addedMap[item.id];

            return (
              <div
                key={item.id}
                className="luxury-card overflow-hidden flex flex-col justify-between p-6 md:p-8 border-gold/60 shadow-md relative group hover:border-gold transition-colors duration-short"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-card)] border border-rule mb-5 bg-paper-2">
                    <Image
                      src={item.image_url || "/images/biryani-mouton.jpg"}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center"
                    />
                    <div className="absolute top-2.5 right-2.5 rounded-[var(--radius-card)] bg-white/95 px-3 py-1 font-display text-base font-bold text-accent shadow-sm border border-gold/40">
                      €{Number(item.price).toFixed(2)}
                    </div>
                  </div>

                  <h3 className="font-display text-lg font-bold text-accent leading-snug">
                    {item.name}
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-rule flex items-center justify-between">
                  <span className="text-xs text-muted font-medium">Complete banquet</span>
                  <button
                    type="button"
                    onClick={() => handleAdd(item)}
                    disabled={!item.is_available}
                    className="btn-primary text-xs"
                  >
                    {isJustAdded ? (
                      <span className="whitespace-nowrap flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Added</span>
                      </span>
                    ) : (
                      <span className="whitespace-nowrap flex items-center gap-1.5">
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Order banquet</span>
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
