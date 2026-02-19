-- Run this ENTIRE script in Supabase SQL Editor to fix/create the course_data table
-- Dashboard > SQL Editor > New query > Paste and Run

-- Remove old table if it exists (clean slate)
DROP TABLE IF EXISTS course_data;

-- Create the course_data table
CREATE TABLE course_data (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE course_data ENABLE ROW LEVEL SECURITY;

-- Policies (allow all for now)
DROP POLICY IF EXISTS "Allow all on course_data" ON course_data;
CREATE POLICY "Allow all on course_data" ON course_data
  FOR ALL USING (true) WITH CHECK (true);
