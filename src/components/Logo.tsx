"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn("flex items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100", sizeClasses[size], className)}>
      <img 
        src="/logo.png" 
        alt="Logo" 
        className="w-full h-full object-contain p-1"
      />
    </div>
  );
}