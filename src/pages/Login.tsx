"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function Login() {
  const nav = useNavigate();

  React.useEffect(() => {
    // Redirect to dashboard immediately since auth is disabled
    nav("/dashboard");
  }, [nav]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-slate-500 font-medium">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}