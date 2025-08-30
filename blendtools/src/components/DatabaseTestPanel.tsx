import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { useScriptsStore, useShadersStore, useProjectsStore, useRenderJobsStore, useAuthStore } from '../stores'

export const DatabaseTestPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [testScript, setTestScript] = useState({ name: 'Test Script', description: 'A test script', category: 'utility', code: 'print("Hello World")' })
  const [testShader, setTestShader] = useState({ name: 'Test Shader', description: 'A test shader', category: 'material' })
  const [testProject, setTestProject] = useState({ name: 'Test Project', description: 'A test project' })

  const { user } = useAuthStore()
  const { 
    scripts, 
    loading: scriptsLoading, 
    error: scriptsError, 
    createScript, 
    fetchScripts 
  } = useScriptsStore()
  
  const { 
    shaders, 
    loading: shadersLoading, 
    error: shadersError, 
    createShader, 
    fetchShaders 
  } = useShadersStore()
  
  const { 
    projects, 
    loading: projectsLoading, 
    error: projectsError, 
    createProject, 
    fetchProjects 
  } = useProjectsStore()
  
  const { 
    renderJobs, 
    loading: jobsLoading, 
    error: jobsError, 
    createRenderJob, 
    fetchRenderJobs 
  } = useRenderJobsStore()

  const handleCreateScript = async () => {
    if (!user) {
      alert('Please sign in first')
      return
    }
    
    const result = await createScript({
      ...testScript,
      author_id: user.id
    })
    
    if (result.success) {
      alert('Script created successfully!')
    } else {
      alert(`Failed to create script: ${result.error}`)
    }
  }

  const handleCreateShader = async () => {
    if (!user) {
      alert('Please sign in first')
      return
    }
    
    const result = await createShader({
      ...testShader,
      author_id: user.id,
      node_data: { nodes: [], edges: [] }
    })
    
    if (result.success) {
      alert('Shader created successfully!')
    } else {
      alert(`Failed to create shader: ${result.error}`)
    }
  }

  const handleCreateProject = async () => {
    if (!user) {
      alert('Please sign in first')
      return
    }
    
    const result = await createProject({
      ...testProject,
      owner_id: user.id
    })
    
    if (result.success) {
      alert('Project created successfully!')
    } else {
      alert(`Failed to create project: ${result.error}`)
    }
  }

  const handleCreateRenderJob = async () => {
    if (!user || projects.length === 0) {
      alert('Please sign in and create a project first')
      return
    }
    
    const result = await createRenderJob({
      name: 'Test Render Job',
      project_id: projects[0].id,
      status: 'queued'
    })
    
    if (result.success) {
      alert('Render job created successfully!')
    } else {
      alert(`Failed to create render job: ${result.error}`)
    }
  }

  const handleRefreshAll = () => {
    fetchScripts()
    fetchShaders()
    fetchProjects()
    fetchRenderJobs()
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-20 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
        >
          🗄️ Database Test
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-20 left-4 z-50 w-96 max-h-96 overflow-auto">
      <Card className="bg-white border-green-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-green-800">Database Integration Test</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {/* Auth Status */}
          <div>
            <div className="text-xs font-medium mb-1">Authentication</div>
            <Badge variant={user ? "default" : "destructive"}>
              {user ? `Logged in as ${user.email}` : 'Not authenticated'}
            </Badge>
          </div>

          {/* Data Counts */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>Scripts: {scripts.length} {scriptsLoading && '⏳'}</div>
            <div>Shaders: {shaders.length} {shadersLoading && '⏳'}</div>
            <div>Projects: {projects.length} {projectsLoading && '⏳'}</div>
            <div>Jobs: {renderJobs.length} {jobsLoading && '⏳'}</div>
          </div>

          {/* Errors */}
          {(scriptsError || shadersError || projectsError || jobsError) && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
              {scriptsError || shadersError || projectsError || jobsError}
            </div>
          )}

          {/* Test Actions */}
          {user && (
            <div className="space-y-2">
              <div className="text-xs font-medium">Test CRUD Operations</div>
              
              {/* Script Test */}
              <div className="space-y-1">
                <Input
                  placeholder="Script name"
                  value={testScript.name}
                  onChange={(e) => setTestScript({ ...testScript, name: e.target.value })}
                  className="text-xs h-6"
                />
                <Button
                  size="sm"
                  onClick={handleCreateScript}
                  disabled={scriptsLoading}
                  className="w-full text-xs h-6"
                >
                  Create Test Script
                </Button>
              </div>

              {/* Shader Test */}
              <Button
                size="sm"
                onClick={handleCreateShader}
                disabled={shadersLoading}
                className="w-full text-xs h-6"
              >
                Create Test Shader
              </Button>

              {/* Project Test */}
              <Button
                size="sm"
                onClick={handleCreateProject}
                disabled={projectsLoading}
                className="w-full text-xs h-6"
              >
                Create Test Project
              </Button>

              {/* Render Job Test */}
              <Button
                size="sm"
                onClick={handleCreateRenderJob}
                disabled={jobsLoading || projects.length === 0}
                className="w-full text-xs h-6"
              >
                Create Test Render Job
              </Button>
            </div>
          )}

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            className="w-full text-xs h-6"
          >
            🔄 Refresh All Data
          </Button>

          {/* Real-time Test */}
          <div className="text-xs text-gray-600">
            💡 Create items in Supabase dashboard to test real-time updates
          </div>
        </CardContent>
      </Card>
    </div>
  )
}