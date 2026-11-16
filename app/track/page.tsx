"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Order, OrderStatus } from "@/lib/supabase/types";
import { useSettings } from "@/lib/context/settings-context";
import {
  Search,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ChefHat,
  ShoppingBag,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const { settings } = useSettings();
  const [orderIdInput, setOrderIdInput] = useState("");
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Load recent local orders
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("skp_local_orders") || "[]");
      setRecentOrders(stored);
      
      const queryId = searchParams.get("id");
      if (queryId) {
        setOrderIdInput(queryId);
        searchOrderById(queryId);
      } else if (stored.length > 0) {
        setOrderIdInput(stored[0].id);
        setCurrentOrder(stored[0]);
      }
    } catch {}
  }, [searchParams]);

  const searchOrderById = async (id: string) => {
    const cleanId = id.trim();
    if (!cleanId) return;

    setIsSearching(true);
    setErrorNotice(null);

    let found: Order | null = null;

    // Check Supabase first if configured
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .or(`id.eq.${cleanId},id.ilike.%${cleanId}%`)
          .single();

        if (!error && data) {
          found = data as Order;
        }
      } catch {}
    }

    // Fallback to local storage
    if (!found) {
      try {
        const local: Order[] = JSON.parse(
          localStorage.getItem("skp_local_orders") || "[]"
        );
        found =
          local.find(
            (o) =>
              o.id.toLowerCase() === cleanId.toLowerCase() ||
              o.id.toLowerCase().includes(cleanId.toLowerCase())
          ) || null;
      } catch {}
    }

    if (found) {
      setCurrentOrder(found);
    } else {
      setErrorNotice(
        `Order "${cleanId}" could not be located. Please verify your reference code or ask at the takeaway counter.`
      );
    }
    setIsSearching(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchOrderById(orderIdInput);
  };

  const statusSteps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: "Pending", label: "Kitchen Queued", desc: "Order recorded in Paris kitchen system" },
    { key: "Preparing", label: "In Kitchen", desc: "Dum deg opened and dishes packed hot" },
    { key: "Ready", label: "Ready for Pickup", desc: "Waiting for you at 28 Rue du Faubourg Saint-Denis" },
    { key: "Completed", label: "Collected", desc: "Handed over to customer" },
  ];

  const getStepState = (stepKey: OrderStatus) => {
    if (!currentOrder) return "pending";
    const statusOrder: OrderStatus[] = ["Pending", "Preparing", "Ready", "Completed"];
    const currentIndex = statusOrder.indexOf(currentOrder.status);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (currentOrder.status === "Cancelled") return "cancelled";
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="container py-12 md:py-16 max-w-4xl">
      {/* Top Navigation */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent font-medium transition-colors duration-short"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Return to Paris menu</span>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full border border-gold/40 bg-paper-2 text-accent mb-3 shadow-sm">
          <ChefHat className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink">
          Track Your Takeaway Order
        </h1>
        <p className="mt-2 text-sm text-muted">
          Enter your unique order reference code below to check live kitchen preparation status.
        </p>
      </div>

      {/* Search Bar */}
      <div className="luxury-card p-6 md:p-8 mb-10">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted pointer-events-none" aria-hidden="true" />
            <input
              type="text"
              required
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              placeholder="Enter your Order ID (e.g. skp-l89x...)"
              className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-accent focus-visible:outline-2 focus-visible:outline-focus"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="btn-primary"
          >
            {isSearching ? "Searching…" : "Track live status"}
          </button>
        </form>

        {errorNotice && (
          <div className="mt-4 flex items-center gap-2 rounded-[var(--radius-card)] border border-error/30 bg-error/10 p-3 text-xs text-error">
            <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span>{errorNotice}</span>
          </div>
        )}

        {/* Recent orders pill selector */}
        {recentOrders.length > 0 && (
          <div className="mt-6 border-t border-rule-subtle pt-4">
            <span className="text-xs text-muted block mb-2">Recent orders from this device:</span>
            <div className="flex flex-wrap gap-2">
              {recentOrders.map((ord) => (
                <button
                  key={ord.id}
                  type="button"
                  onClick={() => {
                    setOrderIdInput(ord.id);
                    searchOrderById(ord.id);
                  }}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors duration-short ${
                    currentOrder?.id === ord.id
                      ? "border-accent bg-accent text-white font-semibold"
                      : "border-rule bg-paper-2 text-ink-2 hover:border-accent hover:text-accent"
                  }`}
                >
                  {ord.id.slice(0, 8)}… (€{Number(ord.total_amount).toFixed(2)})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Order Status Display Card */}
      {currentOrder && (
        <div className="luxury-card p-6 md:p-10 space-y-8">
          
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-rule pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">Order reference</span>
                <span className="font-mono text-xs font-bold text-accent bg-paper-3 px-2 py-0.5 rounded border border-rule">
                  {currentOrder.id}
                </span>
              </div>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
                {currentOrder.customer_name}
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Contact: {currentOrder.customer_phone}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => searchOrderById(currentOrder.id)}
                className="btn-secondary text-xs"
                title="Refresh order telemetry"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Refresh</span>
              </button>
              <div className="text-right">
                <span className="text-xs text-muted block">Takeaway total</span>
                <span className="font-display text-2xl font-bold text-accent">
                  €{Number(currentOrder.total_amount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Timeline */}
          <div>
            <h3 className="text-xs font-semibold text-muted mb-6">
              Live preparation progress
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {statusSteps.map((st, idx) => {
                const state = getStepState(st.key);
                const isCurrent = state === "current";
                const isCompleted = state === "completed";

                return (
                  <div
                    key={st.key}
                    className={`rounded-[var(--radius-card)] p-4 border transition-colors duration-short ${
                      isCurrent
                        ? "border-accent bg-accent/5 ring-1 ring-accent"
                        : isCompleted
                        ? "border-success/40 bg-success/5"
                        : "border-rule-subtle bg-paper-3/40"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                          isCompleted
                            ? "bg-success text-white"
                            : isCurrent
                            ? "bg-accent text-white"
                            : "bg-paper-2 text-muted border border-rule"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          isCurrent ? "text-accent" : isCompleted ? "text-success" : "text-muted"
                        }`}
                      >
                        {st.label}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-muted leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {currentOrder.status === "Ready" && (
              <div className="mt-6 rounded-[var(--radius-card)] border border-gold bg-gold/10 p-4 text-center">
                <p className="font-display text-lg font-medium text-accent">
                  Your order is packed hot and ready for collection!
                </p>
                <p className="text-xs text-muted mt-1">
                  Please proceed to the takeaway counter at 28 Rue du Faubourg Saint-Denis, 75010 Paris.
                </p>
              </div>
            )}
          </div>

          {/* Details & Location Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-rule pt-6">
            {/* Ordered Dishes Summary */}
            <div>
              <h4 className="font-display text-base font-semibold text-ink mb-3">
                Dishes in this order
              </h4>
              <div className="space-y-2 border border-rule-subtle rounded-[var(--radius-card)] p-4 bg-paper-3/30 text-sm">
                {currentOrder.items_json?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="font-medium text-ink">
                      {item.name} <span className="text-accent font-bold">x{item.quantity}</span>
                    </span>
                    <span className="font-mono text-muted">
                      €{(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-rule-subtle pt-2 mt-2 flex justify-between font-bold text-sm text-ink">
                  <span>Total (TVA incluse)</span>
                  <span className="text-accent">€{Number(currentOrder.total_amount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Collection Counter Details */}
            <div>
              <h4 className="font-display text-base font-semibold text-ink mb-3">
                Collection details
              </h4>
              <div className="space-y-3 border border-rule-subtle rounded-[var(--radius-card)] p-4 bg-paper-3/30 text-xs">
                <div className="flex items-start gap-2.5">
                  <Clock className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-medium text-ink block">Scheduled pickup slot</span>
                    <span className="text-muted">{currentOrder.pickup_time}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-medium text-ink block">{settings.name}</span>
                    <span className="text-muted leading-relaxed block">{settings.address}</span>
                    <span className="text-muted block mt-0.5">Métro: {settings.metro}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <ShoppingBag className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-medium text-ink block">Payment notice</span>
                    <span className="text-muted">Pay at pickup counter (Cards & Cash accepted).</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <main className="min-h-screen bg-paper text-ink flex flex-col justify-between">
      <Navbar />
      <div className="flex-1">
        <Suspense fallback={<div className="container py-20 text-center text-sm text-muted">Loading order tracker…</div>}>
          <TrackOrderContent />
        </Suspense>
      </div>
      <Footer />
      <CartDrawer />
    </main>
  );
}
