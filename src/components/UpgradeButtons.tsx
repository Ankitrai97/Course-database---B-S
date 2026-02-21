"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { CreditCard, Globe, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpgradeButtonsProps {
  className?: string;
  vertical?: boolean;
}

export default function UpgradeButtons({ className, vertical = false }: UpgradeButtonsProps) {
  const buttonClasses = vertical 
    ? "w-full rounded-xl h-12 font-bold" 
    : "rounded-2xl h-14 px-10 text-lg font-black shadow-xl shadow-indigo-200 dark:shadow-none transition-all hover:scale-105 active:scale-95";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={cn(buttonClasses, "bg-indigo-600 hover:bg-indigo-700 text-white gap-2", className)}>
          <Sparkles size={vertical ? 18 : 20} />
          Upgrade to Premium
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-indigo-600 p-8 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black flex items-center gap-2 text-white">
              <Sparkles className="text-indigo-200" />
              Choose Your Region
            </DialogTitle>
            <DialogDescription className="text-indigo-100 text-base">
              Select your location to proceed with the correct payment gateway.
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="p-6 space-y-4 bg-white dark:bg-slate-900">
          <a 
            href="https://rzp.io/rzp/w1Wu1NV" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600">
                <CreditCard size={24} />
              </div>
              <div>
                <div className="font-bold text-lg">India</div>
                <div className="text-sm text-slate-500">Pay via UPI, Cards, or Netbanking</div>
              </div>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
          </a>

          <a 
            href="https://rzp.io/rzp/hD4ALyO" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                <Globe size={24} />
              </div>
              <div>
                <div className="font-bold text-lg">International</div>
                <div className="text-sm text-slate-500">Pay via International Cards</div>
              </div>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
          </a>
        </div>
        
        <div className="p-4 bg-slate-50 dark:bg-slate-950 text-center">
          <p className="text-xs text-slate-400">Secure payment powered by Razorpay</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}