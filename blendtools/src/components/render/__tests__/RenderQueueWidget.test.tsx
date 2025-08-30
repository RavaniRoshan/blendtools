import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, createMockUser, createMockRenderJob } from '../../../test/utils'
import { RenderQueueWidget } from '../RenderQueueWidget'
import { useAuthStore } from '../../../stores/authStore'
import { useRenderJobsStore } from '../../../stores/renderJobsStore'

// Mock the stores
vi.mock('../../../stores/authStore')
vi.mock('../../../stores/renderJobsStore')

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockAuthStore = {
  user: null,
}

const mockRenderJobsStore = {
  activeJobs: [],
  renderJobs: [],
  loading: false,
  fetchActiveJobs: vi.fn(),
  fetchRenderJobs: vi.fn(),
}

describe('RenderQueueWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset mock implementations
    vi.mocked(useAuthStore).mockReturnValue(mockAuthStore as any)
    vi.mocked(useRenderJobsStore).mockReturnValue(mockRenderJobsStore as any)
  })

  describe('when user is not authenticated', () => {
    it('should show sign in message', () => {
      render(<RenderQueueWidget />)
      
      expect(screen.getByText('Render Queue')).toBeInTheDocument()
      expect(screen.getByText('Sign in to view render jobs')).toBeInTheDocument()
    })
  })

  describe('when user is authenticated', () => {
    beforeEach(() => {
      mockAuthStore.user = createMockUser()
    })

    it('should show render queue statistics when user has no jobs', () => {
      render(<RenderQueueWidget />)
      
      expect(screen.getByText('Render Queue')).toBeInTheDocument()
      expect(screen.getByText('0')).toBeInTheDocument() // Active jobs count
      expect(screen.getByText('Active')).toBeInTheDocument()
      expect(screen.getByText('No render jobs yet')).toBeInTheDocument()
    })

    it('should display job statistics correctly', () => {
      const jobs = [
        createMockRenderJob({ status: 'rendering' }),
        createMockRenderJob({ status: 'completed' }),
        createMockRenderJob({ status: 'failed' }),
        createMockRenderJob({ status: 'queued' }),
      ]

      mockRenderJobsStore.renderJobs = jobs
      mockRenderJobsStore.activeJobs = [jobs[0], jobs[3]] // rendering and queued

      render(<RenderQueueWidget />)
      
      expect(screen.getByText('2')).toBeInTheDocument() // Active jobs
      expect(screen.getByText('1')).toBeInTheDocument() // Completed jobs  
      expect(screen.getByText('1')).toBeInTheDocument() // Failed jobs
      expect(screen.getByText('4')).toBeInTheDocument() // Total jobs
    })

    it('should show active jobs with progress', () => {
      const activeJob = createMockRenderJob({ 
        name: 'Test Render Job',
        status: 'rendering',
        progress: 75
      })

      mockRenderJobsStore.activeJobs = [activeJob]
      mockRenderJobsStore.renderJobs = [activeJob]

      render(<RenderQueueWidget />)
      
      expect(screen.getByText('Currently Rendering')).toBeInTheDocument()
      expect(screen.getByText('Test Render Job')).toBeInTheDocument()
      expect(screen.getByText('75%')).toBeInTheDocument()
    })

    it('should show recent jobs', () => {
      const recentJobs = [
        createMockRenderJob({ name: 'Recent Job 1', status: 'completed' }),
        createMockRenderJob({ name: 'Recent Job 2', status: 'failed' }),
      ]

      mockRenderJobsStore.renderJobs = recentJobs

      render(<RenderQueueWidget />)
      
      expect(screen.getByText('Recent Jobs')).toBeInTheDocument()
      expect(screen.getByText('Recent Job 1')).toBeInTheDocument()
      expect(screen.getByText('Recent Job 2')).toBeInTheDocument()
    })

    it('should navigate to render queue page when View All is clicked', async () => {
      const user = userEvent.setup()
      
      render(<RenderQueueWidget />)
      
      const viewAllButton = screen.getByRole('button', { name: /view all/i })
      await user.click(viewAllButton)
      
      expect(mockNavigate).toHaveBeenCalledWith('/render-queue')
    })

    it('should navigate to render queue page when Create First Job is clicked', async () => {
      const user = userEvent.setup()
      
      render(<RenderQueueWidget />)
      
      const createJobButton = screen.getByRole('button', { name: /create first job/i })
      await user.click(createJobButton)
      
      expect(mockNavigate).toHaveBeenCalledWith('/render-queue')
    })

    it('should show loading spinner when loading', () => {
      mockRenderJobsStore.loading = true
      
      render(<RenderQueueWidget />)
      
      // Look for loading spinner (animated element)
      const spinner = screen.getByRole('status', { hidden: true }) || 
                    document.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })

    it('should call fetch functions on mount', () => {
      render(<RenderQueueWidget />)
      
      expect(mockRenderJobsStore.fetchActiveJobs).toHaveBeenCalled()
      expect(mockRenderJobsStore.fetchRenderJobs).toHaveBeenCalled()
    })

    it('should limit active jobs display to 2', () => {
      const activeJobs = [
        createMockRenderJob({ name: 'Job 1', status: 'rendering' }),
        createMockRenderJob({ name: 'Job 2', status: 'rendering' }),
        createMockRenderJob({ name: 'Job 3', status: 'rendering' }),
        createMockRenderJob({ name: 'Job 4', status: 'rendering' }),
      ]

      mockRenderJobsStore.activeJobs = activeJobs
      mockRenderJobsStore.renderJobs = activeJobs

      render(<RenderQueueWidget />)
      
      expect(screen.getByText('Job 1')).toBeInTheDocument()
      expect(screen.getByText('Job 2')).toBeInTheDocument()
      expect(screen.queryByText('Job 3')).not.toBeInTheDocument()
      expect(screen.getByText('+2 more active jobs')).toBeInTheDocument()
    })

    it('should limit recent jobs display to 3', () => {
      const jobs = [
        createMockRenderJob({ name: 'Recent 1' }),
        createMockRenderJob({ name: 'Recent 2' }),
        createMockRenderJob({ name: 'Recent 3' }),
        createMockRenderJob({ name: 'Recent 4' }),
        createMockRenderJob({ name: 'Recent 5' }),
      ]

      mockRenderJobsStore.renderJobs = jobs

      render(<RenderQueueWidget />)
      
      expect(screen.getByText('Recent 1')).toBeInTheDocument()
      expect(screen.getByText('Recent 2')).toBeInTheDocument()
      expect(screen.getByText('Recent 3')).toBeInTheDocument()
      expect(screen.queryByText('Recent 4')).not.toBeInTheDocument()
      expect(screen.queryByText('Recent 5')).not.toBeInTheDocument()
    })
  })
})