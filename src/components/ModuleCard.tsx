"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Layers } from "lucide-react";
import ChapterManager from './ChapterManager';
import { Module, Chapter, Lesson } from '@/types/course';

interface ModuleCardProps {
  module: Module;
  onUpdate: (updates: Partial<Module>) => void;
  onDelete: () => void;
  isEditable?: boolean;
  onSelectLesson?: (lesson: Lesson) => void;
  activeLessonId?: string;
}

const ModuleCard = ({ 
  module, 
  onUpdate, 
  onDelete, 
  isEditable = true,
  onSelectLesson,
  activeLessonId
}: ModuleCardProps) => {
  return (
    <Card className="border-2 border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none bg-slate-50/50 dark:bg-slate-900/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-white dark:bg-slate-900 border-b p-6">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Layers size={24} />
          </div>
          <div className="flex-1">
            {isEditable ? (
              <Input
                value={module.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="text-xl font-bold bg-transparent border-none p-0 focus-visible:ring-0"
              />
            ) : (
              <CardTitle className="text-xl font-bold">{module.title}</CardTitle>
            )}
          </div>
        </div>
        {isEditable && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onDelete}
            className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl"
          >
            <Trash2 size={20} />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-6">
        <ChapterManager 
          chapters={module.chapters}
          onUpdateChapters={(chapters) => onUpdate({ chapters })}
          isEditable={isEditable}
          onSelectLesson={onSelectLesson}
          activeLessonId={activeLessonId}
        />
      </CardContent>
    </Card>
  );
};

export default ModuleCard;