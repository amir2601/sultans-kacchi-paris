"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/auth-context";
import { useSettings, DEFAULT_SETTINGS } from "@/lib/context/settings-context";
import {
  Save,
  RotateCcw,
  Store,
  Share2,
  Clock,
  Eye,
  Plus,
  Trash2,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export default function AdminSettingsPage() {
  const { isAdminLoggedIn, isLoading: authLoading } = useAuth();
  const { settings, updateSettings, resetSettings } = useSettings();

  const [formData, setFormData] = useState({ ...settings });
  const [newSlotInput, setNewSlotInput] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (authLoading) return null;
  if (!isAdminLoggedIn) {
    return (
      <div className="container py-24 text-center">
        <p className="text-muted">Please sign in as kitchen administrator.</p>
        <Link href="/admin/login" className="btn-primary mt-4">
          Go to login
        </Link>
      </div>
    );
  }

  const handleChange = (
    field: keyof typeof formData,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSlot = () => {
    if (!newSlotInput.trim()) return;
    const clean = newSlotInput.trim();
    if (!formData.pickupSlots.includes(clean)) {
      handleChange("pickupSlots", [...formData.pickupSlots, clean]);
    }
    setNewSlotInput("");
  };

  const handleRemoveSlot = (slotToRemove: string) => {
    handleChange(
      "pickupSlots",
      formData.pickupSlots.filter((s) => s !== slotToRemove)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetToDefaults = () => {
    if (confirm("Reset all settings to default Sultan’s Kacchi Paris configuration?")) {
      resetSettings();
      setFormData(DEFAULT_SETTINGS);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="container py-10 space-y-8 max-w-5xl">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-rule pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="text-xs text-muted hover:text-accent transition-colors duration-short flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Back to overview</span>
            </Link>
          </div>
          <h1 className="mt-2 font-display text-2xl font-semibold text-ink">
            Restaurant & Portal Settings
          </h1>
          <p className="text-sm text-muted">
            Configure Paris branch contact information, social links, section visibility, and takeaway slots.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="btn-secondary text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Reset defaults</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn-primary"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            <span>Save all changes</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2.5 rounded-[var(--radius-card)] border border-success/40 bg-success/10 p-4 text-xs font-semibold text-success">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          <span>Settings saved successfully. All changes are live across the public storefront and cart.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. Branch Information */}
        <div className="luxury-card p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-rule pb-3">
            <Store className="h-5 w-5 text-accent" aria-hidden="true" />
            <h2 className="font-display text-lg font-semibold text-ink">
              Branch Identity & Location
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Restaurant Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 px-3 text-ink focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Tagline / Subtext
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange("tagline", e.target.value)}
                className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 px-3 text-ink focus:border-accent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Paris Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 px-3 text-ink focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Métro Transport Details
              </label>
              <input
                type="text"
                value={formData.metro}
                onChange={(e) => handleChange("metro", e.target.value)}
                className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 px-3 text-ink focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Direct Telephone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 px-3 text-ink focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 px-3 text-ink focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Opening Hours (Monday to Thursday)
              </label>
              <input
                type="text"
                value={formData.openingHoursWeekdays}
                onChange={(e) => handleChange("openingHoursWeekdays", e.target.value)}
                className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 px-3 text-ink focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Opening Hours (Friday to Sunday)
              </label>
              <input
                type="text"
                value={formData.openingHoursWeekends}
                onChange={(e) => handleChange("openingHoursWeekends", e.target.value)}
                className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 px-3 text-ink focus:border-accent"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isHalalCertified}
                  onChange={(e) => handleChange("isHalalCertified", e.target.checked)}
                  className="h-4 w-4 rounded border-rule text-accent focus:ring-accent"
                />
                <span className="text-xs font-medium text-ink">
                  Display Official Halal Certified emblem on storefront
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* 2. Social Links */}
        <div className="luxury-card p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-rule pb-3">
            <Share2 className="h-5 w-5 text-accent" aria-hidden="true" />
            <h2 className="font-display text-lg font-semibold text-ink">
              Social Channels & Messaging
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-sm">
            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Facebook Page URL
              </label>
              <input
                type="url"
                value={formData.facebookUrl}
                onChange={(e) => handleChange("facebookUrl", e.target.value)}
                placeholder="https://www.facebook.com/Sultanskacchiparis/"
                className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 px-3 text-xs text-ink focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Instagram Profile URL
              </label>
              <input
                type="url"
                value={formData.instagramUrl}
                onChange={(e) => handleChange("instagramUrl", e.target.value)}
                placeholder="https://www.instagram.com/sultanskacchiparis/"
                className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 px-3 text-xs text-ink focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                WhatsApp Hotline
              </label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                placeholder="+33 1 42 46 10 10"
                className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 px-3 text-xs text-ink focus:border-accent"
              />
            </div>
          </div>
        </div>

        {/* 3. Section Visibility Toggles */}
        <div className="luxury-card p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-rule pb-3">
            <Eye className="h-5 w-5 text-accent" aria-hidden="true" />
            <h2 className="font-display text-lg font-semibold text-ink">
              Storefront Section Visibility
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <label className="flex items-center gap-3 p-3 rounded-[var(--radius-card)] border border-rule-subtle bg-paper-3/40 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showWeeklySpecial}
                onChange={(e) => handleChange("showWeeklySpecial", e.target.checked)}
                className="h-4 w-4 rounded border-rule text-accent focus:ring-accent"
              />
              <span className="font-medium text-ink">Show Weekly Special Banner</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-[var(--radius-card)] border border-rule-subtle bg-paper-3/40 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showHeritageStory}
                onChange={(e) => handleChange("showHeritageStory", e.target.checked)}
                className="h-4 w-4 rounded border-rule text-accent focus:ring-accent"
              />
              <span className="font-medium text-ink">Show Royal Heritage Section</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-[var(--radius-card)] border border-rule-subtle bg-paper-3/40 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showLocation}
                onChange={(e) => handleChange("showLocation", e.target.checked)}
                className="h-4 w-4 rounded border-rule text-accent focus:ring-accent"
              />
              <span className="font-medium text-ink">Show Location & Kitchen Hours</span>
            </label>
          </div>
        </div>

        {/* 4. Takeaway Time Slots Management */}
        <div className="luxury-card p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-rule pb-3">
            <Clock className="h-5 w-5 text-accent" aria-hidden="true" />
            <h2 className="font-display text-lg font-semibold text-ink">
              Takeaway Pickup Time Slots
            </h2>
          </div>

          <p className="text-xs text-muted">
            These slots appear in the customer takeaway cart drawer for collection scheduling.
          </p>

          {/* Add Slot */}
          <div className="flex gap-3 max-w-md">
            <input
              type="text"
              value={newSlotInput}
              onChange={(e) => setNewSlotInput(e.target.value)}
              placeholder="e.g. Today at 17:45"
              className="flex-1 rounded-[var(--radius-card)] border border-rule bg-paper py-2 px-3 text-xs text-ink focus:border-accent"
            />
            <button
              type="button"
              onClick={handleAddSlot}
              className="btn-secondary text-xs"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Add slot</span>
            </button>
          </div>

          {/* Existing Slots List */}
          <div className="flex flex-wrap gap-2 pt-2">
            {formData.pickupSlots.map((slot) => (
              <span
                key={slot}
                className="inline-flex items-center gap-2 rounded-full border border-rule bg-paper-2 px-3 py-1 text-xs text-ink-2 shadow-sm"
              >
                <span>{slot}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSlot(slot)}
                  className="text-muted hover:text-error transition-colors"
                  aria-label={`Remove slot ${slot}`}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="btn-primary">
            <Save className="h-4 w-4" aria-hidden="true" />
            <span>Save all changes</span>
          </button>
        </div>

      </form>

    </div>
  );
}
