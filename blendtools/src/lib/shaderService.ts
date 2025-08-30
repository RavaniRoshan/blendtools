import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Shader = Database['public']['Tables']['shaders']['Row']
type ShaderInsert = Database['public']['Tables']['shaders']['Insert']
type ShaderUpdate = Database['public']['Tables']['shaders']['Update']

export const shaderService = {
  // Get all shaders
  async getShaders() {
    const { data, error } = await supabase
      .from('shaders')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get shaders by category
  async getShadersByCategory(category: string) {
    const { data, error } = await supabase
      .from('shaders')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get shader by ID
  async getShader(id: string) {
    const { data, error } = await supabase
      .from('shaders')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Create new shader
  async createShader(shader: ShaderInsert) {
    const { data, error } = await supabase
      .from('shaders')
      .insert(shader)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update shader
  async updateShader(id: string, updates: ShaderUpdate) {
    const { data, error } = await supabase
      .from('shaders')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete shader
  async deleteShader(id: string) {
    const { error } = await supabase
      .from('shaders')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Search shaders
  async searchShaders(query: string) {
    const { data, error } = await supabase
      .from('shaders')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}