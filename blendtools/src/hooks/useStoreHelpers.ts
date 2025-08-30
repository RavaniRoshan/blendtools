import { useEffect } from 'react'
import { useScriptsStore } from '../stores/scriptsStore'
import { useShadersStore } from '../stores/shadersStore'
import { useProjectsStore } from '../stores/projectsStore'
import { useRenderJobsStore } from '../stores/renderJobsStore'
import { useAuthStore } from '../stores/authStore'

/**
 * Hook to initialize all stores when user is authenticated
 * This ensures data is loaded when the user logs in
 */
export const useStoreInitialization = () => {
  const user = useAuthStore(state => state.user)
  const authLoading = useAuthStore(state => state.loading)
  const fetchScripts = useScriptsStore(state => state.fetchScripts)
  const fetchShaders = useShadersStore(state => state.fetchShaders)
  const fetchProjects = useProjectsStore(state => state.fetchProjects)
  const fetchActiveJobs = useRenderJobsStore(state => state.fetchActiveJobs)

  useEffect(() => {
    // Only fetch user-specific data when user is authenticated and auth is not loading
    if (user && !authLoading) {
      fetchProjects()
      fetchActiveJobs()
    }
  }, [user, authLoading, fetchProjects, fetchActiveJobs])

  useEffect(() => {
    // Load public data when auth is not loading (regardless of auth status)
    if (!authLoading) {
      fetchScripts()
      fetchShaders()
    }
  }, [authLoading, fetchScripts, fetchShaders])
}

/**
 * Hook to initialize real-time subscriptions for all stores
 */
export const useRealtimeSubscriptions = () => {
  const subscribeToScriptsChanges = useScriptsStore(state => state.subscribeToChanges)
  const subscribeToShadersChanges = useShadersStore(state => state.subscribeToChanges)
  const subscribeToProjectsChanges = useProjectsStore(state => state.subscribeToChanges)
  const subscribeToRenderJobsChanges = useRenderJobsStore(state => state.subscribeToChanges)
  const user = useAuthStore(state => state.user)

  useEffect(() => {
    if (!user) return // Only subscribe when user is authenticated

    console.log('Setting up real-time subscriptions...')
    
    const unsubscribeScripts = subscribeToScriptsChanges()
    const unsubscribeShaders = subscribeToShadersChanges()
    const unsubscribeProjects = subscribeToProjectsChanges()
    const unsubscribeRenderJobs = subscribeToRenderJobsChanges()

    return () => {
      console.log('Cleaning up real-time subscriptions...')
      unsubscribeScripts()
      unsubscribeShaders()
      unsubscribeProjects()
      unsubscribeRenderJobs()
    }
  }, [user, subscribeToScriptsChanges, subscribeToShadersChanges, subscribeToProjectsChanges, subscribeToRenderJobsChanges])
}

/**
 * Hook for real-time updates of render job progress
 * This would typically integrate with WebSocket or Server-Sent Events
 */
export const useRenderJobUpdates = () => {
  const updateProgress = useRenderJobsStore(state => state.updateProgress)
  const fetchActiveJobs = useRenderJobsStore(state => state.fetchActiveJobs)

  useEffect(() => {
    // Simulate real-time render progress updates
    // In a real app, this would connect to WebSocket or SSE
    const interval = setInterval(() => {
      fetchActiveJobs()
    }, 5000) // Refresh active jobs every 5 seconds

    return () => clearInterval(interval)
  }, [fetchActiveJobs])

  return { updateProgress }
}

/**
 * Hook to sync authentication state changes across stores
 */
export const useAuthSync = () => {
  const user = useAuthStore(state => state.user)
  const clearScripts = useScriptsStore(state => state.clearCurrentScript)
  const clearShaders = useShadersStore(state => state.clearCurrentShader)
  const clearProjects = useProjectsStore(state => state.clearCurrentProject)
  const clearRenderJobs = useRenderJobsStore(state => state.clearCurrentJob)

  useEffect(() => {
    if (!user) {
      // Clear current items when user logs out
      clearScripts()
      clearShaders()
      clearProjects()
      clearRenderJobs()
    }
  }, [user, clearScripts, clearShaders, clearProjects, clearRenderJobs])
}

/**
 * Hook for optimistic updates
 * Useful for immediate UI feedback before server confirmation
 */
export const useOptimisticUpdates = () => {
  const scriptsStore = useScriptsStore()
  const shadersStore = useShadersStore()
  const projectsStore = useProjectsStore()

  const optimisticScriptUpdate = (id: string, updates: any) => {
    // Immediately update the UI
    const originalScript = scriptsStore.scripts.find(s => s.id === id)
    if (originalScript) {
      // Apply optimistic update
      scriptsStore.updateScript(id, updates)
      
      // Return rollback function in case of error
      return () => {
        scriptsStore.updateScript(id, originalScript)
      }
    }
  }

  return {
    optimisticScriptUpdate,
    // Add more optimistic update functions as needed
  }
}