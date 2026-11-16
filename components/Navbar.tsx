"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
  CalendarDays,
} from "lucide-react";

export default function Navbar() {
  const { totalItems, openCart } = useCart();
  const { settings } = useSettings();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll to apply solid white background and enhanced shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open & handle Escape key
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
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
    <header className="sticky top-0 z-[var(--z-sticky-nav)] w-full transition-colors duration-200">
      {/* Top Navbar Bar with Solid White Background on Scroll */}
      <div
        className={`w-full transition-all duration-200 ${
          isScrolled
            ? "bg-white shadow-md border-b border-gold/25"
            : "bg-white/95 backdrop-blur-md border-b border-rule shadow-xs"
        }`}
      >
        <div className="container flex h-16 sm:h-20 items-center justify-between">
          
          {/* Brand Lockup featuring Sultan's Kacchi Paris Logo */}
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="group flex items-center gap-2 text-ink focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 py-1"
          >
            <div className="relative h-12 w-28 sm:h-14 sm:w-36 flex-shrink-0 transition-transform duration-short group-hover:scale-105 drop-shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
              <Image
                src="/images/logo.png"
                alt="Sultan's Kacchi Paris"
                fill
                priority
                className="object-contain"
              />
            </div>
            {settings.isHalalCertified && (
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-semibold text-accent">
                حلال Halal
              </span>
            )}
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-semibold text-ink-2"
            aria-label="Main Navigation"
          >
            <a
              href="/#menu"
              onClick={(e) => handleNavClick(e, "/#menu")}
              className="text-ink-2 hover:text-accent transition-colors duration-short ease-out focus-visible:outline-2 focus-visible:outline-focus"
            >
              {t("nav.menu")}
            </a>
            <a
              href="/#reservation"
              onClick={(e) => handleNavClick(e, "/#reservation")}
              className="text-ink-2 hover:text-accent transition-colors duration-short ease-out focus-visible:outline-2 focus-visible:outline-focus flex items-center gap-1.5"
            >
              <CalendarDays className="h-4 w-4 text-gold" aria-hidden="true" />
              <span>{t("nav.reservation")}</span>
            </a>
            {settings.showLocation && (
              <a
                href="/#location"
                onClick={(e) => handleNavClick(e, "/#location")}
                className="text-ink-2 hover:text-accent transition-colors duration-short ease-out focus-visible:outline-2 focus-visible:outline-focus"
              >
                {t("nav.location")}
              </a>
            )}
            <Link
              href="/track"
              className="flex items-center gap-1.5 text-accent font-bold hover:text-accent-light transition-colors duration-short focus-visible:outline-2 focus-visible:outline-focus"
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

            {/* Mobile Menu Hamburger Button with Smooth Icon Transition */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-2 rounded-[var(--radius-card)] border border-rule bg-paper-2 text-ink hover:text-accent focus-visible:outline-2 focus-visible:outline-focus min-w-[38px] min-h-[38px] flex items-center justify-center transition-all duration-200 active:scale-95"
            >
              <span className={`inline-flex items-center justify-center transition-transform duration-200 ${mobileMenuOpen ? "rotate-90" : "rotate-0"}`}>
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <MenuIcon className="h-5 w-5" aria-hidden="true" />
                )}
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer & Scrim with Smooth Transition */}
      <div
        className={`lg:hidden fixed inset-0 top-16 sm:top-20 z-[var(--z-modal)] transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "visible pointer-events-auto" : "invisible pointer-events-none delay-300"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Backdrop Scrim with Smooth Fade */}
        <div
          className={`fixed inset-0 top-16 sm:top-20 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300 ease-out ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMobileMenu}
          aria-hidden="true"
        />

        {/* Drawer Content with Smooth Slide & Subtle Scale */}
        <div
          className={`fixed inset-x-0 top-16 sm:top-20 bg-paper border-b border-rule shadow-2xl p-5 sm:p-6 flex flex-col justify-between max-h-[calc(100dvh-4rem)] sm:max-h-[calc(100dvh-5rem)] overflow-y-auto transform transition-all duration-300 ease-out ${
            mobileMenuOpen
              ? "translate-y-0 opacity-100 scale-100"
              : "-translate-y-4 opacity-0 scale-[0.98]"
          }`}
          role="dialog"
          aria-modal="true"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-rule-subtle">
              <div className="relative h-10 w-28">
                <Image
                  src="/images/logo.png"
                  alt="Sultan's Kacchi Paris"
                  fill
                  className="object-contain"
                />
              </div>
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
                className="px-3 py-2.5 rounded-[var(--radius-card)] hover:bg-paper-3 hover:text-accent transition-colors duration-short flex items-center justify-between text-sm font-semibold active:scale-[0.99]"
              >
                <span>{t("nav.menuCatalog")}</span>
                <ArrowRight className="h-4 w-4 text-muted" aria-hidden="true" />
              </a>

              <a
                href="/#reservation"
                onClick={(e) => handleNavClick(e, "/#reservation")}
                className="px-3 py-2.5 rounded-[var(--radius-card)] hover:bg-paper-3 hover:text-accent transition-colors duration-short flex items-center justify-between text-sm font-semibold active:scale-[0.99]"
              >
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-gold" aria-hidden="true" />
                  <span>{t("nav.reservation")}</span>
                </span>
                <ArrowRight className="h-4 w-4 text-muted" aria-hidden="true" />
              </a>

              {settings.showLocation && (
                <a
                  href="/#location"
                  onClick={(e) => handleNavClick(e, "/#location")}
                  className="px-3 py-2.5 rounded-[var(--radius-card)] hover:bg-paper-3 hover:text-accent transition-colors duration-short flex items-center justify-between text-sm active:scale-[0.99]"
                >
                  <span>{t("nav.location")}</span>
                  <ArrowRight className="h-4 w-4 text-muted" aria-hidden="true" />
                </a>
              )}

              <Link
                href="/track"
                onClick={closeMobileMenu}
                className="px-3 py-2.5 rounded-[var(--radius-card)] bg-paper-3 text-accent font-semibold flex items-center justify-between text-sm mt-2 border border-rule-subtle hover:border-gold/50 transition-all duration-short active:scale-[0.99]"
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
    </header>
  );
}
