import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WeeklySpecial from "@/components/WeeklySpecial";
import MenuSection from "@/components/MenuSection";
import PartySpecialSection from "@/components/PartySpecialSection";
import HeritageStory from "@/components/HeritageStory";
import LocationHours from "@/components/LocationHours";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { INITIAL_MENU_ITEMS } from "@/lib/data/initial-menu";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { MenuItem } from "@/lib/supabase/types";

// Dynamic data fetching with fallback to initial menu data
async function getMenuItems(): Promise<MenuItem[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("is_weekly_special", { ascending: false })
        .order("category", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as MenuItem[];
      }
    } catch {
      // Fallback to static initial items
    }
  }

  return INITIAL_MENU_ITEMS;
}

export default async function HomePage() {
  const menuItems = await getMenuItems();
  const weeklySpecial =
    menuItems.find((i) => i.is_weekly_special) || menuItems[0];
  const partyItems = menuItems.filter((i) => i.category === "Party Special");

  return (
    <main className="min-h-screen bg-paper text-ink flex flex-col justify-between">
      <Navbar />
      <div className="flex-1">
        <Hero />
        {weeklySpecial && <WeeklySpecial specialItem={weeklySpecial} />}
        <MenuSection initialItems={menuItems} />
        {partyItems.length > 0 && <PartySpecialSection partyItems={partyItems} />}
        <HeritageStory />
        <LocationHours />
      </div>
      <Footer />
      <CartDrawer />
    </main>
  );
}
