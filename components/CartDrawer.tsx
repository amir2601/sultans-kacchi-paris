"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/context/cart-context";
import { useSettings } from "@/lib/context/settings-context";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { X, Trash2, Plus, Minus, ShoppingBag, Clock, User, Phone, CheckCircle2, ArrowRight } from "lucide-react";

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalAmount,
    totalItems,
    isCartOpen,
    closeCart,
  } = useCart();

  const { settings } = useSettings();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{
    orderId: string;
    name: string;
    time: string;
    total: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Lock body scroll when cart drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !pickupTime) {
      setErrorMessage("Please complete your name, phone number, and pickup time.");
      return;
    }

    if (items.length === 0) {
      setErrorMessage("Your takeaway bag is empty.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    // Generate unique human-readable Order ID e.g. SKP-7K92
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const createdId = `SKP-${randomSuffix}`;

    const orderPayload = {
      id: createdId,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      pickup_time: pickupTime,
      items_json: items.map((i) => ({
        id: i.item.id,
        name: i.item.name,
        price: Number(i.item.price),
        quantity: i.quantity,
      })),
      total_amount: Number(totalAmount.toFixed(2)),
      status: "Pending",
    };

    try {
      if (isSupabaseConfigured) {
        try {
          await supabase.from("orders").insert([orderPayload]);
        } catch {
          // fallback to local
        }
      }

      // Record in local storage
      const existingLocalOrders = JSON.parse(
        localStorage.getItem("skp_local_orders") || "[]"
      );
      const newOrderWithMeta = {
        ...orderPayload,
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(
        "skp_local_orders",
        JSON.stringify([newOrderWithMeta, ...existingLocalOrders])
      );

      // Trigger custom storage event for sync
      window.dispatchEvent(new Event("skp_order_created"));

      setOrderSuccess({
        orderId: createdId,
        name: customerName,
        time: pickupTime,
        total: totalAmount,
      });

      clearCart();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to record order. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setOrderSuccess(null);
    setCustomerName("");
    setCustomerPhone("");
    setPickupTime("");
    closeCart();
  };

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex justify-end bg-[var(--color-scrim)] backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCart();
      }}
    >
      <div className="flex h-[100dvh] w-full max-w-lg flex-col justify-between border-l border-rule bg-paper p-5 sm:p-6 md:p-8 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rule pb-4 flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-card)] bg-paper-2 border border-gold/40 text-accent">
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-gold" aria-hidden="true" />
            </div>
            <div>
              <h2 id="cart-drawer-title" className="font-display text-lg sm:text-xl font-bold text-accent">
                Takeaway Bag
              </h2>
              <span className="text-xs text-muted">
                {totalItems} {totalItems === 1 ? "specialty" : "specialties"} selected
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close takeaway bag"
            className="rounded-[var(--radius-card)] p-2 text-muted hover:text-accent hover:bg-paper-3 focus-visible:outline-2 focus-visible:outline-focus min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content Body */}
        {orderSuccess ? (
          <div className="my-auto py-6 sm:py-8 text-center flex flex-col items-center">
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-success/10 border border-success/30 text-success mb-3 sm:mb-4">
              <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-accent">
              Order Confirmed for Pickup
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-ink-2 max-w-[38ch]">
              Thank you, {orderSuccess.name}. Your royal takeaway is scheduled for {orderSuccess.time}.
            </p>

            <div className="mt-5 sm:mt-6 w-full rounded-[var(--radius-card)] border border-rule bg-paper-2 p-4 sm:p-5 text-left text-xs sm:text-sm space-y-2.5 shadow-xs">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted">Order reference</span>
                <span className="font-mono text-xs font-bold text-accent bg-paper-3 px-2 py-0.5 rounded border border-rule">
                  {orderSuccess.orderId}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted">Payment mode</span>
                <span className="font-medium text-ink">Pay on Pickup (Cash or Card)</span>
              </div>
              <div className="flex justify-between font-bold border-t border-rule-subtle pt-2 text-sm sm:text-base text-ink">
                <span>Total to pay</span>
                <span className="text-accent">€{orderSuccess.total.toFixed(2)}</span>
              </div>
            </div>

            <p className="mt-4 text-xs text-muted">
              Collection counter: {settings.address}
            </p>

            <div className="mt-6 w-full space-y-2.5 sm:space-y-3">
              <Link
                href={`/track?id=${orderSuccess.orderId}`}
                onClick={closeCart}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3"
              >
                <span>Track live order preparation</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={handleReset}
                className="btn-secondary w-full text-xs py-2.5"
              >
                Close and return to menu
              </button>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="my-auto py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-paper-2 border border-rule text-muted mb-3">
              <ShoppingBag className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="font-display text-lg font-bold text-accent">Your bag is empty</p>
            <p className="mt-2 text-xs text-muted max-w-[34ch] mx-auto">
              Explore our Paris menu and add authentic Kacchi, Polau, or Party Banquets.
            </p>
            <button
              type="button"
              onClick={closeCart}
              className="mt-6 btn-outline text-xs"
            >
              Browse Paris specialties
            </button>
          </div>
        ) : (
          <div className="flex-1 py-4 sm:py-6 space-y-5 sm:space-y-6 overflow-y-auto">
            
            {/* Items List */}
            <div className="space-y-2.5 sm:space-y-3 max-h-[32vh] overflow-y-auto pr-1">
              {items.map(({ item, quantity }) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2.5 sm:gap-3 rounded-[var(--radius-card)] border border-rule bg-paper-2 p-2.5 sm:p-3 text-sm shadow-xs"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-ink truncate text-xs sm:text-sm">{item.name}</p>
                    <p className="text-[11px] text-muted">€{Number(item.price).toFixed(2)} each</p>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, quantity - 1)}
                      aria-label={`Reduce quantity of ${item.name}`}
                      className="rounded-[var(--radius-card)] border border-rule p-1 sm:p-1.5 hover:bg-paper-3 text-ink-2 min-w-[30px] min-h-[30px] flex items-center justify-center"
                    >
                      <Minus className="h-3 w-3" aria-hidden="true" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-accent">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, quantity + 1)}
                      aria-label={`Increase quantity of ${item.name}`}
                      className="rounded-[var(--radius-card)] border border-rule p-1 sm:p-1.5 hover:bg-paper-3 text-ink-2 min-w-[30px] min-h-[30px] flex items-center justify-center"
                    >
                      <Plus className="h-3 w-3" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="ml-1 text-muted hover:text-error transition-colors p-1 min-w-[28px] min-h-[28px] flex items-center justify-center"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Summary */}
            <div className="border-t border-rule pt-3 sm:pt-4">
              <div className="flex items-center justify-between text-sm sm:text-base font-bold">
                <span className="text-ink">Total takeaway amount</span>
                <span className="font-display text-xl sm:text-2xl text-accent">€{totalAmount.toFixed(2)}</span>
              </div>
              <p className="mt-1 text-[11px] sm:text-xs text-muted">
                Pay on pickup at the counter. All prices include French TVA & service charges.
              </p>
            </div>

            {/* Customer Details Form */}
            <form onSubmit={handleSubmitOrder} className="space-y-3 sm:space-y-3.5 border-t border-rule pt-4">
              {errorMessage && (
                <div className="rounded-[var(--radius-card)] border border-error bg-error/10 p-2.5 text-xs text-error font-medium">
                  {errorMessage}
                </div>
              )}

              <div>
                <label htmlFor="customer-name" className="block text-xs font-semibold text-ink-2 mb-1">
                  Customer full name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted" aria-hidden="true" />
                  <input
                    id="customer-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Jean Dupont"
                    className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 pl-9 pr-3 text-base sm:text-xs text-ink placeholder:text-muted focus:border-accent focus-visible:outline-2 focus-visible:outline-focus"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="customer-phone" className="block text-xs font-semibold text-ink-2 mb-1">
                  Phone number (for pickup SMS)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted" aria-hidden="true" />
                  <input
                    id="customer-phone"
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. +33 6 12 34 56 78"
                    className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 pl-9 pr-3 text-base sm:text-xs text-ink placeholder:text-muted focus:border-accent focus-visible:outline-2 focus-visible:outline-focus"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="pickup-time" className="block text-xs font-semibold text-ink-2 mb-1">
                  Requested pickup slot
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted pointer-events-none" aria-hidden="true" />
                  <select
                    id="pickup-time"
                    required
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 pl-9 pr-3 text-base sm:text-xs text-ink focus:border-accent focus-visible:outline-2 focus-visible:outline-focus"
                  >
                    <option value="">Select pickup time…</option>
                    {settings.pickupSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-3 text-xs sm:text-sm font-bold min-h-[44px]"
                >
                  {isSubmitting ? "Submitting order…" : `Confirm takeaway order (€${totalAmount.toFixed(2)})`}
                </button>
              </div>
            </form>

          </div>
        )}

        {/* Footer info note */}
        <div className="border-t border-rule pt-3 sm:pt-4 text-center flex-shrink-0">
          <p className="text-[11px] sm:text-xs text-muted">
            Pay on pickup at {settings.address.split(",")[0]}, 75010 Paris
          </p>
        </div>

      </div>
    </div>
  );
}
