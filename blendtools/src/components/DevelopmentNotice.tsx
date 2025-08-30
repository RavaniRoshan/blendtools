import React, { useEffect, useState } from 'react'
import { AlertTriangle, ExternalLink, Database, CheckCircle } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { checkDatabaseStatus, getDatabaseSetupInstructions, type DatabaseStatus } from '../lib/databaseChecker'

export const DevelopmentNotice: React.FC = () => {
  const [databaseStatus, setDatabaseStatus] = useState<DatabaseStatus | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const isConfigured = supabaseUrl && 
    supabaseUrl !== 'your_supabase_project_url_here' &&
    supabaseUrl.startsWith('https://')

  useEffect(() => {
    if (isConfigured && !databaseStatus) {
      setIsChecking(true)
      checkDatabaseStatus()
        .then(setDatabaseStatus)
        .finally(() => setIsChecking(false))
    }
  }, [isConfigured, databaseStatus])

  const handleRefreshCheck = async () => {
    setIsChecking(true)
    const status = await checkDatabaseStatus()
    setDatabaseStatus(status)
    setIsChecking(false)
  }

  // Don't show in production
  if (import.meta.env.PROD) {
    return null
  }

  // If everything is configured and working, show minimal success notice
  if (isConfigured && databaseStatus?.connected && databaseStatus?.tablesExist && databaseStatus?.errors.length === 0) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Backend Ready</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const instructions = databaseStatus ? getDatabaseSetupInstructions(databaseStatus) : []

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-orange-800 dark:text-orange-200">
            <div className="flex items-center gap-2">
              {isConfigured ? <Database className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              {isConfigured ? 'Database Setup' : 'Development Mode'}
            </div>
            {isConfigured && (
              <Badge variant={databaseStatus?.connected ? "default" : "destructive"} className="text-xs">
                {isChecking ? '⏳' : databaseStatus?.connected ? 'Connected' : 'Disconnected'}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {!isConfigured ? (
            <>
              <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                Supabase is not configured. Authentication and database features are disabled.
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-orange-700 border-orange-300 hover:bg-orange-100 dark:text-orange-300 dark:border-orange-700 dark:hover:bg-orange-900"
                  onClick={() => window.open('https://supabase.com', '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Setup Supabase
                </Button>
                <details className="text-xs text-orange-600 dark:text-orange-400">
                  <summary className="cursor-pointer">Quick Setup Guide</summary>
                  <div className="mt-2 space-y-1">
                    <p>1. Create project at supabase.com</p>
                    <p>2. Update .env.local with your URL & key</p>
                    <p>3. Run database-schema.sql</p>
                    <p>4. Restart the dev server</p>
                  </div>
                </details>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2 mb-3">
                {instructions.map((instruction, index) => (
                  <p key={index} className="text-xs text-orange-700 dark:text-orange-300">
                    {instruction}
                  </p>
                ))}
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-orange-700 border-orange-300 hover:bg-orange-100 dark:text-orange-300 dark:border-orange-700 dark:hover:bg-orange-900"
                  onClick={handleRefreshCheck}
                  disabled={isChecking}
                >
                  {isChecking ? '⏳ Checking...' : '🔄 Refresh Check'}
                </Button>
                {databaseStatus && !databaseStatus.tablesExist && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-orange-700 border-orange-300 hover:bg-orange-100 dark:text-orange-300 dark:border-orange-700 dark:hover:bg-orange-900"
                    onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Open Supabase Dashboard
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}