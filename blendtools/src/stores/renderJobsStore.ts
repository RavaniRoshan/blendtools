import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { renderJobService } from '../lib/renderJobService'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type RenderJob = Database['public']['Tables']['render_jobs']['Row']
type RenderJobInsert = Database['public']['Tables']['render_jobs']['Insert']
type RenderJobUpdate = Database['public']['Tables']['render_jobs']['Update']

interface RenderJobsState {
  // State
  renderJobs: RenderJob[]
  activeJobs: RenderJob[]
  currentJob: RenderJob | null
  loading: boolean
  error: string | null
  queueStats: {
    total: number
    queued: number
    rendering: number
    completed: number
    failed: number
  }
  
  // Actions
  fetchRenderJobs: () => Promise<void>
  fetchActiveJobs: () => Promise<void>
  fetchRenderJob: (id: string) => Promise<void>
  fetchJobsByProject: (projectId: string) => Promise<void>
  createRenderJob: (job: RenderJobInsert) => Promise<{ success: boolean; error?: string }>
  updateRenderJob: (id: string, updates: RenderJobUpdate) => Promise<{ success: boolean; error?: string }>
  updateProgress: (id: string, progress: number) => Promise<{ success: boolean; error?: string }>
  cancelJob: (id: string) => Promise<{ success: boolean; error?: string }>
  deleteRenderJob: (id: string) => Promise<{ success: boolean; error?: string }>
  pauseJob: (id: string) => Promise<{ success: boolean; error?: string }>
  resumeJob: (id: string) => Promise<{ success: boolean; error?: string }>
  retryJob: (id: string) => Promise<{ success: boolean; error?: string }>
  clearQueue: () => Promise<{ success: boolean; error?: string }>
  updateQueueStats: () => void
  clearError: () => void
  clearCurrentJob: () => void
  subscribeToChanges: () => () => void
}

