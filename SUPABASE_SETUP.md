# Supabase Database Setup Guide

This guide will help you set up your Supabase database to sync course data.

## Quick Setup (Recommended)

1. **Open your Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Run the Simple Schema**
   - Go to **SQL Editor** → **New query**
   - Copy the contents of `supabase-simple-schema.sql`
   - Paste and click **Run**

3. **Done!** The app will now save course data to Supabase.

## Alternative: Multi-Table Schema

For the normalized schema (courses, modules, chapters, lessons tables), use `supabase-schema.sql` instead. The app currently uses the **simple single-table** approach.

4. **Verify Environment Variables**
   Make sure your `.env` file contains:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

5. **Test the Connection**
   - Start your development server: `npm run dev`
   - The app will automatically:
     - Load existing course data from Supabase on startup
     - Create the initial course if none exists
     - Sync all changes to the database automatically (with 1 second debounce)

## How It Works

- **Automatic Sync**: All course updates (modules, chapters, lessons) are automatically saved to Supabase with a 1-second debounce to prevent excessive API calls
- **Fallback**: If Supabase is unavailable, the app falls back to localStorage
- **Loading States**: The UI shows loading indicators while fetching/saving data
- **Error Handling**: Errors are displayed via toast notifications

## Database Structure

```
courses
  └── modules
       └── chapters
            └── lessons
```

All relationships use CASCADE DELETE, so deleting a course will automatically delete all related modules, chapters, and lessons.

## Security Notes

The current setup uses public read/write access. For production, you should:
1. Implement authentication
2. Update RLS policies to restrict access based on user roles
3. Consider using service role keys for admin operations
