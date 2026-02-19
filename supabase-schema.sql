-- Supabase Database Schema for Course Management
-- Run this SQL in your Supabase SQL Editor

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create modules table
CREATE TABLE IF NOT EXISTS modules (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  chapter_id TEXT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  video_url TEXT,
  notion_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_modules_course_id ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_chapters_module_id ON chapters(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_chapter_id ON lessons(chapter_id);

-- Enable Row Level Security (RLS)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read/write (adjust based on your security needs)
-- For now, allowing all operations. You may want to restrict this based on authentication.

-- Courses policies
CREATE POLICY "Allow public read access on courses" ON courses
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access on courses" ON courses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access on courses" ON courses
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access on courses" ON courses
  FOR DELETE USING (true);

-- Modules policies
CREATE POLICY "Allow public read access on modules" ON modules
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access on modules" ON modules
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access on modules" ON modules
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access on modules" ON modules
  FOR DELETE USING (true);

-- Chapters policies
CREATE POLICY "Allow public read access on chapters" ON chapters
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access on chapters" ON chapters
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access on chapters" ON chapters
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access on chapters" ON chapters
  FOR DELETE USING (true);

-- Lessons policies
CREATE POLICY "Allow public read access on lessons" ON lessons
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access on lessons" ON lessons
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access on lessons" ON lessons
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access on lessons" ON lessons
  FOR DELETE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON chapters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
