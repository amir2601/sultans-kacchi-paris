"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/context/cart-context";
import { useSettings } from "@/lib/context/settings-context";
import {
  ShoppingBag,
  Menu as MenuIcon,
  X,
  Crown,
  Search,
  CheckCircle,
} from "lucide-react";

export default function Navbar() {
  const { totalItems, openCart } = useCart();
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-[var(--z-sticky-nav)] w-full border-b border-rule bg-paper/95 backdrop-blur-md shadow-xs">
      <div className="container flex h-20 items-center justify-between">
        
        {/* Brand Lockup inspired by Sultan's Kacchi Paris */}
        <Link
          href="/"
          className="group flex items-center gap-3 text-ink focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
        >
          {/* Halal / Royal Crown Seal */}
          <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[var(--radius-card)] border border-gold/50 bg-paper-2 text-accent shadow-xs group-hover:border-gold transition-colors duration-short">
            <Crown className="h-5 w-5 text-gold" aria-hidden="true" />
            {settings.isHalalCertified && (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white shadow-xs">
                حلال
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <span className="font-display text-xl md:text-2xl font-bold tracking-tight text-accent leading-none">
              Sultan’s Kacchi
            </span>
            <span className="text-xs font-medium text-muted mt-0.5">
              Paris 10e · Maison Royale
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-ink-2"
          aria-label="Main Navigation"
        >
          <a
            href="/#menu"
            className="hover:text-accent transition-colors duration-short ease-out focus-visible:outline-2 focus-visible:outline-focus"
          >
            Paris Menu
          </a>
          {settings.showWeeklySpecial && (
            <a
              href="/#weekly-special"
              className="hover:text-accent transition-colors duration-short ease-out focus-visible:outline-2 focus-visible:outline-focus"
            >
              Weekly Special
            </a>
          )}
          {settings.showPartySpecial && (
            <a
              href="/#party-special"
              className="hover:text-accent transition-colors duration-short ease-out focus-visible:outline-2 focus-visible:outline-focus"
            >
              Party Banquet
            </a>
          )}
          {settings.showHeritageStory && (
            <a
              href="/#heritage"
              className="hover:text-accent transition-colors duration-short ease-out focus-visible:outline-2 focus-visible:outline-focus"
            >
              Royal Heritage
            </a>
          )}
          {settings.showLocation && (
            <a
              href="/#location"
              className="hover:text-accent transition-colors duration-short ease-out focus-visible:outline-2 focus-visible:outline-focus"
            >
              Location & Hours
            </a>
          )}
          <Link
            href="/track"
            className="flex items-center gap-1.5 text-accent font-semibold hover:text-accent-light transition-colors duration-short focus-visible:outline-2 focus-visible:outline-focus"
          >
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Track Order</span>
          </Link>
        </nav>

        {/* Actions (Cart & Mobile Hamburger) */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="hidden sm:inline-flex text-xs font-semibold text-muted hover:text-accent transition-colors duration-short px-2 py-1 rounded border border-rule-subtle hover:border-gold"
          >
            Kitchen Admin
          </Link>

          <button
            type="button"
            onClick={openCart}
            aria-label={`Open takeaway bag, ${totalItems} items`}
            className="btn-primary"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Takeaway Bag</span>
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
            aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
            className="lg:hidden p-2 rounded-[var(--radius-card)] border border-rule bg-paper-2 text-ink hover:text-accent focus-visible:outline-2 focus-visible:outline-focus"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <MenuIcon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-x-0 top-20 bottom-0 z-[var(--z-modal)] bg-paper/98 backdrop-blur-lg border-b border-rule shadow-lg overflow-y-auto p-6 flex flex-col justify-between"
          role="dialog"
          aria-modal="true"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-rule-subtle">
              <span className="font-display text-sm font-bold text-accent">
                Sultan’s Kacchi Navigation
              </span>
              <span className="text-xs text-muted flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                <span>100% Halal Paris</span>
              </span>
            </div>

            <nav className="flex flex-col space-y-3 text-base font-medium text-ink-2">
              <a
                href="/#menu"
                onClick={closeMobileMenu}
                className="p-2 rounded hover:bg-paper-3 hover:text-accent transition-colors"
              >
                Paris Menu Catalog
              </a>
              {settings.showWeeklySpecial && (
                <a
                  href="/#weekly-special"
                  onClick={closeMobileMenu}
                  className="p-2 rounded hover:bg-paper-3 hover:text-accent transition-colors"
                >
                  Weekly Special Banner
                </a>
              )}
              {settings.showPartySpecial && (
                <a
                  href="/#party-special"
                  onClick={closeMobileMenu}
                  className="p-2 rounded hover:bg-paper-3 hover:text-accent transition-colors"
                >
                  Party Special Banquets
                </a>
              )}
              {settings.showHeritageStory && (
                <a
                  href="/#heritage"
                  onClick={closeMobileMenu}
                  className="p-2 rounded hover:bg-paper-3 hover:text-accent transition-colors"
                >
                  Royal Mughal Heritage
                </a>
              )}
              {settings.showLocation && (
                <a
                  href="/#location"
                  onClick={closeMobileMenu}
                  className="p-2 rounded hover:bg-paper-3 hover:text-accent transition-colors"
                >
                  Location & Kitchen Hours
                </a>
              )}
              <Link
                href="/track"
                onClick={closeMobileMenu}
                className="p-2 rounded bg-paper-3 text-accent font-semibold flex items-center gap-2"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                <span>Track Your Takeaway Order</span>
              </Link>
            </nav>
          </div>

          <div className="pt-6 border-t border-rule-subtle space-y-3">
            <Link
              href="/admin"
              onClick={closeMobileMenu}
              className="btn-secondary w-full text-center text-xs"
            >
              Admin Kitchen Portal
            </Link>
            <p className="text-center text-xs text-muted">
              {settings.address}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
