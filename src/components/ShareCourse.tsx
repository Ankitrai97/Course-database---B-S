"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Copy, MessageCircle, Mail, Share } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

export default function ShareCourse() {
  // Using the production domain for sharing
  const shareUrl = "https://course.rapplemedia.in";
  const shareTitle = "Join me on Build & Sell with AI!";
  const shareText = "I'm learning how to build AI products. Join me and start your journey too!";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showSuccess("Link copied to clipboard!");
    } catch (err) {
      showError("Failed to copy link");
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      copyToClipboard();
    }
  };

  const shareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
    window.open(url, "_blank");
  };

  const shareEmail = () => {
    const url = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`;
    window.location.href = url;
  };

  return (
    <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="text-indigo-600" /> Share with Friends
        </CardTitle>
        <CardDescription>Invite others to join the course and build together.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Input 
            readOnly 
            value={shareUrl} 
            className="rounded-xl h-12 bg-slate-50 dark:bg-slate-950 border-none"
          />
          <Button onClick={copyToClipboard} variant="secondary" className="rounded-xl h-12 px-4">
            <Copy size={18} />
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button 
            variant="outline" 
            onClick={shareWhatsApp}
            className="rounded-xl h-12 gap-2 border-emerald-100 hover:bg-emerald-50 hover:text-emerald-600 dark:border-emerald-900/30 dark:hover:bg-emerald-900/20"
          >
            <MessageCircle size={18} /> WhatsApp
          </Button>
          <Button 
            variant="outline" 
            onClick={shareEmail}
            className="rounded-xl h-12 gap-2 border-blue-100 hover:bg-blue-50 hover:text-blue-600 dark:border-blue-900/30 dark:hover:bg-blue-900/20"
          >
            <Mail size={18} /> Email
          </Button>
          <Button 
            variant="outline" 
            onClick={shareNative}
            className="rounded-xl h-12 gap-2 border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 sm:col-span-2"
          >
            <Share size={18} /> More Options
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}