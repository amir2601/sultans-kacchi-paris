"use client";

import { useState } from "react";
import Image from "next/image";
import { MenuItem } from "@/lib/supabase/types";
import { useCart } from "@/lib/context/cart-context";
import { Plus, Check, Sparkles } from "lucide-react";

interface MenuSectionProps {
  initialItems: MenuItem[];
}

export default function MenuSection({ initialItems }: MenuSectionProps) {
  const { addItem, items: cartItems } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Mutton Kacchi",
    "Polau",
    "Tehari",
    "Weekly Special",
    "Party Special",
    "Evening Special",
    "Rooti",
    "Additional",
    "Desserts",
    "Beverage",
  ];

  const filteredItems =
    selectedCategory === "All"
      ? initialItems
      : initialItems.filter((item) => item.category === selectedCategory);

  const getItemQuantityInCart = (id: string) => {
    const found = cartItems.find((i) => i.item.id === id);
    return found ? found.quantity : 0;
  };

  return (
    <section id="menu" className="border-b border-rule bg-paper py-16 lg:py-20">
      <div className="container">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8 border-b border-rule">
          <div>
            <h2 className="font-display text-section-head font-bold text-accent">
              The Authentic Paris Menu
            </h2>
            <p className="mt-2 text-sm text-muted max-w-[54ch]">
              Prepared fresh daily in sealed copper degs with halal French lamb, pure ghee, and aged basmati. Prices include all French taxes.
            </p>
          </div>

          <div className="text-xs text-muted flex items-center gap-2">
            <span className="font-semibold text-ink">46 Artisanal Specialties</span>
            <span>· Pay on Pickup Available</span>
          </div>
        </div>

        {/* Category Filter Tabs - Mobile Responsive with Horizontal Scrolling */}
        <div className="mt-8 overflow-x-auto pb-2 scrollbar-none">
          <div
            className="flex items-center gap-2 min-w-max"
            role="tablist"
            aria-label="Menu categories"
          >
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-[var(--radius-card)] px-4 py-2 text-xs font-semibold transition-colors duration-short ease-out focus-visible:outline-2 focus-visible:outline-focus ${
                    isActive
                      ? "bg-accent text-white shadow-sm border border-accent"
                      : "bg-paper-2 text-ink-2 hover:bg-paper-3 hover:text-accent border border-rule"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Grid - minmax(0, 1fr) for image-bearing tracks */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredItems.map((item) => {
            const inCartQty = getItemQuantityInCart(item.id);

            return (
              <article
                key={item.id}
                className="luxury-card flex flex-col justify-between overflow-hidden hover:border-gold transition-colors duration-short group"
              >
                {/* Image Aspect Box */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-paper-3">
                  <Image
                    src={item.image_url || "/images/biryani-mouton.jpg"}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center"
                  />
                  {item.is_weekly_special && (
                    <span className="absolute top-3 left-3 rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
                      Special Selection
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 rounded-[var(--radius-card)] bg-white/95 px-3 py-1 font-display text-base font-bold text-accent shadow-sm border border-gold/40">
                    €{Number(item.price).toFixed(2)}
                  </span>
                </div>

                {/* Content Details */}
                <div className="p-5 sm:p-6 flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-ink group-hover:text-accent transition-colors duration-short">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted line-clamp-3">
                      {item.description || "Authentic recipe crafted with clarified butter, slow steam, and roasted spices."}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-rule-subtle pt-4">
                    <span className="text-xs text-muted">
                      {item.is_available ? "Fresh today" : "Sold out"}
                    </span>

                    <button
                      type="button"
                      onClick={() => addItem(item)}
                      disabled={!item.is_available}
                      aria-label={`Add ${item.name} to takeaway bag`}
                      className={inCartQty > 0 ? "btn-secondary text-xs" : "btn-primary text-xs"}
                    >
                      {inCartQty > 0 ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                          <span>In bag ({inCartQty})</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Add to bag</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
