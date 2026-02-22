"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProfileMenu from "@/components/ProfileMenu";
import CourseCard from "@/components/CourseCard";
import { useAuth } from "@/contexts/AuthContext";
import { courseService } from "@/lib/courseService";
import { Course } from "@/types/course";

export default function Dashboard() {
  const { subscriptionStatus, role, loading: authLoading } = useAuth();
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const isPremium = subscriptionStatus === "active" || role === "admin";

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await courseService.getCourse("main-course");
        if (data) {
          setCourseData(data);
        }
      } catch (error) {
        console.error("Error fetching course for dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-black tracking-tight italic">MY COURSES</h2>
            <p className="text-slate-500">Select a course to continue your journey.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Search courses..." 
              className="pl-11 h-12 rounded-2xl bg-white dark:bg-slate-900 border-none shadow-sm"
            />
          </div>
        </div>

        {isLoading || authLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
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