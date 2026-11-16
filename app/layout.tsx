import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
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
  title: "Sultan's Kacchi Paris | Maison Royale de Gastronomie",
  description: "Authentic royal Kacchi Biryani and Bengali Mughal banquets at 28 Rue du Faubourg Saint-Denis, 75010 Paris. Halal certified takeaway ordering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <body className="antialiased selection:bg-gold/30">
        <SettingsProvider>
          <CartProvider>{children}</CartProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
