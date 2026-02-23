"use client";

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, BookOpen, GripVertical } from "lucide-react";
import LessonList from './LessonList';
import { Chapter, Lesson } from '@/types/course';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

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
  
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !isEditable) return;
    
    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onUpdateChapters(items);
  };

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

  const reorderLessons = (chapterId: string, lessons: Lesson[]) => {
    onUpdateChapters(chapters.map(c => 
      c.id === chapterId ? { ...c, lessons } : c
    ));
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
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="chapters">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              <Accordion type="multiple" className="w-full space-y-2">
                {chapters.map((chapter, index) => (
                  <Draggable 
                    key={chapter.id} 
                    draggableId={chapter.id} 
                    index={index}
                    isDragDisabled={!isEditable}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={snapshot.isDragging ? 'z-50' : ''}
                      >
                        <AccordionItem 
                          value={chapter.id}
                          className={`border rounded-2xl bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden ${snapshot.isDragging ? 'ring-2 ring-indigo-500 shadow-lg' : ''}`}
                        >
                          <div className="flex items-center px-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            {isEditable && (
                              <div {...provided.dragHandleProps} className="text-slate-400 hover:text-indigo-500 cursor-grab active:cursor-grabbing mr-2">
                                <GripVertical size={18} />
                              </div>
                            )}
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
                              onReorder={(lessons) => reorderLessons(chapter.id, lessons)}
                              onDelete={(lessonId) => deleteLesson(chapter.id, lessonId)}
                              isEditable={isEditable}
                              onSelect={onSelectLesson}
                              activeLessonId={activeLessonId}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Accordion>
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
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