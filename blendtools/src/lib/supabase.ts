import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if we have valid Supabase credentials
const hasValidCredentials = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_project_url_here' &&
  supabaseAnonKey !== 'your_supabase_anon_key_here' &&
  supabaseUrl.startsWith('https://')

if (!hasValidCredentials) {
  console.warn('⚠️  Supabase credentials not configured. Using mock client for development.')
  console.info('To configure Supabase:')
  console.info('1. Create a project at https://supabase.com')
  console.info('2. Update .env.local with your credentials')
  console.info('3. Run the database schema from database-schema.sql')
}

// Create either a real Supabase client or a mock one for development
export const supabase = hasValidCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockSupabaseClient()

// Mock Supabase client for development when credentials are not configured
function createMockSupabaseClient() {
  const mockAuth = {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: async () => ({ error: { message: 'Supabase not configured' } }),
    signUp: async () => ({ error: { message: 'Supabase not configured' } }),
    signOut: async () => ({ error: null }),
    signInWithOAuth: async () => ({ error: { message: 'Supabase not configured' } }),
  }

  const mockFrom = () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: null, error: { message: 'Supabase not configured' } }),
    update: () => ({ data: null, error: { message: 'Supabase not configured' } }),
    delete: () => ({ error: { message: 'Supabase not configured' } }),
    eq: function() { return this },
    single: function() { return this },
    order: function() { return this },
    or: function() { return this },
    in: function() { return this },
  })

  return {
    auth: mockAuth,
    from: mockFrom,
    rpc: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
  }
}

// Database types (will be auto-generated later)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      scripts: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string | null
          code: string
          author_id: string
          downloads: number
          rating: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category?: string | null
          code: string
          author_id: string
          downloads?: number
          rating?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string | null
          code?: string
          author_id?: string
          downloads?: number
          rating?: number
          created_at?: string
        }
      }
      shaders: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string | null
          node_data: any
          preview_url: string | null
          author_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category?: string | null
          node_data: any
          preview_url?: string | null
          author_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string | null
          node_data?: any
          preview_url?: string | null
          author_id?: string
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      render_jobs: {
        Row: {
          id: string
          name: string
          project_id: string
          status: 'queued' | 'rendering' | 'completed' | 'failed'
          progress: number
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          name: string
          project_id: string
          status?: 'queued' | 'rendering' | 'completed' | 'failed'
          progress?: number
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          project_id?: string
          status?: 'queued' | 'rendering' | 'completed' | 'failed'
          progress?: number
          created_at?: string
          completed_at?: string | null
        }
      }
    }
  }
}