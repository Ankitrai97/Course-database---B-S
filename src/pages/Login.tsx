"use client";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Chrome, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { showError } from "@/utils/toast";

export default function Login() {
  const nav = useNavigate();
  const { user, loading, signInWithGoogle } = useAuth();
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!loading && user) nav("/dashboard");
  }, [loading, user, nav]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 backdrop-blur p-8 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="text-xl font-black leading-tight">Sign in</div>
              <div className="text-sm text-slate-500">Use Google to access your dashboard.</div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <Button
              className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 h-11"
              disabled={submitting}
              onClick={async () => {
                try {
                  setSubmitting(true);
                  await signInWithGoogle();
                  // Redirect handled by Supabase OAuth
                } catch (e: unknown) {
                  const msg =
                    e instanceof Error
                      ? e.message
                      : typeof e === "object" && e !== null && "message" in e
                        ? String((e as { message: string }).message)
                        : "Google sign-in failed";
                  showError(msg);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Chrome className="h-4 w-4" />}
              Continue with Google
            </Button>

            <Button asChild variant="outline" className="w-full rounded-2xl h-11">
              <Link to="/dashboard">Continue as student (view only)</Link>
            </Button>
          </div>

          <div className="mt-6 text-xs text-slate-500">
            Admin access is granted when your `profiles.role` is set to <span className="font-semibold">admin</span>.
          </div>
        </div>
      </div>
    </div>
  );
}

