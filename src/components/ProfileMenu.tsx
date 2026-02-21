"use client";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, LogOut, Shield, User, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { showError, showSuccess } from "@/utils/toast";

function initials(email?: string | null) {
  if (!email) return "U";
  return email.slice(0, 2).toUpperCase();
}

export default function ProfileMenu() {
  const nav = useNavigate();
  const { user, role, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Link
        to="/login"
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 px-4 h-10 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-900"
      >
        <LogIn size={18} />
        Login
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full ring-2 ring-indigo-500/20 focus:outline-none">
          <Avatar>
            <AvatarImage
              src={user.user_metadata?.avatar_url || user.user_metadata?.picture}
              alt={user.email || "User"}
            />
            <AvatarFallback>{initials(user.email)}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="space-y-1">
          <div className="text-sm font-semibold flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Shield className="h-3.5 w-3.5" />
            <span className="capitalize">{role}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => nav("/profile")}>
          <Settings className="mr-2 h-4 w-4" />
          Profile Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            try {
              await signOut();
              showSuccess("Logged out");
              nav("/");
            } catch (e: unknown) {
              const msg =
                e instanceof Error
                  ? e.message
                  : typeof e === "object" && e !== null && "message" in e
                    ? String((e as { message: string }).message)
                    : "Failed to logout";
              showError(msg);
            }
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}