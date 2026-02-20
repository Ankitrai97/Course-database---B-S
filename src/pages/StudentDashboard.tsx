"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, PlayCircle, ExternalLink, Sparkles, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModuleCard from '@/components/ModuleCard';
import VideoPlayer from '@/components/VideoPlayer';
import { Course, Lesson } from '@/types/course';
import { courseService } from '@/lib/courseService';
import { useAuth } from '@/contexts/AuthContext';
import ProfileMenu from '@/components/ProfileMenu';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const data = await courseService.getCourse('main-course');
        setCourse(data);
      } catch (err) {
        console.error("Failed to load course", err);
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Sparkles className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{course?.title || "Student Portal"}</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Learning Experience</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right mr-2">
              <p className="text-sm font-bold">{user?.email}</p>
              <p className="text-xs text-slate-500">Student Access</p>
            </div>
            <ProfileMenu />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-indigo-600" />
              Course Content
            </h3>
            {course?.modules.map((module) => (
              <ModuleCard 
                key={module.id} 
                module={module}
                isEditable={false}
                onUpdate={() => {}}
                onDelete={() => {}}
                onSelectLesson={setActiveLesson}
                activeLessonId={activeLesson?.id}
              />
            ))}
          </div>

          {/* Player Area */}
          <div className="lg:col-span-8">
            {activeLesson ? (
              <div className="space-y-6">
                <VideoPlayer url={activeLesson.videoUrl} title={activeLesson.title} />
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{activeLesson.title}</h2>
                      <p className="text-slate-500">Lesson Materials</p>
                    </div>
                    {activeLesson.notionUrl && (
                      <Button asChild className="rounded-xl gap-2 bg-black hover:bg-zinc-800">
                        <a href={activeLesson.notionUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink size={18} />
                          Open Materials
                        </a>
                      </Button>
                    )}
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p>Welcome to this lesson! Follow along with the video and use the resources provided to complete your learning objectives.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl h-[500px] border-2 border-dashed text-center p-12">
                <div className="w-20 h-20 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 mb-6">
                  <PlayCircle size={40} />
                </div>
                <h3 className="text-xl font-bold mb-2">Ready to learn?</h3>
                <p className="text-slate-500 max-w-xs mx-auto">Select a lesson from the sidebar to begin your learning journey.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}