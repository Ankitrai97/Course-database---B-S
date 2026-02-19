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
  // Primary: match by auth user id (recommended)
  const { data: byId, error: byIdError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (byIdError) {
    console.error("Failed to fetch profile role by id (RLS?)", byIdError);
  }

  if (byId?.role === "admin") return "admin";
  if (byId?.role) return "student";

  // Fallback: match by email (helps if profiles.id was not created from auth.users.id)
  if (email) {
    const { data: byEmail, error: byEmailError } = await supabase
      .from("profiles")
      .select("role")
      .eq("email", email)
      .maybeSingle();

    if (byEmailError) {
      console.error("Failed to fetch profile role by email (RLS?)", byEmailError);
    }

    return byEmail?.role === "admin" ? "admin" : "student";
  }

  return "student";
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
        setSession(data.session ?? null);
        if (data.session?.user) {
          setRole(await fetchRole(data.session.user.id, data.session.user.email));
        } else {
          setRole("student");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      if (newSession?.user) {
        setRole(await fetchRole(newSession.user.id, newSession.user.email));
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

