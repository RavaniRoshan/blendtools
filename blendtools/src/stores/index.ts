// Main store exports for BlendTools
export { useAuthStore } from './authStore'
export { useScriptsStore } from './scriptsStore'
export { useShadersStore } from './shadersStore'
export { useProjectsStore } from './projectsStore'
export { useRenderJobsStore } from './renderJobsStore'

import { useAuthStore } from './authStore'
import { useScriptsStore } from './scriptsStore'
import { useShadersStore } from './shadersStore'
import { useProjectsStore } from './projectsStore'
import { useRenderJobsStore } from './renderJobsStore'

// Store selectors for common patterns
export const createStoreSelectors = <T extends Record<string, any>>(store: T) => {
  const selectors = {} as { [K in keyof T]: () => T[K] }
  
  for (const key in store) {
    selectors[key] = () => store(state => state[key])
  }
  
  return selectors
}

// Common loading states across stores
export const useGlobalLoading = () => {
  const authLoading = useAuthStore(state => state.loading)
  const scriptsLoading = useScriptsStore(state => state.loading)
  const shadersLoading = useShadersStore(state => state.loading)
  const projectsLoading = useProjectsStore(state => state.loading)
  const renderJobsLoading = useRenderJobsStore(state => state.loading)
  
  return authLoading || scriptsLoading || shadersLoading || projectsLoading || renderJobsLoading
}

// Global error states
export const useGlobalError = () => {
  const authError = useAuthStore(state => state.error)
  const scriptsError = useScriptsStore(state => state.error)
  const shadersError = useShadersStore(state => state.error)
  const projectsError = useProjectsStore(state => state.error)
  const renderJobsError = useRenderJobsStore(state => state.error)
  
  return authError || scriptsError || shadersError || projectsError || renderJobsError
}

// Clear all errors
export const useClearAllErrors = () => {
  const clearAuthError = useAuthStore(state => state.clearError)
  const clearScriptsError = useScriptsStore(state => state.clearError)
  const clearShadersError = useShadersStore(state => state.clearError)
  const clearProjectsError = useProjectsStore(state => state.clearError)
  const clearRenderJobsError = useRenderJobsStore(state => state.clearError)
  
  return () => {
    clearAuthError()
    clearScriptsError()
    clearShadersError()
    clearProjectsError()
    clearRenderJobsError()
  }
}