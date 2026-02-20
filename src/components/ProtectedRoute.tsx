"use client";

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAccess?: boolean;
}

export default function ProtectedRoute({ children, requireAccess = true }: ProtectedRouteProps) {
  const { user, loading, hasAccess } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAccess && !hasAccess) {
    return <Navigate to="/no-access" replace />;
  }

  return <>{children}</>;
}