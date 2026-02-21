"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle, BookOpen, Sparkles, Lock } from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  isLocked?: boolean;
  moduleCount: number;
}

export default function CourseCard({ id, title, description, isLocked, moduleCount }: CourseCardProps) {
  return (
    <Card className="group border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]">
      <div className="aspect-[16/9] bg-gradient-to-tr from-indigo-600 to-violet-500 relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
        <Sparkles className="text-white/20 w-24 h-24 absolute -bottom-4 -right-4 rotate-12" />
        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-2xl">
          <PlayCircle size={32} />
        </div>
        {isLocked && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-black/40 backdrop-blur-md border-white/10 text-white gap-1">
              <Lock size={12} /> Premium
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest">
          <BookOpen size={14} />
          {moduleCount} Modules
        </div>
        <h3 className="text-2xl font-black tracking-tight leading-tight">{title}</h3>
        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
          {description}
        </p>
      </CardContent>

      <CardFooter className="px-8 pb-8 pt-0">
        <Button asChild className="w-full rounded-2xl h-12 bg-slate-900 hover:bg-indigo-600 text-white font-bold transition-all">
          <Link to={`/course/${id}`}>
            {isLocked ? "Unlock Course" : "Continue Learning"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}