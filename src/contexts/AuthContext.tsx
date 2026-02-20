"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type Role = "admin" | "student";

type AuthState = {
  session: Session | null;
  user: User | null;
  role: Role;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

async function fetchRole(userId: string, email?: string | null): Promise<Role> {
  try {
    // Primary: match by auth user id
    const { data: byId, error: byIdError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (byIdError) {
      console.error("[Auth] Error fetching profile by ID:", byIdError);
    }

    const roleFromId = byId?.role?.toLowerCase().trim();
    if (roleFromId === "admin") {
      console.log("[Auth] Admin role confirmed by ID");
      return "admin";
    }

    // Fallback: match by email
    if (email) {
      const { data: byEmail, error: byEmailError } = await supabase
        .from("profiles")
        .select("role")
        .eq("email", email)
        .maybeSingle();

      if (byEmailError) {
        console.error("[Auth] Error fetching profile by email:", byEmailError);
      }

      const roleFromEmail = byEmail?.role?.toLowerCase().trim();
      if (roleFromEmail === "admin") {
        console.log("[Auth] Admin role confirmed by email");
        return "admin";
      }
    }

    console.log("[Auth] Role resolved to student (no admin match found)");
    return "student";
  } catch (e) {
    console.error("[Auth] Unexpected error in fetchRole:", e);
    return "student";
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role>("student");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        
        const currentSession = data.session ?? null;
        setSession(currentSession);
        
        if (currentSession?.user) {
          const userRole = await fetchRole(currentSession.user.id, currentSession.user.email);
          setRole(userRole);
        } else {
          setRole("student");
        }
      } catch (e) {
        console.error("[Auth] Init error:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      console.log("[Auth] Auth state change:", event);
      setSession(newSession);
      
      if (newSession?.user) {
        const userRole = await fetchRole(newSession.user.id, newSession.user.email);
        setRole(userRole);
      } else {
        setRole("student");
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthState>(() => {
    return {
      session,
      user: session?.user ?? null,
      role,
      loading,
      signInWithGoogle: async () => {
        const redirectTo = `${window.location.origin}/dashboard`;
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo },
        });
        if (error) throw error;
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      },
    };
  }, [session, role, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}