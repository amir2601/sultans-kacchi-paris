"use client";

import { useSettings } from "@/lib/context/settings-context";
import { useLanguage } from "@/lib/context/language-context";
import { MapPin, Clock, Phone, Mail, ExternalLink } from "lucide-react";

export default function LocationHours() {
  const { settings } = useSettings();
  const { t } = useLanguage();

  return (
    <section id="location" className="border-b border-rule bg-paper py-12 sm:py-16 lg:py-20">
      <div className="container">
        
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-section-head font-bold text-accent">
            {t("loc.headline")}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted">
            {t("loc.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Address & Transport */}
          <div className="luxury-card p-5 sm:p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-card)] bg-paper-3 text-accent border border-rule">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-lg sm:text-xl font-bold text-accent">
                {t("loc.addressTitle")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2 font-medium">
                {settings.address}
              </p>
              <div className="mt-4 border-t border-rule-subtle pt-3 text-xs text-muted">
                Métro: {settings.metro}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-rule">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-light transition-colors"
              >
                <span>{t("loc.openMaps")}</span>
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Service Hours */}
          <div className="luxury-card p-5 sm:p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-card)] bg-paper-3 text-accent border border-rule">
                <Clock className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-lg sm:text-xl font-bold text-accent">
                {t("loc.hoursTitle")}
              </h3>
              <div className="mt-3 space-y-2 text-xs sm:text-sm text-ink-2">
                <div className="flex justify-between border-b border-rule-subtle pb-1.5">
                  <span>{t("loc.monThu")}</span>
                  <span className="font-semibold text-accent">{settings.openingHoursWeekdays}</span>
                </div>
                <div className="flex justify-between border-b border-rule-subtle pb-1.5">
                  <span>{t("loc.friSun")}</span>
                  <span className="font-semibold text-accent">{settings.openingHoursWeekends}</span>
                </div>
              </div>
              <div className="mt-4 border-t border-rule-subtle pt-3 text-xs text-muted">
                {t("loc.freshNotice")}
              </div>
            </div>
          </div>

          {/* Direct Assistance & Social Links */}
          <div className="luxury-card p-5 sm:p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-card)] bg-paper-3 text-accent border border-rule">
                <Phone className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-lg sm:text-xl font-bold text-accent">
                {t("loc.contactTitle")}
              </h3>
              <div className="mt-3 space-y-2 text-xs sm:text-sm text-ink-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gold-dark flex-shrink-0" aria-hidden="true" />
                  <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="hover:text-accent font-medium transition-colors break-all">
                    {settings.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gold-dark flex-shrink-0" aria-hidden="true" />
                  <a href={`mailto:${settings.email}`} className="hover:text-accent font-medium transition-colors break-all">
                    {settings.email}
                  </a>
                </div>
              </div>
              <div className="mt-4 border-t border-rule-subtle pt-3 text-xs text-muted">
                {t("loc.cateringNotice")}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-rule flex flex-wrap items-center gap-2 sm:gap-3">
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[var(--radius-card)] border border-rule px-3 py-1.5 text-xs text-muted hover:text-accent hover:border-gold transition-colors"
                >
                  {t("loc.facebook")}
                </a>
              )}
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[var(--radius-card)] border border-rule px-3 py-1.5 text-xs text-muted hover:text-accent hover:border-gold transition-colors"
                >
                  {t("loc.instagram")}
                </a>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
