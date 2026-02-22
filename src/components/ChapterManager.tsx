"use client";

import React, { useMemo } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, BookOpen } from "lucide-react";
import LessonList from './LessonList';
import { Chapter, Lesson } from '@/types/course';

interface ChapterManagerProps {
  chapters: Chapter[];
  onUpdateChapters: (chapters: Chapter[]) => void;
  isEditable?: boolean;
  onSelectLesson?: (lesson: Lesson) => void;
  activeLessonId?: string;
}

const ChapterManager = ({ 
  chapters, 
  onUpdateChapters, 
  isEditable = true,
  onSelectLesson,
  activeLessonId
}: ChapterManagerProps) => {
  
  // Find the ID of the chapter that contains the active lesson to expand it by default
  const defaultExpandedChapter = useMemo(() => {
    if (!activeLessonId) return [];
    const chapter = chapters.find(c => c.lessons.some(l => l.id === activeLessonId));
    return chapter ? [chapter.id] : [];
  }, [chapters, activeLessonId]);

  const addChapter = () => {
    const newChapter: Chapter = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Chapter',
      lessons: []
    };
    onUpdateChapters([...chapters, newChapter]);
  };

  const deleteChapter = (id: string) => {
    onUpdateChapters(chapters.filter(c => c.id !== id));
  };

  const updateChapterTitle = (id: string, title: string) => {
    onUpdateChapters(chapters.map(c => c.id === id ? { ...c, title } : c));
  };

  const addLesson = (chapterId: string) => {
    onUpdateChapters(chapters.map(c => {
      if (c.id === chapterId) {
        return {
          ...c,
          lessons: [...c.lessons, {
            id: Math.random().toString(36).substr(2, 9),
            title: 'New Lesson',
            videoUrl: '',
            notionUrl: ''
          }]
        };
      }
      return c;
    }));
  };

  const updateLesson = (chapterId: string, lessonId: string, updates: Partial<Lesson>) => {
    onUpdateChapters(chapters.map(c => {
      if (c.id === chapterId) {
        return {
          ...c,
          lessons: c.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l)
        };
      }
      return c;
    }));
  };

  const deleteLesson = (chapterId: string, lessonId: string) => {
    onUpdateChapters(chapters.map(c => {
      if (c.id === chapterId) {
        return { ...c, lessons: c.lessons.filter(l => l.id !== lessonId) };
      }
      return c;
    }));
  };

  return (
    <div className="space-y-4">
      <Accordion 
        type="multiple" 
        className="w-full space-y-2"
        defaultValue={defaultExpandedChapter}
      >
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
                  {isEditable ? (
                    <Input
                      value={chapter.title}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateChapterTitle(chapter.id, e.target.value)}
                      className="bg-transparent border-none font-semibold focus-visible:ring-1"
                    />
                  ) : (
                    <span className="font-semibold">{chapter.title}</span>
                  )}
                </div>
              </AccordionTrigger>
              {isEditable && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChapter(chapter.id);
                  }}
                  className="text-slate-400 hover:text-rose-500"
                >
                  <Trash2 size={18} />
                </Button>
              )}
            </div>
            <AccordionContent className="px-4 pb-4">
              <LessonList 
                lessons={chapter.lessons}
                onAdd={() => addLesson(chapter.id)}
                onUpdate={(lessonId, updates) => updateLesson(chapter.id, lessonId, updates)}
                onDelete={(lessonId) => deleteLesson(chapter.id, lessonId)}
                isEditable={isEditable}
                onSelect={onSelectLesson}
                activeLessonId={activeLessonId}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      {isEditable && (
        <Button 
          onClick={addChapter} 
          className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 h-12 shadow-md shadow-indigo-200"
        >
          <Plus className="mr-2" size={20} /> Add Chapter
        </Button>
      )}
    </div>
  );
};

export default ChapterManager;