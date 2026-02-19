"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Layout, User, Sparkles, Rocket, ExternalLink, BookOpen, PlayCircle, LogOut } from "lucide-react";
import ModuleCard from '@/components/ModuleCard';
import VideoPlayer from '@/components/VideoPlayer';
import { Module, Lesson } from '@/types/course';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [userRole, setUserRole] = useState<string>('student');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (data) setUserRole(data.role);
    }
  };

  const fetchCourseData = async () => {
    try {
      // Fetch modules
      const { data: modulesData, error: modError } = await supabase
        .from('modules')
        .select('*')
        .order('order_index');

      if (modError) throw modError;

      // Fetch chapters and lessons for each module
      const enrichedModules = await Promise.all((modulesData || []).map(async (mod) => {
        const { data: chaptersData } = await supabase
          .from('chapters')
          .select('*')
          .eq('module_id', mod.id)
          .order('order_index');

        const enrichedChapters = await Promise.all((chaptersData || []).map(async (chap) => {
          const { data: lessonsData } = await supabase
            .from('lessons')
            .select('*')
            .eq('chapter_id', chap.id)
            .order('order_index');

          return {
            ...chap,
            lessons: (lessonsData || []).map(l => ({
              id: l.id,
              title: l.title,
              videoUrl: l.video_url || '',
              notionUrl: l.description // Using description as placeholder for notion url if needed
            }))
          };
        }));

        return {
          ...mod,
          chapters: enrichedChapters
        };
      }));

      setModules(enrichedModules);
    } catch (error: any) {
      showError("Failed to load course data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const addModule = async () => {
    const { data, error } = await supabase
      .from('modules')
      .insert([{ title: 'New Module', order_index: modules.length }])
      .select()
      .single();

    if (error) {
      showError("Failed to add module");
      return;
    }

    setModules([...modules, { ...data, chapters: [] }]);
    showSuccess("Module added successfully!");
  };

  const updateModule = async (moduleId: string, updates: Partial<Module>) => {
    // Note: This is a simplified update logic for the UI tree
    // Real implementation would need individual table updates
    setModules(modules.map(m => m.id === moduleId ? { ...m, ...updates } : m));
  };

  const deleteModule = async (moduleId: string) => {
    const { error } = await supabase.from('modules').delete().eq('id', moduleId);
    if (error) {
      showError("Failed to delete module");
      return;
    }
    setModules(modules.filter(m => m.id !== moduleId));
    showSuccess("Module removed");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 pb-20">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Build and Sell with AI</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Course Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-xl">
              <LogOut size={18} />
            </Button>
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden ring-2 ring-indigo-500/20">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-12">
        <Tabs defaultValue={userRole === 'admin' ? "editor" : "viewer"} className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 italic">DASHBOARD</h2>
              <p className="text-slate-500">Welcome back to the portal.</p>
            </div>
            {userRole === 'admin' && (
              <TabsList className="bg-white dark:bg-slate-900 p-1 rounded-2xl border shadow-sm h-14">
                <TabsTrigger value="editor" className="rounded-xl h-full px-6 gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                  <Layout size={18} /> Editor
                </TabsTrigger>
                <TabsTrigger value="viewer" className="rounded-xl h-full px-6 gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                  <User size={18} /> Student View
                </TabsTrigger>
              </TabsList>
            )}
          </div>

          <TabsContent value="editor" className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {modules.map((module) => (
                <ModuleCard 
                  key={module.id} 
                  module={module}
                  onUpdate={(updates) => updateModule(module.id, updates)}
                  onDelete={() => deleteModule(module.id)}
                />
              ))}
              <button onClick={addModule} className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-12 hover:border-indigo-500 transition-all group">
                <Plus size={32} className="text-slate-400 group-hover:text-indigo-600" />
                <p className="font-bold text-slate-600 group-hover:text-indigo-600">Add New Module</p>
              </button>
            </div>
          </TabsContent>

          <TabsContent value="viewer">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-4">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <BookOpen size={20} className="text-indigo-600" />
                  Course Curriculum
                </h3>
                {modules.map((module) => (
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

              <div className="lg:col-span-8">
                {activeLesson ? (
                  <div className="space-y-6">
                    <VideoPlayer url={activeLesson.videoUrl} title={activeLesson.title} />
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h2 className="text-2xl font-bold mb-2">{activeLesson.title}</h2>
                          <p className="text-slate-500">Module Resources</p>
                        </div>
                        {activeLesson.notionUrl && (
                          <Button asChild className="rounded-xl gap-2 bg-black hover:bg-zinc-800">
                            <a href={activeLesson.notionUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink size={18} /> Notion Link
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl h-[600px] border-2 border-dashed text-center p-12">
                    <PlayCircle size={40} className="text-indigo-600 mb-6" />
                    <h3 className="text-xl font-bold mb-2">Select a lesson to begin</h3>
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