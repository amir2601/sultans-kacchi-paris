"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/lib/context/auth-context";
import {
  UtensilsCrossed,
  LayoutDashboard,
  Utensils,
  ClipboardList,
  Settings,
  LogOut,
  ExternalLink,
  Crown,
} from "lucide-react";

function AdminNav() {
  const pathname = usePathname();
  const { isAdminLoggedIn, adminProfile, logout } = useAuth();

  if (pathname === "/admin/login") {
    return null;
  }

  return (
    <header className="sticky top-0 z-[var(--z-sticky-nav)] border-b border-rule bg-paper-2 shadow-sm">
      <div className="container flex h-14 sm:h-16 items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link
            href="/admin"
            className="flex items-center gap-2 font-display text-base sm:text-lg font-bold text-accent"
          >
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-[var(--radius-card)] border border-gold/40 bg-paper text-gold shadow-xs">
              <UtensilsCrossed className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            </div>
            <span>Sultan’s Paris Admin</span>
          </Link>

          {/* Navigation Links - Desktop */}
          {isAdminLoggedIn && (
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 rounded-[var(--radius-card)] px-3 py-1.5 transition-colors duration-short ${
                  pathname === "/admin"
                    ? "bg-accent text-white font-semibold shadow-xs"
                    : "text-muted hover:text-ink hover:bg-paper-3"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                <span>Overview</span>
              </Link>

              <Link
                href="/admin/orders"
                className={`flex items-center gap-1.5 rounded-[var(--radius-card)] px-3 py-1.5 transition-colors duration-short ${
                  pathname === "/admin/orders"
                    ? "bg-accent text-white font-semibold shadow-xs"
                    : "text-muted hover:text-ink hover:bg-paper-3"
                }`}
              >
                <ClipboardList className="h-4 w-4" aria-hidden="true" />
                <span>Orders</span>
              </Link>

              <Link
                href="/admin/menu"
                className={`flex items-center gap-1.5 rounded-[var(--radius-card)] px-3 py-1.5 transition-colors duration-short ${
                  pathname === "/admin/menu"
                    ? "bg-accent text-white font-semibold shadow-xs"
                    : "text-muted hover:text-ink hover:bg-paper-3"
                }`}
              >
                <Utensils className="h-4 w-4" aria-hidden="true" />
                <span>Menu items</span>
              </Link>

              <Link
                href="/admin/settings"
                className={`flex items-center gap-1.5 rounded-[var(--radius-card)] px-3 py-1.5 transition-colors duration-short ${
                  pathname === "/admin/settings"
                    ? "bg-accent text-white font-semibold shadow-xs"
                    : "text-muted hover:text-ink hover:bg-paper-3"
                }`}
              >
                <Settings className="h-4 w-4" aria-hidden="true" />
                <span>Settings</span>
              </Link>
            </nav>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Identity Badge */}
          {isAdminLoggedIn && (
            <div className="hidden lg:flex items-center gap-2 rounded-[var(--radius-card)] border border-gold/40 bg-paper px-2.5 py-1 text-xs">
              <Crown className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              <span className="font-semibold text-ink-2 truncate max-w-[160px]">
                {adminProfile?.email || "amir26hossin@gmail.com"}
              </span>
              <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
                {adminProfile?.role || "Main Admin"}
              </span>
            </div>
          )}

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1 text-xs text-muted hover:text-accent font-medium transition-colors duration-short px-2 py-1 rounded hover:bg-paper-3"
          >
            <span>Live site</span>
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </Link>

          {isAdminLoggedIn && (
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1 rounded-[var(--radius-card)] border border-rule-subtle px-2.5 py-1 text-xs text-muted hover:text-error hover:border-error transition-colors duration-short"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          )}
        </div>

      </div>

      {/* Mobile Sub-Navigation Bar for Admin */}
      {isAdminLoggedIn && (
        <div className="md:hidden border-t border-rule bg-paper px-3 py-1.5 overflow-x-auto scrollbar-none flex items-center gap-1 text-xs">
          <Link
            href="/admin"
            className={`px-3 py-1.5 rounded-[var(--radius-card)] whitespace-nowrap flex items-center gap-1.5 ${
              pathname === "/admin"
                ? "bg-accent text-white font-semibold shadow-xs"
                : "text-muted hover:text-ink hover:bg-paper-3"
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Overview</span>
          </Link>

          <Link
            href="/admin/orders"
            className={`px-3 py-1.5 rounded-[var(--radius-card)] whitespace-nowrap flex items-center gap-1.5 ${
              pathname === "/admin/orders"
                ? "bg-accent text-white font-semibold shadow-xs"
                : "text-muted hover:text-ink hover:bg-paper-3"
            }`}
          >
            <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Orders</span>
          </Link>

          <Link
            href="/admin/menu"
            className={`px-3 py-1.5 rounded-[var(--radius-card)] whitespace-nowrap flex items-center gap-1.5 ${
              pathname === "/admin/menu"
                ? "bg-accent text-white font-semibold shadow-xs"
                : "text-muted hover:text-ink hover:bg-paper-3"
            }`}
          >
            <Utensils className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Menu items</span>
          </Link>

          <Link
            href="/admin/settings"
            className={`px-3 py-1.5 rounded-[var(--radius-card)] whitespace-nowrap flex items-center gap-1.5 ${
              pathname === "/admin/settings"
                ? "bg-accent text-white font-semibold shadow-xs"
                : "text-muted hover:text-ink hover:bg-paper-3"
            }`}
          >
            <Settings className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Settings</span>
          </Link>
        </div>
      )}
    </header>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-paper text-ink flex flex-col">
        <AdminNav />
        <main className="flex-1">{children}</main>
      </div>
    </AuthProvider>
  );
}
