"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "../supabase/client";

export interface AdminProfile {
  email: string;
  name: string;
  role: "Main Admin" | "Manager" | "Kitchen Staff";
}

export const MAIN_ADMIN_CREDENTIALS = {
  email: "amir26hossin@gmail.com",
  password: "Riad@1234",
  name: "Amir Hossin",
  role: "Main Admin" as const,
};

interface AuthContextType {
  user: User | null;
  adminProfile: AdminProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAdminLoggedIn: boolean;
  isMainAdmin: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loginDemo: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoAdmin, setIsDemoAdmin] = useState(false);

  useEffect(() => {
    // Check if session profile was stored
    try {
      const demoStored = sessionStorage.getItem("skp_demo_admin");
      const profileStored = sessionStorage.getItem("skp_admin_profile");
      if (demoStored === "true") {
        setIsDemoAdmin(true);
      }
      if (profileStored) {
        setAdminProfile(JSON.parse(profileStored));
      }
    } catch {
      // ignore
    }

    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user?.email) {
          const isTargetMainAdmin =
            session.user.email.toLowerCase() === MAIN_ADMIN_CREDENTIALS.email.toLowerCase();
          setAdminProfile({
            email: session.user.email,
            name: isTargetMainAdmin
              ? MAIN_ADMIN_CREDENTIALS.name
              : (session.user.user_metadata?.full_name as string) || "Branch Manager",
            role: isTargetMainAdmin ? "Main Admin" : "Manager",
          });
        }
        setIsLoading(false);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user?.email) {
          const isTargetMainAdmin =
            session.user.email.toLowerCase() === MAIN_ADMIN_CREDENTIALS.email.toLowerCase();
          setAdminProfile({
            email: session.user.email,
            name: isTargetMainAdmin
              ? MAIN_ADMIN_CREDENTIALS.name
              : (session.user.user_metadata?.full_name as string) || "Branch Manager",
            role: isTargetMainAdmin ? "Main Admin" : "Manager",
          });
        }
        setIsLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const isTargetMainAdmin = cleanEmail === MAIN_ADMIN_CREDENTIALS.email.toLowerCase();

    // 1. Try Supabase Auth first if configured
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: pass,
        });

        if (!error && data?.user) {
          setUser(data.user);
          setSession(data.session);
          const profile: AdminProfile = {
            email: data.user.email || cleanEmail,
            name: isTargetMainAdmin
              ? MAIN_ADMIN_CREDENTIALS.name
              : (data.user.user_metadata?.full_name as string) || "Branch Manager",
            role: isTargetMainAdmin ? "Main Admin" : "Manager",
          };
          setAdminProfile(profile);
          sessionStorage.setItem("skp_admin_profile", JSON.stringify(profile));
          return { success: true };
        }
      } catch {
        // Fallback to credential check
      }
    }

    // 2. Direct Main Admin verification
    if (isTargetMainAdmin) {
      if (pass === MAIN_ADMIN_CREDENTIALS.password) {
        const profile: AdminProfile = {
          email: MAIN_ADMIN_CREDENTIALS.email,
          name: MAIN_ADMIN_CREDENTIALS.name,
          role: "Main Admin",
        };
        setAdminProfile(profile);
        setIsDemoAdmin(true);
        sessionStorage.setItem("skp_demo_admin", "true");
        sessionStorage.setItem("skp_admin_profile", JSON.stringify(profile));
        return { success: true };
      } else {
        return { success: false, error: "Incorrect password for Main Admin account." };
      }
    }

    // 3. Strict authentication requirement: reject any unverified credentials
    return {
      success: false,
      error: "Invalid email or password. Access is restricted to authorized kitchen administrators.",
    };
  };

  const loginDemo = () => {
    const profile: AdminProfile = {
      email: MAIN_ADMIN_CREDENTIALS.email,
      name: MAIN_ADMIN_CREDENTIALS.name,
      role: "Main Admin",
    };
    setAdminProfile(profile);
    setIsDemoAdmin(true);
    sessionStorage.setItem("skp_demo_admin", "true");
    sessionStorage.setItem("skp_admin_profile", JSON.stringify(profile));
  };

  const logout = async () => {
    setIsDemoAdmin(false);
    setAdminProfile(null);
    try {
      sessionStorage.removeItem("skp_demo_admin");
      sessionStorage.removeItem("skp_admin_profile");
    } catch {}

    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
    setUser(null);
    setSession(null);
  };

  const isMainAdmin = Boolean(
    adminProfile?.role === "Main Admin" ||
      adminProfile?.email?.toLowerCase() === MAIN_ADMIN_CREDENTIALS.email.toLowerCase() ||
      user?.email?.toLowerCase() === MAIN_ADMIN_CREDENTIALS.email.toLowerCase()
  );

  const isAdminLoggedIn = Boolean(user || isDemoAdmin || adminProfile);

  return (
    <AuthContext.Provider
      value={{
        user,
        adminProfile,
        session,
        isLoading,
        isAdminLoggedIn,
        isMainAdmin,
        login,
        logout,
        loginDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
