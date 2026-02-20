"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { Session, User } from "@supabase/supabase-js";

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

// Mock user for development without auth
const MOCK_USER: User = {
  id: "dev-user",
  email: "admin@example.com",
  app_metadata: {},
  user_metadata: {
    full_name: "Developer Admin",
  },
  aud: "authenticated",
  created_at: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Auth is now disabled/mocked
  const value = useMemo<AuthState>(() => {
    return {
      session: { user: MOCK_USER, access_token: "mock", refresh_token: "mock", expires_in: 3600, token_type: "bearer" } as Session,
      user: MOCK_USER,
      role: "admin", // Hardcoded to admin so you can use the editor
      loading: false,
      signInWithGoogle: async () => {
        console.log("Auth is disabled: signInWithGoogle called");
      },
      signOut: async () => {
        console.log("Auth is disabled: signOut called");
      },
    };
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}