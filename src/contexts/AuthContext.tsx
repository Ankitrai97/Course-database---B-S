"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Role = "admin" | "student";

type AuthState = {
  session: Session | null;
  user: User | null;
  role: Role;
  hasAccess: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshAccess: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>("student");
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    try {
      // 1. Fetch profile for role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();

      const userRole = (profile?.role as Role) || "student";
      setRole(userRole);

      // 2. Fetch course access status
      const { data: access } = await supabase
        .from("course_access")
        .select("status")
        .eq("user_id", userId)
        .eq("status", "active")
        .maybeSingle();

      // User has access if they have an 'active' status OR if they are an admin
      setHasAccess(!!access || userRole === "admin");
    } catch (error) {
      console.error("Error fetching user data:", error);
      setHasAccess(false);
    }
  };

  const refreshAccess = async () => {
    if (user) {
      await fetchUserData(user.id);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setLoading(true);
        await fetchUserData(session.user.id);
        setLoading(false);
      } else {
        setRole("student");
        setHasAccess(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo(() => ({
    session,
    user,
    role,
    hasAccess,
    loading,
    signOut: async () => {
      await supabase.auth.signOut();
    },
    refreshAccess,
  }), [session, user, role, hasAccess, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}