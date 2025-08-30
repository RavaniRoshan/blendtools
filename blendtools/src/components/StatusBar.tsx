import { Circle, Wifi, Battery, Clock } from 'lucide-react'

export function StatusBar() {
  return (
    <div className="flex h-8 items-center justify-between border-t bg-muted/50 px-4 text-xs text-muted-foreground">
      <div className="flex items-center space-x-2">
        <Circle className="h-2 w-2 fill-green-500 text-green-500" />
        <span>Ready</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <Wifi className="h-3 w-3" />
          <span>Online</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Battery className="h-3 w-3" />
          <span>100%</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Clock className="h-3 w-3" />
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  )
}
