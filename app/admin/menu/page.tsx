"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/context/auth-context";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { MenuItem } from "@/lib/supabase/types";
import { INITIAL_MENU_ITEMS } from "@/lib/data/initial-menu";
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Upload,
  ArrowLeft,
  Sparkles,
  Search,
} from "lucide-react";

export default function AdminMenuPage() {
  const { isAdminLoggedIn, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Mutton Kacchi");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("/images/biryani-mouton.jpg");
  const [isWeeklySpecial, setIsWeeklySpecial] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    "Mutton Kacchi",
    "Polau",
    "Tehari",
    "Weekly Special",
    "Party Special",
    "Evening Special",
    "Rooti",
    "Additional",
    "Desserts",
    "Beverage",
  ];

  // Local available image assets
  const availableLocalImages = [
    { label: "Mutton Biryani / Kacchi", path: "/images/biryani-mouton.jpg" },
    { label: "Roast Polau", path: "/images/roast-polau.jpg" },
    { label: "Beef Tehari", path: "/images/beef-tehari.jpg" },
    { label: "Beef Rezala", path: "/images/beef-rezala-v2.jpg" },
    { label: "Chicken Roast", path: "/images/chicken-roast.jpg" },
    { label: "Beef Curry / Kala Bhuna", path: "/images/boeuf-au-curry.jpg" },
    { label: "Mutton Curry / Rezala", path: "/images/angeau-au-curry.jpg" },
    { label: "Whole Grilled Chicken", path: "/images/poulet-tandoori.jpg" },
    { label: "Tikka / Jali Kabab", path: "/images/poulet-tikka.jpg" },
    { label: "Firni Dessert", path: "/images/firni.jpg" },
    { label: "Jorda Dessert", path: "/images/jorda.jpg" },
    { label: "Mango Lassi", path: "/images/lassi-mangue.jpg" },
    { label: "Natural Borhani / Lassi", path: "/images/lassi-nature.jpg" },
    { label: "Rose / Zafrani Sorbat", path: "/images/lassi-rose.jpg" },
    { label: "Cheese Naan", path: "/images/naan-fromage.jpg" },
    { label: "Garlic Cheese Naan", path: "/images/naan-ail-fromage.jpg" },
    { label: "Vegetable Curry / Chutney", path: "/images/curry-au-légume.jpg" },
    { label: "Taj Mahal Royal Architecture", path: "/images/2026-11-03-taj-mahal7409450.jpg" },
  ];

  useEffect(() => {
    loadMenuItems();
  }, [isAdminLoggedIn]);

  const loadMenuItems = async () => {
    setIsLoading(true);
    let loaded: MenuItem[] = INITIAL_MENU_ITEMS;

    try {
      const local = localStorage.getItem("skp_local_menu");
      if (local) {
        loaded = JSON.parse(local);
      }
    } catch {}

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("menu_items")
          .select("*")
          .order("category", { ascending: true });

        if (!error && data && data.length > 0) {
          loaded = data;
        }
      } catch {}
    }

    setItems(loaded);
    setIsLoading(false);
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setName("");
    setCategory("Mutton Kacchi");
    setDescription("");
    setPrice("");
    setImageUrl("/images/biryani-mouton.jpg");
    setIsWeeklySpecial(false);
    setIsAvailable(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setDescription(item.description || "");
    setPrice(item.price.toString());
    setImageUrl(item.image_url || "/images/biryani-mouton.jpg");
    setIsWeeklySpecial(item.is_weekly_special);
    setIsAvailable(item.is_available);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setStatusMessage(null);

    try {
      if (isSupabaseConfigured) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `items/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("menu-images")
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from("menu-images")
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          setImageUrl(publicUrlData.publicUrl);
        }
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Image upload failed";
      setStatusMessage(`Upload notice: ${msg}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) return;

    const payload: Partial<MenuItem> = {
      name: name.trim(),
      category,
      description: description.trim(),
      price: parsedPrice,
      image_url: imageUrl || "/images/biryani-mouton.jpg",
      is_weekly_special: isWeeklySpecial,
      is_available: isAvailable,
    };

    let updatedList = [...items];

    if (editingItem) {
      if (isSupabaseConfigured) {
        try {
          await supabase
            .from("menu_items")
            .update(payload)
            .eq("id", editingItem.id);
        } catch {}
      }
      updatedList = updatedList.map((i) =>
        i.id === editingItem.id ? { ...i, ...payload } : i
      );
    } else {
      const newId = `item-${Date.now()}`;
      const newItem: MenuItem = {
        id: newId,
        ...payload,
      } as MenuItem;

      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase
            .from("menu_items")
            .insert([payload])
            .select()
            .single();
          if (data) newItem.id = data.id;
        } catch {}
      }
      updatedList = [newItem, ...updatedList];
    }

    setItems(updatedList);
    try {
      localStorage.setItem("skp_local_menu", JSON.stringify(updatedList));
    } catch {}

    setIsModalOpen(false);
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to remove this dish from the menu?")) {
      return;
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from("menu_items").delete().eq("id", id);
      } catch {}
    }

    const updatedList = items.filter((i) => i.id !== id);
    setItems(updatedList);
    try {
      localStorage.setItem("skp_local_menu", JSON.stringify(updatedList));
    } catch {}
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    const updatedStatus = !item.is_available;
    const updatedList = items.map((i) =>
      i.id === item.id ? { ...i, is_available: updatedStatus } : i
    );
    setItems(updatedList);

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from("menu_items")
          .update({ is_available: updatedStatus })
          .eq("id", item.id);
      } catch {}
    }

    try {
      localStorage.setItem("skp_local_menu", JSON.stringify(updatedList));
    } catch {}
  };

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

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedFilterCategory === "All" || item.category === selectedFilterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container py-10 space-y-8">
      
      {/* Top Header */}
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
          <h1 className="mt-2 font-display text-2xl font-bold text-accent">
            Paris Menu Management (46 Dishes)
          </h1>
          <p className="text-sm text-muted">
            Add, update prices in Euros, assign local food images, and toggle daily availability.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Add new menu dish</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="luxury-card p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted pointer-events-none" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish by name…"
            className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-1.5 pl-9 pr-3 text-xs text-ink focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
          <span className="text-xs text-muted font-medium mr-1 whitespace-nowrap">Category:</span>
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedFilterCategory(cat)}
              className={`rounded px-2.5 py-1 text-xs whitespace-nowrap font-medium transition-colors ${
                selectedFilterCategory === cat
                  ? "bg-accent text-white"
                  : "bg-paper-2 text-ink-2 hover:bg-paper-3 border border-rule-subtle"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Table */}
      <div className="luxury-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-ink-2">
            <thead className="border-b border-rule bg-paper-3 text-xs text-muted font-semibold">
              <tr>
                <th className="p-4">Dish & Image</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price (€)</th>
                <th className="p-4">Weekly special</th>
                <th className="p-4">Availability</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule-subtle">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-paper-3/40 transition-colors duration-short">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-[var(--radius-card)] border border-rule bg-paper-2">
                        <Image
                          src={item.image_url || "/images/biryani-mouton.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-ink">{item.name}</p>
                        <p className="text-xs text-muted line-clamp-1 max-w-[34ch]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-xs font-medium">{item.category}</td>
                  <td className="p-4 font-display font-bold text-accent text-base">
                    €{Number(item.price).toFixed(2)}
                  </td>
                  <td className="p-4 text-xs">
                    {item.is_weekly_special ? (
                      <span className="inline-flex items-center gap-1 text-accent font-semibold">
                        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Active special</span>
                      </span>
                    ) : (
                      <span className="text-muted">Standard</span>
                    )}
                  </td>
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => handleToggleAvailability(item)}
                      className={`inline-flex items-center gap-1.5 rounded-[var(--radius-card)] px-2.5 py-1 text-xs font-medium transition-colors duration-short ${
                        item.is_available
                          ? "bg-success/15 text-success border border-success/30"
                          : "bg-paper-3 text-muted border border-rule-subtle"
                      }`}
                    >
                      {item.is_available ? (
                        <>
                          <Check className="h-3 w-3" aria-hidden="true" />
                          <span>Available</span>
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3" aria-hidden="true" />
                          <span>Paused</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(item)}
                        aria-label={`Edit ${item.name}`}
                        className="rounded-[var(--radius-card)] p-1.5 text-muted hover:text-accent hover:bg-paper-2 border border-rule-subtle"
                      >
                        <Edit2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id)}
                        aria-label={`Delete ${item.name}`}
                        className="rounded-[var(--radius-card)] p-1.5 text-muted hover:text-error hover:bg-paper-2 border border-rule-subtle"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-[var(--color-scrim)] p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="luxury-card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-rule pb-3">
              <h2 className="font-display text-xl font-bold text-accent">
                {editingItem ? "Edit Menu Dish" : "Add New Menu Dish"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-muted hover:text-ink"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {statusMessage && (
              <div className="mt-4 rounded-[var(--radius-card)] border border-rule bg-paper-2 p-2.5 text-xs text-muted">
                {statusMessage}
              </div>
            )}

            <form onSubmit={handleSaveItem} className="mt-4 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Dish name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Mutton Kacchi"
                  className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 px-3 text-ink focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-2 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 px-3 text-ink focus:border-accent text-xs"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-2 mb-1">
                    Price in Euros (€)
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="9.90"
                    className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 px-3 text-ink focus:border-accent text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Culinary description & ingredients
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Aged basmati rice, tender lamb, saffron ghee…"
                  className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 px-3 text-ink focus:border-accent text-xs"
                />
              </div>

              {/* Local Food Image Picker */}
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Select Local Food Image (from public/images)
                </label>
                <select
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 px-3 text-ink focus:border-accent text-xs mb-2"
                >
                  {availableLocalImages.map((img) => (
                    <option key={img.path} value={img.path}>
                      {img.label} ({img.path})
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="btn-secondary text-xs"
                  >
                    <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{isUploading ? "Uploading…" : "Upload custom photo"}</span>
                  </button>
                  <span className="text-xs text-muted">or URL:</span>
                </div>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/images/biryani-mouton.jpg"
                  className="mt-2 w-full rounded-[var(--radius-card)] border border-rule bg-paper py-1.5 px-3 text-xs text-ink focus:border-accent font-mono"
                />

                {imageUrl && (
                  <div className="relative mt-2 h-24 w-36 overflow-hidden rounded-[var(--radius-card)] border border-rule">
                    <Image
                      src={imageUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-2 pt-2 border-t border-rule-subtle">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isWeeklySpecial}
                    onChange={(e) => setIsWeeklySpecial(e.target.checked)}
                    className="h-4 w-4 rounded border-rule text-accent focus:ring-accent"
                  />
                  <span className="text-xs font-medium text-ink">Feature as Chef’s Weekly Special</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="h-4 w-4 rounded border-rule text-accent focus:ring-accent"
                  />
                  <span className="text-xs font-medium text-ink">Available for orders today</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-rule">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  {editingItem ? "Save changes" : "Create dish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
