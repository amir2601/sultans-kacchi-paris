"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/context/language-context";
import { useSettings } from "@/lib/context/settings-context";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Reservation } from "@/lib/supabase/types";
import {
  CalendarDays,
  Clock,
  Users,
  User,
  Phone,
  Mail,
  CheckCircle2,
  Sparkles,
  MapPin,
  UtensilsCrossed,
} from "lucide-react";

export default function ReservationSection() {
  const { t, language } = useLanguage();
  const { settings } = useSettings();

  // Calculate default date (today) in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const timeSlots = [
    // Lunch
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    // Dinner
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !name.trim() || !phone.trim()) {
      setErrorMessage(
        language === "fr"
          ? "Veuillez renseigner la date, l'heure, votre nom et votre numéro de téléphone."
          : "Please complete the reservation date, time, your name, and phone number."
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const createdId = `RES-${randomSuffix}`;

    const reservationPayload: Reservation = {
      id: createdId,
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      customer_email: email.trim() || null,
      guests_count: Number(guests),
      reservation_date: date,
      reservation_time: time,
      special_notes: specialNotes.trim() || null,
      status: "Confirmed",
      created_at: new Date().toISOString(),
    };

    try {
      if (isSupabaseConfigured) {
        try {
          await supabase.from("reservations").insert([reservationPayload]);
        } catch {
          // fallback to localStorage
        }
      }

      // Record in local storage
      const existing = JSON.parse(
        localStorage.getItem("skp_reservations") || "[]"
      );
      localStorage.setItem(
        "skp_reservations",
        JSON.stringify([reservationPayload, ...existing])
      );

      // Dispatch event for any active admin listener
      window.dispatchEvent(new Event("skp_reservation_created"));

      setConfirmedReservation(reservationPayload);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : language === "fr"
          ? "Impossible d'enregistrer la réservation. Veuillez réessayer."
          : "Failed to record reservation. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmedReservation(null);
    setTime("");
    setName("");
    setPhone("");
    setEmail("");
    setSpecialNotes("");
  };

  return (
    <section id="reservation" className="border-b border-rule bg-paper py-12 sm:py-16 lg:py-20 relative">
      <div className="container">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-paper-2 px-3.5 py-1 text-xs font-bold text-accent shadow-xs mb-3">
            <CalendarDays className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            <span>{t("reservation.badge")}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-section-head font-bold text-accent">
            {t("reservation.headline")}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
            {t("reservation.description")}
          </p>
        </div>

        {/* Content Card */}
        <div className="max-w-4xl mx-auto luxury-card p-6 sm:p-8 md:p-10 border-gold/60 shadow-lg">
          {confirmedReservation ? (
            <div className="py-6 sm:py-8 text-center flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 border border-success/30 text-success mb-4">
                <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-accent">
                {t("reservation.successTitle")}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-ink-2 max-w-[48ch] leading-relaxed">
                {t("reservation.successDesc", {
                  name: confirmedReservation.customer_name,
                  guests: confirmedReservation.guests_count,
                  date: confirmedReservation.reservation_date,
                  time: confirmedReservation.reservation_time,
                })}
              </p>

              {/* Reservation Receipt Card */}
              <div className="mt-6 w-full max-w-md rounded-[var(--radius-card)] border border-rule bg-paper-2 p-5 text-left text-xs sm:text-sm space-y-3 shadow-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted">{t("reservation.refLabel")}</span>
                  <span className="font-mono text-sm font-bold text-accent bg-paper-3 px-2.5 py-0.5 rounded border border-rule">
                    {confirmedReservation.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">{t("reservation.guestsLabel")}</span>
                  <span className="font-semibold text-ink">
                    {confirmedReservation.guests_count}{" "}
                    {confirmedReservation.guests_count === 1
                      ? t("reservation.guestOne")
                      : t("reservation.guestTwo").replace("2", "")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">{t("reservation.timeLabel")}</span>
                  <span className="font-semibold text-accent">
                    {confirmedReservation.reservation_date} · {confirmedReservation.reservation_time}
                  </span>
                </div>
                <div className="flex justify-between border-t border-rule-subtle pt-2">
                  <span className="text-muted">{t("loc.addressTitle")}</span>
                  <span className="font-medium text-ink text-right">
                    {settings.address.split(",")[0]}, Paris
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-muted max-w-md text-center">
                <Clock className="h-4 w-4 text-gold flex-shrink-0" aria-hidden="true" />
                <span>{t("reservation.holdNotice")}</span>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="mt-6 btn-outline text-xs px-6"
              >
                {t("reservation.bookAnother")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="rounded-[var(--radius-card)] border border-error bg-error/10 p-3 text-xs text-error font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Row 1: Date, Time & Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Date */}
                <div>
                  <label htmlFor="res-date" className="block text-xs font-semibold text-ink mb-1.5">
                    {t("reservation.dateLabel")}
                  </label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-2.5 h-4 w-4 text-muted pointer-events-none" aria-hidden="true" />
                    <input
                      id="res-date"
                      type="date"
                      required
                      min={today}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 pl-9 pr-3 text-xs sm:text-sm text-ink focus:border-accent focus-visible:outline-2 focus-visible:outline-focus"
                    />
                  </div>
                </div>

                {/* Time Slot */}
                <div>
                  <label htmlFor="res-time" className="block text-xs font-semibold text-ink mb-1.5">
                    {t("reservation.timeLabel")}
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted pointer-events-none" aria-hidden="true" />
                    <select
                      id="res-time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 pl-9 pr-3 text-xs sm:text-sm text-ink focus:border-accent focus-visible:outline-2 focus-visible:outline-focus"
                    >
                      <option value="">{t("reservation.selectTime")}</option>
                      <optgroup label={t("reservation.lunch")}>
                        {timeSlots.slice(0, 6).map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label={t("reservation.dinner")}>
                        {timeSlots.slice(6).map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>

                {/* Number of Guests */}
                <div>
                  <label htmlFor="res-guests" className="block text-xs font-semibold text-ink mb-1.5">
                    {t("reservation.guestsLabel")}
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted pointer-events-none" aria-hidden="true" />
                    <select
                      id="res-guests"
                      required
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 pl-9 pr-3 text-xs sm:text-sm text-ink focus:border-accent focus-visible:outline-2 focus-visible:outline-focus"
                    >
                      <option value={1}>{t("reservation.guestOne")}</option>
                      <option value={2}>{t("reservation.guestTwo")}</option>
                      <option value={3}>{t("reservation.guestThree")}</option>
                      <option value={4}>{t("reservation.guestFour")}</option>
                      <option value={5}>{t("reservation.guestFive")}</option>
                      <option value={6}>{t("reservation.guestSix")}</option>
                      <option value={8}>{t("reservation.guestGroup")}</option>
                      <option value={12}>{t("reservation.guestBanquet")}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 2: Customer Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="res-name" className="block text-xs font-semibold text-ink mb-1.5">
                    {t("reservation.nameLabel")}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted pointer-events-none" aria-hidden="true" />
                    <input
                      id="res-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("reservation.namePlaceholder")}
                      className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 pl-9 pr-3 text-base sm:text-xs text-ink placeholder:text-muted focus:border-accent focus-visible:outline-2 focus-visible:outline-focus"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="res-phone" className="block text-xs font-semibold text-ink mb-1.5">
                    {t("reservation.phoneLabel")}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted pointer-events-none" aria-hidden="true" />
                    <input
                      id="res-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t("reservation.phonePlaceholder")}
                      className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 pl-9 pr-3 text-base sm:text-xs text-ink placeholder:text-muted focus:border-accent focus-visible:outline-2 focus-visible:outline-focus"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Optional Email & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="res-email" className="block text-xs font-semibold text-ink mb-1.5">
                    {t("reservation.emailLabel")}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted pointer-events-none" aria-hidden="true" />
                    <input
                      id="res-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("reservation.emailPlaceholder")}
                      className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 pl-9 pr-3 text-base sm:text-xs text-ink placeholder:text-muted focus:border-accent focus-visible:outline-2 focus-visible:outline-focus"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="res-notes" className="block text-xs font-semibold text-ink mb-1.5">
                    {t("reservation.notesLabel")}
                  </label>
                  <input
                    id="res-notes"
                    type="text"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder={t("reservation.notesPlaceholder")}
                    className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 px-3 text-base sm:text-xs text-ink placeholder:text-muted focus:border-accent focus-visible:outline-2 focus-visible:outline-focus"
                  />
                </div>
              </div>

              {/* Submit & Policy */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <MapPin className="h-4 w-4 text-gold flex-shrink-0" aria-hidden="true" />
                  <span>28 Rue du Faubourg Saint-Denis, 75010 Paris</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full sm:w-auto px-8 py-3 text-xs sm:text-sm font-bold min-h-[44px]"
                >
                  <UtensilsCrossed className="h-4 w-4" aria-hidden="true" />
                  <span>{isSubmitting ? t("reservation.submitting") : t("reservation.submitBtn")}</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
