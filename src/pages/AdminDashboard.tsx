"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Plus, Layout, Sparkles, Rocket, Loader2, Save, ShieldCheck, ArrowLeft } from "lucide-react";
import ModuleCard from '@/components/ModuleCard';
import { Course, Module } from '@/types/course';
import { showSuccess, showError } from '@/utils/toast';
import { courseService } from '@/lib/courseService';
import ProfileMenu from '@/components/ProfileMenu';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

const INITIAL_COURSE: Course = {
  id: 'main-course',
  title: 'Build and Sell with AI',
  description: 'Learn how to leverage AI to build profitable software products.',
  modules: []
};

const AdminDashboard = () => {
  const nav = useNavigate();
  const { role, loading: isAuthLoading } = useAuth();
  const [course, setCourse] = useState<Course>(INITIAL_COURSE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && role !== 'admin') {
      showError("Access denied. Admin role required.");
      nav("/dashboard");
    }
  }, [role, isAuthLoading, nav]);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setIsLoading(true);
        const loadedCourse = await courseService.getCourse('main-course');
        if (loadedCourse) setCourse(loadedCourse);
      } catch (error: any) {
        showError(`Load Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    loadCourse();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await courseService.saveCourse(course);
      showSuccess('Course changes published!');
    } catch (error: any) {
      showError(`Save Failed: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const addModule = () => {
    const newModule: Module = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Module',
      chapters: []
    };
    setCourse({ ...course, modules: [...course.modules, newModule] });
  };

  if (isAuthLoading || isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <header className="bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => nav("/")} className="text-slate-400 hover:text-white">
              <ArrowLeft size={20} />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                <ShieldCheck size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">Course Editor</h1>
                  <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">Admin</Badge>
                </div>
                <p className="text-xs text-slate-500 uppercase tracking-widest">Management Console</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button onClick={handleSave} disabled={isSaving} className="rounded-xl bg-indigo-600 hover:bg-indigo-700">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} className="mr-2" />}
              Save Changes
            </Button>
            <ProfileMenu />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-12">
        <div className="mb-10">
          <h2 className="text-3xl font-black italic mb-2">CURRICULUM BUILDER</h2>
          <p className="text-slate-400">Structure your course modules, chapters, and lessons.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {course.modules.map((module) => (
            <ModuleCard 
              key={module.id} 
              module={module}
              onUpdate={(updates) => setCourse({
                ...course,
                modules: course.modules.map(m => m.id === module.id ? { ...m, ...updates } : m)
              })}
              onDelete={() => setCourse({
                ...course,
                modules: course.modules.filter(m => m.id !== module.id)
              })}
            />
          ))}
          
          <button 
            onClick={addModule}
            className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-slate-800 rounded-3xl p-12 hover:border-indigo-500 hover:bg-indigo-500/5 transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-slate-600 group-hover:text-indigo-500 transition-colors">
              <Plus size={32} />
            </div>
            <div className="text-center">
              <p className="font-bold text-lg text-slate-400 group-hover:text-indigo-400">Add New Module</p>
              <p className="text-sm text-slate-600">Expand your curriculum</p>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;