import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { shaderService } from '../lib/shaderService'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Shader = Database['public']['Tables']['shaders']['Row']
type ShaderInsert = Database['public']['Tables']['shaders']['Insert']
type ShaderUpdate = Database['public']['Tables']['shaders']['Update']

interface ShadersState {
  // State
  shaders: Shader[]
  currentShader: Shader | null
  loading: boolean
  error: string | null
  searchQuery: string
  categoryFilter: string
  
  // Actions
  fetchShaders: () => Promise<void>
  fetchShader: (id: string) => Promise<void>
  createShader: (shader: ShaderInsert) => Promise<{ success: boolean; error?: string }>
  updateShader: (id: string, updates: ShaderUpdate) => Promise<{ success: boolean; error?: string }>
  deleteShader: (id: string) => Promise<{ success: boolean; error?: string }>
  searchShaders: (query: string) => Promise<void>
  setSearchQuery: (query: string) => void
  setCategoryFilter: (category: string) => void
  clearError: () => void
  clearCurrentShader: () => void
  subscribeToChanges: () => () => void
}

export const useShadersStore = create<ShadersState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      shaders: [],
      currentShader: null,
      loading: false,
      error: null,
      searchQuery: '',
      categoryFilter: '',

      // Actions
      fetchShaders: async () => {
        set({ loading: true, error: null })
        
        try {
          const shaders = await shaderService.getShaders()
          set({ shaders, loading: false })
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch shaders'
          set({ loading: false, error: errorMessage })
        }
      },

      fetchShader: async (id: string) => {
        set({ loading: true, error: null })
        
        try {
          const shader = await shaderService.getShader(id)
          set({ currentShader: shader, loading: false })
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch shader'
          set({ loading: false, error: errorMessage })
        }
      },

      createShader: async (shaderData: ShaderInsert) => {
        set({ loading: true, error: null })
        
        try {
          const newShader = await shaderService.createShader(shaderData)
          
          set(state => ({
            shaders: [newShader, ...state.shaders],
            loading: false
          }))
          
          return { success: true }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to create shader'
          set({ loading: false, error: errorMessage })
          return { success: false, error: errorMessage }
        }
      },

      updateShader: async (id: string, updates: ShaderUpdate) => {
        set({ loading: true, error: null })
        
        try {
          const updatedShader = await shaderService.updateShader(id, updates)
          
          set(state => ({
            shaders: state.shaders.map(shader => 
              shader.id === id ? updatedShader : shader
            ),
            currentShader: state.currentShader?.id === id ? updatedShader : state.currentShader,
            loading: false
          }))
          
          return { success: true }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to update shader'
          set({ loading: false, error: errorMessage })
          return { success: false, error: errorMessage }
        }
      },

      deleteShader: async (id: string) => {
        set({ loading: true, error: null })
        
        try {
          await shaderService.deleteShader(id)
          
          set(state => ({
            shaders: state.shaders.filter(shader => shader.id !== id),
            currentShader: state.currentShader?.id === id ? null : state.currentShader,
            loading: false
          }))
          
          return { success: true }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to delete shader'
          set({ loading: false, error: errorMessage })
          return { success: false, error: errorMessage }
        }
      },

      searchShaders: async (query: string) => {
        set({ loading: true, error: null, searchQuery: query })
        
        try {
          const shaders = query 
            ? await shaderService.searchShaders(query)
            : await shaderService.getShaders()
          
          set({ shaders, loading: false })
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to search shaders'
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
          const { fetchShadersByCategory } = extendShadersStore()
          fetchShadersByCategory(category)
        } else {
          get().fetchShaders()
        }
      },

      clearError: () => {
        set({ error: null })
      },

      clearCurrentShader: () => {
        set({ currentShader: null })
      },

      subscribeToChanges: () => {
        // Only subscribe if we have a real Supabase client
        if (!supabase || typeof (supabase as any).channel !== 'function') {
          console.log('Real-time subscriptions not available (mock client)')
          return () => {} // Return empty unsubscribe function
        }

        const subscription = (supabase as any)
          .channel('shaders_changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'shaders'
            },
            (payload: any) => {
              console.log('Shaders change received:', payload)
              
              const { eventType, new: newRecord, old: oldRecord } = payload
              
              set(state => {
                let updatedShaders = [...state.shaders]
                
                switch (eventType) {
                  case 'INSERT':
                    updatedShaders = [newRecord as Shader, ...updatedShaders]
                    break
                  case 'UPDATE':
                    updatedShaders = updatedShaders.map(shader => 
                      shader.id === newRecord.id ? newRecord as Shader : shader
                    )
                    break
                  case 'DELETE':
                    updatedShaders = updatedShaders.filter(shader => 
                      shader.id !== oldRecord.id
                    )
                    break
                }
                
                return { shaders: updatedShaders }
              })
            }
          )
          .subscribe()
        
        return () => {
          subscription.unsubscribe()
        }
      },
    })),
    { name: 'shaders-store' }
  )
)

// Helper method extension for internal use
const extendShadersStore = () => {
  const fetchShadersByCategory = async (category: string) => {
    useShadersStore.setState({ loading: true, error: null })
    
    try {
      const shaders = await shaderService.getShadersByCategory(category)
      useShadersStore.setState({ shaders, loading: false })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch shaders by category'
      useShadersStore.setState({ loading: false, error: errorMessage })
    }
  }
  
  return { fetchShadersByCategory }
}