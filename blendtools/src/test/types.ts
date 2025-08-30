/// <reference types="vitest" />
import { vi } from 'vitest'

// Make vi globally available
declare global {
  const vi: typeof import('vitest').vi
}

// Mock types for Supabase
export interface MockSupabaseResponse<T = any> {
  data: T | null
  error: any | null
}

export interface MockSupabaseClient {
  auth: {
    getSession: ReturnType<typeof vi.fn>
    getUser: ReturnType<typeof vi.fn>
    signUp: ReturnType<typeof vi.fn>
    signInWithPassword: ReturnType<typeof vi.fn>
    signInWithOAuth: ReturnType<typeof vi.fn>
    signOut: ReturnType<typeof vi.fn>
    onAuthStateChange: ReturnType<typeof vi.fn>
  }
  from: ReturnType<typeof vi.fn>
  channel: ReturnType<typeof vi.fn>
}

// Test state types
export interface TestState {
  loading?: boolean
  error?: string | null
  [key: string]: any
}

// Component test props
export interface ComponentTestProps {
  [key: string]: any
}