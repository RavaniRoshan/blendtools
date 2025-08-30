import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthState {
  // State
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
  
  // Actions
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<{ success: boolean; error?: string }>
  signInWithOAuth: (provider: 'github' | 'google') => Promise<{ success: boolean; error?: string }>
  clearError: () => void
  initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      user: null,
      session: null,
      loading: true,
      error: null,

      // Actions
      signIn: async (email: string, password: string) => {
        set({ loading: true, error: null })
        
        try {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
          
          if (error) {
            set({ loading: false, error: error.message })
            return { success: false, error: error.message }
          }
          
          set({ loading: false })
          return { success: true }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
          set({ loading: false, error: errorMessage })
          return { success: false, error: errorMessage }
        }
      },

      signUp: async (email: string, password: string) => {
        set({ loading: true, error: null })
        
        try {
          const { error } = await supabase.auth.signUp({
            email,
            password,
          })
          
          if (error) {
            set({ loading: false, error: error.message })
            return { success: false, error: error.message }
          }
          
          set({ loading: false })
          return { success: true }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
          set({ loading: false, error: errorMessage })
          return { success: false, error: errorMessage }
        }
      },

      signOut: async () => {
        set({ loading: true, error: null })
        
        try {
          const { error } = await supabase.auth.signOut()
          
          if (error) {
            set({ loading: false, error: error.message })
            return { success: false, error: error.message }
          }
          
          set({ user: null, session: null, loading: false })
          return { success: true }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
          set({ loading: false, error: errorMessage })
          return { success: false, error: errorMessage }
        }
      },

      signInWithOAuth: async (provider: 'github' | 'google') => {
        set({ loading: true, error: null })
        
        try {
          const redirectTo = typeof window !== 'undefined' 
            ? `${window.location.origin}/auth/callback`
            : 'http://localhost:3000/auth/callback'
            
          const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
              redirectTo
            }
          })
          
          if (error) {
            set({ loading: false, error: error.message })
            return { success: false, error: error.message }
          }
          
          // OAuth redirect happens, so we don't set loading to false here
          return { success: true }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
          set({ loading: false, error: errorMessage })
          return { success: false, error: errorMessage }
        }
      },

      clearError: () => {
        set({ error: null })
      },

      initializeAuth: async () => {
        try {
          // Get initial session
          const { data: { session }, error } = await supabase.auth.getSession()
          
          if (error) {
            console.error('Error getting session:', error)
            set({ loading: false, error: error.message })
            return
          }

          set({
            session,
            user: session?.user ?? null,
            loading: false
          })

          // Listen for auth changes
          supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event, session?.user?.email)
            
            set({
              session,
              user: session?.user ?? null,
              loading: false
            })

            // Clear error on successful auth state change
            if (session && get().error) {
              set({ error: null })
            }
          })
        } catch (err) {
          console.error('Error initializing auth:', err)
          set({ 
            loading: false, 
            error: err instanceof Error ? err.message : 'Failed to initialize authentication'
          })
        }
      },
    })),
    { name: 'auth-store' }
  )
)

// Export a function to initialize auth - call this from a React component
export const initializeAuthStore = () => {
  return useAuthStore.getState().initializeAuth()
}