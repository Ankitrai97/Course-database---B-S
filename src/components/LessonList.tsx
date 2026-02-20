"use client";

import React from 'react';
import { PlayCircle } from "lucide-react";
import { Lesson } from '@/types/course';

interface LessonListProps {
  lessons: Lesson[];
  onSelect?: (lesson: Lesson) => void;
  activeLessonId?: string;
}

const LessonList = ({ 
  lessons, 
  onSelect, 
  activeLessonId
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
          }`}
        >
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onSelect?.(lesson)}
              className="flex-1 text-left font-medium text-sm flex items-center gap-2"
            >
              <PlayCircle size={16} className={activeLessonId === lesson.id ? "text-indigo-600" : "text-indigo-400"} />
              {lesson.title}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LessonList;