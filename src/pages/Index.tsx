"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Layout, User, Sparkles, Rocket, ExternalLink, BookOpen, PlayCircle, Loader2, Save } from "lucide-react";
import ModuleCard from '@/components/ModuleCard';
import VideoPlayer from '@/components/VideoPlayer';
import { Course, Module, Lesson } from '@/types/course';
import { showSuccess, showError } from '@/utils/toast';
import { courseService } from '@/lib/courseService';
import ProfileMenu from '@/components/ProfileMenu';
import { useAuth } from '@/contexts/AuthContext';

const INITIAL_COURSE: Course = {
  id: 'main-course',
  title: 'Build and Sell with AI',
  description: 'Learn how to leverage AI to build profitable software products.',
  modules: [
    {
      id: 'm1',
      title: 'Module 1: AI Fundamentals',
      chapters: [
        {
          id: 'c1',
          title: 'Introduction to LLMs',
          lessons: [
            { id: 'l1', title: 'What are Large Language Models?', videoUrl: 'https://www.youtube.com/watch?v=5sLYAQS9sWQ', notionUrl: 'https://notion.so/intro' }
          ]
        }
      ]
    }
  ]
};

const Index = () => {
  const [course, setCourse] = useState<Course>(INITIAL_COURSE);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { role, loading: isAuthLoading } = useAuth();
  const isAdmin = role === 'admin';

  // Load course from Supabase on mount
  useEffect(() => {
    const loadCourse = async () => {
      try {
        setIsLoading(true);
        const loadedCourse = await courseService.getCourse('main-course');
        
        if (loadedCourse) {
          setCourse(loadedCourse);
          localStorage.setItem('course_data', JSON.stringify(loadedCourse));
        } else {
          // No course found, create initial course in database
          await courseService.saveCourse(INITIAL_COURSE);
          localStorage.setItem('course_data', JSON.stringify(INITIAL_COURSE));
        }
      } catch (error: any) {
        console.error('Error loading course:', error);
        // Fallback to localStorage if database fails
        const saved = localStorage.getItem('course_data');
        if (saved) {
          setCourse(JSON.parse(saved));
        }
        // Show the actual error message to help debug
        showError(`Database Error: ${error.message || 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, []);

  // Save course to Supabase when Save button is clicked
  const handleSaveToDatabase = async () => {
    try {
      setIsSaving(true);
      await courseService.saveCourse(course);
      localStorage.setItem('course_data', JSON.stringify(course));
      showSuccess('Course saved to database!');
    } catch (error: any) {
      console.error('Error saving course:', error);
      showError(`Save Failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Update course state only (no auto-save)
  const updateCourse = useCallback((updatedCourse: Course) => {
    setCourse(updatedCourse);
  }, []);

  const addModule = () => {
    const newModule: Module = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Module',
      chapters: []
    };
    const updatedCourse = { ...course, modules: [...course.modules, newModule] };
    updateCourse(updatedCourse);
    showSuccess("Module added successfully!");
  };

  const updateModule = (moduleId: string, updates: Partial<Module>) => {
    const updatedCourse = {
      ...course,
      modules: course.modules.map(m => m.id === moduleId ? { ...m, ...updates } : m)
    };
    updateCourse(updatedCourse);
  };

  const deleteModule = (moduleId: string) => {
    const updatedCourse = {
      ...course,
      modules: course.modules.filter(m => m.id !== moduleId)
    };
    updateCourse(updatedCourse);
    showSuccess("Module deleted successfully!");
  };

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
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Creator Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Button
                onClick={handleSaveToDatabase}
                disabled={isSaving}
                className="rounded-xl gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Save to Database
              </Button>
            )}
            <Button variant="outline" className="rounded-xl gap-2 hidden sm:flex">
              <Rocket size={18} />
              Publish
            </Button>
            <ProfileMenu />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-12">
        {isLoading || isAuthLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <p className="text-slate-500">Loading...</p>
            </div>
          </div>
        ) : (
          <Tabs defaultValue={isAdmin ? "editor" : "viewer"} className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 italic">DASHBOARD</h2>
                <p className="text-slate-500">Manage your course content and preview the student experience.</p>
              </div>
              <div className="flex items-center gap-4">
                <TabsList className="bg-white dark:bg-slate-900 p-1 rounded-2xl border shadow-sm h-14">
                  {isAdmin && (
                    <TabsTrigger value="editor" className="rounded-xl h-full px-6 gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                      <Layout size={18} /> Editor
                    </TabsTrigger>
                  )}
                  <TabsTrigger value="viewer" className="rounded-xl h-full px-6 gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                    <User size={18} /> Student View
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

          {/* Editor View - only for admins */}
          {isAdmin && (
            <TabsContent value="editor" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {course.modules.map((module) => (
                  <ModuleCard 
                    key={module.id} 
                    module={module}
                    onUpdate={(updates) => updateModule(module.id, updates)}
                    onDelete={() => deleteModule(module.id)}
                  />
                ))}
                
                <button 
                  onClick={addModule}
                  className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-12 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all group"
                >
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                    <Plus size={32} />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg text-slate-600 group-hover:text-indigo-600">Add New Module</p>
                    <p className="text-sm text-slate-400">Expand your course curriculum</p>
                  </div>
                </button>
              </div>
            </TabsContent>
          )}

          {/* Student Viewer View */}
          <TabsContent value="viewer" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sidebar Content Tree */}
              <div className="lg:col-span-4 space-y-4">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <BookOpen size={20} className="text-indigo-600" />
                  Course Content
                </h3>
                {course.modules.map((module) => (
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

              {/* Main Player Area */}
              <div className="lg:col-span-8">
                {activeLesson ? (
                  <div className="space-y-6">
                    <VideoPlayer url={activeLesson.videoUrl} title={activeLesson.title} />
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h2 className="text-2xl font-bold mb-2">{activeLesson.title}</h2>
                          <p className="text-slate-500">Module Resources & Material</p>
                        </div>
                        {activeLesson.notionUrl && (
                          <Button asChild className="rounded-xl gap-2 bg-black hover:bg-zinc-800">
                            <a href={activeLesson.notionUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink size={18} />
                              Open Notion Materials
                            </a>
                          </Button>
                        )}
                      </div>
                      <div className="prose prose-slate dark:prose-invert max-w-none">
                        <p>Welcome to this lesson! In this part of the course, we'll dive deep into the concepts discussed in the video above.</p>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
                          <li>Review the core principles discussed.</li>
                          <li>Download the attached assets if available.</li>
                          <li>Complete the weekly challenge in the Notion workspace.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl h-[600px] border-2 border-dashed text-center p-12">
                    <div className="w-20 h-20 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 mb-6">
                      <PlayCircle size={40} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Select a lesson to begin</h3>
                    <p className="text-slate-500 max-w-xs mx-auto">Click on any lesson from the curriculum sidebar to start learning and watching.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        )}
      </main>
    </div>
  );
};

export default Index;