import React, { useMemo, useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { StatusBar } from './components/StatusBar'
import { DraggableLayout } from './components/DraggableLayout'
import { DevelopmentNotice } from './components/DevelopmentNotice'
import { StoreDebugPanel } from './components/StoreDebugPanel'
import { DatabaseTestPanel } from './components/DatabaseTestPanel'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { RenderQueueWidget } from './components/render/RenderQueueWidget'
import { AuthProvider } from './hooks/useAuth'
import { StoreInitializer } from './components/StoreInitializer'
import { useStoreInitialization, useAuthSync, useRealtimeSubscriptions } from './hooks/useStoreHelpers'
import { initializeAuthStore } from './stores/authStore'
import ScriptHub from './pages/ScriptHub'
import ShaderLibrary from './pages/ShaderLibrary'
import ProjectDashboard from './pages/projects/ProjectDashboard'
import RenderQueuePage from './pages/RenderQueuePage'
import { AuthCallback } from './pages/AuthCallback'

function DashboardPage() {
  const items = useMemo(
    () => [
      {
        id: 'tool-1',
        title: 'Scene Overview',
        description: 'Summary of active scene objects and stats.',
        icon: '🧭',
        content: <div className="text-sm">Objects: 12 • Lights: 3 • Cameras: 1</div>,
      },
      {
        id: 'tool-2',
        title: 'Material Inspector',
        description: 'Inspect and tweak material parameters.',
        icon: '🎨',
        content: (
          <div className="space-y-2 text-sm">
            <div>Base Color: #a3bffa</div>
            <div>Metallic: 0.2</div>
            <div>Roughness: 0.6</div>
          </div>
        ),
      },
      {
        id: 'tool-3',
        title: 'Render Settings',
        description: 'Global render quality and performance.',
        icon: '⚙️',
        content: <div className="text-sm">Samples: 128 • Denoise: On • Resolution: 1920×1080</div>,
      },
      {
        id: 'render-queue',
        title: 'Render Queue',
        description: 'Monitor and manage render jobs.',
        icon: '🎬',
        content: <RenderQueueWidget />,
      },
    ],
    []
  )

  return <DraggableLayout items={items} />
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Coming soon.</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [authInitialized, setAuthInitialized] = useState(false)

  // Initialize auth store first
  useEffect(() => {
    const initAuth = async () => {
      try {
        await initializeAuthStore()
        setAuthInitialized(true)
      } catch (error) {
        console.error('Failed to initialize auth store:', error)
        setAuthInitialized(true) // Still allow app to continue
      }
    }
    initAuth()
  }, [])

  // Show loading while auth initializes
  if (!authInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Initializing BlendTools...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <DevelopmentNotice />
      <StoreDebugPanel />
      <DatabaseTestPanel />
      {authInitialized && <StoreInitializer />}
      <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
        <Header onMenuToggle={() => setIsSidebarOpen((v) => !v)} />

        <div className="relative grid grid-cols-1 md:grid-cols-[auto_1fr]">
          <Sidebar
            isOpen={isSidebarOpen}
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarOpen((v) => !v)}
            onCollapse={() => setIsSidebarCollapsed((v) => !v)}
          />

          <main className="min-h-[calc(100vh-3.5rem-2rem)]">
            <React.Suspense
              fallback={
                <div className="flex h-full items-center justify-center p-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/scripthub" element={<ScriptHub />} />
                <Route path="/shaderlibrary" element={<ShaderLibrary />} />
                <Route path="/projects" element={<ProjectDashboard />} />
                <Route path="/render-queue" element={<RenderQueuePage />} />
                <Route path="/3d-tools" element={<Placeholder title="3D Tools" />} />
                <Route path="/materials" element={<Placeholder title="Material Editor" />} />
                <Route path="/docs" element={<Placeholder title="Documentation" />} />
                <Route path="/settings" element={<Placeholder title="Settings" />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
              </Routes>
            </React.Suspense>
          </main>
        </div>

        <StatusBar />
      </div>
    </AuthProvider>
  )
}