export const useRenderJobsStore = create<RenderJobsState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      renderJobs: [],
      activeJobs: [],
      currentJob: null,
      loading: false,
      error: null,
      queueStats: {
        total: 0,
        queued: 0,
        rendering: 0,
        completed: 0,
        failed: 0
      },

      // Actions
      fetchRenderJobs: async () => {
        set({ loading: true, error: null })
        
        try {
          const renderJobs = await renderJobService.getRenderJobs()
          set({ renderJobs, loading: false })
          get().updateQueueStats()
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch render jobs'
          set({ loading: false, error: errorMessage })
        }
      },

      fetchActiveJobs: async () => {
        try {
          const activeJobs = await renderJobService.getActiveRenderJobs()
          set({ activeJobs })
        } catch (err) {
          console.error('Failed to fetch active jobs:', err)
        }
      },

      fetchRenderJob: async (id: string) => {
        set({ loading: true, error: null })
        
        try {
          const job = await renderJobService.getRenderJob(id)
          set({ currentJob: job, loading: false })
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch render job'
          set({ loading: false, error: errorMessage })
        }
      },

      fetchJobsByProject: async (projectId: string) => {
        set({ loading: true, error: null })
        
        try {
          const jobs = await renderJobService.getRenderJobsByProject(projectId)
          set({ renderJobs: jobs, loading: false })
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch project render jobs'
          set({ loading: false, error: errorMessage })
        }
      },

      createRenderJob: async (jobData: RenderJobInsert) => {
        set({ loading: true, error: null })
        
        try {
          const newJob = await renderJobService.createRenderJob(jobData)
          
          set(state => ({
            renderJobs: [newJob, ...state.renderJobs],
            activeJobs: ['queued', 'rendering'].includes(newJob.status) 
              ? [newJob, ...state.activeJobs] 
              : state.activeJobs,
            loading: false
          }))
          
          return { success: true }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to create render job'
          set({ loading: false, error: errorMessage })
          return { success: false, error: errorMessage }
        }
      },

      updateRenderJob: async (id: string, updates: RenderJobUpdate) => {
        set({ loading: true, error: null })
        
        try {
          const updatedJob = await renderJobService.updateRenderJob(id, updates)
          
          set(state => ({
            renderJobs: state.renderJobs.map(job => 
              job.id === id ? updatedJob : job
            ),
            activeJobs: state.activeJobs.map(job => 
              job.id === id ? updatedJob : job
            ).filter(job => ['queued', 'rendering'].includes(job.status)),
            currentJob: state.currentJob?.id === id ? updatedJob : state.currentJob,
            loading: false
          }))
          
          return { success: true }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to update render job'
          set({ loading: false, error: errorMessage })
          return { success: false, error: errorMessage }
        }
      },

      updateProgress: async (id: string, progress: number) => {
        try {
          const updatedJob = await renderJobService.updateRenderProgress(id, progress)
          
          set(state => ({
            renderJobs: state.renderJobs.map(job => 
              job.id === id ? updatedJob : job
            ),
            activeJobs: state.activeJobs.map(job => 
              job.id === id ? updatedJob : job
            ).filter(job => ['queued', 'rendering'].includes(job.status)),
            currentJob: state.currentJob?.id === id ? updatedJob : state.currentJob,
          }))
          
          return { success: true }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to update progress'
          console.error(errorMessage)
          return { success: false, error: errorMessage }
        }
      },

      cancelJob: async (id: string) => {
        set({ loading: true, error: null })
        
        try {
          const cancelledJob = await renderJobService.cancelRenderJob(id)
          
          set(state => ({
            renderJobs: state.renderJobs.map(job => 
              job.id === id ? cancelledJob : job
            ),
            activeJobs: state.activeJobs.filter(job => job.id !== id),
            currentJob: state.currentJob?.id === id ? cancelledJob : state.currentJob,
            loading: false
          }))
          
          return { success: true }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to cancel render job'
          set({ loading: false, error: errorMessage })
          return { success: false, error: errorMessage }
        }
      },

      deleteRenderJob: async (id: string) => {
        set({ loading: true, error: null })
        
        try {
          await renderJobService.deleteRenderJob(id)
          
          set(state => ({
            renderJobs: state.renderJobs.filter(job => job.id !== id),
            activeJobs: state.activeJobs.filter(job => job.id !== id),
            currentJob: state.currentJob?.id === id ? null : state.currentJob,
            loading: false
          }))
          
          return { success: true }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to delete render job'
          set({ loading: false, error: errorMessage })
          return { success: false, error: errorMessage }
        }
      },

      clearError: () => {
        set({ error: null })
      },

      clearCurrentJob: () => {
        set({ currentJob: null })
      },

      pauseJob: async (id: string) => {
        set({ loading: true, error: null })
        
        try {
          const pausedJob = await renderJobService.updateRenderJob(id, { status: 'queued' })
          
          set(state => ({
            renderJobs: state.renderJobs.map(job => 
              job.id === id ? pausedJob : job
            ),
            activeJobs: state.activeJobs.filter(job => job.id !== id),
            currentJob: state.currentJob?.id === id ? pausedJob : state.currentJob,
            loading: false
          }))
          
          get().updateQueueStats()
          return { success: true }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to pause job'
          set({ loading: false, error: errorMessage })
          return { success: false, error: errorMessage }
        }
      },

      resumeJob: async (id: string) => {
        set({ loading: true, error: null })
        
        try {
          const resumedJob = await renderJobService.updateRenderJob(id, { status: 'rendering' })
          
          set(state => ({
            renderJobs: state.renderJobs.map(job => 
              job.id === id ? resumedJob : job
            ),
            activeJobs: [...state.activeJobs, resumedJob],
            currentJob: state.currentJob?.id === id ? resumedJob : state.currentJob,
            loading: false
          }))
          
          get().updateQueueStats()
          return { success: true }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to resume job'
          set({ loading: false, error: errorMessage })
          return { success: false, error: errorMessage }
        }
      },

      retryJob: async (id: string) => {
        set({ loading: true, error: null })
        
        try {
          const retriedJob = await renderJobService.updateRenderJob(id, { 
            status: 'queued',
            progress: 0,
            completed_at: null
          })
          
          set(state => ({
            renderJobs: state.renderJobs.map(job => 
              job.id === id ? retriedJob : job
            ),
            activeJobs: state.activeJobs.find(job => job.id === id)
              ? state.activeJobs.map(job => job.id === id ? retriedJob : job)
              : [...state.activeJobs, retriedJob],
            currentJob: state.currentJob?.id === id ? retriedJob : state.currentJob,
            loading: false
          }))
          
          get().updateQueueStats()
          return { success: true }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to retry job'
          set({ loading: false, error: errorMessage })
          return { success: false, error: errorMessage }
        }
      },

      clearQueue: async () => {
        set({ loading: true, error: null })
        
        try {
          // Cancel all active jobs and delete completed/failed ones
          const state = get()
          const activeJobIds = state.activeJobs.map(job => job.id)
          const completedJobIds = state.renderJobs
            .filter(job => job.status === 'completed' || job.status === 'failed')
            .map(job => job.id)
          
          // Cancel active jobs
          await Promise.all(activeJobIds.map(id => renderJobService.cancelRenderJob(id)))
          
          // Delete completed/failed jobs
          await Promise.all(completedJobIds.map(id => renderJobService.deleteRenderJob(id)))
          
          // Refresh the data
          await get().fetchRenderJobs()
          await get().fetchActiveJobs()
          
          set({ loading: false })
          return { success: true }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to clear queue'
          set({ loading: false, error: errorMessage })
          return { success: false, error: errorMessage }
        }
      },

      updateQueueStats: () => {
        const state = get()
        const stats = {
          total: state.renderJobs.length,
          queued: state.renderJobs.filter(job => job.status === 'queued').length,
          rendering: state.renderJobs.filter(job => job.status === 'rendering').length,
          completed: state.renderJobs.filter(job => job.status === 'completed').length,
          failed: state.renderJobs.filter(job => job.status === 'failed').length
        }
        set({ queueStats: stats })
      },

      subscribeToChanges: () => {
        // Only subscribe if we have a real Supabase client
        if (!supabase || typeof (supabase as any).channel !== 'function') {
          console.log('Real-time subscriptions not available (mock client)')
          return () => {} // Return empty unsubscribe function
        }

        const subscription = (supabase as any)
          .channel('render_jobs_changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'render_jobs'
            },
            (payload: any) => {
              console.log('Render jobs change received:', payload)
              
              const { eventType, new: newRecord, old: oldRecord } = payload
              
              set(state => {
                let updatedJobs = [...state.renderJobs]
                let updatedActiveJobs = [...state.activeJobs]
                
                switch (eventType) {
                  case 'INSERT':
                    updatedJobs = [newRecord as RenderJob, ...updatedJobs]
                    if (['queued', 'rendering'].includes((newRecord as RenderJob).status)) {
                      updatedActiveJobs = [newRecord as RenderJob, ...updatedActiveJobs]
                    }
                    break
                  case 'UPDATE':
                    updatedJobs = updatedJobs.map(job => 
                      job.id === newRecord.id ? newRecord as RenderJob : job
                    )
                    // Update active jobs based on status
                    if (['queued', 'rendering'].includes((newRecord as RenderJob).status)) {
                      updatedActiveJobs = updatedActiveJobs.map(job => 
                        job.id === newRecord.id ? newRecord as RenderJob : job
                      )
                      // Add to active if not already there
                      if (!updatedActiveJobs.find(job => job.id === newRecord.id)) {
                        updatedActiveJobs = [newRecord as RenderJob, ...updatedActiveJobs]
                      }
                    } else {
                      // Remove from active jobs if status changed to completed/failed
                      updatedActiveJobs = updatedActiveJobs.filter(job => job.id !== newRecord.id)
                    }
                    break
                  case 'DELETE':
                    updatedJobs = updatedJobs.filter(job => job.id !== oldRecord.id)
                    updatedActiveJobs = updatedActiveJobs.filter(job => job.id !== oldRecord.id)
                    break
                }
                
                return { 
                  renderJobs: updatedJobs,
                  activeJobs: updatedActiveJobs,
                  currentJob: state.currentJob?.id === newRecord?.id ? newRecord as RenderJob : state.currentJob
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
    { name: 'render-jobs-store' }
  )
)