import { supabase } from './supabase';
import { Course } from '@/types/course';

// Single table - stores entire course as JSON
const COURSE_DATA_TABLE = 'course_data';

export const courseService = {
  async getCourse(courseId: string = 'main-course'): Promise<Course | null> {
    try {
      const { data, error } = await supabase
        .from(COURSE_DATA_TABLE)
        .select('data')
        .eq('id', courseId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (!data?.data) return null;

      return data.data as Course;
    } catch (error) {
      console.error('Error fetching course:', error);
      return null;
    }
  },

  async saveCourse(course: Course): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(COURSE_DATA_TABLE)
        .upsert(
          {
            id: course.id,
            data: course,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );

      if (error) throw error;
      return true;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'message' in error
            ? String((error as { message: string }).message)
            : String(error);
      console.error('Error saving course:', error);
      throw new Error(message);
    }
  },
};
