"use client";

import Link from "next/link";
import { useSettings } from "@/lib/context/settings-context";
import { useLanguage } from "@/lib/context/language-context";
import { Crown, CheckCircle, Search, ExternalLink } from "lucide-react";

export default function Footer() {
  const { settings } = useSettings();
  const { t } = useLanguage();

  return (
    <footer className="border-t border-rule bg-paper-2 py-10 sm:py-16 text-sm text-ink-2 shadow-xs">
      <div className="container">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 pb-8 sm:pb-12 border-b border-rule">
          
          {/* Brand Col */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-card)] border border-gold/40 bg-paper text-accent shadow-xs">
                <Crown className="h-5 w-5 text-gold" aria-hidden="true" />
              </div>
              <span className="font-display text-lg sm:text-xl font-bold text-accent">
                {settings.name}
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted max-w-[32ch]">
              {t("footer.tagline")}
            </p>
            {settings.isHalalCertified && (
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-paper-3 px-3 py-0.5 text-[11px] font-semibold text-accent">
                <CheckCircle className="h-3 w-3 text-success" aria-hidden="true" />
                <span>{t("footer.halalCert")}</span>
              </div>
            )}
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-display text-sm font-bold text-accent">
              {t("footer.maisonSections")}
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-muted font-medium">
              <li>
                <a href="/#menu" className="hover:text-accent transition-colors duration-short">
                  {t("nav.menuCatalog")}
                </a>
              </li>
              <li>
                <a href="/#weekly-special" className="hover:text-accent transition-colors duration-short">
                  {t("nav.weeklyBanner")}
                </a>
              </li>
              <li>
                <a href="/#party-special" className="hover:text-accent transition-colors duration-short">
                  {t("nav.partyBanquets")}
                </a>
              </li>
              <li>
                <a href="/#heritage" className="hover:text-accent transition-colors duration-short">
                  {t("nav.heritage")}
                </a>
              </li>
              <li>
                <Link href="/track" className="hover:text-accent flex items-center gap-1 text-accent font-semibold">
                  <Search className="h-3 w-3" aria-hidden="true" />
                  <span>{t("nav.track")}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Paris Branch */}
          <div>
            <h4 className="font-display text-sm font-bold text-accent">
              {t("footer.takeawayCounter")}
            </h4>
            <p className="mt-3 text-xs leading-relaxed text-muted font-medium">
              {settings.address}<br />
              Tél: {settings.phone}
            </p>
            <p className="mt-2 text-xs text-muted">
              {t("footer.metro")} {settings.metro}
            </p>
            <p className="mt-2 text-xs text-accent font-semibold">
              {t("footer.dailyService")} {settings.openingHoursWeekdays}
            </p>
          </div>

          {/* Administration & Social */}
          <div>
            <h4 className="font-display text-sm font-bold text-accent">
              {t("footer.management")}
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-muted font-medium">
              <li>
                <Link href="/admin" className="hover:text-accent transition-colors duration-short font-semibold">
                  {t("nav.kitchenAdminPortal")}
                </Link>
              </li>
              <li>
                <Link href="/admin/settings" className="hover:text-accent transition-colors duration-short">
                  {t("footer.settingsManager")}
                </Link>
              </li>
              <li>
                <Link href="/admin/menu" className="hover:text-accent transition-colors duration-short">
                  {t("footer.menuInventory")}
                </Link>
              </li>
              {settings.facebookUrl && (
                <li>
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-accent transition-colors duration-short inline-flex items-center gap-1"
                  >
                    <span>{t("loc.facebook")}</span>
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Hallmark Compliant Photo Credits & Copyright */}
        <div className="pt-6 sm:pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 text-xs text-muted">
          <p>
            © {new Date().getFullYear()} Sultan’s Kacchi Paris. {t("footer.copyright")}
          </p>

          <p data-credits className="text-xs text-muted">
            {t("footer.photos")}
          </p>
        </div>

      </div>
    </footer>
  );
}
