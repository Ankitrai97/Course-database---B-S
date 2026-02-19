"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Layout, User, Sparkles, Rocket, ExternalLink, BookOpen, PlayCircle } from "lucide-react";
import ModuleCard from '@/components/ModuleCard';
import VideoPlayer from '@/components/VideoPlayer';
import { Course, Module, Lesson } from '@/types/course';
import { showSuccess } from '@/utils/toast';

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
  const [course, setCourse] = useState<Course>(() => {
    const saved = localStorage.getItem('course_data');
    return saved ? JSON.parse(saved) : INITIAL_COURSE;
  });
  
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    localStorage.setItem('course_data', JSON.stringify(course));
  }, [course]);

  const addModule = () => {
    const newModule: Module = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Module',
      chapters: []
    };
    setCourse({ ...course, modules: [...course.modules, newModule] });
    showSuccess("Module added successfully!");
  };

  const updateModule = (moduleId: string, updates: Partial<Module>) => {
    setCourse({
      ...course,
      modules: course.modules.map(m => m.id === moduleId ? { ...m, ...updates } : m)
    });
  };

  const deleteModule = (moduleId: string) => {
    setCourse({
      ...course,
      modules: course.modules.filter(m => m.id !== moduleId)
    });
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
            <Button variant="outline" className="rounded-xl gap-2 hidden sm:flex">
              <Rocket size={18} />
              Publish
            </Button>
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden ring-2 ring-indigo-500/20">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-12">
        <Tabs defaultValue="editor" className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 italic">DASHBOARD</h2>
              <p className="text-slate-500">Manage your course content and preview the student experience.</p>
            </div>
            <TabsList className="bg-white dark:bg-slate-900 p-1 rounded-2xl border shadow-sm h-14">
              <TabsTrigger value="editor" className="rounded-xl h-full px-6 gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <Layout size={18} /> Editor
              </TabsTrigger>
              <TabsTrigger value="viewer" className="rounded-xl h-full px-6 gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <User size={18} /> Student View
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Editor View */}
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
      </main>
    </div>
  );
};

export default Index;