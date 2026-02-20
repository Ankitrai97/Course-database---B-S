"use client";

import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileMenu from "@/components/ProfileMenu";

export default function NoAccess() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6">
        <Link to="/" className="font-bold text-xl tracking-tight">Build & Sell with AI</Link>
        <ProfileMenu />
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-3xl flex items-center justify-center text-amber-600 mx-auto">
            <ShieldAlert size={40} />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight">Access Restricted</h1>
            <p className="text-slate-500">
              It looks like you don't have an active subscription to this course yet. 
              If you've already paid, please wait a few minutes for your access to be activated.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild className="rounded-xl bg-indigo-600 hover:bg-indigo-700">
              <a href="mailto:support@example.com" className="gap-2">
                <Mail size={18} /> Contact Support
              </a>
            </Button>
            <Button asChild variant="ghost" className="rounded-xl">
              <Link to="/" className="gap-2">
                <ArrowLeft size={18} /> Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}