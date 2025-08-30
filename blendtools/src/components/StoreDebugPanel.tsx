import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useAuthStore, useScriptsStore, useShadersStore, useProjectsStore, useRenderJobsStore } from '../stores'

export const StoreDebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  
  const auth = useAuthStore()
  const scripts = useScriptsStore()
  const shaders = useShadersStore()
  const projects = useProjectsStore()
  const renderJobs = useRenderJobsStore()

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
        >
          🔍 Debug Stores
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-80 max-h-96 overflow-auto">
      <Card className="bg-white border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-blue-800">Store State Debug</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          {/* Auth Store */}
          <div>
            <div className="font-medium text-blue-700 mb-1">Authentication</div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>User:</span>
                <Badge variant={auth.user ? "default" : "secondary"}>
                  {auth.user ? auth.user.email : 'Not logged in'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Loading:</span>
                <Badge variant={auth.loading ? "destructive" : "outline"}>
                  {auth.loading ? 'Yes' : 'No'}
                </Badge>
              </div>
              {auth.error && (
                <div className="text-red-600 text-xs">Error: {auth.error}</div>
              )}
            </div>
          </div>

          {/* Scripts Store */}
          <div>
            <div className="font-medium text-blue-700 mb-1">Scripts</div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Count:</span>
                <Badge variant="outline">{scripts.scripts.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Loading:</span>
                <Badge variant={scripts.loading ? "destructive" : "outline"}>
                  {scripts.loading ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Search:</span>
                <Badge variant="secondary">{scripts.searchQuery || 'None'}</Badge>
              </div>
            </div>
          </div>

          {/* Shaders Store */}
          <div>
            <div className="font-medium text-blue-700 mb-1">Shaders</div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Count:</span>
                <Badge variant="outline">{shaders.shaders.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Loading:</span>
                <Badge variant={shaders.loading ? "destructive" : "outline"}>
                  {shaders.loading ? 'Yes' : 'No'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Projects Store */}
          <div>
            <div className="font-medium text-blue-700 mb-1">Projects</div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Count:</span>
                <Badge variant="outline">{projects.projects.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Current:</span>
                <Badge variant={projects.currentProject ? "default" : "secondary"}>
                  {projects.currentProject?.name || 'None'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Render Jobs Store */}
          <div>
            <div className="font-medium text-blue-700 mb-1">Render Jobs</div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Total:</span>
                <Badge variant="outline">{renderJobs.renderJobs.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Active:</span>
                <Badge variant="default">{renderJobs.activeJobs.length}</Badge>
              </div>
            </div>
          </div>

          {/* Test Actions */}
          <div className="pt-2 border-t">
            <div className="font-medium text-blue-700 mb-2">Test Actions</div>
            <div className="space-y-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => scripts.fetchScripts()}
                className="w-full text-xs"
              >
                Fetch Scripts
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => shaders.fetchShaders()}
                className="w-full text-xs"
              >
                Fetch Shaders
              </Button>
              {auth.user && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => projects.fetchProjects()}
                  className="w-full text-xs"
                >
                  Fetch Projects
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}