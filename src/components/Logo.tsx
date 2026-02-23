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
    <div className={cn("flex items-center justify-center overflow-hidden", sizeClasses[size], className)}>
      <img 
        src="/logo.png" 
        alt="Logo" 
        className="w-full h-full object-contain"
        style={{ 
          // This filter turns black/dark colors into a vibrant cyan (#00FFFF)
          // If the logo is already colored, this will enhance it
          filter: "invert(62%) sepia(94%) saturate(4000%) hue-rotate(145deg) brightness(100%) contrast(105%)"
        }}
      />
    </div>
  );
}