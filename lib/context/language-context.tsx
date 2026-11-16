"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "fr";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.brandTitle": "Sultan’s Kacchi",
    "nav.brandSubtitle": "Paris 10e · Royal Mughal House",
    "nav.halalBadge": "100% Halal Paris",
    "nav.menu": "Paris Menu",
    "nav.weeklySpecial": "Weekly Special",
    "nav.partySpecial": "Party Banquet",
    "nav.heritage": "Royal Heritage",
    "nav.location": "Location & Hours",
    "nav.track": "Track Order",
    "nav.trackMobile": "Track Your Takeaway Order",
    "nav.kitchenAdmin": "Kitchen Admin",
    "nav.kitchenAdminPortal": "Kitchen Admin Portal",
    "nav.takeawayBag": "Takeaway Bag",
    "nav.menuCatalog": "Paris Menu Catalog",
    "nav.weeklyBanner": "Weekly Chef’s Special",
    "nav.partyBanquets": "Party Special Banquets",

    // Hero Section
    "hero.halalTag": "100% Halal Authenticated · Paris 10e",
    "hero.headline": "Royal Mughal Kacchi Banquet in Paris",
    "hero.description": "Authentic slow-dum biryani infused with pure saffron, ghee, and twenty-one royal spices.",
    "hero.orderPickup": "Order for pickup",
    "hero.exploreMenu": "Explore Paris menu",
    "hero.serviceContinuously": "Service continuously:",
    "hero.signatureTitle": "Signature Mutton Kacchi",
    "hero.signatureSubtitle": "Aged basmati & tender lamb",

    // Weekly Special Section
    "weekly.chefBadge": "Chef’s Weekly Special",
    "weekly.maisonSelection": "Royal House Selection",
    "weekly.oldDhakaRecipe": "Authentic Old Dhaka Recipe",
    "weekly.tvaNotice": "Service charge and French TVA included",
    "weekly.orderButton": "Order special",
    "weekly.addedToBag": "Added to bag",

    // Menu Section
    "menu.sectionHead": "The Authentic Paris Menu",
    "menu.sectionSub": "Prepared fresh daily in sealed copper degs with halal French lamb, pure ghee, and aged basmati. Prices include all French taxes.",
    "menu.specialtiesCount": "46 Artisanal Specialties",
    "menu.payOnPickup": "Pay on Pickup Available",
    "menu.searchPlaceholder": "Search dishes, naan, desserts, lassi…",
    "menu.searchLabel": "Search Paris menu dishes",
    "menu.dishesSingular": "dish",
    "menu.dishesPlural": "dishes",
    "menu.specialSelection": "Special Selection",
    "menu.freshToday": "Fresh today",
    "menu.soldOut": "Sold out",
    "menu.addToBag": "Add to bag",
    "menu.inBag": "In bag",
    "menu.noDishesFound": "No dishes found",
    "menu.noDishesSub": "Try adjusting your search query or choose another category above.",
    "menu.resetFilters": "Reset filters",
    "menu.floatingInBag": "in bag",
    "menu.floatingSpecialtySingular": "specialty",
    "menu.floatingSpecialtyPlural": "specialties",
    "menu.viewBag": "View Bag",

    // Categories
    "cat.All": "All",
    "cat.Mutton Kacchi": "Mutton Kacchi",
    "cat.Polau": "Polau",
    "cat.Tehari": "Tehari",
    "cat.Weekly Special": "Weekly Special",
    "cat.Party Special": "Party Special",
    "cat.Evening Special": "Evening Special",
    "cat.Rooti": "Rooti & Naan",
    "cat.Additional": "Additional",
    "cat.Desserts": "Desserts",
    "cat.Beverage": "Beverage",

    // Party Special Section
    "party.badge": "Grand Feast & Celebrations",
    "party.headline": "Party Special Royal Banquets",
    "party.description": "All-inclusive imperial feast platters featuring authentic Kacchi or Polau, golden Chicken Roast, Jali Kabab, Beef Rezala, Borhani, dessert, and chutney.",
    "party.completeBanquet": "Complete banquet",
    "party.orderBanquet": "Order banquet",
    "party.added": "Added to bag",

    // Heritage Section
    "heritage.dumPukht": "The Dum Pukht Royal Tradition",
    "heritage.dumPukhtDesc": "Sealed copper degs, pure ghee, and slow steam cooking over wood fire coals without artificial colours.",
    "heritage.headline": "Mughal Banquet Heritage in Paris",
    "heritage.p1": "Kacchi biryani originated in the imperial Mughal courts, where raw cuts of marinated spring lamb were layered under fragrant basmati and sealed with flour dough. Steam alone coaxes tenderness from the meat and perfumed richness from the rice.",
    "heritage.p2": "At Sultan’s Kacchi Paris, we honour this uncompromising culinary manuscript daily. We pair French heritage butchery with hand-ground spices and aged saffron, delivering an authentic feast packaged with care for takeaway dining across Paris.",
    "heritage.grainTitle": "Grain Selection",
    "heritage.grainVal": "Aged Kalijeera & Basmati",
    "heritage.halalTitle": "Halal Purity",
    "heritage.halalVal": "100% Certified Paris",

    // Location & Hours Section
    "loc.headline": "Location and Service Hours",
    "loc.description": "Visit our takeaway counter in the tenth arrondissement of Paris or order ahead for expedited collection.",
    "loc.addressTitle": "Paris Address",
    "loc.openMaps": "Open in Google Maps",
    "loc.hoursTitle": "Kitchen Service Hours",
    "loc.monThu": "Monday to Thursday",
    "loc.friSun": "Friday to Sunday",
    "loc.freshNotice": "Fresh hot dum deg opened continuously throughout service.",
    "loc.contactTitle": "Direct Contact",
    "loc.cateringNotice": "Catering and large banquets: order 24 hours in advance.",
    "loc.facebook": "Facebook Page",
    "loc.instagram": "Instagram",

    // Footer
    "footer.tagline": "Royal Mughal banquet dining translated for Parisian takeaway connoisseurs. Slow-cooked fresh in sealed copper degs daily.",
    "footer.halalCert": "100% Certified Halal Meat",
    "footer.maisonSections": "Maison Sections",
    "footer.takeawayCounter": "Takeaway Counter",
    "footer.metro": "Métro:",
    "footer.dailyService": "Daily service:",
    "footer.management": "Management & Social",
    "footer.menuInventory": "Menu Inventory (46 items)",
    "footer.settingsManager": "Branch Settings Manager",
    "footer.copyright": "All rights reserved · French TVA and service charges included.",
    "footer.photos": "Photographs: Sultan’s Kacchi Paris Culinary Archives",

    // Cart Drawer
    "cart.title": "Takeaway Bag",
    "cart.specialtiesSelected": "specialties selected",
    "cart.specialtySelected": "specialty selected",
    "cart.emptyTitle": "Your bag is empty",
    "cart.emptyDesc": "Explore our Paris menu and add authentic Kacchi, Polau, or Party Banquets.",
    "cart.browseSpecialties": "Browse Paris specialties",
    "cart.totalAmount": "Total takeaway amount",
    "cart.payNotice": "Pay on pickup at the counter. All prices include French TVA & service charges.",
    "cart.customerName": "Customer full name",
    "cart.namePlaceholder": "e.g. Jean Dupont",
    "cart.customerPhone": "Phone number (for pickup SMS)",
    "cart.phonePlaceholder": "e.g. +33 6 12 34 56 78",
    "cart.pickupSlot": "Requested pickup slot",
    "cart.selectSlot": "Select pickup time…",
    "cart.confirmOrder": "Confirm takeaway order ({total})",
    "cart.submitting": "Submitting order…",
    "cart.counterNote": "Pay on pickup at {address}, 75010 Paris",
    "cart.confirmedTitle": "Order Confirmed for Pickup",
    "cart.confirmedDesc": "Thank you, {name}. Your royal takeaway is scheduled for {time}.",
    "cart.orderRef": "Order reference",
    "cart.paymentMode": "Payment mode",
    "cart.payOnPickupBadge": "Pay on Pickup (Cash or Card)",
    "cart.totalToPay": "Total to pay",
    "cart.collectionCounter": "Collection counter:",
    "cart.trackOrder": "Track live order preparation",
    "cart.closeReturn": "Close and return to menu",
    "cart.each": "each",

    // Track Order Page
    "track.returnMenu": "Return to Paris menu",
    "track.headline": "Track Your Takeaway Order",
    "track.subheadline": "Enter your unique order reference code below to check live kitchen preparation status.",
    "track.inputPlaceholder": "Enter your Order ID (e.g. SKP-7K92)",
    "track.submitBtn": "Track live status",
    "track.searching": "Searching…",
    "track.recentOrders": "Recent orders from this device:",
    "track.orderRef": "Order reference",
    "track.contact": "Contact:",
    "track.refresh": "Refresh",
    "track.takeawayTotal": "Takeaway total",
    "track.liveProgress": "Live preparation progress",
    "track.step1": "Kitchen Queued",
    "track.step1Desc": "Order recorded in Paris kitchen system",
    "track.step2": "In Kitchen",
    "track.step2Desc": "Dum deg opened and dishes packed hot",
    "track.step3": "Ready for Pickup",
    "track.step3Desc": "Waiting for you at 28 Rue du Faubourg Saint-Denis",
    "track.step4": "Collected",
    "track.step4Desc": "Handed over to customer",
    "track.readyBanner": "Your order is packed hot and ready for collection!",
    "track.readyBannerSub": "Please proceed to the takeaway counter at 28 Rue du Faubourg Saint-Denis, 75010 Paris.",
    "track.dishesTitle": "Dishes in this order",
    "track.totalTva": "Total (TVA included)",
    "track.collectionDetails": "Collection details",
    "track.pickupSlot": "Scheduled pickup slot",
    "track.paymentNotice": "Payment notice",
    "track.paymentNoticeDesc": "Pay at pickup counter (Cards & Cash accepted).",
    "track.notFound": "Order \"{id}\" could not be located. Please verify your reference code or ask at the takeaway counter.",
    "track.loading": "Loading order tracker…",
  },
  fr: {
    // Navigation
    "nav.brandTitle": "Sultan’s Kacchi",
    "nav.brandSubtitle": "Paris 10e · Maison Royale",
    "nav.halalBadge": "100% Halal Paris",
    "nav.menu": "Menu Paris",
    "nav.weeklySpecial": "Spécial Semaine",
    "nav.partySpecial": "Banquets Royaux",
    "nav.heritage": "Héritage Royal",
    "nav.location": "Accès & Horaires",
    "nav.track": "Suivi Commande",
    "nav.trackMobile": "Suivre Votre Commande à Emporter",
    "nav.kitchenAdmin": "Admin Cuisine",
    "nav.kitchenAdminPortal": "Portail Admin Cuisine",
    "nav.takeawayBag": "Sac à Emporter",
    "nav.menuCatalog": "Catalogue du Menu de Paris",
    "nav.weeklyBanner": "Spécialité du Chef de la Semaine",
    "nav.partyBanquets": "Banquets Royaux pour Célébrations",

    // Hero Section
    "hero.halalTag": "100% Halal Authentifié · Paris 10e",
    "hero.headline": "Banquet Royal Mughal Kacchi à Paris",
    "hero.description": "Biryani authentique cuit lentement au dum, infusé de safran pur, de ghee et de vingt-et-une épices royales.",
    "hero.orderPickup": "Commander à emporter",
    "hero.exploreMenu": "Découvrir le menu",
    "hero.serviceContinuously": "Service continu :",
    "hero.signatureTitle": "Kacchi au Mouton Signature",
    "hero.signatureSubtitle": "Riz basmati affiné & agneau tendre",

    // Weekly Special Section
    "weekly.chefBadge": "Spécialité du Chef de la Semaine",
    "weekly.maisonSelection": "Sélection Maison Royale",
    "weekly.oldDhakaRecipe": "Recette Authentique du Vieux Dhaka",
    "weekly.tvaNotice": "Frais de service et TVA française inclus",
    "weekly.orderButton": "Commander le spécial",
    "weekly.addedToBag": "Ajouté au sac",

    // Menu Section
    "menu.sectionHead": "Le Menu Authentique de Paris",
    "menu.sectionSub": "Préparé frais chaque jour dans des degs de cuivre scellés avec de l'agneau français halal, du ghee pur et du basmati affiné. Taxes incluses.",
    "menu.specialtiesCount": "46 Spécialités Artisanales",
    "menu.payOnPickup": "Paiement au Retrait Disponible",
    "menu.searchPlaceholder": "Rechercher des plats, naan, desserts, lassi…",
    "menu.searchLabel": "Rechercher dans le menu de Paris",
    "menu.dishesSingular": "plat",
    "menu.dishesPlural": "plats",
    "menu.specialSelection": "Sélection Spéciale",
    "menu.freshToday": "Frais du jour",
    "menu.soldOut": "Épuisé",
    "menu.addToBag": "Ajouter au sac",
    "menu.inBag": "Dans le sac",
    "menu.noDishesFound": "Aucun plat trouvé",
    "menu.noDishesSub": "Essayez d'ajuster votre recherche ou choisissez une autre catégorie ci-dessus.",
    "menu.resetFilters": "Réinitialiser les filtres",
    "menu.floatingInBag": "dans le sac",
    "menu.floatingSpecialtySingular": "spécialité",
    "menu.floatingSpecialtyPlural": "spécialités",
    "menu.viewBag": "Voir le Sac",

    // Categories
    "cat.All": "Tous",
    "cat.Mutton Kacchi": "Kacchi au Mouton",
    "cat.Polau": "Polau",
    "cat.Tehari": "Tehari",
    "cat.Weekly Special": "Spécial Semaine",
    "cat.Party Special": "Banquets Fêtes",
    "cat.Evening Special": "Spécial Soirée",
    "cat.Rooti": "Rooti & Naan",
    "cat.Additional": "Accompagnements",
    "cat.Desserts": "Desserts",
    "cat.Beverage": "Boissons",

    // Party Special Section
    "party.badge": "Grand Festin & Célébrations",
    "party.headline": "Banquets Royaux pour Fêtes",
    "party.description": "Plateaux de banquet impérial tout-en-un comprenant Kacchi ou Polau authentique, poulet rôti doré, Jali Kabab, Beef Rezala, Borhani, dessert et chutney.",
    "party.completeBanquet": "Banquet complet",
    "party.orderBanquet": "Commander le banquet",
    "party.added": "Ajouté au sac",

    // Heritage Section
    "heritage.dumPukht": "La Tradition Royale Dum Pukht",
    "heritage.dumPukhtDesc": "Degs de cuivre scellés, ghee pur et cuisson lente à la vapeur sur braises sans colorants artificiels.",
    "heritage.headline": "L'Héritage Mughal à Paris",
    "heritage.p1": "Le Kacchi biryani trouve ses origines dans les cours impériales mogholes, où de tendres morceaux d'agneau mariné étaient superposés sous du riz basmati parfumé et scellés avec de la pâte. Seule la vapeur extrait la tendreté de la viande et la richesse parfumée du riz.",
    "heritage.p2": "À Sultan’s Kacchi Paris, nous honorons quotidiennement ce manuscrit culinaire sans compromis. Nous associons la boucherie de tradition française à des épices moulues à la main et du safran affiné, offrant un festin authentique soigneusement préparé pour la vente à emporter à Paris.",
    "heritage.grainTitle": "Sélection des Grains",
    "heritage.grainVal": "Kalijeera & Basmati Affinés",
    "heritage.halalTitle": "Pureté Halal",
    "heritage.halalVal": "100% Certifié Paris",

    // Location & Hours Section
    "loc.headline": "Adresse et Horaires de Service",
    "loc.description": "Visitez notre comptoir à emporter dans le dixième arrondissement de Paris ou commandez à l'avance pour un retrait rapide.",
    "loc.addressTitle": "Adresse à Paris",
    "loc.openMaps": "Ouvrir dans Google Maps",
    "loc.hoursTitle": "Horaires du Service Cuisine",
    "loc.monThu": "Lundi au Jeudi",
    "loc.friSun": "Vendredi au Dimanche",
    "loc.freshNotice": "Degs fumants ouverts en continu tout au long du service.",
    "loc.contactTitle": "Contact Direct",
    "loc.cateringNotice": "Traiteur et grands banquets : commandez 24h à l'avance.",
    "loc.facebook": "Page Facebook",
    "loc.instagram": "Instagram",

    // Footer
    "footer.tagline": "La haute gastronomie de banquet moghole pour les amateurs de vente à emporter à Paris. Cuit frais chaque jour dans des degs de cuivre scellés.",
    "footer.halalCert": "100% Viande Halal Certifiée",
    "footer.maisonSections": "Sections de la Maison",
    "footer.takeawayCounter": "Comptoir à Emporter",
    "footer.metro": "Métro :",
    "footer.dailyService": "Service quotidien :",
    "footer.management": "Gestion & Réseaux",
    "footer.menuInventory": "Inventaire du Menu (46 plats)",
    "footer.settingsManager": "Gestionnaire des Paramètres",
    "footer.copyright": "Tous droits réservés · Frais de service et TVA française inclus.",
    "footer.photos": "Photographies : Archives Culinaires Sultan’s Kacchi Paris",

    // Cart Drawer
    "cart.title": "Sac à Emporter",
    "cart.specialtiesSelected": "spécialités sélectionnées",
    "cart.specialtySelected": "spécialité sélectionnée",
    "cart.emptyTitle": "Votre sac est vide",
    "cart.emptyDesc": "Découvrez notre menu de Paris et ajoutez d'authentiques Kacchi, Polau ou Banquets Royaux.",
    "cart.browseSpecialties": "Découvrir les spécialités de Paris",
    "cart.totalAmount": "Montant total à emporter",
    "cart.payNotice": "Paiement au retrait au comptoir. Prix incluant TVA et service.",
    "cart.customerName": "Nom et prénom",
    "cart.namePlaceholder": "ex. Jean Dupont",
    "cart.customerPhone": "Numéro de téléphone (pour SMS)",
    "cart.phonePlaceholder": "ex. +33 6 12 34 56 78",
    "cart.pickupSlot": "Créneau horaire souhaité",
    "cart.selectSlot": "Sélectionnez l'heure de retrait…",
    "cart.confirmOrder": "Confirmer la commande ({total})",
    "cart.submitting": "Envoi de la commande…",
    "cart.counterNote": "Paiement au retrait au {address}, 75010 Paris",
    "cart.confirmedTitle": "Commande Confirmée pour Retrait",
    "cart.confirmedDesc": "Merci, {name}. Votre commande royale est prévue pour {time}.",
    "cart.orderRef": "Référence de commande",
    "cart.paymentMode": "Mode de paiement",
    "cart.payOnPickupBadge": "Paiement au Retrait (Carte ou Espèces)",
    "cart.totalToPay": "Total à régler",
    "cart.collectionCounter": "Comptoir de retrait :",
    "cart.trackOrder": "Suivre la préparation en direct",
    "cart.closeReturn": "Fermer et retourner au menu",
    "cart.each": "l'unité",

    // Track Order Page
    "track.returnMenu": "Retour au menu de Paris",
    "track.headline": "Suivre Votre Commande à Emporter",
    "track.subheadline": "Entrez votre code de référence de commande ci-dessous pour vérifier l'état de préparation en cuisine.",
    "track.inputPlaceholder": "Entrez votre ID de commande (ex. SKP-7K92)",
    "track.submitBtn": "Suivre l'état en direct",
    "track.searching": "Recherche…",
    "track.recentOrders": "Commandes récentes de cet appareil :",
    "track.orderRef": "Référence de commande",
    "track.contact": "Contact :",
    "track.refresh": "Actualiser",
    "track.takeawayTotal": "Total à emporter",
    "track.liveProgress": "Progression de la préparation",
    "track.step1": "Enregistrée en Cuisine",
    "track.step1Desc": "Commande enregistrée dans le système de la cuisine",
    "track.step2": "En Cuisine",
    "track.step2Desc": "Deg scellé ouvert et plats préparés chauds",
    "track.step3": "Prête pour Retrait",
    "track.step3Desc": "Disponible au comptoir au 28 Rue du Faubourg Saint-Denis",
    "track.step4": "Retirée",
    "track.step4Desc": "Remise en main propre au client",
    "track.readyBanner": "Votre commande est emballée chaude et prête à être retirée !",
    "track.readyBannerSub": "Veuillez vous présenter au comptoir de vente à emporter au 28 Rue du Faubourg Saint-Denis, 75010 Paris.",
    "track.dishesTitle": "Plats dans cette commande",
    "track.totalTva": "Total (TVA incluse)",
    "track.collectionDetails": "Détails du retrait",
    "track.pickupSlot": "Créneau horaire planifié",
    "track.paymentNotice": "Information paiement",
    "track.paymentNoticeDesc": "Règlement au comptoir de retrait (Cartes & Espèces acceptées).",
    "track.notFound": "La commande \"{id}\" n'a pas pu être trouvée. Veuillez vérifier votre code ou demander au comptoir.",
    "track.loading": "Chargement du suivi de commande…",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default primary language is English ("en")
  const [language, setLanguageState] = useState<Language>("en");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("skp_language") as Language | null;
      if (stored === "en" || stored === "fr") {
        setLanguageState(stored);
      }
    } catch {
      // ignore
    }
    setIsHydrated(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("skp_language", lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    let template = langDict[key] || TRANSLATIONS.en[key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        template = template.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(val));
      });
    }

    return template;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
