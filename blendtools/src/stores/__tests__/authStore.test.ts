import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mockSupabaseClient, createMockUser } from '../../test/utils'

// Mock the supabase client before importing the store
vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabaseClient,
}))

// Import the store after mocking
import { useAuthStore } from '../authStore'

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      session: null,
      loading: false,
      error: null,
    })
    
    // Reset all mocks
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useAuthStore.getState()
      
      expect(state.user).toBeNull()
      expect(state.session).toBeNull()
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('signUp', () => {
    it('should handle successful sign up', async () => {
      mockSupabaseClient.auth.signUp.mockResolvedValueOnce({
        data: { user: createMockUser(), session: null },
        error: null,
      })

      const { signUp } = useAuthStore.getState()
      const result = await signUp('test@example.com', 'password123')

      expect(result.success).toBe(true)
      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    it('should handle sign up error', async () => {
      const error = { message: 'Email already registered' }
      
      mockSupabaseClient.auth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error,
      })

      const { signUp } = useAuthStore.getState()
      const result = await signUp('test@example.com', 'password123')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Email already registered')
      expect(useAuthStore.getState().error).toBe('Email already registered')
    })

    it('should set loading state during sign up', async () => {
      // Create a promise that we can control
      let resolveSignUp: (value: any) => void
      const signUpPromise = new Promise((resolve) => {
        resolveSignUp = resolve
      })
      
      mockSupabaseClient.auth.signUp.mockReturnValueOnce(signUpPromise)

      const { signUp } = useAuthStore.getState()
      
      // Start sign up (don't await yet)
      const signUpCall = signUp('test@example.com', 'password123')
      
      // Check loading state is true
      expect(useAuthStore.getState().loading).toBe(true)
      
      // Resolve the promise
      resolveSignUp({
        data: { user: null, session: null },
        error: null,
      })
      
      // Wait for completion
      await signUpCall
      
      // Check loading state is false
      expect(useAuthStore.getState().loading).toBe(false)
    })
  })

  describe('signIn', () => {
    it('should handle successful sign in', async () => {
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: createMockUser(), session: null },
        error: null,
      })

      const { signIn } = useAuthStore.getState()
      const result = await signIn('test@example.com', 'password123')

      expect(result.success).toBe(true)
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    it('should handle sign in error', async () => {
      const error = { message: 'Invalid credentials' }
      
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error,
      })

      const { signIn } = useAuthStore.getState()
      const result = await signIn('test@example.com', 'wrongpassword')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid credentials')
      expect(useAuthStore.getState().error).toBe('Invalid credentials')
    })
  })

  describe('signInWithOAuth', () => {
    it('should handle successful OAuth sign in', async () => {
      mockSupabaseClient.auth.signInWithOAuth.mockResolvedValueOnce({
        data: { url: 'https://github.com/oauth/callback' },
        error: null,
      })

      const { signInWithOAuth } = useAuthStore.getState()
      const result = await signInWithOAuth('github')

      expect(result.success).toBe(true)
      expect(mockSupabaseClient.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'github',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback',
        },
      })
    })

    it('should handle OAuth error', async () => {
      const error = { message: 'OAuth provider not configured' }
      
      mockSupabaseClient.auth.signInWithOAuth.mockResolvedValueOnce({
        data: { url: null },
        error,
      })

      const { signInWithOAuth } = useAuthStore.getState()
      const result = await signInWithOAuth('github')

      expect(result.success).toBe(false)
      expect(result.error).toBe('OAuth provider not configured')
    })
  })

  describe('signOut', () => {
    it('should handle successful sign out', async () => {
      // Set initial user state
      const mockUser = createMockUser()
      useAuthStore.setState({ user: mockUser })

      mockSupabaseClient.auth.signOut.mockResolvedValueOnce({
        error: null,
      })

      const { signOut } = useAuthStore.getState()
      const result = await signOut()

      expect(result.success).toBe(true)
      expect(useAuthStore.getState().user).toBeNull()
      expect(useAuthStore.getState().session).toBeNull()
      expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled()
    })

    it('should handle sign out error', async () => {
      const error = { message: 'Network error' }
      
      mockSupabaseClient.auth.signOut.mockResolvedValueOnce({
        error,
      })

      const { signOut } = useAuthStore.getState()
      const result = await signOut()

      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
    })
  })

  describe('clearError', () => {
    it('should clear error state', () => {
      // Set initial error state
      useAuthStore.setState({ error: 'Some error' })

      const { clearError } = useAuthStore.getState()
      clearError()

      expect(useAuthStore.getState().error).toBeNull()
    })
  })
})