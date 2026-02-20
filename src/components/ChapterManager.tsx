"use client";

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen } from "lucide-react";
import LessonList from './LessonList';
import { Chapter, Lesson } from '@/types/course';

interface ChapterManagerProps {
  chapters: Chapter[];
  onSelectLesson?: (lesson: Lesson) => void;
  activeLessonId?: string;
}

const ChapterManager = ({ 
  chapters, 
  onSelectLesson,
  activeLessonId
}: ChapterManagerProps) => {
  return (
    <div className="space-y-4">
      <Accordion type="multiple" className="w-full space-y-2">
        {chapters.map((chapter) => (
          <AccordionItem 
            key={chapter.id} 
            value={chapter.id}
            className="border rounded-2xl bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden"
          >
            <div className="flex items-center px-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <AccordionTrigger className="flex-1 hover:no-underline py-4">
                <div className="flex items-center gap-3 w-full text-left">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600">
                    <BookOpen size={18} />
                  </div>
                  <span className="font-semibold">{chapter.title}</span>
                </div>
              </AccordionTrigger>
            </div>
            <AccordionContent className="px-4 pb-4">
              <LessonList 
                lessons={chapter.lessons}
                onSelect={onSelectLesson}
                activeLessonId={activeLessonId}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ChapterManager;