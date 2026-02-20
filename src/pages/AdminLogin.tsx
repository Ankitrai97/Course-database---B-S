"use client";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Chrome, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { showError } from "@/utils/toast";

export default function AdminLogin() {
  const nav = useNavigate();
  const { user, role, loading, signInWithGoogle } = useAuth();
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!loading && user) {
      if (role === 'admin') nav("/admin/dashboard");
      else nav("/dashboard");
    }
  }, [loading, user, role, nav]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur p-8 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="text-2xl font-black leading-tight">Admin Portal</div>
              <div className="text-sm text-slate-400">Secure access for course creators.</div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <Button
              className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 h-12 text-lg font-bold"
              disabled={submitting}
              onClick={async () => {
                try {
                  setSubmitting(true);
                  await signInWithGoogle();
                } catch (e: any) {
                  showError(e.message || "Admin sign-in failed");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Chrome className="h-5 w-5 mr-2" />}
              Admin Sign In
            </Button>
            
            <p className="text-center text-xs text-slate-500">
              Authorized personnel only. Your account must have the 'admin' role in the database.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}