"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface RestaurantSettings {
  name: string;
  tagline: string;
  address: string;
  metro: string;
  phone: string;
  email: string;
  openingHoursWeekdays: string;
  openingHoursWeekends: string;
  isHalalCertified: boolean;
  facebookUrl: string;
  instagramUrl: string;
  whatsappNumber: string;
  showWeeklySpecial: boolean;
  showPartySpecial: boolean;
  showHeritageStory: boolean;
  showLocation: boolean;
  pickupSlots: string[];
}

export const DEFAULT_SETTINGS: RestaurantSettings = {
  name: "Sultan’s Kacchi Paris",
  tagline: "Maison Royale de Gastronomie",
  address: "28 Rue du Faubourg Saint-Denis, 75010 Paris, France",
  metro: "Strasbourg Saint-Denis (L4, L8, L9) ou Château d’Eau (L4)",
  phone: "+33 1 42 46 10 10",
  email: "paris@sultanskacchi.fr",
  openingHoursWeekdays: "12:00 to 23:00",
  openingHoursWeekends: "12:00 to 23:30",
  isHalalCertified: true,
  facebookUrl: "https://www.facebook.com/Sultanskacchiparis/",
  instagramUrl: "https://www.instagram.com/sultanskacchiparis/",
  whatsappNumber: "+33 1 42 46 10 10",
  showWeeklySpecial: true,
  showPartySpecial: true,
  showHeritageStory: true,
  showLocation: true,
  pickupSlots: [
    "Today at 12:30",
    "Today at 13:00",
    "Today at 13:30",
    "Today at 14:00",
    "Today at 18:00",
    "Today at 18:30",
    "Today at 19:00",
    "Today at 19:30",
    "Today at 20:00",
    "Today at 20:30",
    "Today at 21:00",
    "Today at 21:30",
    "Today at 22:00",
  ],
};

interface SettingsContextType {
  settings: RestaurantSettings;
  updateSettings: (newSettings: Partial<RestaurantSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<RestaurantSettings>(DEFAULT_SETTINGS);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("skp_settings");
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      }
    } catch {
      // ignore
    }
    setIsHydrated(true);
  }, []);

  const updateSettings = (newSettings: Partial<RestaurantSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem("skp_settings", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem("skp_settings");
    } catch {}
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
