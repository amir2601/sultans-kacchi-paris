"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/auth-context";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Order, OrderStatus } from "@/lib/supabase/types";
import {
  ArrowLeft,
  Clock,
  Phone,
  RefreshCw,
  Search,
  ExternalLink,
} from "lucide-react";

export default function AdminOrdersPage() {
  const { isAdminLoggedIn, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  const statuses: OrderStatus[] = ["Pending", "Preparing", "Ready", "Completed", "Cancelled"];

  useEffect(() => {
    loadOrders();

    const handleOrderCreated = () => {
      loadOrders();
    };
    window.addEventListener("skp_order_created", handleOrderCreated);
    return () => {
      window.removeEventListener("skp_order_created", handleOrderCreated);
    };
  }, [isAdminLoggedIn]);

  const loadOrders = async () => {
    setIsRefreshing(true);
    let loaded: Order[] = [];

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          loaded = data;
        }
      } catch {}
    }

    try {
      const local = JSON.parse(
        localStorage.getItem("skp_local_orders") || "[]"
      );
      const mergedMap = new Map<string, Order>();
      [...local, ...loaded].forEach((ord: Order) => {
        if (!mergedMap.has(ord.id)) {
          mergedMap.set(ord.id, ord);
        }
      });
      loaded = Array.from(mergedMap.values());
    } catch {}

    setOrders(loaded);
    setIsRefreshing(false);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    setOrders(updated);

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from("orders")
          .update({ status: newStatus })
          .eq("id", orderId);
      } catch {}
    }

    try {
      localStorage.setItem("skp_local_orders", JSON.stringify(updated));
    } catch {}

    // Dispatch update for track page synchronization
    window.dispatchEvent(new Event("skp_order_updated"));
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

  const filteredOrders = orders.filter((o) => {
    const matchesTab = activeTab === "All" || o.status === activeTab;
    const matchesSearch =
      o.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      o.customer_phone.includes(searchFilter);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="container py-10 space-y-8">
      
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
          <h1 className="mt-2 font-display text-2xl font-bold text-accent">
            Live Takeaway Order Queue
          </h1>
          <p className="text-sm text-muted">
            Progress customer orders in real-time. Changes instantly reflect on customer live tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-[var(--radius-card)] border border-rule bg-paper-2 p-1 text-xs">
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={`rounded-[var(--radius-card)] px-3 py-1 font-semibold transition-colors duration-short ${
                viewMode === "kanban"
                  ? "bg-accent text-white shadow-xs"
                  : "text-muted hover:text-ink"
              }`}
            >
              Kanban
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`rounded-[var(--radius-card)] px-3 py-1 font-semibold transition-colors duration-short ${
                viewMode === "list"
                  ? "bg-accent text-white shadow-xs"
                  : "text-muted hover:text-ink"
              }`}
            >
              List view
            </button>
          </div>

          <button
            type="button"
            onClick={loadOrders}
            disabled={isRefreshing}
            className="btn-secondary text-xs"
            title="Refresh orders"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search and Tabs Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2" role="tablist">
          {["All", ...statuses].map((status) => {
            const count =
              status === "All"
                ? orders.length
                : orders.filter((o) => o.status === status).length;
            const isActive = activeTab === status;

            return (
              <button
                key={status}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(status)}
                className={`rounded-[var(--radius-card)] px-3.5 py-1.5 text-xs font-semibold transition-colors duration-short ${
                  isActive
                    ? "bg-accent text-white shadow-xs"
                    : "bg-paper-2 text-ink-2 hover:bg-paper-3 border border-rule"
                }`}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted pointer-events-none" aria-hidden="true" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search by ID, name or phone…"
            className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-1.5 pl-8 pr-3 text-xs text-ink focus:border-accent"
          />
        </div>
      </div>

      {/* Kanban Board View - Single containment layer for cards */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(["Pending", "Preparing", "Ready", "Completed"] as OrderStatus[]).map(
            (colStatus) => {
              const colOrders = filteredOrders.filter((o) => o.status === colStatus);

              return (
                <div
                  key={colStatus}
                  className="rounded-[var(--radius-card)] border border-rule bg-paper-3/50 flex flex-col p-4 min-h-[500px]"
                >
                  <div className="flex items-center justify-between border-b border-rule pb-3 mb-4">
                    <span className="font-display text-sm font-bold text-accent">
                      {colStatus}
                    </span>
                    <span className="rounded-full bg-paper px-2 py-0.5 text-xs font-bold text-accent border border-rule">
                      {colOrders.length}
                    </span>
                  </div>

                  <div className="space-y-4 flex-1 overflow-y-auto">
                    {colOrders.length === 0 ? (
                      <p className="py-8 text-center text-xs text-muted">
                        No orders in {colStatus.toLowerCase()}
                      </p>
                    ) : (
                      colOrders.map((order) => (
                        <div
                          key={order.id}
                          className="luxury-card p-4 space-y-3 shadow-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-ink text-sm">
                                  {order.customer_name}
                                </span>
                                <Link
                                  href={`/track?id=${order.id}`}
                                  target="_blank"
                                  className="text-[10px] text-accent hover:underline flex items-center gap-0.5"
                                  title="Customer tracking link"
                                >
                                  <ExternalLink className="h-2.5 w-2.5" aria-hidden="true" />
                                </Link>
                              </div>
                              <a
                                href={`tel:${order.customer_phone}`}
                                className="text-xs text-muted hover:text-accent flex items-center gap-1 mt-0.5"
                              >
                                <Phone className="h-3 w-3 text-gold-dark" aria-hidden="true" />
                                <span>{order.customer_phone}</span>
                              </a>
                            </div>
                            <span className="font-display text-base font-bold text-accent">
                              €{Number(order.total_amount).toFixed(2)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-1.5 text-xs text-ink-2 bg-paper-3/60 p-2 rounded-[var(--radius-card)] border border-rule-subtle">
                            <span className="font-mono text-[11px] font-bold text-accent">{order.id}</span>
                            <div className="flex items-center gap-1 text-muted">
                              <Clock className="h-3 w-3 text-gold" aria-hidden="true" />
                              <span>{order.pickup_time}</span>
                            </div>
                          </div>

                          {/* Ordered Items summary */}
                          <div className="space-y-1 text-xs text-muted border-t border-rule-subtle pt-2">
                            {order.items_json?.map((it, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span className="line-clamp-1">{it.name}</span>
                                <span className="font-bold text-accent ml-2">x{it.quantity}</span>
                              </div>
                            ))}
                          </div>

                          {/* Quick Status Progression */}
                          <div className="border-t border-rule-subtle pt-2 flex items-center justify-between gap-2">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleUpdateStatus(order.id, e.target.value as OrderStatus)
                              }
                              className="w-full text-xs rounded-[var(--radius-card)] border border-rule bg-paper py-1.5 px-2 text-ink font-semibold focus:border-accent"
                            >
                              {statuses.map((st) => (
                                <option key={st} value={st}>
                                  Status: {st}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      ) : (
        /* List View */
        <div className="luxury-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-ink-2">
              <thead className="border-b border-rule bg-paper-3 text-xs text-muted font-semibold">
                <tr>
                  <th className="p-4">Order ID & Customer</th>
                  <th className="p-4">Pickup Time</th>
                  <th className="p-4">Dishes</th>
                  <th className="p-4">Total (€)</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule-subtle">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-sm text-muted">
                      No orders found matching this filter.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-paper-3/40 transition-colors duration-short">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-accent">{order.id}</span>
                          <span className="font-bold text-ink">{order.customer_name}</span>
                        </div>
                        <p className="text-xs text-muted">{order.customer_phone}</p>
                      </td>
                      <td className="p-4 text-xs font-semibold text-ink">
                        {order.pickup_time}
                      </td>
                      <td className="p-4 text-xs">
                        {order.items_json?.map((it, idx) => (
                          <div key={idx} className="line-clamp-1">
                            {it.name} <span className="text-accent font-bold">x{it.quantity}</span>
                          </div>
                        ))}
                      </td>
                      <td className="p-4 font-display font-bold text-accent text-base">
                        €{Number(order.total_amount).toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`rounded-[var(--radius-card)] px-2.5 py-1 text-xs font-semibold ${
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
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleUpdateStatus(order.id, e.target.value as OrderStatus)
                          }
                          className="text-xs rounded-[var(--radius-card)] border border-rule bg-paper py-1.5 px-2 text-ink font-semibold focus:border-accent"
                        >
                          {statuses.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
