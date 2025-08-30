# 🚀 SUPABASE DATABASE SETUP INSTRUCTIONS

## ✅ **Environment Variables Configured**
Your `.env.local` file has been updated with your Supabase credentials:
- **Project URL**: https://prbfqqnlcsujirmnasvy.supabase.co
- **Anonymous Key**: Configured ✅
- **Development Server**: Restarted and running on http://localhost:5174

---

## 📋 **NEXT STEP: Set Up Database Schema**

### **1. Open Your Supabase Dashboard**
Go to: [https://supabase.com/dashboard/projects](https://supabase.com/dashboard/projects)

### **2. Navigate to SQL Editor**
1. Select your project: `prbfqqnlcsujirmnasvy`
2. Click on **"SQL Editor"** in the left sidebar
3. Click **"New Query"**

### **3. Copy and Run the Database Schema**
Copy the **entire contents** of this file:
📁 `c:\Users\Admin\OneDrive\Desktop\Roshan's space\Project-production\blendtools\blendtools\database-schema.sql`

**OR** copy this complete schema:

```sql
-- BlendTools Database Schema Setup
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security on auth.users
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create public.users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create public.scripts table
CREATE TABLE IF NOT EXISTS public.scripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  code TEXT NOT NULL,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  downloads INTEGER DEFAULT 0 NOT NULL,
  rating NUMERIC(3,2) DEFAULT 0.0 NOT NULL CHECK (rating >= 0 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create public.shaders table
CREATE TABLE IF NOT EXISTS public.shaders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  node_data JSONB,
  preview_url TEXT,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create public.projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create public.render_jobs table
CREATE TABLE IF NOT EXISTS public.render_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('queued', 'rendering', 'completed', 'failed')) DEFAULT 'queued' NOT NULL,
  progress INTEGER DEFAULT 0 NOT NULL CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scripts_author_id ON public.scripts(author_id);
CREATE INDEX IF NOT EXISTS idx_scripts_category ON public.scripts(category);
CREATE INDEX IF NOT EXISTS idx_scripts_created_at ON public.scripts(created_at);
CREATE INDEX IF NOT EXISTS idx_scripts_rating ON public.scripts(rating);

CREATE INDEX IF NOT EXISTS idx_shaders_author_id ON public.shaders(author_id);
CREATE INDEX IF NOT EXISTS idx_shaders_category ON public.shaders(category);
CREATE INDEX IF NOT EXISTS idx_shaders_created_at ON public.shaders(created_at);

CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON public.projects(updated_at);

CREATE INDEX IF NOT EXISTS idx_render_jobs_project_id ON public.render_jobs(project_id);
CREATE INDEX IF NOT EXISTS idx_render_jobs_status ON public.render_jobs(status);
CREATE INDEX IF NOT EXISTS idx_render_jobs_created_at ON public.render_jobs(created_at);

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shaders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.render_jobs ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies

-- Users policies
CREATE POLICY "Users can read their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Scripts policies
CREATE POLICY "Scripts are publicly readable" ON public.scripts
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Users can create scripts" ON public.scripts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own scripts" ON public.scripts
  FOR UPDATE TO authenticated USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own scripts" ON public.scripts
  FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- Shaders policies
CREATE POLICY "Shaders are publicly readable" ON public.shaders
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Users can create shaders" ON public.shaders
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own shaders" ON public.shaders
  FOR UPDATE TO authenticated USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own shaders" ON public.shaders
  FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- Projects policies
CREATE POLICY "Users can read their own projects" ON public.projects
  FOR SELECT TO authenticated USING (auth.uid() = owner_id);

CREATE POLICY "Users can create projects" ON public.projects
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own projects" ON public.projects
  FOR UPDATE TO authenticated USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own projects" ON public.projects
  FOR DELETE TO authenticated USING (auth.uid() = owner_id);

-- Render jobs policies
CREATE POLICY "Users can read render jobs for their projects" ON public.render_jobs
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = render_jobs.project_id 
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create render jobs for their projects" ON public.render_jobs
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = render_jobs.project_id 
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update render jobs for their projects" ON public.render_jobs
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = render_jobs.project_id 
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete render jobs for their projects" ON public.render_jobs
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = render_jobs.project_id 
      AND projects.owner_id = auth.uid()
    )
  );

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to increment script downloads
CREATE OR REPLACE FUNCTION public.increment_script_downloads(script_id UUID)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE public.scripts
  SET downloads = downloads + 1
  WHERE id = script_id
  RETURNING downloads INTO new_count;
  
  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update project updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_project_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update project updated_at
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_project_updated_at();

-- Enable real-time subscriptions for all tables (optional)
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.scripts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.shaders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.render_jobs;
```

### **4. Execute the Query**
1. Paste the entire schema into the SQL Editor
2. Click **"Run"** button
3. Wait for completion (should show "Success")

### **5. Verify Tables Created**
Go to **"Table Editor"** in the left sidebar and you should see:
- ✅ `users`
- ✅ `scripts`
- ✅ `shaders`
- ✅ `projects`
- ✅ `render_jobs`

---

## 🎯 **After Database Setup**

Once you run the schema:
1. **Refresh your BlendTools app** (http://localhost:5174)
2. **The orange development notice should disappear**
3. **Authentication will be fully functional**
4. **Database operations will work**

---

## 🔧 **Test Authentication**

Try these features after setup:
1. **Sign up with email/password**
2. **Sign in with existing account**
3. **OAuth with GitHub/Google** (requires additional setup)

---

## 🚨 **Important Notes**

- **Row Level Security** is enabled for data protection
- **Real-time subscriptions** are configured
- **Automatic user profile creation** on signup
- **Performance indexes** are created
- **Secure functions** for database operations

**The development notice will automatically disappear once the database is set up!**