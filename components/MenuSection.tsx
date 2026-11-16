"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MenuItem } from "@/lib/supabase/types";
import { useCart } from "@/lib/context/cart-context";
import { useLanguage } from "@/lib/context/language-context";
import { Plus, Minus, Check, Search, ShoppingBag, ArrowRight, X } from "lucide-react";

interface MenuSectionProps {
  initialItems: MenuItem[];
}

const DEFAULT_CATEGORIES = [
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

export default function MenuSection({ initialItems }: MenuSectionProps) {
  const { addItem, updateQuantity, items: cartItems, openCart, totalItems, totalAmount } = useCart();
  const { t, language } = useLanguage();
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [categories, setCategories] = useState<string[]>(() => {
    const fromItems = initialItems.map((i) => i.category).filter(Boolean);
    return Array.from(new Set([...DEFAULT_CATEGORIES, ...fromItems]));
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncData = () => {
      let currentItems = initialItems;
      try {
        const localMenu = localStorage.getItem("skp_local_menu");
        if (localMenu) {
          currentItems = JSON.parse(localMenu);
          setItems(currentItems);
        }
      } catch {}

      try {
        const custom: string[] = JSON.parse(
          localStorage.getItem("skp_custom_categories") || "[]"
        );
        const fromItems = currentItems.map((i) => i.category).filter(Boolean);
        setCategories(Array.from(new Set([...DEFAULT_CATEGORIES, ...custom, ...fromItems])));
      } catch {}
    };

    syncData();
    window.addEventListener("skp_categories_updated", syncData);
    window.addEventListener("skp_local_menu_updated", syncData);
    return () => {
      window.removeEventListener("skp_categories_updated", syncData);
      window.removeEventListener("skp_local_menu_updated", syncData);
    };
  }, [initialItems]);

  const handleCategorySelect = (cat: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedCategory(cat);
    // Smoothly scroll the tapped tab toward the center on mobile
    e.currentTarget.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      (item.name_fr && item.name_fr.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.description_fr && item.description_fr.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const getItemQuantityInCart = (id: string) => {
    const found = cartItems.find((i) => i.item.id === id);
    return found ? found.quantity : 0;
  };

  const getCategoryCount = (cat: string) => {
    if (cat === "All") return items.length;
    return items.filter((i) => i.category === cat).length;
  };

  return (
    <section id="menu" className="border-b border-rule bg-paper py-12 sm:py-16 lg:py-20 relative">
      <div className="container">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-rule">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-section-head font-bold text-accent">
              {t("menu.sectionHead")}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted max-w-[54ch] leading-relaxed">
              {t("menu.sectionSub")}
            </p>
          </div>

          <div className="text-xs text-muted flex flex-wrap items-center gap-2">
            <span className="font-semibold text-ink">{t("menu.specialtiesCount")}</span>
            <span>· {t("menu.payOnPickup")}</span>
          </div>
        </div>

        {/* Search Bar for Mobile & Desktop */}
        <div className="mt-6 sm:mt-8 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("menu.searchPlaceholder")}
              aria-label={t("menu.searchLabel")}
              className="w-full rounded-[var(--radius-card)] border border-rule bg-paper-2 py-2 pl-9 pr-9 text-xs sm:text-sm text-ink placeholder:text-muted focus:border-accent focus:bg-paper focus-visible:outline-2 focus-visible:outline-focus"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search query"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink rounded"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
          
          <span className="text-xs text-muted font-medium whitespace-nowrap">
            {filteredItems.length} {filteredItems.length === 1 ? t("menu.dishesSingular") : t("menu.dishesPlural")}
          </span>
        </div>

        {/* Category Filter Tabs with Touch-Friendly Horizontal Scrolling */}
        <div className="relative mt-4 sm:mt-6">
          {/* Scrollable Container */}
          <div
            ref={tabsContainerRef}
            className="overflow-x-auto pb-2 scrollbar-none scroll-smooth flex items-center gap-2 -mx-4 px-4 sm:mx-0 sm:px-0"
            role="tablist"
            aria-label="Menu categories"
          >
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              const count = getCategoryCount(cat);
              const rawLabel = t(`cat.${cat}`);
              const label = rawLabel.startsWith("cat.") ? cat : rawLabel;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isActive}
                  onClick={(e) => handleCategorySelect(cat, e)}
                  className={`rounded-[var(--radius-card)] px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors duration-short ease-out flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-focus min-h-[36px] flex-shrink-0 ${
                    isActive
                      ? "bg-accent text-white shadow-xs border border-accent"
                      : "bg-paper-2 text-ink-2 hover:bg-paper-3 hover:text-accent border border-rule"
                  }`}
                >
                  <span>{label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-paper-3 text-muted"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-display text-lg font-bold text-accent">{t("menu.noDishesFound")}</p>
            <p className="mt-1 text-xs text-muted">
              {t("menu.noDishesSub")}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 btn-secondary text-xs"
            >
              {t("menu.resetFilters")}
            </button>
          </div>
        )}

        {/* Menu Grid - Fully Responsive */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {filteredItems.map((item) => {
            const inCartQty = getItemQuantityInCart(item.id);
            const itemName = language === "fr" && item.name_fr ? item.name_fr : item.name;
            const itemDesc = language === "fr" && item.description_fr ? item.description_fr : (item.description || "Authentic recipe crafted with clarified butter, slow steam, and roasted spices.");

            return (
              <article
                key={item.id}
                className="luxury-card flex flex-col justify-between overflow-hidden hover:border-gold transition-colors duration-short group"
              >
                {/* Image Aspect Box */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-paper-3">
                  <Image
                    src={item.image_url || "/images/biryani-mouton.jpg"}
                    alt={itemName}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  {item.is_weekly_special && (
                    <span className="absolute top-2.5 left-2.5 rounded-full bg-accent px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-white shadow-xs">
                      {t("menu.specialSelection")}
                    </span>
                  )}
                  <span className="absolute bottom-2.5 right-2.5 rounded-[var(--radius-card)] bg-white/95 px-2.5 py-1 font-display text-sm sm:text-base font-bold text-accent shadow-xs border border-gold/40">
                    €{Number(item.price).toFixed(2)}
                  </span>
                </div>

                {/* Content Details */}
                <div className="p-4 sm:p-5 flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-base sm:text-lg font-bold text-ink group-hover:text-accent transition-colors duration-short">
                        {itemName}
                      </h3>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted line-clamp-2 sm:line-clamp-3">
                      {itemDesc}
                    </p>
                  </div>

                  <div className="mt-4 sm:mt-5 flex items-center justify-between border-t border-rule-subtle pt-3">
                    <span className="text-[11px] text-muted">
                      {item.is_available ? t("menu.freshToday") : t("menu.soldOut")}
                    </span>

                    {/* Interactive Mobile-Friendly Button / Stepper */}
                    {inCartQty > 0 ? (
                      <div className="flex items-center gap-1 bg-paper-3 rounded-[var(--radius-card)] border border-gold/50 p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, inCartQty - 1)}
                          aria-label={`Decrease ${itemName} in bag`}
                          className="h-8 w-8 flex items-center justify-center rounded text-accent hover:bg-paper-2 active:scale-95 transition-transform"
                        >
                          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <span className="min-w-6 text-center text-xs font-bold text-accent">
                          {inCartQty}
                        </span>
                        <button
                          type="button"
                          onClick={() => addItem(item, false)}
                          aria-label={`Increase ${itemName} in bag`}
                          className="h-8 w-8 flex items-center justify-center rounded text-accent hover:bg-paper-2 active:scale-95 transition-transform"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addItem(item, false)}
                        disabled={!item.is_available}
                        aria-label={`Add ${itemName} to takeaway bag`}
                        className="btn-primary text-xs py-2 px-3 sm:px-4 min-h-[36px]"
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{t("menu.addToBag")}</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

      </div>

      {/* Floating Sticky Mobile Order Bar when Items are in Bag with Smooth Slide In/Out */}
      <aside
        aria-label="Current takeaway bag summary"
        className={`lg:hidden fixed bottom-4 inset-x-4 z-[var(--z-sticky)] transform transition-all duration-300 ease-out ${
          totalItems > 0
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-12 opacity-0 pointer-events-none"
        }`}
      >
        <div className="luxury-card border-gold bg-accent text-white p-3.5 sm:p-4 shadow-2xl flex items-center justify-between rounded-[var(--radius-card)]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-accent-dark font-bold shadow-xs">
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-bold block text-gold-light leading-none">
                {totalItems} {totalItems === 1 ? t("menu.floatingSpecialtySingular") : t("menu.floatingSpecialtyPlural")} {t("menu.floatingInBag")}
              </span>
              <span className="font-display text-base font-bold text-white">
                €{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={openCart}
            className="bg-white text-accent hover:bg-gold-light hover:text-accent-dark font-bold text-xs px-4 py-2 rounded-[var(--radius-card)] flex items-center gap-1.5 shadow-md active:scale-95 transition-all duration-150 min-h-[38px]"
          >
            <span>{t("menu.viewBag")}</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </aside>
    </section>
  );
}
