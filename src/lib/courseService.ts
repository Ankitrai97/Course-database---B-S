import { supabase } from './supabase';
import { Course } from '@/types/course';

const COURSE_DATA_TABLE = 'course_data';

export const courseService = {
  async getCourse(courseId: string = 'main-course'): Promise<Course | null> {
    try {
      const { data, error } = await supabase
        .from(COURSE_DATA_TABLE)
        .select('data')
        .eq('id', courseId)
        .maybeSingle();

      if (error) {
        console.error('Supabase error fetching course:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      if (!data?.data) return null;

      return data.data as Course;
    } catch (error) {
      console.error('Error in getCourse:', error);
      throw error;
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

      if (error) {
        console.error('Supabase error saving course:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      return true;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'message' in error
            ? String((error as { message: string }).message)
            : String(error);
      console.error('Error in saveCourse:', error);
      throw new Error(message);
    }
  },
};