"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

type Role = "admin" | "student";
type SubscriptionStatus = "active" | "inactive";

type AuthState = {
  session: Session | null;
  user: User | null;
  role: Role;
  subscriptionStatus: SubscriptionStatus;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>("student");
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>("inactive");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setRole("student");
        setSubscriptionStatus("inactive");
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile for role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();
      
      if (profile) setRole(profile.role as Role);

      // Fetch subscription status
      const { data: access } = await supabase
        .from("course_access")
        .select("status")
        .eq("user_id", userId)
        .maybeSingle();
      
      if (access) setSubscriptionStatus(access.status as SubscriptionStatus);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = useMemo(() => ({
    session,
    user,
    role,
    subscriptionStatus,
    loading,
    signOut,
  }), [session, user, role, subscriptionStatus, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}