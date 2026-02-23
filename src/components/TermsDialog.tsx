"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function TermsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-slate-600 hover:text-indigo-600 transition-colors text-sm font-semibold">
          Terms & Conditions
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">Terms & Conditions</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
          <ul className="list-disc pl-5 space-y-3">
            <li>This product is a digital course that includes video and text based practical learning materials.</li>
            <li>Access is provided digitally via email after successful payment. Please enter your correct email address at checkout.</li>
            <li>Due to the nature of digital products and instant access, all sales are final.</li>
            <li>The course is for individual use only. Sharing login credentials or distributing course materials in any form is not allowed.</li>
            <li>For payment or access related issues, contact us within 24 hours of purchase.</li>
          </ul>
          <p className="pt-4 border-t border-slate-100 dark:border-slate-800 text-sm italic">
            You agree to share information entered on this page with Rapplemedia (owner of this page) and Razorpay, adhering to applicable laws.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}