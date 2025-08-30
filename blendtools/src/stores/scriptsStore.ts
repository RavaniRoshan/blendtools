import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { scriptService } from '../lib/scriptService'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Script = Database['public']['Tables']['scripts']['Row']
type ScriptInsert = Database['public']['Tables']['scripts']['Insert']
type ScriptUpdate = Database['public']['Tables']['scripts']['Update']

interface ScriptsState {
  // State
  scripts: Script[]
  currentScript: Script | null
  loading: boolean
  error: string | null
  searchQuery: string
  categoryFilter: string
  ratingFilter: number | null
  
  // Actions
  fetchScripts: () => Promise<void>
  fetchScript: (id: string) => Promise<void>
  createScript: (script: ScriptInsert) => Promise<{ success: boolean; error?: string }>
  updateScript: (id: string, updates: ScriptUpdate) => Promise<{ success: boolean; error?: string }>
  deleteScript: (id: string) => Promise<{ success: boolean; error?: string }>
  incrementDownloads: (id: string) => Promise<void>
  searchScripts: (query: string) => Promise<void>
  setSearchQuery: (query: string) => void
  setCategoryFilter: (category: string) => void
  setRatingFilter: (rating: number | null) => void
  clearError: () => void
  clearCurrentScript: () => void
  subscribeToChanges: () => () => void
}

export const useScriptsStore = create<ScriptsState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      scripts: [],
      currentScript: null,
      loading: false,
      error: null,
      searchQuery: '',
      categoryFilter: '',
      ratingFilter: null,

      // Actions
      fetchScripts: async () => {
        set({ loading: true, error: null })
        
        try {
          const scripts = await scriptService.getScripts()
          set({ scripts, loading: false })
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch scripts'
          set({ loading: false, error: errorMessage })
        }
      },

      fetchScript: async (id: string) => {
        set({ loading: true, error: null })
        
        try {
          const script = await scriptService.getScript(id)
          set({ currentScript: script, loading: false })
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch script'
          set({ loading: false, error: errorMessage })
        }
      },

      createScript: async (scriptData: ScriptInsert) => {
        set({ loading: true, error: null })
        
        try {
          const newScript = await scriptService.createScript(scriptData)
          
          set(state => ({
            scripts: [newScript, ...state.scripts],
            loading: false
          }))
          
          return { success: true }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to create script'
          set({ loading: false, error: errorMessage })
          return { success: false, error: errorMessage }
        }
      },

      updateScript: async (id: string, updates: ScriptUpdate) => {
        set({ loading: true, error: null })
        
        try {
          const updatedScript = await scriptService.updateScript(id, updates)
          
          set(state => ({
            scripts: state.scripts.map(script => 
              script.id === id ? updatedScript : script
            ),
            currentScript: state.currentScript?.id === id ? updatedScript : state.currentScript,
            loading: false
          }))
          
          return { success: true }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to update script'
          set({ loading: false, error: errorMessage })
          return { success: false, error: errorMessage }
        }
      },

      deleteScript: async (id: string) => {
        set({ loading: true, error: null })
        
        try {
          await scriptService.deleteScript(id)
          
          set(state => ({
            scripts: state.scripts.filter(script => script.id !== id),
            currentScript: state.currentScript?.id === id ? null : state.currentScript,
            loading: false
          }))
          
          return { success: true }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to delete script'
          set({ loading: false, error: errorMessage })
          return { success: false, error: errorMessage }
        }
      },

      incrementDownloads: async (id: string) => {
        try {
          const newCount = await scriptService.incrementDownloads(id)
          
          set(state => ({
            scripts: state.scripts.map(script => 
              script.id === id ? { ...script, downloads: newCount } : script
            ),
            currentScript: state.currentScript?.id === id 
              ? { ...state.currentScript, downloads: newCount }
              : state.currentScript
          }))
        } catch (err) {
          console.error('Failed to increment downloads:', err)
        }
      },

      searchScripts: async (query: string) => {
        set({ loading: true, error: null, searchQuery: query })
        
        try {
          const scripts = query 
            ? await scriptService.searchScripts(query)
            : await scriptService.getScripts()
          
          set({ scripts, loading: false })
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to search scripts'
          set({ loading: false, error: errorMessage })
        }
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query })
      },

      setCategoryFilter: (category: string) => {
        set({ categoryFilter: category })
        
        // Trigger filtered fetch
        if (category) {
          const { fetchScriptsByCategory } = extendStore()
          fetchScriptsByCategory(category)
        } else {
          get().fetchScripts()
        }
      },

      setRatingFilter: (rating: number | null) => {
        set({ ratingFilter: rating })
      },

      clearError: () => {
        set({ error: null })
      },

      clearCurrentScript: () => {
        set({ currentScript: null })
      },

      subscribeToChanges: () => {
        // Only subscribe if we have a real Supabase client
        if (!supabase || typeof (supabase as any).channel !== 'function') {
          console.log('Real-time subscriptions not available (mock client)')
          return () => {} // Return empty unsubscribe function
        }

        const subscription = (supabase as any)
          .channel('scripts_changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'scripts'
            },
            (payload: any) => {
              console.log('Scripts change received:', payload)
              
              const { eventType, new: newRecord, old: oldRecord } = payload
              
              set(state => {
                let updatedScripts = [...state.scripts]
                
                switch (eventType) {
                  case 'INSERT':
                    updatedScripts = [newRecord as Script, ...updatedScripts]
                    break
                  case 'UPDATE':
                    updatedScripts = updatedScripts.map(script => 
                      script.id === newRecord.id ? newRecord as Script : script
                    )
                    break
                  case 'DELETE':
                    updatedScripts = updatedScripts.filter(script => 
                      script.id !== oldRecord.id
                    )
                    break
                }
                
                return { scripts: updatedScripts }
              })
            }
          )
          .subscribe()
        
        return () => {
          subscription.unsubscribe()
        }
      },
    })),
    { name: 'scripts-store' }
  )
)

// Helper method extension for internal use
type ExtendedScriptsStore = ReturnType<typeof useScriptsStore> & {
  fetchScriptsByCategory: (category: string) => Promise<void>
}

// Add the helper method after store creation
const extendStore = () => {
  const originalStore = useScriptsStore.getState()
  
  const fetchScriptsByCategory = async (category: string) => {
    useScriptsStore.setState({ loading: true, error: null })
    
    try {
      const scripts = await scriptService.getScriptsByCategory(category)
      useScriptsStore.setState({ scripts, loading: false })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch scripts by category'
      useScriptsStore.setState({ loading: false, error: errorMessage })
    }
  }
  
  return { ...originalStore, fetchScriptsByCategory }
}