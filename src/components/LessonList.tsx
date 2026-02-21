"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Video, FileText, PlayCircle, Lock } from "lucide-react";
import { Lesson } from '@/types/course';

interface LessonListProps {
  lessons: Lesson[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Lesson>) => void;
  onSelect?: (lesson: Lesson) => void;
  activeLessonId?: string;
  isEditable?: boolean;
  isLocked?: boolean;
}

const LessonList = ({ 
  lessons, 
  onAdd, 
  onDelete, 
  onUpdate, 
  onSelect, 
  activeLessonId,
  isEditable = true,
  isLocked = false
}: LessonListProps) => {
  return (
    <div className="space-y-3 pl-4 border-l-2 border-indigo-100 dark:border-indigo-900/30 ml-2">
      {lessons.map((lesson) => (
        <div 
          key={lesson.id} 
          className={`group flex flex-col p-3 rounded-xl transition-all ${
            activeLessonId === lesson.id 
            ? 'bg-indigo-50 dark:bg-indigo-900/40 border-indigo-200 dark:border-indigo-800' 
            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
          } ${isLocked ? 'opacity-75' : ''}`}
        >
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2">
              {isEditable ? (
                <Input
                  value={lesson.title}
                  onChange={(e) => onUpdate(lesson.id, { title: e.target.value })}
                  placeholder="Lesson Title"
                  className="bg-transparent border-none focus-visible:ring-1 h-8"
                />
              ) : (
                <button 
                  onClick={() => !isLocked && onSelect?.(lesson)}
                  className={`flex-1 text-left font-medium text-sm flex items-center gap-2 ${isLocked ? 'cursor-not-allowed' : ''}`}
                >
                  {isLocked ? (
                    <Lock size={16} className="text-slate-400" />
                  ) : (
                    <PlayCircle size={16} className="text-indigo-500" />
                  )}
                  {lesson.title}
                </button>
              )}
            </div>
            {isEditable && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onDelete(lesson.id)}
                className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
          
          {isEditable && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex items-center gap-2">
                <Video size={14} className="text-slate-400" />
                <Input
                  value={lesson.videoUrl}
                  onChange={(e) => onUpdate(lesson.id, { videoUrl: e.target.value })}
                  placeholder="YouTube URL"
                  className="h-7 text-xs bg-white dark:bg-slate-900"
                />
              </div>
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-slate-400" />
                <Input
                  value={lesson.notionUrl || ''}
                  onChange={(e) => onUpdate(lesson.id, { notionUrl: e.target.value })}
                  placeholder="Notion URL"
                  className="h-7 text-xs bg-white dark:bg-slate-900"
                />
              </div>
            </div>
          )}
        </div>
      ))}
      {isEditable && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAdd}
          className="w-full border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400"
        >
          <Plus size={14} className="mr-2" /> Add Lesson
        </Button>
      )}
    </div>
  );
};

export default LessonList;