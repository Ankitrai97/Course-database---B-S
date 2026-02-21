# Supabase Database Setup Guide

This guide will help you set up your Supabase database to sync course data and automate user onboarding.

## Quick Setup (Recommended)

1. **Open your Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Run the Simple Schema**
   - Go to **SQL Editor** → **New query**
   - Copy the contents of `supabase-simple-schema.sql`
   - Paste and click **Run**

3. **Set up Automation Triggers**
   - Run the following SQL to automatically create profiles and course access for new users:
   ```sql
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER
   LANGUAGE PLPGSQL
   SECURITY DEFINER SET search_path = ''
   AS $$
   BEGIN
     INSERT INTO public.profiles (id, email, role)
     VALUES (new.id, new.email, 'student');

     INSERT INTO public.course_access (user_id, status)
     VALUES (new.id, 'inactive');

     RETURN new;
   END;
   $$;

   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
   ```

4. **Done!** The app will now:
   - Save course data to Supabase.
   - Automatically create an "inactive" subscription for every new student.

## How It Works

- **Automatic Onboarding**: The database trigger ensures that as soon as a user signs up via Google or Email, they have a profile and a course access record ready to be updated by your n8n workflow.
- **Automatic Sync**: All course updates (modules, chapters, lessons) are automatically saved to Supabase with a 1-second debounce.
- **Fallback**: If Supabase is unavailable, the app falls back to localStorage.

## Security Notes

- **RLS Policies**: Ensure Row Level Security is enabled. Students can only see their own `course_access` and `profiles`.
- **Admin Role**: To edit the course, manually change a user's `role` to 'admin' in the `profiles` table.