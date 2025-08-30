  
import { NavLink } from 'react-router-dom'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { 
  Box, 
  Settings, 
  Palette, 
  FileText, 
  BarChart3, 
  ChevronLeft,
  ChevronRight,
  Code,
  Paintbrush,
  Activity
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  isCollapsed: boolean
  onToggle: () => void
  onCollapse: () => void
}

const navigationItems = [
  { name: 'Dashboard', icon: BarChart3, path: '/' },
  { name: 'Script Hub', icon: Code, path: '/scripthub' },
  { name: 'Shader Library', icon: Paintbrush, path: '/shaderlibrary' },
  { name: 'Projects', icon: Box, path: '/projects' },
  { name: 'Render Queue', icon: Activity, path: '/render-queue' },
  { name: '3D Tools', icon: Box, path: '/3d-tools' },
  { name: 'Material Editor', icon: Palette, path: '/materials' },
  { name: 'Documentation', icon: FileText, path: '/docs' },
  { name: 'Settings', icon: Settings, path: '/settings' },
]

export function Sidebar({ isOpen, isCollapsed, onToggle, onCollapse }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-14 z-50 h-[calc(100vh-3.5rem)] w-64 transform border-r bg-background transition-transform duration-200 ease-in-out md:relative md:top-0 md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}>
        <div className="flex h-full flex-col">
          {/* Collapse button */}
          <div className="flex items-center justify-end p-2 border-b">
            <Button
              variant="ghost"
              size="icon"
              onClick={onCollapse}
              className="h-8 w-8"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-accent text-accent-foreground' 
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }
                  `}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      onToggle()
                    }
                  }}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </NavLink>
              )
            })}
          </nav>
          
          {/* Footer */}
          {!isCollapsed && (
            <div className="p-4 border-t">
              <Card>
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground text-center">
                    BlendTools v1.0.0
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
