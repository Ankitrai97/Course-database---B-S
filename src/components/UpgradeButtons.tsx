"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpgradeButtonsProps {
  className?: string;
  vertical?: boolean;
}

export default function UpgradeButtons({ className, vertical = false }: UpgradeButtonsProps) {
  const containerClasses = cn(
    "flex gap-3",
    vertical ? "flex-col" : "flex-col sm:flex-row items-center justify-center",
    className
  );

  const buttonClasses = vertical ? "w-full rounded-xl h-12" : "rounded-2xl h-14 px-8 text-lg font-bold shadow-lg";

  return (
    <div className={containerClasses}>
      <Button asChild className={cn(buttonClasses, "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200")}>
        <a href="https://rzp.io/rzp/w1Wu1NV" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
          <CreditCard size={vertical ? 18 : 20} />
          Upgrade (India)
        </a>
      </Button>
      
      <Button asChild variant="outline" className={cn(buttonClasses, "border-indigo-200 text-indigo-700 hover:bg-indigo-50 bg-white")}>
        <a href="https://rzp.io/rzp/hD4ALyO" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
          <Globe size={vertical ? 18 : 20} />
          Upgrade (International)
        </a>
      </Button>
    </div>
  );
}