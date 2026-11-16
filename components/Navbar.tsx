"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/context/cart-context";
import { useSettings } from "@/lib/context/settings-context";
import { useLanguage } from "@/lib/context/language-context";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  ShoppingBag,
  Menu as MenuIcon,
  X,
  Crown,
  Search,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function Navbar() {
  const { totalItems, openCart } = useCart();
  const { settings } = useSettings();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    closeMobileMenu();
    if (href.startsWith("/#") && typeof window !== "undefined" && window.location.pathname === "/") {
      e.preventDefault();
      const id = href.replace("/#", "");
      const elem = document.getElementById(id);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <header className="sticky top-0 z-[var(--z-sticky-nav)] w-full">
      {/* Top Navbar Bar with Backdrop Blur */}
      <div className="w-full border-b border-rule bg-paper/95 backdrop-blur-md shadow-xs">
        <div className="container flex h-16 sm:h-20 items-center justify-between">
          
          {/* Brand Lockup inspired by Sultan's Kacchi Paris */}
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="group flex items-center gap-2.5 sm:gap-3 text-ink focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
          >
            {/* Halal / Royal Crown Seal */}
            <div className="relative flex h-9 w-9 sm:h-11 sm:w-11 flex-shrink-0 items-center justify-center rounded-[var(--radius-card)] border border-gold/50 bg-paper-2 text-accent shadow-xs group-hover:border-gold transition-colors duration-short">
              <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-gold" aria-hidden="true" />
              {settings.isHalalCertified && (
                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-accent text-[8px] sm:text-[9px] font-bold text-white shadow-xs">
                  حلال
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <span className="font-display text-lg sm:text-2xl font-bold tracking-tight text-accent leading-none">
                {t("nav.brandTitle")}
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-muted mt-0.5 sm:mt-1">
                {t("nav.brandSubtitle")}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-medium text-ink-2"
            aria-label="Main Navigation"
          >
            <a
              href="/#menu"
              onClick={(e) => handleNavClick(e, "/#menu")}
              className="hover:text-accent transition-colors duration-short ease-out focus-visible:outline-2 focus-visible:outline-focus"
            >
              {t("nav.menu")}
            </a>
            {settings.showWeeklySpecial && (
              <a
                href="/#weekly-special"
                onClick={(e) => handleNavClick(e, "/#weekly-special")}
                className="hover:text-accent transition-colors duration-short ease-out focus-visible:outline-2 focus-visible:outline-focus"
              >
                {t("nav.weeklySpecial")}
              </a>
            )}
            {settings.showPartySpecial && (
              <a
                href="/#party-special"
                onClick={(e) => handleNavClick(e, "/#party-special")}
                className="hover:text-accent transition-colors duration-short ease-out focus-visible:outline-2 focus-visible:outline-focus"
              >
                {t("nav.partySpecial")}
              </a>
            )}
            {settings.showHeritageStory && (
              <a
                href="/#heritage"
                onClick={(e) => handleNavClick(e, "/#heritage")}
                className="hover:text-accent transition-colors duration-short ease-out focus-visible:outline-2 focus-visible:outline-focus"
              >
                {t("nav.heritage")}
              </a>
            )}
            {settings.showLocation && (
              <a
                href="/#location"
                onClick={(e) => handleNavClick(e, "/#location")}
                className="hover:text-accent transition-colors duration-short ease-out focus-visible:outline-2 focus-visible:outline-focus"
              >
                {t("nav.location")}
              </a>
            )}
            <Link
              href="/track"
              className="flex items-center gap-1.5 text-accent font-semibold hover:text-accent-light transition-colors duration-short focus-visible:outline-2 focus-visible:outline-focus"
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t("nav.track")}</span>
            </Link>
          </nav>

          {/* Actions (Language Switcher, Cart & Mobile Hamburger) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Language Selector */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            <Link
              href="/admin"
              className="hidden xl:inline-flex text-xs font-semibold text-muted hover:text-accent transition-colors duration-short px-2 py-1 rounded border border-rule-subtle hover:border-gold"
            >
              {t("nav.kitchenAdmin")}
            </Link>

            <button
              type="button"
              onClick={openCart}
              aria-label={`${t("nav.takeawayBag")}, ${totalItems} items`}
              className="btn-primary px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm min-h-[38px]"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{t("nav.takeawayBag")}</span>
              {totalItems > 0 && (
                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-xs font-bold text-accent-dark">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-2 rounded-[var(--radius-card)] border border-rule bg-paper-2 text-ink hover:text-accent focus-visible:outline-2 focus-visible:outline-focus min-w-[38px] min-h-[38px] flex items-center justify-center transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <MenuIcon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer & Scrim */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          {/* Backdrop Scrim */}
          <div
            className="fixed inset-0 top-16 sm:top-20 z-[var(--z-modal)] bg-black/45 backdrop-blur-[2px]"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div
            className="fixed inset-x-0 top-16 sm:top-20 z-[var(--z-modal)] bg-paper border-b border-rule shadow-2xl p-5 sm:p-6 flex flex-col justify-between max-h-[calc(100dvh-4rem)] sm:max-h-[calc(100dvh-5rem)] overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-rule-subtle">
                <span className="font-display text-sm font-bold text-accent">
                  {t("nav.brandTitle")} Navigation
                </span>
                <span className="text-xs text-muted flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                  <span>{t("nav.halalBadge")}</span>
                </span>
              </div>

              {/* Language Switcher in Mobile Drawer */}
              <div className="pb-2">
                <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-1.5">
                  Language / Langue
                </span>
                <LanguageSwitcher variant="detailed" />
              </div>

              <nav className="flex flex-col space-y-1.5 text-base font-medium text-ink-2">
                <a
                  href="/#menu"
                  onClick={(e) => handleNavClick(e, "/#menu")}
                  className="px-3 py-2.5 rounded-[var(--radius-card)] hover:bg-paper-3 hover:text-accent transition-colors flex items-center justify-between text-sm font-semibold"
                >
                  <span>{t("nav.menuCatalog")}</span>
                  <ArrowRight className="h-4 w-4 text-muted" aria-hidden="true" />
                </a>

                {settings.showWeeklySpecial && (
                  <a
                    href="/#weekly-special"
                    onClick={(e) => handleNavClick(e, "/#weekly-special")}
                    className="px-3 py-2.5 rounded-[var(--radius-card)] hover:bg-paper-3 hover:text-accent transition-colors flex items-center justify-between text-sm"
                  >
                    <span>{t("nav.weeklyBanner")}</span>
                    <ArrowRight className="h-4 w-4 text-muted" aria-hidden="true" />
                  </a>
                )}

                {settings.showPartySpecial && (
                  <a
                    href="/#party-special"
                    onClick={(e) => handleNavClick(e, "/#party-special")}
                    className="px-3 py-2.5 rounded-[var(--radius-card)] hover:bg-paper-3 hover:text-accent transition-colors flex items-center justify-between text-sm"
                  >
                    <span>{t("nav.partyBanquets")}</span>
                    <ArrowRight className="h-4 w-4 text-muted" aria-hidden="true" />
                  </a>
                )}

                {settings.showHeritageStory && (
                  <a
                    href="/#heritage"
                    onClick={(e) => handleNavClick(e, "/#heritage")}
                    className="px-3 py-2.5 rounded-[var(--radius-card)] hover:bg-paper-3 hover:text-accent transition-colors flex items-center justify-between text-sm"
                  >
                    <span>{t("nav.heritage")}</span>
                    <ArrowRight className="h-4 w-4 text-muted" aria-hidden="true" />
                  </a>
                )}

                {settings.showLocation && (
                  <a
                    href="/#location"
                    onClick={(e) => handleNavClick(e, "/#location")}
                    className="px-3 py-2.5 rounded-[var(--radius-card)] hover:bg-paper-3 hover:text-accent transition-colors flex items-center justify-between text-sm"
                  >
                    <span>{t("nav.location")}</span>
                    <ArrowRight className="h-4 w-4 text-muted" aria-hidden="true" />
                  </a>
                )}

                <Link
                  href="/track"
                  onClick={closeMobileMenu}
                  className="px-3 py-2.5 rounded-[var(--radius-card)] bg-paper-3 text-accent font-semibold flex items-center justify-between text-sm mt-2 border border-rule-subtle"
                >
                  <span className="flex items-center gap-2">
                    <Search className="h-4 w-4" aria-hidden="true" />
                    <span>{t("nav.trackMobile")}</span>
                  </span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </nav>
            </div>

            <div className="pt-6 border-t border-rule-subtle space-y-3 mt-4">
              <Link
                href="/admin"
                onClick={closeMobileMenu}
                className="btn-secondary w-full text-center text-xs py-2.5"
              >
                {t("nav.kitchenAdminPortal")}
              </Link>
              <p className="text-center text-xs text-muted">
                {settings.address}
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
