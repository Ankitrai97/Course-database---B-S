"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, PlayCircle, Sparkles, Rocket, Zap, Target, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";

export default function Landing() {
  const { user } = useAuth();
  const [studentCount, setStudentCount] = useState<number>(50);

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (!error && count !== null) {
          // We use 50 as a base offset for social proof, matching the dashboard logic
          setStudentCount(50 + count);
        }
      } catch (error) {
        console.error("Error fetching student count:", error);
      }
    };

    fetchStudentCount();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div className="font-black tracking-tight text-lg">Build & Sell with AI</div>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="rounded-xl hidden sm:flex">
              <Link to="/dashboard">Preview Course</Link>
            </Button>
            <Button asChild className="rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none">
              <Link to={user ? "/dashboard" : "/login"}>
                {user ? "Go to Dashboard" : "Get Started"} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/60 dark:border-indigo-900/40 bg-indigo-50/60 dark:bg-indigo-950/30 px-4 py-2 text-sm font-bold text-indigo-700 dark:text-indigo-300 animate-in fade-in slide-in-from-top-4 duration-700">
              <Sparkles className="h-4 w-4" />
              Join {studentCount}+ ambitious AI creators
            </div>

            <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-[1.05] text-slate-900 dark:text-white">
              Build & Sell Your 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">AI Service in Weeks</span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              The ultimate blueprint to master AI development, automate workflows, and launch profitable digital products without writing complex code
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 h-14 px-8 text-lg shadow-xl shadow-indigo-200 dark:shadow-none">
                <Link to="/dashboard">
                  <PlayCircle className="mr-2 h-5 w-5" /> Start Learning Now
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-2xl h-14 px-8 text-lg border-2">
                <Link to="/login">
                  <BookOpen className="mr-2 h-5 w-5" /> Admin Portal
                </Link>
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {[
                { icon: <Rocket className="h-4 w-4" />, text: "Step-by-step AI product blueprint" },
                { icon: <Zap className="h-4 w-4" />, text: "Master No-Code & Low-Code tools" },
                { icon: <Target className="h-4 w-4" />, text: "Proven monetization strategies" },
                { icon: <Globe className="h-4 w-4" />, text: "Launch your first AI SaaS" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    {item.icon}
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 bg-gradient-to-tr from-indigo-600/20 to-violet-500/20 blur-3xl rounded-[3rem] animate-pulse" />
            <div className="relative rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 p-8 shadow-2xl backdrop-blur-sm">
              <div className="rounded-3xl bg-slate-950 text-white p-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Logo size="lg" className="bg-transparent border-none shadow-none" />
                </div>
                <div className="relative z-10">
                  <div className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-2">Curriculum Overview</div>
                  <div className="text-3xl font-black mb-6">Master the AI Stack</div>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      "Finding Profitable AI Services",
                      "Building with LLMs & APIs",
                      "No-Code App Development",
                      "Marketing & Scaling Your Ai Services"
                    ].map((module, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
                          0{i+1}
                        </div>
                        <span className="font-semibold text-slate-200">{module}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between px-2">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                    +{studentCount}
                  </div>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Trusted by creators worldwide
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div className="font-bold text-slate-900 dark:text-white">Build & Sell with AI</div>
          </div>
          
          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} Rapple Media. All rights reserved.
          </div>

          <div className="flex items-center gap-8 text-sm font-semibold">
            <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 transition-colors">
              Dashboard
            </Link>
            <Link to="/login" className="text-slate-600 hover:text-indigo-600 transition-colors">
              Login
            </Link>
            <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}