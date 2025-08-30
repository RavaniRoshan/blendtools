import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type RenderJob = Database['public']['Tables']['render_jobs']['Row']
type RenderJobInsert = Database['public']['Tables']['render_jobs']['Insert']
type RenderJobUpdate = Database['public']['Tables']['render_jobs']['Update']

export const renderJobService = {
  // Get all render jobs
  async getRenderJobs() {
    const { data, error } = await supabase
      .from('render_jobs')
      .select(`
        *,
        projects (
          name,
          description
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get render jobs by project
  async getRenderJobsByProject(projectId: string) {
    const { data, error } = await supabase
      .from('render_jobs')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get render job by ID
  async getRenderJob(id: string) {
    const { data, error } = await supabase
      .from('render_jobs')
      .select(`
        *,
        projects (
          name,
          description
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Create new render job
  async createRenderJob(renderJob: RenderJobInsert) {
    const { data, error } = await supabase
      .from('render_jobs')
      .insert(renderJob)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update render job
  async updateRenderJob(id: string, updates: RenderJobUpdate) {
    const { data, error } = await supabase
      .from('render_jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update render job progress
  async updateRenderProgress(id: string, progress: number) {
    const updates: RenderJobUpdate = { progress }
    
    // If progress is 100, mark as completed
    if (progress >= 100) {
      updates.status = 'completed'
      updates.completed_at = new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('render_jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Cancel render job
  async cancelRenderJob(id: string) {
    const { data, error } = await supabase
      .from('render_jobs')
      .update({ status: 'failed' })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete render job
  async deleteRenderJob(id: string) {
    const { error } = await supabase
      .from('render_jobs')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Get active render jobs (queued or rendering)
  async getActiveRenderJobs() {
    const { data, error } = await supabase
      .from('render_jobs')
      .select(`
        *,
        projects (
          name,
          description
        )
      `)
      .in('status', ['queued', 'rendering'])
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}