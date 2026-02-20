"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, PlayCircle, Loader2, Sparkles, ExternalLink } from "lucide-react";
import ModuleCard from '@/components/ModuleCard';
import VideoPlayer from '@/components/VideoPlayer';
import { Course, Lesson } from '@/types/course';
import { showError } from '@/utils/toast';
import { courseService } from '@/lib/courseService';
import ProfileMenu from '@/components/ProfileMenu';
import { Button } from '@/components/ui/button';

const INITIAL_COURSE: Course = {
  id: 'main-course',
  title: 'Build and Sell with AI',
  description: 'Learn how to leverage AI to build profitable software products.',
  modules: []
};

const Index = () => {
  const [course, setCourse] = useState<Course>(INITIAL_COURSE);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load course from Supabase on mount
  useEffect(() => {
    const loadCourse = async () => {
      try {
        setIsLoading(true);
        const loadedCourse = await courseService.getCourse('main-course');
        
        if (loadedCourse) {
          setCourse(loadedCourse);
        } else {
          // If no course exists in DB, we show the initial empty state
          setCourse(INITIAL_COURSE);
        }
      } catch (error: any) {
        console.error('Error loading course:', error);
        showError(`Database Error: ${error.message || 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 pb-20">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{course.title}</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Student Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ProfileMenu />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-12">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <p className="text-slate-500">Loading course content...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 italic">LEARNING DASHBOARD</h2>
                <p className="text-slate-500">{course.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sidebar Content Tree */}
              <div className="lg:col-span-4 space-y-4">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <BookOpen size={20} className="text-indigo-600" />
                  Course Curriculum
                </h3>
                {course.modules.map((module) => (
                  <ModuleCard 
                    key={module.id} 
                    module={module}
                    onSelectLesson={setActiveLesson}
                    activeLessonId={activeLesson?.id}
                  />
                ))}
                {course.modules.length === 0 && (
                  <div className="p-8 text-center border-2 border-dashed rounded-2xl text-slate-400">
                    No modules available yet.
                  </div>
                )}
              </div>

              {/* Main Player Area */}
              <div className="lg:col-span-8">
                {activeLesson ? (
                  <div className="space-y-6">
                    <VideoPlayer url={activeLesson.videoUrl} title={activeLesson.title} />
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h2 className="text-2xl font-bold mb-2">{activeLesson.title}</h2>
                          <p className="text-slate-500">Lesson Resources & Material</p>
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
                        <p>Welcome to this lesson! Follow along with the video and check out any linked materials above.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl h-[600px] border-2 border-dashed text-center p-12">
                    <div className="w-20 h-20 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 mb-6">
                      <PlayCircle size={40} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Select a lesson to begin</h3>
                    <p className="text-slate-500 max-w-xs mx-auto">Click on any lesson from the curriculum sidebar to start learning.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;