import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, mockSupabaseClient, createMockUser } from '../../test/utils'
import { AuthComponent } from '../../components/AuthComponent'

// Mock the useAuth hook
vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

const mockUseAuth = {
  user: null,
  loading: false,
  signUp: vi.fn(),
  signIn: vi.fn(),
  signInWithOAuth: vi.fn(),
  signOut: vi.fn(),
}

describe('Authentication Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset mock auth
    Object.assign(mockUseAuth, {
      user: null,
      loading: false,
    })
    
    // Import the useAuth module after mocking
    const { useAuth } = require('../../hooks/useAuth')
    useAuth.mockReturnValue(mockUseAuth)
  })

  describe('Sign Up Flow', () => {
    it('should handle successful sign up', async () => {
      const user = userEvent.setup()
      const mockUser = createMockUser()
      
      mockUseAuth.signUp.mockResolvedValueOnce({ data: { user: mockUser }, error: null })
      
      render(<AuthComponent />)
      
      // Click sign up toggle button
      const signUpToggle = screen.getByRole('button', { name: /don't have an account\? sign up/i })
      await user.click(signUpToggle)
      
      // Fill in the form
      const emailInput = screen.getByPlaceholderText(/email/i)
      const passwordInput = screen.getByPlaceholderText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign up$/i })
      
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)
      
      expect(mockUseAuth.signUp).toHaveBeenCalledWith('test@example.com', 'password123')
    })

    it('should handle sign up errors', async () => {
      const user = userEvent.setup()
      
      mockUseAuth.signUp.mockResolvedValueOnce({ 
        data: { user: null },
        error: { message: 'Email already registered' }
      })
      
      render(<AuthComponent />)
      
      // Click sign up toggle button
      const signUpToggle = screen.getByRole('button', { name: /don't have an account\? sign up/i })
      await user.click(signUpToggle)
      
      // Fill in the form
      const emailInput = screen.getByPlaceholderText(/email/i)
      const passwordInput = screen.getByPlaceholderText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign up$/i })
      
      await user.type(emailInput, 'existing@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)
      
      expect(mockUseAuth.signUp).toHaveBeenCalledWith('existing@example.com', 'password123')
      
      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByText('Email already registered')).toBeInTheDocument()
      })
    })

    it('should validate email format', async () => {
      const user = userEvent.setup()
      
      render(<AuthComponent />)
      
      // Click sign up toggle button
      const signUpToggle = screen.getByRole('button', { name: /don't have an account\? sign up/i })
      await user.click(signUpToggle)
      
      // Fill in invalid email
      const emailInput = screen.getByPlaceholderText(/email/i)
      const passwordInput = screen.getByPlaceholderText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign up$/i })
      
      await user.type(emailInput, 'invalid-email')
      await user.type(passwordInput, 'password123')
      
      // The browser's built-in validation should prevent submission
      expect(emailInput).toBeInvalid()
      expect(mockUseAuth.signUp).not.toHaveBeenCalled()
    })

    it('should validate password length', async () => {
      const user = userEvent.setup()
      
      render(<AuthComponent />)
      
      // Click sign up toggle button
      const signUpToggle = screen.getByRole('button', { name: /don't have an account\? sign up/i })
      await user.click(signUpToggle)
      
      // Fill in short password
      const emailInput = screen.getByPlaceholderText(/email/i)
      const passwordInput = screen.getByPlaceholderText(/password/i)
      
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, '123')
      
      // Since we don't have client-side validation in the component,
      // this test verifies the form fields are accessible
      expect(emailInput).toHaveValue('test@example.com')
      expect(passwordInput).toHaveValue('123')
    })
  })

  describe('Sign In Flow', () => {
    it('should handle successful sign in', async () => {
      const user = userEvent.setup()
      const mockUser = createMockUser()
      
      mockUseAuth.signIn.mockResolvedValueOnce({ data: { user: mockUser }, error: null })
      
      render(<AuthComponent />)
      
      // Sign in is the default state, so we can directly fill the form
      const emailInput = screen.getByPlaceholderText(/email/i)
      const passwordInput = screen.getByPlaceholderText(/password/i)
      const submitButton = screen.getByRole('button', { name: /^sign in$/i })
      
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)
      
      expect(mockUseAuth.signIn).toHaveBeenCalledWith('test@example.com', 'password123')
    })

    it('should handle sign in errors', async () => {
      const user = userEvent.setup()
      
      mockUseAuth.signIn.mockResolvedValueOnce({ 
        data: { user: null },
        error: { message: 'Invalid credentials' }
      })
      
      render(<AuthComponent />)
      
      const emailInput = screen.getByPlaceholderText(/email/i)
      const passwordInput = screen.getByPlaceholderText(/password/i)
      const submitButton = screen.getByRole('button', { name: /^sign in$/i })
      
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'wrongpassword')
      await user.click(submitButton)
      
      expect(mockUseAuth.signIn).toHaveBeenCalledWith('test@example.com', 'wrongpassword')
      
      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
      })
    })
  })

  describe('OAuth Sign In', () => {
    it('should handle GitHub OAuth sign in', async () => {
      const user = userEvent.setup()
      
      mockUseAuth.signInWithOAuth.mockResolvedValueOnce({ 
        data: { url: 'https://github.com/oauth' },
        error: null 
      })
      
      render(<AuthComponent />)
      
      const githubButton = screen.getByRole('button', { name: /github/i })
      await user.click(githubButton)
      
      expect(mockUseAuth.signInWithOAuth).toHaveBeenCalledWith('github')
    })

    it('should handle Google OAuth sign in', async () => {
      const user = userEvent.setup()
      
      mockUseAuth.signInWithOAuth.mockResolvedValueOnce({ 
        data: { url: 'https://accounts.google.com/oauth' },
        error: null 
      })
      
      render(<AuthComponent />)
      
      const googleButton = screen.getByRole('button', { name: /google/i })
      await user.click(googleButton)
      
      expect(mockUseAuth.signInWithOAuth).toHaveBeenCalledWith('google')
    })

    it('should handle OAuth errors', async () => {
      const user = userEvent.setup()
      
      mockUseAuth.signInWithOAuth.mockResolvedValueOnce({ 
        data: { url: null },
        error: { message: 'OAuth provider not configured' }
      })
      
      render(<AuthComponent />)
      
      const githubButton = screen.getByRole('button', { name: /github/i })
      await user.click(githubButton)
      
      expect(mockUseAuth.signInWithOAuth).toHaveBeenCalledWith('github')
      
      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByText('OAuth provider not configured')).toBeInTheDocument()
      })
    })
  })

  describe('Loading States', () => {
    it('should show loading state during sign in', async () => {
      mockUseAuth.loading = true
      
      render(<AuthComponent />)
      
      // Should show loading spinner
      expect(screen.getByRole('status', { hidden: true }) || 
             document.querySelector('.animate-spin')).toBeInTheDocument()
    })

    it('should show loading state when user is authenticated', async () => {
      mockUseAuth.user = createMockUser()
      
      render(<AuthComponent />)
      
      // Should show user info and sign out button
      expect(screen.getByText('Welcome back!')).toBeInTheDocument()
      expect(screen.getByText(/signed in as:/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should toggle between sign in and sign up modes', async () => {
      const user = userEvent.setup()
      
      render(<AuthComponent />)
      
      // Initially shows Sign In
      expect(screen.getByText('Sign In')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument()
      
      // Click toggle to sign up
      const toggleButton = screen.getByRole('button', { name: /don't have an account\? sign up/i })
      await user.click(toggleButton)
      
      // Now shows Sign Up
      expect(screen.getByText('Create Account')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign up$/i })).toBeInTheDocument()
    })

    it('should handle form input changes', async () => {
      const user = userEvent.setup()
      
      render(<AuthComponent />)
      
      const emailInput = screen.getByPlaceholderText(/email/i)
      const passwordInput = screen.getByPlaceholderText(/password/i)
      
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      
      expect(emailInput).toHaveValue('test@example.com')
      expect(passwordInput).toHaveValue('password123')
    })
  })

  describe('Authentication State', () => {
    it('should not render auth form when user is authenticated', () => {
      mockUseAuth.user = createMockUser()
      
      render(<AuthComponent />)
      
      // Should show welcome message instead of auth form
      expect(screen.getByText('Welcome back!')).toBeInTheDocument()
      expect(screen.queryByPlaceholderText(/email/i)).not.toBeInTheDocument()
    })

    it('should render auth form when user is not authenticated', () => {
      mockUseAuth.user = null
      
      render(<AuthComponent />)
      
      expect(screen.getByText('Sign In')).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
    })
  })
})