import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { projectService } from '../lib/projectService'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Project = Database['public']['Tables']['projects']['Row']
type ProjectInsert = Database['public']['Tables']['projects']['Insert']
type ProjectUpdate = Database['public']['Tables']['projects']['Update']

interface ProjectsState {
  // State
  projects: Project[]
  currentProject: Project | null
  loading: boolean
  error: string | null
  searchQuery: string
  
  // Actions
  fetchProjects: () => Promise<void>
  fetchProject: (id: string) => Promise<void>
  createProject: (project: ProjectInsert) => Promise<{ success: boolean; error?: string }>
  updateProject: (id: string, updates: ProjectUpdate) => Promise<{ success: boolean; error?: string }>
  deleteProject: (id: string) => Promise<{ success: boolean; error?: string }>
  searchProjects: (query: string) => Promise<void>
  setSearchQuery: (query: string) => void
  setCurrentProject: (project: Project | null) => void
  clearError: () => void
  clearCurrentProject: () => void
  subscribeToChanges: () => () => void
}

export const useProjectsStore = create<ProjectsState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      projects: [],
      currentProject: null,
      loading: false,
      error: null,
      searchQuery: '',

      // Actions
      fetchProjects: async () => {
        set({ loading: true, error: null })
        
        try {
          const projects = await projectService.getProjects()
          set({ projects, loading: false })
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects'
          set({ loading: false, error: errorMessage })
        }
      },

      fetchProject: async (id: string) => {
        set({ loading: true, error: null })
        
        try {
          const project = await projectService.getProject(id)
          set({ currentProject: project, loading: false })
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch project'
          set({ loading: false, error: errorMessage })
        }
      },

      createProject: async (projectData: ProjectInsert) => {
        set({ loading: true, error: null })
        
        try {
          const newProject = await projectService.createProject(projectData)
          
          set(state => ({
            projects: [newProject, ...state.projects],
            loading: false
          }))
          
          return { success: true }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to create project'
          set({ loading: false, error: errorMessage })
          return { success: false, error: errorMessage }
        }
      },

      updateProject: async (id: string, updates: ProjectUpdate) => {
        set({ loading: true, error: null })
        
        try {
          const updatedProject = await projectService.updateProject(id, updates)
          
          set(state => ({
            projects: state.projects.map(project => 
              project.id === id ? updatedProject : project
            ),
            currentProject: state.currentProject?.id === id ? updatedProject : state.currentProject,
            loading: false
          }))
          
          return { success: true }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to update project'
          set({ loading: false, error: errorMessage })
          return { success: false, error: errorMessage }
        }
      },

      deleteProject: async (id: string) => {
        set({ loading: true, error: null })
        
        try {
          await projectService.deleteProject(id)
          
          set(state => ({
            projects: state.projects.filter(project => project.id !== id),
            currentProject: state.currentProject?.id === id ? null : state.currentProject,
            loading: false
          }))
          
          return { success: true }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to delete project'
          set({ loading: false, error: errorMessage })
          return { success: false, error: errorMessage }
        }
      },

      searchProjects: async (query: string) => {
        set({ loading: true, error: null, searchQuery: query })
        
        try {
          const projects = query 
            ? await projectService.searchProjects(query)
            : await projectService.getProjects()
          
          set({ projects, loading: false })
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to search projects'
          set({ loading: false, error: errorMessage })
        }
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query })
      },

      setCurrentProject: (project: Project | null) => {
        set({ currentProject: project })
      },

      clearError: () => {
        set({ error: null })
      },

      clearCurrentProject: () => {
        set({ currentProject: null })
      },

      subscribeToChanges: () => {
        // Only subscribe if we have a real Supabase client
        if (!supabase || typeof (supabase as any).channel !== 'function') {
          console.log('Real-time subscriptions not available (mock client)')
          return () => {} // Return empty unsubscribe function
        }

        const subscription = (supabase as any)
          .channel('projects_changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'projects'
            },
            (payload: any) => {
              console.log('Projects change received:', payload)
              
              const { eventType, new: newRecord, old: oldRecord } = payload
              
              set(state => {
                let updatedProjects = [...state.projects]
                
                switch (eventType) {
                  case 'INSERT':
                    updatedProjects = [newRecord as Project, ...updatedProjects]
                    break
                  case 'UPDATE':
                    updatedProjects = updatedProjects.map(project => 
                      project.id === newRecord.id ? newRecord as Project : project
                    )
                    break
                  case 'DELETE':
                    updatedProjects = updatedProjects.filter(project => 
                      project.id !== oldRecord.id
                    )
                    break
                }
                
                return { 
                  projects: updatedProjects,
                  currentProject: state.currentProject?.id === newRecord?.id ? newRecord as Project : state.currentProject
                }
              })
            }
          )
          .subscribe()
        
        return () => {
          subscription.unsubscribe()
        }
      },
    })),
    { name: 'projects-store' }
  )
)