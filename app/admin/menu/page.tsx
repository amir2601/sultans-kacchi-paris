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
  Tags,
  Image as ImageIcon,
  FolderPlus,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const DEFAULT_CATEGORIES = [
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

// Curated library of all authentic local dishes available in public/images
const AVAILABLE_LOCAL_IMAGES = [
  { label: "Mutton Kacchi / Biryani", path: "/images/biryani-mouton.jpg", group: "Biryani & Kacchi" },
  { label: "Chicken Biryani", path: "/images/biryani-poulet.jpg", group: "Biryani & Kacchi" },
  { label: "Butter Chicken Biryani", path: "/images/biryani-butter-chicken.jpg", group: "Biryani & Kacchi" },
  { label: "Paneer Biryani", path: "/images/biryani-panir.jpg", group: "Biryani & Kacchi" },
  { label: "Chicken Roast Polau", path: "/images/roast-polau.jpg", group: "Polau & Tehari" },
  { label: "Old Dhaka Beef Tehari", path: "/images/beef-tehari.jpg", group: "Polau & Tehari" },
  { label: "Shahi Beef Rezala", path: "/images/beef-rezala-v2.jpg", group: "Curry & Meat" },
  { label: "Shahi Chicken Roast", path: "/images/chicken-roast.jpg", group: "Chicken Specials" },
  { label: "Chicken Korma", path: "/images/chicken-korma.jpg", group: "Chicken Specials" },
  { label: "Beef Curry / Kala Bhuna", path: "/images/boeuf-au-curry.jpg", group: "Curry & Meat" },
  { label: "Mutton Curry / Rogan Josh", path: "/images/angeau-au-curry.jpg", group: "Curry & Meat" },
  { label: "Butter Chicken", path: "/images/butter-chicken-v2.jpg", group: "Chicken Specials" },
  { label: "Madras Curry", path: "/images/mandras.jpg", group: "Curry & Meat" },
  { label: "Whole Tandoori Chicken", path: "/images/poulet-tandoori.jpg", group: "Tandoori & Grill" },
  { label: "Chicken Tikka", path: "/images/poulet-tikka.jpg", group: "Tandoori & Grill" },
  { label: "Chicken Tikka Masala", path: "/images/poulet-tikka-masala.jpg", group: "Chicken Specials" },
  { label: "Palak Paneer", path: "/images/palak-panir.jpg", group: "Vegetarian" },
  { label: "Mixed Vegetable Curry", path: "/images/curry-au-légume.jpg", group: "Vegetarian" },
  { label: "Vegetable Korma", path: "/images/legume-korma.jpg", group: "Vegetarian" },
  { label: "Cheese Naan", path: "/images/naan-fromage.jpg", group: "Breads" },
  { label: "Garlic Cheese Naan", path: "/images/naan-ail-fromage.jpg", group: "Breads" },
  { label: "Royal Zafrani Firni", path: "/images/firni.jpg", group: "Desserts" },
  { label: "Shahi Shondesh Jorda", path: "/images/jorda.jpg", group: "Desserts" },
  { label: "Mango Lassi", path: "/images/lassi-mangue.jpg", group: "Beverages" },
  { label: "Traditional Borhani / Lassi", path: "/images/lassi-nature.jpg", group: "Beverages" },
  { label: "Rose Water Lassi", path: "/images/lassi-rose.jpg", group: "Beverages" },
  { label: "Taj Mahal Palace Heritage", path: "/images/2026-11-03-taj-mahal7409450.jpg", group: "Heritage" },
];

export default function AdminMenuPage() {
  const { isAdminLoggedIn, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("All");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
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

  // Image picker states
  const [imageGallerySearch, setImageGallerySearch] = useState("");
  const [imageTab, setImageTab] = useState<"gallery" | "custom">("gallery");

  // Category manager states
  const [newCatInput, setNewCatInput] = useState("");
  const [catFeedback, setCatFeedback] = useState<{ type: "error" | "success"; text: string } | null>(null);

  // Inline category add inside dish modal
  const [showInlineCatAdd, setShowInlineCatAdd] = useState(false);
  const [inlineCatInput, setInlineCatInput] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMenuItems();
  }, [isAdminLoggedIn]);

  const loadCategories = (menuItemsList: MenuItem[]) => {
    try {
      const saved = localStorage.getItem("skp_custom_categories");
      const customCats: string[] = saved ? JSON.parse(saved) : [];
      const itemCats = menuItemsList.map((i) => i.category).filter(Boolean);
      const merged = Array.from(new Set([...DEFAULT_CATEGORIES, ...customCats, ...itemCats]));
      setCategories(merged);
    } catch {
      setCategories(DEFAULT_CATEGORIES);
    }
  };

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
    loadCategories(loaded);
    setIsLoading(false);
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setName("");
    setCategory(categories[0] || "Mutton Kacchi");
    setDescription("");
    setPrice("");
    setImageUrl("/images/biryani-mouton.jpg");
    setIsWeeklySpecial(false);
    setIsAvailable(true);
    setImageTab("gallery");
    setImageGallerySearch("");
    setShowInlineCatAdd(false);
    setInlineCatInput("");
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
    setImageTab("gallery");
    setImageGallerySearch("");
    setShowInlineCatAdd(false);
    setInlineCatInput("");
    setIsModalOpen(true);
  };

  // Add Category Handler
  const handleAddCategory = (categoryName: string): boolean => {
    const trimmed = categoryName.trim();
    if (!trimmed) {
      setCatFeedback({ type: "error", text: "Category name cannot be empty." });
      return false;
    }

    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setCatFeedback({ type: "error", text: `Category "${trimmed}" already exists.` });
      return false;
    }

    const updated = [...categories, trimmed];
    setCategories(updated);

    try {
      const saved = localStorage.getItem("skp_custom_categories");
      const customCats: string[] = saved ? JSON.parse(saved) : [];
      if (!customCats.includes(trimmed)) {
        customCats.push(trimmed);
        localStorage.setItem("skp_custom_categories", JSON.stringify(customCats));
      }
      window.dispatchEvent(new Event("skp_categories_updated"));
    } catch {}

    setCatFeedback({ type: "success", text: `Category "${trimmed}" added successfully!` });
    setTimeout(() => setCatFeedback(null), 3000);
    return true;
  };

  const handleDeleteCategory = (catName: string) => {
    const dishCount = items.filter((i) => i.category === catName).length;
    if (dishCount > 0) {
      if (
        !confirm(
          `"${catName}" has ${dishCount} dish(es) currently assigned to it. Are you sure you want to remove this category? (The dishes will still remain in your menu)`
        )
      ) {
        return;
      }
    }

    const updated = categories.filter((c) => c !== catName);
    setCategories(updated);

    try {
      const saved = localStorage.getItem("skp_custom_categories");
      const customCats: string[] = saved ? JSON.parse(saved) : [];
      const filtered = customCats.filter((c) => c !== catName);
      localStorage.setItem("skp_custom_categories", JSON.stringify(filtered));
      window.dispatchEvent(new Event("skp_categories_updated"));
    } catch {}

    if (selectedFilterCategory === catName) {
      setSelectedFilterCategory("All");
    }
  };

  const handleInlineAddCategory = () => {
    if (handleAddCategory(inlineCatInput)) {
      setCategory(inlineCatInput.trim());
      setInlineCatInput("");
      setShowInlineCatAdd(false);
    }
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
      window.dispatchEvent(new Event("skp_local_menu_updated"));
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
      window.dispatchEvent(new Event("skp_local_menu_updated"));
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
      window.dispatchEvent(new Event("skp_local_menu_updated"));
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

  // Filter gallery images in grid view
  const filteredGalleryImages = AVAILABLE_LOCAL_IMAGES.filter((img) => {
    if (!imageGallerySearch.trim()) return true;
    const q = imageGallerySearch.toLowerCase();
    return img.label.toLowerCase().includes(q) || img.group.toLowerCase().includes(q);
  });

  const selectedImageObj = AVAILABLE_LOCAL_IMAGES.find((img) => img.path === imageUrl);

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
          <h1 className="mt-2 font-display text-2xl font-bold text-accent flex items-center gap-3">
            <span>Paris Menu Management</span>
            <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
              {items.length} Dishes
            </span>
          </h1>
          <p className="text-sm text-muted">
            Add dishes, organize categories, pick photos in visual grid view, and set prices.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setCatFeedback(null);
              setNewCatInput("");
              setIsCategoryModalOpen(true);
            }}
            className="btn-secondary text-xs"
          >
            <Tags className="h-4 w-4 text-accent" aria-hidden="true" />
            <span>Manage Categories ({categories.length})</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="btn-primary text-xs"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Add new menu dish</span>
          </button>
        </div>
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

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          <span className="text-xs text-muted font-medium mr-1 whitespace-nowrap">Category:</span>
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedFilterCategory(cat)}
              className={`rounded px-2.5 py-1 text-xs whitespace-nowrap font-medium transition-colors ${
                selectedFilterCategory === cat
                  ? "bg-accent text-white shadow-xs"
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
                  <td className="p-4 text-xs font-medium">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-paper-3 border border-rule-subtle text-ink-2 font-medium">
                      {item.category}
                    </span>
                  </td>
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

      {/* ======================================================== */}
      {/* 1. Category Management Modal */}
      {/* ======================================================== */}
      {isCategoryModalOpen && (
        <div
          className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-[var(--color-scrim)] p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="luxury-card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-rule pb-3">
              <div className="flex items-center gap-2">
                <Tags className="h-5 w-5 text-accent" />
                <h2 className="font-display text-xl font-bold text-accent">
                  Manage Menu Categories
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-muted hover:text-ink p-1 rounded"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <p className="text-xs text-muted mt-2">
              Create new categories to organize your Paris menu. Added categories appear in customer filters and dish creation.
            </p>

            {/* Add Category Form */}
            <div className="mt-4 p-4 rounded-xl bg-paper-2 border border-rule">
              <label className="block text-xs font-semibold text-ink-2 mb-1.5">
                Add New Category
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCatInput}
                  onChange={(e) => setNewCatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (handleAddCategory(newCatInput)) setNewCatInput("");
                    }
                  }}
                  placeholder="e.g. Set Menu, Chef Specials, Starters…"
                  className="flex-1 rounded-[var(--radius-card)] border border-rule bg-paper py-2 px-3 text-xs text-ink focus:border-accent"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (handleAddCategory(newCatInput)) setNewCatInput("");
                  }}
                  className="btn-primary text-xs py-2 px-4 whitespace-nowrap"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Category</span>
                </button>
              </div>

              {catFeedback && (
                <div
                  className={`mt-2.5 p-2 rounded-lg text-xs flex items-center gap-2 ${
                    catFeedback.type === "error"
                      ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                      : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  }`}
                >
                  {catFeedback.type === "error" ? (
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  )}
                  <span>{catFeedback.text}</span>
                </div>
              )}
            </div>

            {/* Existing Categories List */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                  Active Categories ({categories.length})
                </h3>
                <span className="text-[11px] text-muted">Click trash to remove custom tag</span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {categories.map((cat) => {
                  const dishCount = items.filter((i) => i.category === cat).length;
                  const isDefault = DEFAULT_CATEGORIES.includes(cat);

                  return (
                    <div
                      key={cat}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-rule bg-paper hover:bg-paper-2 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="h-2 w-2 rounded-full bg-accent" />
                        <div>
                          <span className="text-xs font-semibold text-ink">{cat}</span>
                          {isDefault && (
                            <span className="ml-2 text-[10px] text-muted bg-paper-3 px-1.5 py-0.2 rounded">
                              System
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted font-medium">
                          {dishCount} {dishCount === 1 ? "dish" : "dishes"}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat)}
                          title="Delete category"
                          className="p-1 rounded text-muted hover:text-rose-500 hover:bg-paper-3 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-rule flex justify-end">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="btn-secondary text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. Add / Edit Dish Modal */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-[var(--color-scrim)] p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="luxury-card w-full max-w-2xl p-6 max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-rule pb-3">
              <h2 className="font-display text-xl font-bold text-accent">
                {editingItem ? "Edit Menu Dish" : "Add New Menu Dish"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-muted hover:text-ink p-1 rounded"
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
              {/* Dish Name */}
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Dish name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Mutton Kacchi"
                  className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 px-3 text-ink focus:border-accent text-xs"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-ink-2">
                      Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowInlineCatAdd(!showInlineCatAdd)}
                      className="text-[11px] font-semibold text-accent hover:underline flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>{showInlineCatAdd ? "Cancel" : "Add New Category"}</span>
                    </button>
                  </div>

                  {showInlineCatAdd ? (
                    <div className="flex gap-1.5 mb-2">
                      <input
                        type="text"
                        value={inlineCatInput}
                        onChange={(e) => setInlineCatInput(e.target.value)}
                        placeholder="New category name…"
                        className="flex-1 rounded border border-accent bg-paper py-1 px-2 text-xs text-ink focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleInlineAddCategory}
                        className="btn-primary text-xs py-1 px-2.5"
                      >
                        Save
                      </button>
                    </div>
                  ) : null}

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
                    Price in Euros (€) *
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

              {/* Description */}
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

              {/* ======================================================== */}
              {/* IMAGE SELECTION - VISUAL GRID VIEW */}
              {/* ======================================================== */}
              <div className="p-3.5 rounded-xl border border-rule bg-paper-2/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                  <div>
                    <label className="block text-xs font-bold text-ink">
                      Select Dish Photo (Visual Grid View)
                    </label>
                    <span className="text-[11px] text-muted">
                      Click any photo to select it for this dish
                    </span>
                  </div>

                  {/* Mode switcher tabs */}
                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-paper border border-rule-subtle text-xs">
                    <button
                      type="button"
                      onClick={() => setImageTab("gallery")}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                        imageTab === "gallery"
                          ? "bg-accent text-white shadow-xs"
                          : "text-muted hover:text-ink"
                      }`}
                    >
                      Gallery Grid
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab("custom")}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                        imageTab === "custom"
                          ? "bg-accent text-white shadow-xs"
                          : "text-muted hover:text-ink"
                      }`}
                    >
                      Upload / URL
                    </button>
                  </div>
                </div>

                {imageTab === "gallery" ? (
                  <div>
                    {/* Gallery Search Filter */}
                    <div className="relative mb-2.5">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted pointer-events-none" />
                      <input
                        type="text"
                        value={imageGallerySearch}
                        onChange={(e) => setImageGallerySearch(e.target.value)}
                        placeholder="Search photos (e.g. biryani, roast, naan, dessert, lassi)..."
                        className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-1.5 pl-8 pr-3 text-xs text-ink placeholder:text-muted/60 focus:border-accent"
                      />
                    </div>

                    {/* PHOTO GRID VIEW */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 max-h-60 overflow-y-auto p-2 rounded-xl border border-rule bg-paper scrollbar-thin">
                      {filteredGalleryImages.map((img) => {
                        const isSelected = imageUrl === img.path;

                        return (
                          <button
                            type="button"
                            key={img.path}
                            onClick={() => setImageUrl(img.path)}
                            className={`group relative flex flex-col rounded-lg overflow-hidden border text-left transition-all duration-150 ${
                              isSelected
                                ? "border-accent ring-2 ring-accent ring-offset-1 shadow-md bg-paper-2"
                                : "border-rule hover:border-accent/60 bg-paper hover:shadow-xs"
                            }`}
                          >
                            {/* Thumbnail Box */}
                            <div className="relative aspect-square w-full bg-paper-3 overflow-hidden">
                              <Image
                                src={img.path}
                                alt={img.label}
                                fill
                                className={`object-cover transition-transform duration-200 ${
                                  isSelected ? "scale-105" : "group-hover:scale-105"
                                }`}
                                sizes="(max-width: 640px) 33vw, 20vw"
                              />

                              {/* Selected Checkmark Badge */}
                              {isSelected && (
                                <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-accent text-white flex items-center justify-center shadow-md">
                                  <Check className="h-3 w-3 stroke-[3]" />
                                </div>
                              )}
                            </div>

                            {/* Caption Label */}
                            <div className="p-1.5">
                              <p
                                className={`text-[10px] leading-tight line-clamp-1 ${
                                  isSelected ? "text-accent font-bold" : "text-ink-2 font-medium"
                                }`}
                                title={img.label}
                              >
                                {img.label}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Selected Image Status Strip */}
                    {imageUrl && (
                      <div className="mt-2.5 flex items-center justify-between p-2 rounded-lg bg-paper border border-rule text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative h-9 w-9 rounded-md overflow-hidden flex-shrink-0 border border-gold/40 shadow-xs">
                            <Image
                              src={imageUrl}
                              alt="Selected photo"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-bold text-accent tracking-wider block">
                              Active Photo
                            </span>
                            <p className="font-semibold text-ink truncate text-xs">
                              {selectedImageObj?.label || imageUrl}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
                          <Check className="h-3 w-3" /> Selected
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Custom Upload / URL mode */
                  <div className="space-y-3 pt-1">
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
                        <span>{isUploading ? "Uploading…" : "Upload from device"}</span>
                      </button>
                      <span className="text-xs text-muted">or paste direct image URL below:</span>
                    </div>

                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="/images/biryani-mouton.jpg or https://..."
                      className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-1.5 px-3 text-xs text-ink focus:border-accent font-mono"
                    />

                    {imageUrl && (
                      <div className="flex items-center gap-3">
                        <div className="relative h-16 w-24 overflow-hidden rounded-[var(--radius-card)] border border-rule">
                          <Image
                            src={imageUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-xs text-muted">Custom image preview</span>
                      </div>
                    )}
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
