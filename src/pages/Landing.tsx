"use client";

import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, PlayCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Sparkles size={18} />
            </div>
            <div className="font-black tracking-tight">Build & Sell with AI</div>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild className="rounded-xl bg-indigo-600 hover:bg-indigo-700">
              <Link to="/dashboard">
                Go to dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/60 dark:border-indigo-900/40 bg-indigo-50/60 dark:bg-indigo-950/30 px-4 py-2 text-sm font-semibold text-indigo-700 dark:text-indigo-300">
              <Sparkles className="h-4 w-4" />
              Creator portal + student experience
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.05]">
              A beautiful course experience.
              <span className="block text-indigo-600">Built for creators.</span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl">
              Manage modules and lessons in an admin editor, then preview everything in student view—videos,
              materials, and a clean learning flow.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="rounded-xl bg-indigo-600 hover:bg-indigo-700">
                <Link to="/dashboard">
                  <PlayCircle className="mr-2 h-4 w-4" /> View student experience
                </Link>
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 pt-3">
              {[
                "Admin-only editor with role checks",
                "Google sign-in with Supabase Auth",
                "Student view for preview & playback",
                "Course data saved to Supabase",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-tr from-indigo-600/20 to-violet-500/20 blur-2xl rounded-[2rem]" />
            <div className="relative rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 p-6 shadow-xl">
              <div className="rounded-2xl bg-slate-950 text-white p-6">
                <div className="text-sm font-semibold text-slate-300">What you get</div>
                <div className="mt-2 text-2xl font-black">A clean, modern course UI</div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-white/10 p-4">Modules & lessons</div>
                  <div className="rounded-xl bg-white/10 p-4">Video preview</div>
                  <div className="rounded-xl bg-white/10 p-4">Notion materials</div>
                  <div className="rounded-xl bg-white/10 p-4">Role-based editor</div>
                </div>
              </div>
              <div className="mt-5 text-sm text-slate-500">
                Tip: Set your user’s role to <span className="font-semibold">admin</span> in the `profiles` table to unlock the editor.
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-6 text-sm text-slate-500 flex items-center justify-between">
          <div>© {new Date().getFullYear()} Build & Sell with AI</div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="hover:text-slate-700 dark:hover:text-slate-300">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}