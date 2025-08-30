import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useRenderJobsStore } from '../renderJobsStore'
import { mockSupabaseClient, createMockRenderJob, createMockProject } from '../../test/utils'

// Mock the render job service
vi.mock('../../lib/renderJobService', () => ({
  renderJobService: {
    getRenderJobs: vi.fn(),
    getActiveRenderJobs: vi.fn(),
    getRenderJob: vi.fn(),
    createRenderJob: vi.fn(),
    updateRenderJob: vi.fn(),
    deleteRenderJob: vi.fn(),
    cancelRenderJob: vi.fn(),
  },
}))

// Mock supabase
vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabaseClient,
}))

const mockRenderJobService = {
  getRenderJobs: vi.fn(),
  getActiveRenderJobs: vi.fn(),
  getRenderJob: vi.fn(),
  createRenderJob: vi.fn(),
  updateRenderJob: vi.fn(),
  deleteRenderJob: vi.fn(),
  cancelRenderJob: vi.fn(),
}

// Import after mocking
const { renderJobService } = await import('../../lib/renderJobService')
Object.assign(renderJobService, mockRenderJobService)

describe('RenderJobsStore', () => {
  beforeEach(() => {
    // Reset store state
    useRenderJobsStore.setState({
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
        failed: 0,
      },
    })

    // Clear all mocks
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useRenderJobsStore.getState()
      
      expect(state.renderJobs).toEqual([])
      expect(state.activeJobs).toEqual([])
      expect(state.currentJob).toBeNull()
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
      expect(state.queueStats).toEqual({
        total: 0,
        queued: 0,
        rendering: 0,
        completed: 0,
        failed: 0,
      })
    })
  })

  describe('fetchRenderJobs', () => {
    it('should fetch render jobs successfully', async () => {
      const mockJobs = [
        createMockRenderJob({ id: '1', name: 'Job 1' }),
        createMockRenderJob({ id: '2', name: 'Job 2', status: 'completed' }),
      ]

      mockRenderJobService.getRenderJobs.mockResolvedValueOnce(mockJobs)

      const { fetchRenderJobs } = useRenderJobsStore.getState()
      await fetchRenderJobs()

      const state = useRenderJobsStore.getState()
      expect(state.renderJobs).toEqual(mockJobs)
      expect(state.loading).toBe(false)
      expect(state.queueStats.total).toBe(2)
      expect(state.queueStats.queued).toBe(1)
      expect(state.queueStats.completed).toBe(1)
    })

    it('should handle fetch error', async () => {
      const error = new Error('Failed to fetch jobs')
      mockRenderJobService.getRenderJobs.mockRejectedValueOnce(error)

      const { fetchRenderJobs } = useRenderJobsStore.getState()
      await fetchRenderJobs()

      const state = useRenderJobsStore.getState()
      expect(state.renderJobs).toEqual([])
      expect(state.loading).toBe(false)
      expect(state.error).toBe('Failed to fetch jobs')
    })
  })

  describe('createRenderJob', () => {
    it('should create render job successfully', async () => {
      const newJob = createMockRenderJob({ name: 'New Job' })
      const jobData = {
        name: 'New Job',
        project_id: 'project-1',
        status: 'queued' as const,
      }

      mockRenderJobService.createRenderJob.mockResolvedValueOnce(newJob)

      const { createRenderJob } = useRenderJobsStore.getState()
      const result = await createRenderJob(jobData)

      expect(result.success).toBe(true)
      expect(useRenderJobsStore.getState().renderJobs).toContain(newJob)
      expect(mockRenderJobService.createRenderJob).toHaveBeenCalledWith(jobData)
    })

    it('should handle create error', async () => {
      const error = new Error('Failed to create job')
      mockRenderJobService.createRenderJob.mockRejectedValueOnce(error)

      const jobData = {
        name: 'New Job',
        project_id: 'project-1',
        status: 'queued' as const,
      }

      const { createRenderJob } = useRenderJobsStore.getState()
      const result = await createRenderJob(jobData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to create job')
    })
  })

  describe('updateRenderJob', () => {
    it('should update render job successfully', async () => {
      const existingJob = createMockRenderJob({ id: 'job-1', status: 'queued' })
      const updatedJob = { ...existingJob, status: 'rendering' as const, progress: 50 }

      // Set initial state
      useRenderJobsStore.setState({ renderJobs: [existingJob] })

      mockRenderJobService.updateRenderJob.mockResolvedValueOnce(updatedJob)

      const { updateRenderJob } = useRenderJobsStore.getState()
      const result = await updateRenderJob('job-1', { status: 'rendering', progress: 50 })

      expect(result.success).toBe(true)
      
      const state = useRenderJobsStore.getState()
      expect(state.renderJobs[0]).toEqual(updatedJob)
    })

    it('should handle update error', async () => {
      const error = new Error('Failed to update job')
      mockRenderJobService.updateRenderJob.mockRejectedValueOnce(error)

      const { updateRenderJob } = useRenderJobsStore.getState()
      const result = await updateRenderJob('job-1', { status: 'rendering' })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to update job')
    })
  })

  describe('cancelJob', () => {
    it('should cancel job successfully', async () => {
      const activeJob = createMockRenderJob({ id: 'job-1', status: 'rendering' })
      const cancelledJob = { ...activeJob, status: 'failed' as const }

      useRenderJobsStore.setState({ 
        renderJobs: [activeJob],
        activeJobs: [activeJob] 
      })

      mockRenderJobService.cancelRenderJob.mockResolvedValueOnce(cancelledJob)

      const { cancelJob } = useRenderJobsStore.getState()
      const result = await cancelJob('job-1')

      expect(result.success).toBe(true)
      expect(mockRenderJobService.cancelRenderJob).toHaveBeenCalledWith('job-1')
      
      const state = useRenderJobsStore.getState()
      expect(state.activeJobs).toEqual([])
    })
  })

  describe('deleteRenderJob', () => {
    it('should delete job successfully', async () => {
      const job = createMockRenderJob({ id: 'job-1' })
      useRenderJobsStore.setState({ renderJobs: [job] })

      mockRenderJobService.deleteRenderJob.mockResolvedValueOnce(undefined)

      const { deleteRenderJob } = useRenderJobsStore.getState()
      const result = await deleteRenderJob('job-1')

      expect(result.success).toBe(true)
      expect(mockRenderJobService.deleteRenderJob).toHaveBeenCalledWith('job-1')
      
      const state = useRenderJobsStore.getState()
      expect(state.renderJobs).toEqual([])
    })
  })

  describe('retryJob', () => {
    it('should retry failed job successfully', async () => {
      const failedJob = createMockRenderJob({ id: 'job-1', status: 'failed' })
      const retriedJob = { ...failedJob, status: 'queued' as const, progress: 0 }

      useRenderJobsStore.setState({ renderJobs: [failedJob] })

      mockRenderJobService.updateRenderJob.mockResolvedValueOnce(retriedJob)

      const { retryJob } = useRenderJobsStore.getState()
      const result = await retryJob('job-1')

      expect(result.success).toBe(true)
      expect(mockRenderJobService.updateRenderJob).toHaveBeenCalledWith('job-1', {
        status: 'queued',
        progress: 0,
        completed_at: null,
      })

      const state = useRenderJobsStore.getState()
      expect(state.renderJobs[0].status).toBe('queued')
      expect(state.activeJobs).toContain(retriedJob)
    })
  })

  describe('updateQueueStats', () => {
    it('should calculate queue statistics correctly', () => {
      const jobs = [
        createMockRenderJob({ status: 'queued' }),
        createMockRenderJob({ status: 'rendering' }),
        createMockRenderJob({ status: 'completed' }),
        createMockRenderJob({ status: 'failed' }),
        createMockRenderJob({ status: 'queued' }),
      ]

      useRenderJobsStore.setState({ renderJobs: jobs })

      const { updateQueueStats } = useRenderJobsStore.getState()
      updateQueueStats()

      const { queueStats } = useRenderJobsStore.getState()
      expect(queueStats.total).toBe(5)
      expect(queueStats.queued).toBe(2)
      expect(queueStats.rendering).toBe(1)
      expect(queueStats.completed).toBe(1)
      expect(queueStats.failed).toBe(1)
    })
  })

  describe('clearError', () => {
    it('should clear error state', () => {
      useRenderJobsStore.setState({ error: 'Some error' })

      const { clearError } = useRenderJobsStore.getState()
      clearError()

      expect(useRenderJobsStore.getState().error).toBeNull()
    })
  })
})