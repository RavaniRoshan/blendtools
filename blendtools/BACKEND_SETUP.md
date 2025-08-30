# BlendTools Backend Setup

This document outlines the backend setup that has been implemented for BlendTools, including Supabase integration and authentication.

## ✅ What's Been Implemented

### 1. Supabase Client Configuration
- **File**: `src/lib/supabase.ts`
- **Features**: 
  - Supabase client initialization
  - Environment variable validation
  - TypeScript database types

### 2. Authentication System
- **File**: `src/hooks/useAuth.tsx`
- **Features**:
  - React Context for authentication state
  - Email/password authentication
  - OAuth support (GitHub, Google)
  - Session management
  - Loading states

### 3. Database Service Layer
- **Scripts Service**: `src/lib/scriptService.ts`
- **Shaders Service**: `src/lib/shaderService.ts`
- **Projects Service**: `src/lib/projectService.ts`
- **Render Jobs Service**: `src/lib/renderJobService.ts`
- **Features**:
  - CRUD operations for all entities
  - Search functionality
  - Type-safe database operations

### 4. UI Components
- **Auth Component**: `src/components/AuthComponent.tsx`
- **Auth Callback**: `src/pages/AuthCallback.tsx`
- **Features**:
  - Login/signup forms
  - OAuth buttons
  - Loading states
  - Error handling

### 5. Environment Configuration
- **File**: `.env.local`
- **Variables**:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

### 6. Dependencies Added
- `@supabase/supabase-js` - Supabase client
- `zustand` - State management (ready for implementation)

## 🚀 Setup Instructions

### 1. Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Update `.env.local` with your credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 2. Database Schema Setup
1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Run the SQL script from `database-schema.sql`
4. This will create:
   - All required tables (users, scripts, shaders, projects, render_jobs)
   - Row Level Security policies
   - Indexes for performance
   - Trigger functions
   - Sample data structure

### 3. Authentication Configuration
1. In Supabase dashboard, go to Authentication > Settings
2. Configure OAuth providers:
   - **GitHub**: Add your GitHub OAuth app credentials
   - **Google**: Add your Google OAuth credentials
3. Set redirect URLs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

### 4. Install Dependencies
```bash
npm install
```

### 5. Run the Application
```bash
npm run dev
```

## 📊 Database Schema

### Tables Created:
1. **users** - User profiles (extends auth.users)
2. **scripts** - Python scripts for Blender
3. **shaders** - Shader materials and node graphs
4. **projects** - User projects
5. **render_jobs** - Render queue management

### Features:
- Row Level Security (RLS) enabled
- Automatic user profile creation on signup
- Foreign key relationships
- Performance indexes
- Real-time subscriptions enabled

## 🔒 Security Features

- Row Level Security policies implemented
- User data isolation
- Authenticated-only write operations
- Public read access for scripts/shaders
- Private access for projects/render jobs

## 🎯 Next Steps

### State Management (Zustand)
The next priority is implementing Zustand stores for:
- User state
- Scripts state  
- Shaders state
- Projects state
- Render jobs state

### Integration with Existing Components
Update existing components to use the new backend services:
- ScriptHub → scriptService
- ShaderLibrary → shaderService
- ProjectDashboard → projectService

### Real-time Features
Implement real-time subscriptions for:
- Live render progress updates
- Collaborative project features
- Real-time script/shader updates

## 🧪 Testing the Setup

1. **Start the development server**: `npm run dev`
2. **Check authentication**: The auth system should work if Supabase is configured
3. **Test database operations**: Use the service files to interact with the database
4. **Verify OAuth**: Test GitHub/Google login (requires OAuth app setup)

## 📁 File Structure

```
src/
├── lib/
│   ├── supabase.ts          # Supabase client
│   ├── scriptService.ts     # Scripts CRUD
│   ├── shaderService.ts     # Shaders CRUD
│   ├── projectService.ts    # Projects CRUD
│   └── renderJobService.ts  # Render jobs CRUD
├── hooks/
│   └── useAuth.tsx          # Authentication hook
├── components/
│   └── AuthComponent.tsx    # Auth UI component
├── pages/
│   └── AuthCallback.tsx     # OAuth callback handler
└── .env.local               # Environment variables
```

## 🐛 Troubleshooting

### Common Issues:
1. **Environment variables not loading**: Restart the dev server after updating `.env.local`
2. **OAuth redirect errors**: Check redirect URLs in Supabase dashboard
3. **Database permission errors**: Verify RLS policies are correctly applied
4. **TypeScript errors**: Ensure all dependencies are installed

### Verification Steps:
1. Check Supabase connection in browser console
2. Test authentication flow
3. Verify database operations in Supabase dashboard
4. Check network requests in browser dev tools

The backend infrastructure is now ready! You can proceed with connecting your existing UI components to use the new database services.