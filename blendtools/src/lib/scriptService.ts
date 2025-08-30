import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Script = Database['public']['Tables']['scripts']['Row']
type ScriptInsert = Database['public']['Tables']['scripts']['Insert']
type ScriptUpdate = Database['public']['Tables']['scripts']['Update']

export const scriptService = {
  // Get all scripts
  async getScripts() {
    const { data, error } = await supabase
      .from('scripts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get scripts by category
  async getScriptsByCategory(category: string) {
    const { data, error } = await supabase
      .from('scripts')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get script by ID
  async getScript(id: string) {
    const { data, error } = await supabase
      .from('scripts')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Create new script
  async createScript(script: ScriptInsert) {
    const { data, error } = await supabase
      .from('scripts')
      .insert(script)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update script
  async updateScript(id: string, updates: ScriptUpdate) {
    const { data, error } = await supabase
      .from('scripts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete script
  async deleteScript(id: string) {
    const { error } = await supabase
      .from('scripts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Increment download count
  async incrementDownloads(id: string) {
    const { data, error } = await supabase
      .rpc('increment_script_downloads', { script_id: id })
    
    if (error) throw error
    return data
  },

  // Search scripts
  async searchScripts(query: string) {
    const { data, error } = await supabase
      .from('scripts')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}