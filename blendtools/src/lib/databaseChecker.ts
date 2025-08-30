import { supabase } from './supabase'

export interface DatabaseStatus {
  connected: boolean
  tablesExist: boolean
  missingTables: string[]
  errors: string[]
}

export const checkDatabaseStatus = async (): Promise<DatabaseStatus> => {
  const status: DatabaseStatus = {
    connected: false,
    tablesExist: false,
    missingTables: [],
    errors: []
  }

  try {
    // Test connection
    const { data, error } = await supabase
      .from('_test')
      .select('*')
      .limit(1)
    
    if (error && error.code === '42P01') {
      status.connected = true // Table not found is expected for connection test
    } else if (error) {
      status.errors.push(`Connection issue: ${error.message}`)
      return status
    } else {
      status.connected = true
    }

    // Check required tables
    const requiredTables = ['users', 'scripts', 'shaders', 'projects', 'render_jobs']
    const tableChecks = []

    for (const table of requiredTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('id')
          .limit(1)
        
        if (error && error.code === '42P01') {
          status.missingTables.push(table)
        } else if (error) {
          status.errors.push(`Error checking ${table}: ${error.message}`)
        }
      } catch (err) {
        status.errors.push(`Error checking ${table}: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }

    status.tablesExist = status.missingTables.length === 0

  } catch (err) {
    status.errors.push(`Connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
  }

  return status
}

export const getDatabaseSetupInstructions = (status: DatabaseStatus): string[] => {
  const instructions: string[] = []

  if (!status.connected) {
    instructions.push('❌ Cannot connect to Supabase')
    instructions.push('1. Check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local')
    instructions.push('2. Verify your Supabase project is active')
    instructions.push('3. Restart the development server')
    return instructions
  }

  if (!status.tablesExist) {
    instructions.push('📝 Database tables missing')
    instructions.push('1. Go to your Supabase dashboard: https://supabase.com/dashboard')
    instructions.push('2. Navigate to SQL Editor')
    instructions.push('3. Copy and paste the contents of database-schema.sql')
    instructions.push('4. Click "Run" to execute the schema')
    instructions.push('5. Restart your development server')
    
    if (status.missingTables.length > 0) {
      instructions.push(`Missing tables: ${status.missingTables.join(', ')}`)
    }
  }

  if (status.errors.length > 0) {
    instructions.push('⚠️ Errors detected:')
    status.errors.forEach(error => instructions.push(`   • ${error}`))
  }

  if (status.connected && status.tablesExist && status.errors.length === 0) {
    instructions.push('✅ Database is fully configured!')
    instructions.push('🎉 Your BlendTools backend is ready to use')
  }

  return instructions
}