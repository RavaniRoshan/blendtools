// Legacy authentication hook - now using Zustand store
// This file maintained for backward compatibility

import { useAuthStore } from '../stores/authStore'

// Re-export the store hook for backward compatibility
export const useAuth = () => {
  const {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    signInWithOAuth,
    clearError
  } = useAuthStore()

  return {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    signInWithOAuth,
    clearError
  }
}

// Legacy AuthProvider - now just a pass-through
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // The Zustand store handles all auth state now
  return <>{children}</>
}