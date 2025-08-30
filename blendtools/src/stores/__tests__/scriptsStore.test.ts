import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useScriptsStore } from '../scriptsStore'
import { mockSupabaseClient, createMockScript } from '../../test/utils'

// Mock the script service
vi.mock('../../lib/scriptService', () => ({
  scriptService: {
    getScripts: vi.fn(),
    getScript: vi.fn(),
    createScript: vi.fn(),
    updateScript: vi.fn(),
    deleteScript: vi.fn(),
    searchScripts: vi.fn(),
  },
}))

vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabaseClient,
}))

const mockScriptService = {
  getScripts: vi.fn(),
  getScript: vi.fn(),
  createScript: vi.fn(),
  updateScript: vi.fn(),
  deleteScript: vi.fn(),
  searchScripts: vi.fn(),
}

// Import after mocking
const { scriptService } = await import('../../lib/scriptService')
Object.assign(scriptService, mockScriptService)

describe('ScriptsStore', () => {
  beforeEach(() => {
    // Reset store state
    useScriptsStore.setState({
      scripts: [],
      filteredScripts: [],
      currentScript: null,
      loading: false,
      error: null,
      searchQuery: '',
      categoryFilter: 'all',
      ratingFilter: 0,
    })

    // Clear all mocks
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useScriptsStore.getState()
      
      expect(state.scripts).toEqual([])
      expect(state.filteredScripts).toEqual([])
      expect(state.currentScript).toBeNull()
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
      expect(state.searchQuery).toBe('')
      expect(state.categoryFilter).toBe('all')
      expect(state.ratingFilter).toBe(0)
    })
  })

  describe('fetchScripts', () => {
    it('should fetch scripts successfully', async () => {
      const mockScripts = [
        createMockScript({ id: '1', name: 'Script 1', category: 'utility' }),
        createMockScript({ id: '2', name: 'Script 2', category: 'animation' }),
      ]

      mockScriptService.getScripts.mockResolvedValueOnce(mockScripts)

      const { fetchScripts } = useScriptsStore.getState()
      await fetchScripts()

      const state = useScriptsStore.getState()
      expect(state.scripts).toEqual(mockScripts)
      expect(state.filteredScripts).toEqual(mockScripts)
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })

    it('should handle fetch error', async () => {
      const error = new Error('Failed to fetch scripts')
      mockScriptService.getScripts.mockRejectedValueOnce(error)

      const { fetchScripts } = useScriptsStore.getState()
      await fetchScripts()

      const state = useScriptsStore.getState()
      expect(state.scripts).toEqual([])
      expect(state.loading).toBe(false)
      expect(state.error).toBe('Failed to fetch scripts')
    })
  })

  describe('createScript', () => {
    it('should create script successfully', async () => {
      const newScript = createMockScript({ name: 'New Script' })
      const scriptData = {
        name: 'New Script',
        description: 'A new script',
        code: 'print("Hello")',
        category: 'utility',
        author_id: 'user-1',
      }

      mockScriptService.createScript.mockResolvedValueOnce(newScript)

      const { createScript } = useScriptsStore.getState()
      const result = await createScript(scriptData)

      expect(result.success).toBe(true)
      expect(useScriptsStore.getState().scripts).toContain(newScript)
      expect(mockScriptService.createScript).toHaveBeenCalledWith(scriptData)
    })

    it('should handle create error', async () => {
      const error = new Error('Failed to create script')
      mockScriptService.createScript.mockRejectedValueOnce(error)

      const scriptData = {
        name: 'New Script',
        description: 'A new script',
        code: 'print("Hello")',
        category: 'utility',
        author_id: 'user-1',
      }

      const { createScript } = useScriptsStore.getState()
      const result = await createScript(scriptData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to create script')
    })
  })

  describe('updateScript', () => {
    it('should update script successfully', async () => {
      const existingScript = createMockScript({ id: 'script-1', name: 'Old Name' })
      const updatedScript = { ...existingScript, name: 'New Name' }

      useScriptsStore.setState({ scripts: [existingScript] })

      mockScriptService.updateScript.mockResolvedValueOnce(updatedScript)

      const { updateScript } = useScriptsStore.getState()
      const result = await updateScript('script-1', { name: 'New Name' })

      expect(result.success).toBe(true)
      
      const state = useScriptsStore.getState()
      expect(state.scripts[0].name).toBe('New Name')
    })
  })

  describe('deleteScript', () => {
    it('should delete script successfully', async () => {
      const script = createMockScript({ id: 'script-1' })
      useScriptsStore.setState({ scripts: [script] })

      mockScriptService.deleteScript.mockResolvedValueOnce(undefined)

      const { deleteScript } = useScriptsStore.getState()
      const result = await deleteScript('script-1')

      expect(result.success).toBe(true)
      expect(mockScriptService.deleteScript).toHaveBeenCalledWith('script-1')
      
      const state = useScriptsStore.getState()
      expect(state.scripts).toEqual([])
    })
  })

  describe('searchScripts', () => {
    it('should search scripts successfully', async () => {
      const searchResults = [
        createMockScript({ id: '1', name: 'Search Result 1' }),
        createMockScript({ id: '2', name: 'Search Result 2' }),
      ]

      mockScriptService.searchScripts.mockResolvedValueOnce(searchResults)

      const { searchScripts } = useScriptsStore.getState()
      await searchScripts('search query')

      const state = useScriptsStore.getState()
      expect(state.filteredScripts).toEqual(searchResults)
      expect(state.searchQuery).toBe('search query')
      expect(mockScriptService.searchScripts).toHaveBeenCalledWith('search query')
    })
  })

  describe('filtering', () => {
    beforeEach(() => {
      const scripts = [
        createMockScript({ id: '1', category: 'utility', rating: 4.5 }),
        createMockScript({ id: '2', category: 'animation', rating: 3.0 }),
        createMockScript({ id: '3', category: 'utility', rating: 5.0 }),
        createMockScript({ id: '4', category: 'modeling', rating: 2.5 }),
      ]

      useScriptsStore.setState({ scripts, filteredScripts: scripts })
    })

    it('should filter by category', () => {
      const { setCategoryFilter } = useScriptsStore.getState()
      setCategoryFilter('utility')

      const state = useScriptsStore.getState()
      expect(state.categoryFilter).toBe('utility')
      expect(state.filteredScripts).toHaveLength(2)
      expect(state.filteredScripts.every(script => script.category === 'utility')).toBe(true)
    })

    it('should filter by rating', () => {
      const { setRatingFilter } = useScriptsStore.getState()
      setRatingFilter(4)

      const state = useScriptsStore.getState()
      expect(state.ratingFilter).toBe(4)
      expect(state.filteredScripts).toHaveLength(2)
      expect(state.filteredScripts.every(script => script.rating >= 4)).toBe(true)
    })

    it('should combine category and rating filters', () => {
      const { setCategoryFilter, setRatingFilter } = useScriptsStore.getState()
      
      setCategoryFilter('utility')
      setRatingFilter(4.5)

      const state = useScriptsStore.getState()
      expect(state.filteredScripts).toHaveLength(1)
      expect(state.filteredScripts[0].id).toBe('3')
    })

    it('should show all scripts when filters are reset', () => {
      const { setCategoryFilter, setRatingFilter } = useScriptsStore.getState()
      
      // Set filters
      setCategoryFilter('utility')
      setRatingFilter(4)
      
      // Reset filters
      setCategoryFilter('all')
      setRatingFilter(0)

      const state = useScriptsStore.getState()
      expect(state.filteredScripts).toHaveLength(4)
    })
  })

  describe('clearError', () => {
    it('should clear error state', () => {
      useScriptsStore.setState({ error: 'Some error' })

      const { clearError } = useScriptsStore.getState()
      clearError()

      expect(useScriptsStore.getState().error).toBeNull()
    })
  })

  describe('clearCurrentScript', () => {
    it('should clear current script', () => {
      const script = createMockScript()
      useScriptsStore.setState({ currentScript: script })

      const { clearCurrentScript } = useScriptsStore.getState()
      clearCurrentScript()

      expect(useScriptsStore.getState().currentScript).toBeNull()
    })
  })
})