import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/context/language-context";
import { CartProvider } from "@/lib/context/cart-context";
import { SettingsProvider } from "@/lib/context/settings-context";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sultan's Kacchi Paris | Royal Mughal Gastronomy House",
  description: "Authentic royal Kacchi Biryani and Bengali Mughal banquets at 28 Rue du Faubourg Saint-Denis, 75010 Paris. 100% Halal certified takeaway ordering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <body className="antialiased selection:bg-gold/30">
        <LanguageProvider>
          <SettingsProvider>
            <CartProvider>{children}</CartProvider>
          </SettingsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
