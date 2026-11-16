"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/auth-context";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Order, MenuItem } from "@/lib/supabase/types";
import { INITIAL_MENU_ITEMS } from "@/lib/data/initial-menu";
import {
  ClipboardList,
  Utensils,
  Euro,
  Clock,
  Plus,
  ArrowRight,
  Settings,
  Sparkles,
  CalendarDays,
} from "lucide-react";

export default function AdminOverviewPage() {
  const { isAdminLoggedIn, adminProfile, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      let loadedOrders: Order[] = [];
      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });
          if (data) loadedOrders = data;
        } catch {}
      }

      try {
        const local = JSON.parse(
          localStorage.getItem("skp_local_orders") || "[]"
        );
        const mergedMap = new Map<string, Order>();
        [...local, ...loadedOrders].forEach((ord: Order) => {
          if (!mergedMap.has(ord.id)) {
            mergedMap.set(ord.id, ord);
          }
        });
        loadedOrders = Array.from(mergedMap.values());
      } catch {}

      setOrders(loadedOrders);

      let loadedMenu: MenuItem[] = INITIAL_MENU_ITEMS;
      try {
        const localMenu = localStorage.getItem("skp_local_menu");
        if (localMenu) loadedMenu = JSON.parse(localMenu);
      } catch {}

      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase
            .from("menu_items")
            .select("*")
            .order("category", { ascending: true });
          if (data && data.length > 0) loadedMenu = data;
        } catch {}
      }
      setMenuItems(loadedMenu);
      setIsLoading(false);
    }

    if (isAdminLoggedIn) {
      loadData();
    }
  }, [isAdminLoggedIn]);

  if (authLoading) {
    return (
      <div className="container py-20 text-center">
        <p className="text-sm text-muted">Checking administrator session…</p>
      </div>
    );
  }

  if (!isAdminLoggedIn) {
    return (
      <div className="container py-24 text-center">
        <div className="mx-auto max-w-md luxury-card p-8">
          <h1 className="font-display text-2xl font-bold text-accent">
            Admin Access Required
          </h1>
          <p className="mt-2 text-sm text-muted">
            Please sign in to access the kitchen orders and menu management dashboard.
          </p>
          <div className="mt-6">
            <Link href="/admin/login" className="btn-primary w-full">
              Go to login page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate real metrics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.status === "Pending" || o.status === "Preparing"
  ).length;
  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.total_amount),
    0
  );
  const activeMenuItemsCount = menuItems.filter((i) => i.is_available).length;

  return (
    <div className="container py-10 space-y-10">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-rule pb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-accent">
            Kitchen Telemetry & Command
          </h1>
          <p className="text-sm text-muted">
            Real-time incoming takeaway orders, menu inventory, and branch configuration.
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-ink-2">
            <span className="font-semibold text-accent">{adminProfile?.name || "Amir Hossin"}</span>
            <span className="text-muted">({adminProfile?.email || "amir26hossin@gmail.com"})</span>
            <span className="rounded bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
              {adminProfile?.role || "Main Admin"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/settings" className="btn-secondary text-xs">
            <Settings className="h-4 w-4" aria-hidden="true" />
            <span>Branch settings</span>
          </Link>
          <Link href="/admin/reservations" className="btn-secondary text-xs">
            <CalendarDays className="h-4 w-4 text-accent" aria-hidden="true" />
            <span>Reservations</span>
          </Link>
          <Link href="/admin/orders" className="btn-secondary text-xs">
            <ClipboardList className="h-4 w-4 text-accent" aria-hidden="true" />
            <span>Orders ({pendingOrders} active)</span>
          </Link>
          <Link href="/admin/menu" className="btn-primary text-xs">
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Manage 46 dishes</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row - Real values, no invented fake stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="luxury-card p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted">Total orders recorded</span>
            <div className="h-8 w-8 rounded-full bg-paper-3 flex items-center justify-center text-accent">
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-accent">
            {isLoading ? "0" : totalOrders}
          </p>
          <span className="mt-1 block text-xs text-muted">
            All customer takeaway requests
          </span>
        </div>

        <div className="luxury-card p-6 border-gold/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted">Active kitchen queue</span>
            <div className="h-8 w-8 rounded-full bg-gold/15 flex items-center justify-center text-gold-dark">
              <Clock className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-gold-dark">
            {isLoading ? "0" : pendingOrders}
          </p>
          <span className="mt-1 block text-xs text-muted">
            Pending or preparing right now
          </span>
        </div>

        <div className="luxury-card p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted">Active menu dishes</span>
            <div className="h-8 w-8 rounded-full bg-paper-3 flex items-center justify-center text-accent">
              <Utensils className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-accent">
            {isLoading ? "0" : activeMenuItemsCount}
          </p>
          <span className="mt-1 block text-xs text-muted">
            Of {menuItems.length} catalog items
          </span>
        </div>

        <div className="luxury-card p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted">Recorded gross value</span>
            <div className="h-8 w-8 rounded-full bg-paper-3 flex items-center justify-center text-accent">
              <Euro className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-accent">
            {isLoading ? "€0.00" : `€${totalRevenue.toFixed(2)}`}
          </p>
          <span className="mt-1 block text-xs text-muted">
            Pay on pickup volume
          </span>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="luxury-card p-6 md:p-8">
        <div className="flex items-center justify-between border-b border-rule pb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-accent">
              Recent Takeaway Orders
            </h2>
            <p className="text-xs text-muted">
              Live submissions from Paris pickup customers.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-xs text-accent font-semibold hover:underline"
          >
            <span>View all orders</span>
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted">
            No takeaway orders recorded yet today.
          </div>
        ) : (
          <div className="mt-4 divide-y divide-rule-subtle">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ink">{order.customer_name}</span>
                    <span className="text-xs text-muted font-mono">({order.id})</span>
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    Pickup: <span className="font-semibold text-ink-2">{order.pickup_time}</span> ·{" "}
                    {order.items_json?.length || 0} specialties
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-display text-base font-bold text-accent">
                    €{Number(order.total_amount).toFixed(2)}
                  </span>
                  <span
                    className={`rounded-[var(--radius-card)] px-2.5 py-0.5 text-xs font-semibold ${
                      order.status === "Ready"
                        ? "bg-success/15 text-success border border-success/30"
                        : order.status === "Preparing"
                        ? "bg-gold/20 text-accent-dark border border-gold/40"
                        : order.status === "Completed"
                        ? "bg-paper-3 text-muted border border-rule-subtle"
                        : "bg-accent/10 text-accent border border-accent/20"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
