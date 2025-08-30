import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { useRenderJobsStore } from '../../stores/renderJobsStore'
import { useAuthStore } from '../../stores/authStore'
import { 
  Play, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  Activity
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const RenderQueueWidget: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { 
    activeJobs, 
    renderJobs, 
    loading, 
    fetchActiveJobs, 
    fetchRenderJobs 
  } = useRenderJobsStore()

  useEffect(() => {
    if (user) {
      fetchActiveJobs()
      fetchRenderJobs()
    }
  }, [user, fetchActiveJobs, fetchRenderJobs])

  const recentJobs = renderJobs.slice(0, 3)
  const activeJobsCount = activeJobs.length
  const completedJobs = renderJobs.filter(job => job.status === 'completed').length
  const failedJobs = renderJobs.filter(job => job.status === 'failed').length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'queued':
        return <Clock className="h-3 w-3 text-orange-500" />
      case 'rendering':
        return <Play className="h-3 w-3 text-blue-500" />
      case 'completed':
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'failed':
        return <XCircle className="h-3 w-3 text-red-500" />
      default:
        return <Clock className="h-3 w-3 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'queued':
        return 'bg-orange-100 text-orange-800'
      case 'rendering':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Render Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Sign in to view render jobs</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Render Queue
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/render-queue')}
            className="text-xs"
          >
            View All
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="space-y-1">
            <div className="text-lg font-bold text-blue-600">{activeJobsCount}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold text-green-600">{completedJobs}</div>
            <div className="text-xs text-muted-foreground">Done</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold text-red-600">{failedJobs}</div>
            <div className="text-xs text-muted-foreground">Failed</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold text-gray-600">{renderJobs.length}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>

        {/* Active Jobs Progress */}
        {activeJobs.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Currently Rendering</h4>
            {activeJobs.slice(0, 2).map((job) => (
              <div key={job.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(job.status)}
                    <span className="truncate max-w-32">{job.name}</span>
                  </div>
                  <Badge size="sm" className={getStatusColor(job.status)}>
                    {job.status === 'rendering' ? `${job.progress}%` : job.status}
                  </Badge>
                </div>
                {job.status === 'rendering' && (
                  <Progress value={job.progress} className="h-1" />
                )}
              </div>
            ))}
            {activeJobs.length > 2 && (
              <div className="text-xs text-muted-foreground text-center">
                +{activeJobs.length - 2} more active jobs
              </div>
            )}
          </div>
        )}

        {/* Recent Jobs */}
        {recentJobs.length > 0 ? (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Recent Jobs</h4>
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {getStatusIcon(job.status)}
                  <span className="truncate max-w-32">{job.name}</span>
                </div>
                <Badge size="sm" className={getStatusColor(job.status)}>
                  {job.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <Activity className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No render jobs yet</p>
            <Button 
              size="sm" 
              variant="outline" 
              className="mt-2"
              onClick={() => navigate('/render-queue')}
            >
              Create First Job
            </Button>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}