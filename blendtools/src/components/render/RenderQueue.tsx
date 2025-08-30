import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { useRenderJobsStore } from '../../stores/renderJobsStore'
import { useProjectsStore } from '../../stores/projectsStore'
import { useAuthStore } from '../../stores/authStore'
import { 
  Play, 
  Pause, 
  Square, 
  Trash2, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'

interface RenderJobCardProps {
  job: any // Using any for now, should be RenderJob type
  onCancel: (id: string) => void
  onDelete: (id: string) => void
  onRetry?: (id: string) => void
}

const RenderJobCard: React.FC<RenderJobCardProps> = ({ job, onCancel, onDelete, onRetry }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'queued':
        return <Clock className="h-4 w-4 text-orange-500" />
      case 'rendering':
        return <Play className="h-4 w-4 text-blue-500" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'queued':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'rendering':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const canCancel = job.status === 'queued' || job.status === 'rendering'
  const canRetry = job.status === 'failed'

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(job.status)}
            <div>
              <CardTitle className="text-base">{job.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Created: {formatTime(job.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(job.status)}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canCancel && (
                  <DropdownMenuItem onClick={() => onCancel(job.id)}>
                    <Square className="h-4 w-4 mr-2" />
                    Cancel Job
                  </DropdownMenuItem>
                )}
                {canRetry && (
                  <DropdownMenuItem onClick={() => onRetry?.(job.id)}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry Job
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={() => onDelete(job.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Job
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {job.status === 'rendering' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{job.progress}%</span>
            </div>
            <Progress value={job.progress} className="w-full" />
          </div>
        )}
        {job.completed_at && (
          <p className="text-sm text-muted-foreground">
            Completed: {formatTime(job.completed_at)}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

interface NewRenderJobDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (job: any) => void
}

const NewRenderJobDialog: React.FC<NewRenderJobDialogProps> = ({ open, onOpenChange, onSubmit }) => {
  const [jobName, setJobName] = useState('')
  const [selectedProject, setSelectedProject] = useState('')
  const [description, setDescription] = useState('')
  const { projects } = useProjectsStore()

  const handleSubmit = () => {
    if (!jobName.trim() || !selectedProject) return

    onSubmit({
      name: jobName.trim(),
      project_id: selectedProject,
      status: 'queued',
      progress: 0
    })

    // Reset form
    setJobName('')
    setSelectedProject('')
    setDescription('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Render Job</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="job-name">Job Name</Label>
            <Input
              id="job-name"
              placeholder="Enter job name..."
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project">Project</Label>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter job description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!jobName.trim() || !selectedProject}
            >
              Create Job
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const RenderQueue: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'failed'>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { user } = useAuthStore()
  const { projects, fetchProjects } = useProjectsStore()
  const {
    renderJobs,
    activeJobs,
    loading,
    error,
    fetchRenderJobs,
    fetchActiveJobs,
    createRenderJob,
    cancelJob,
    deleteRenderJob,
    updateRenderJob,
    clearError
  } = useRenderJobsStore()

  useEffect(() => {
    if (user) {
      fetchRenderJobs()
      fetchActiveJobs()
      fetchProjects()
    }
  }, [user, fetchRenderJobs, fetchActiveJobs, fetchProjects])

  const handleCreateJob = async (jobData: any) => {
    const result = await createRenderJob(jobData)
    if (!result.success) {
      // Handle error - could show toast notification
      console.error('Failed to create render job:', result.error)
    }
  }

  const handleCancelJob = async (id: string) => {
    const result = await cancelJob(id)
    if (!result.success) {
      console.error('Failed to cancel job:', result.error)
    }
  }

  const handleDeleteJob = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this render job?')) {
      const result = await deleteRenderJob(id)
      if (!result.success) {
        console.error('Failed to delete job:', result.error)
      }
    }
  }

  const handleRetryJob = async (id: string) => {
    const result = await updateRenderJob(id, { 
      status: 'queued', 
      progress: 0,
      completed_at: null 
    })
    if (!result.success) {
      console.error('Failed to retry job:', result.error)
    }
  }

  const filteredJobs = renderJobs.filter(job => {
    switch (filter) {
      case 'active':
        return job.status === 'queued' || job.status === 'rendering'
      case 'completed':
        return job.status === 'completed'
      case 'failed':
        return job.status === 'failed'
      default:
        return true
    }
  })

  const activeJobsCount = activeJobs.length
  const completedJobsCount = renderJobs.filter(job => job.status === 'completed').length
  const failedJobsCount = renderJobs.filter(job => job.status === 'failed').length

  if (!user) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Render Queue</h2>
        <p className="text-muted-foreground">Please sign in to view your render jobs.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Render Queue</h1>
          <p className="text-muted-foreground">Manage and monitor your render jobs</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Render Job
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Play className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
                <p className="text-2xl font-bold">{activeJobsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedJobsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold">{failedJobsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
                <p className="text-2xl font-bold">{renderJobs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label>Filter:</Label>
          <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={() => { fetchRenderJobs(); fetchActiveJobs(); }}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-800">{error}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={clearError}>
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Jobs List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No render jobs found</h3>
              <p className="text-muted-foreground mb-4">
                {filter === 'all' 
                  ? "You haven't created any render jobs yet." 
                  : `No ${filter} jobs found.`}
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Job
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <RenderJobCard
                key={job.id}
                job={job}
                onCancel={handleCancelJob}
                onDelete={handleDeleteJob}
                onRetry={handleRetryJob}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Job Dialog */}
      <NewRenderJobDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateJob}
      />
    </div>
  )
}