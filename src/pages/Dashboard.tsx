"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Search, Loader2, TrendingUp, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProfileMenu from "@/components/ProfileMenu";
import CourseCard from "@/components/CourseCard";
import { useAuth } from "@/contexts/AuthContext";
import { courseService } from "@/lib/courseService";
import { Course } from "@/types/course";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const { subscriptionStatus, role, loading: authLoading } = useAuth();
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [studentCount, setStudentCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const isPremium = subscriptionStatus === "active" || role === "admin";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch course data
        const data = await courseService.getCourse("main-course");
        if (data) {
          setCourseData(data);
        }

        // Fetch total profiles count
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (!error && count !== null) {
          // We use 50 as a base offset for social proof
          setStudentCount(50 + count);
        } else {
          setStudentCount(50);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setStudentCount(50);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fallback or dynamic course list
  const courses = [
    {
      id: "main-course",
      title: courseData?.title || "Build and Sell with AI",
      description: courseData?.description || "Master the art of building AI-powered applications and turning them into profitable businesses.",
      moduleCount: courseData?.modules?.length || 0,
      isLocked: !isPremium,
      thumbnailUrl: "/course-thumbnail.gif"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Sparkles size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Learning Hub</h1>
          </div>
          <ProfileMenu />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-12 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6">
            {/* Premium Student Count Badge */}
            {studentCount !== null ? (
              <div className="inline-flex items-center gap-4 px-4 py-2 rounded-full bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 backdrop-blur-sm animate-in fade-in slide-in-from-left-4 duration-700">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white shadow-indigo-200 dark:shadow-none shadow-lg">
                  <Users size={14} />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-indigo-900 dark:text-indigo-100 font-bold text-sm leading-none">
                      {studentCount}
                    </span>
                    <span className="text-indigo-600/70 dark:text-indigo-400/70 text-[11px] font-semibold uppercase tracking-wider leading-none">
                      Active Learners
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Live now</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-12 w-40 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full" />
            )}

            <div className="space-y-2">
              <h2 className="text-5xl font-black tracking-tighter italic text-slate-900 dark:text-white">
                MY <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">COURSES</span>
              </h2>
              <p className="text-slate-500 text-lg max-w-md">Continue your journey and master the future of AI development.</p>
            </div>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <Input 
              placeholder="Search your library..." 
              className="pl-12 h-14 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm focus-visible:ring-indigo-500 text-base"
            />
          </div>
        </div>

        {isLoading || authLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            <p className="text-slate-500 font-medium animate-pulse">Loading your dashboard...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}