"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/context/auth-context";
import { Crown, Lock, Mail, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAdminLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (isAdminLoggedIn) {
    router.push("/admin");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      router.push("/admin");
    } else {
      setErrorMessage(res.error || "Authentication failed. Please verify your credentials.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-12">
      <div className="w-full max-w-md luxury-card p-8 border-gold/50 shadow-xl">
        
        {/* Top Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[var(--radius-card)] border border-gold/50 bg-paper-2 text-accent shadow-sm">
            <Crown className="h-7 w-7 text-gold" aria-hidden="true" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-accent">
            Kitchen Administration
          </h1>
          <p className="mt-1 text-xs text-muted font-medium">
            Sultan’s Kacchi Paris · Management System
          </p>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="mt-6 rounded-[var(--radius-card)] border border-error/30 bg-error/10 p-3 text-xs text-error font-medium">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-xs font-semibold text-ink-2 mb-1">
              Admin email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted" aria-hidden="true" />
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sultanskacchi.fr"
                className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 pl-9 pr-3 text-xs text-ink placeholder:text-muted focus:border-accent focus-visible:outline-2 focus-visible:outline-focus"
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-xs font-semibold text-ink-2 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted" aria-hidden="true" />
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-[var(--radius-card)] border border-rule bg-paper py-2 pl-9 pr-3 text-xs text-ink placeholder:text-muted focus:border-accent focus-visible:outline-2 focus-visible:outline-focus"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full"
            >
              {isSubmitting ? "Authenticating…" : "Sign in to dashboard"}
            </button>
          </div>
        </form>

        {/* Return Home */}
        <div className="mt-8 border-t border-rule pt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent font-medium transition-colors duration-short"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Return to public website</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
