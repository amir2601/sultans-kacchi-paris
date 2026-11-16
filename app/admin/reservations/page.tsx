"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/auth-context";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Reservation, ReservationStatus } from "@/lib/supabase/types";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Phone,
  Mail,
  Users,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  Trash2,
} from "lucide-react";

export default function AdminReservationsPage() {
  const { isAdminLoggedIn, isLoading: authLoading } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchFilter, setSearchFilter] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const statuses: ReservationStatus[] = ["Confirmed", "Pending", "Cancelled"];

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    loadReservations();

    const handleCreated = () => {
      loadReservations();
    };
    window.addEventListener("skp_reservation_created", handleCreated);
    return () => {
      window.removeEventListener("skp_reservation_created", handleCreated);
    };
  }, [isAdminLoggedIn]);

  const loadReservations = async () => {
    setIsRefreshing(true);
    let loaded: Reservation[] = [];

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("reservations")
          .select("*")
          .order("reservation_date", { ascending: false });

        if (!error && data) {
          loaded = data;
        }
      } catch {}
    }

    try {
      const local: Reservation[] = JSON.parse(
        localStorage.getItem("skp_reservations") || "[]"
      );
      const mergedMap = new Map<string, Reservation>();
      [...local, ...loaded].forEach((res) => {
        if (!mergedMap.has(res.id)) {
          mergedMap.set(res.id, res);
        }
      });
      loaded = Array.from(mergedMap.values()).sort((a, b) => {
        const dateA = `${a.reservation_date} ${a.reservation_time}`;
        const dateB = `${b.reservation_date} ${b.reservation_time}`;
        return dateB.localeCompare(dateA);
      });
    } catch {}

    setReservations(loaded);
    setIsRefreshing(false);
  };

  const handleUpdateStatus = async (resId: string, newStatus: ReservationStatus) => {
    const updated = reservations.map((r) =>
      r.id === resId ? { ...r, status: newStatus } : r
    );
    setReservations(updated);

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from("reservations")
          .update({ status: newStatus })
          .eq("id", resId);
      } catch {}
    }

    try {
      localStorage.setItem("skp_reservations", JSON.stringify(updated));
    } catch {}
  };

  const handleDelete = async (resId: string) => {
    if (!confirm("Are you sure you want to delete this reservation?")) return;

    const filtered = reservations.filter((r) => r.id !== resId);
    setReservations(filtered);

    if (isSupabaseConfigured) {
      try {
        await supabase.from("reservations").delete().eq("id", resId);
      } catch {}
    }

    try {
      localStorage.setItem("skp_reservations", JSON.stringify(filtered));
    } catch {}
  };

  if (authLoading) return null;
  if (!isAdminLoggedIn) {
    return (
      <div className="container py-24 text-center">
        <p className="text-muted">Please sign in as kitchen administrator.</p>
        <Link
          href="/admin/login"
          className="inline-block mt-4 px-6 py-2 rounded-full bg-gold text-charcoal font-semibold text-sm hover:bg-gold-light"
        >
          Sign In
        </Link>
      </div>
    );
  }

  // Filter reservations
  const filteredReservations = reservations.filter((res) => {
    // Status tab filter
    if (activeTab !== "All" && res.status !== activeTab) {
      return false;
    }

    // Date filter
    if (dateFilter === "today" && res.reservation_date !== todayStr) {
      return false;
    }
    if (dateFilter === "upcoming" && res.reservation_date < todayStr) {
      return false;
    }

    // Search query
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchId = res.id.toLowerCase().includes(q);
      const matchName = res.customer_name.toLowerCase().includes(q);
      const matchPhone = res.customer_phone.toLowerCase().includes(q);
      const matchDate = res.reservation_date.toLowerCase().includes(q);
      return matchId || matchName || matchPhone || matchDate;
    }

    return true;
  });

  const totalGuestsToday = reservations
    .filter((r) => r.reservation_date === todayStr && r.status !== "Cancelled")
    .reduce((acc, cur) => acc + (cur.guests_count || 0), 0);

  const confirmedCount = reservations.filter((r) => r.status === "Confirmed").length;
  const pendingCount = reservations.filter((r) => r.status === "Pending").length;

  return (
    <div className="min-h-screen bg-charcoal text-cream font-sans pb-24">
      {/* Top Header */}
      <div className="border-b border-gold/15 bg-charcoal-light/60 backdrop-blur-md sticky top-0 z-30">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2 rounded-lg bg-charcoal border border-gold/20 text-cream/70 hover:text-gold hover:border-gold/40 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-cream flex items-center gap-2">
                Table Reservations
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30">
                  {reservations.length} total
                </span>
              </h1>
              <p className="text-xs text-muted">
                Manage guest table bookings, party sizes, and dining schedules
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadReservations}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gold/20 text-xs text-cream/80 hover:text-gold hover:border-gold transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-gold" : ""}`} />
              Refresh
            </button>
            <Link
              href="/#reservation"
              target="_blank"
              className="px-3.5 py-1.5 rounded-lg bg-gold/15 border border-gold/30 text-gold hover:bg-gold hover:text-charcoal text-xs font-semibold transition-colors"
            >
              Customer Booking Form &rarr;
            </Link>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-charcoal-light border border-gold/15">
            <span className="text-xs text-muted block mb-1">Today's Expected Guests</span>
            <div className="text-2xl font-serif font-bold text-gold flex items-center gap-2">
              <Users className="w-5 h-5 text-gold/70" />
              {totalGuestsToday}
            </div>
            <span className="text-[11px] text-muted block mt-1">
              Active covers for {todayStr}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-charcoal-light border border-gold/15">
            <span className="text-xs text-muted block mb-1">Confirmed Bookings</span>
            <div className="text-2xl font-serif font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400/70" />
              {confirmedCount}
            </div>
            <span className="text-[11px] text-muted block mt-1">Ready for seating</span>
          </div>

          <div className="p-4 rounded-xl bg-charcoal-light border border-gold/15">
            <span className="text-xs text-muted block mb-1">Pending Confirmation</span>
            <div className="text-2xl font-serif font-bold text-amber-400 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400/70" />
              {pendingCount}
            </div>
            <span className="text-[11px] text-muted block mt-1">Needs verification</span>
          </div>

          <div className="p-4 rounded-xl bg-charcoal-light border border-gold/15">
            <span className="text-xs text-muted block mb-1">All Records</span>
            <div className="text-2xl font-serif font-bold text-cream flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-gold/70" />
              {reservations.length}
            </div>
            <span className="text-[11px] text-muted block mt-1">Stored bookings</span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 rounded-2xl bg-charcoal-light border border-gold/15 mb-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Status Tabs */}
            <div className="flex flex-wrap gap-2">
              {["All", "Confirmed", "Pending", "Cancelled"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeTab === tab
                      ? "bg-gold text-charcoal shadow-sm shadow-gold/20"
                      : "bg-charcoal text-cream/70 border border-gold/20 hover:text-gold hover:border-gold/40"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Date Filters */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDateFilter("all")}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                  dateFilter === "all"
                    ? "bg-gold/20 text-gold border border-gold/40"
                    : "text-muted hover:text-cream"
                }`}
              >
                All Dates
              </button>
              <button
                onClick={() => setDateFilter("today")}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                  dateFilter === "today"
                    ? "bg-gold/20 text-gold border border-gold/40"
                    : "text-muted hover:text-cream"
                }`}
              >
                Today Only
              </button>
              <button
                onClick={() => setDateFilter("upcoming")}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                  dateFilter === "upcoming"
                    ? "bg-gold/20 text-gold border border-gold/40"
                    : "text-muted hover:text-cream"
                }`}
              >
                Upcoming
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-gold/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name, phone, reservation ID (e.g. RES-AB12), or date..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-charcoal border border-gold/20 text-cream placeholder:text-muted/60 focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        {/* Reservations List */}
        {filteredReservations.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-charcoal-light border border-gold/10">
            <CalendarDays className="w-12 h-12 text-gold/40 mx-auto mb-3" />
            <h3 className="font-serif text-lg text-cream">No reservations found</h3>
            <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
              {searchFilter
                ? "Try adjusting your search or active filters."
                : "New bookings created from the website will automatically appear here."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReservations.map((res) => {
              const isToday = res.reservation_date === todayStr;

              return (
                <div
                  key={res.id}
                  className={`p-5 rounded-2xl bg-charcoal-light border transition-all duration-200 flex flex-col justify-between ${
                    isToday
                      ? "border-gold shadow-lg shadow-gold/5"
                      : "border-gold/15 hover:border-gold/30"
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-gold px-2 py-0.5 rounded bg-gold/10 border border-gold/20">
                            {res.id}
                          </span>
                          {isToday && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Today
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif text-lg font-bold text-cream mt-1.5">
                          {res.customer_name}
                        </h4>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1 ${
                          res.status === "Confirmed"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : res.status === "Pending"
                            ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                            : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {res.status === "Confirmed" && <CheckCircle2 className="w-3 h-3" />}
                        {res.status === "Pending" && <AlertCircle className="w-3 h-3" />}
                        {res.status === "Cancelled" && <XCircle className="w-3 h-3" />}
                        {res.status}
                      </span>
                    </div>

                    {/* Dining Details */}
                    <div className="space-y-2 p-3 rounded-xl bg-charcoal/60 border border-gold/10 text-xs mb-3">
                      <div className="flex items-center justify-between text-cream/90">
                        <span className="flex items-center gap-2 text-muted">
                          <CalendarDays className="w-3.5 h-3.5 text-gold" />
                          Date:
                        </span>
                        <span className="font-semibold text-cream">
                          {res.reservation_date}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-cream/90">
                        <span className="flex items-center gap-2 text-muted">
                          <Clock className="w-3.5 h-3.5 text-gold" />
                          Time:
                        </span>
                        <span className="font-semibold text-gold">
                          {res.reservation_time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-cream/90">
                        <span className="flex items-center gap-2 text-muted">
                          <Users className="w-3.5 h-3.5 text-gold" />
                          Guests:
                        </span>
                        <span className="font-semibold text-cream">
                          {res.guests_count} {res.guests_count === 1 ? "Person" : "Guests"}
                        </span>
                      </div>
                    </div>

                    {/* Customer Contact */}
                    <div className="space-y-1.5 text-xs text-muted mb-3">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-gold/70 shrink-0" />
                        <a
                          href={`tel:${res.customer_phone}`}
                          className="hover:text-gold transition-colors font-mono"
                        >
                          {res.customer_phone}
                        </a>
                      </div>
                      {res.customer_email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-gold/70 shrink-0" />
                          <a
                            href={`mailto:${res.customer_email}`}
                            className="hover:text-gold transition-colors truncate"
                          >
                            {res.customer_email}
                          </a>
                        </div>
                      )}
                      {res.special_notes && (
                        <div className="pt-2 border-t border-gold/10 flex items-start gap-2 text-cream/80 italic">
                          <FileText className="w-3.5 h-3.5 text-gold/70 shrink-0 mt-0.5" />
                          <span>"{res.special_notes}"</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-gold/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {statuses.map((st) => (
                        <button
                          key={st}
                          onClick={() => handleUpdateStatus(res.id, st)}
                          disabled={res.status === st}
                          className={`text-[11px] px-2 py-1 rounded transition-colors ${
                            res.status === st
                              ? "bg-gold/20 text-gold font-semibold cursor-default"
                              : "bg-charcoal text-muted hover:text-cream hover:bg-charcoal-light border border-gold/10"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handleDelete(res.id)}
                      className="p-1.5 text-muted hover:text-rose-400 rounded transition-colors"
                      title="Delete reservation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
