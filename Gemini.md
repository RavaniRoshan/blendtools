# BlendTools - Curated Utilities for Blender Power Users

## Project Overview
BlendTools is a modern web-based utility suite designed to optimize, extend, and accelerate Blender workflows. Built for 3D creators, designers, and technical artists, BlendTools empowers users with a robust collection of tools tailored for Blender's open-source 3D ecosystem.

## Tech Stack & Architecture

### Frontend
- **Framework**: Vite + React 18 (TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui components
- **UI Architecture**: Modular, drag-and-drop support for tool layout
- **PWA Ready**: Offline-first capabilities for essential tools
- **WebSocket Client**: Persistent connection with Blender's local bridge
- **State Management**: Zustand for global state
- **Routing**: React Router v6
- **Charts**: Recharts for analytics
- **Icons**: Lucide React

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with OAuth (GitHub, Google)
- **Real-time**: Supabase subscriptions
- **File Storage**: Supabase Storage for .blend files, textures, previews
- **API**: RESTful endpoints via Supabase functions
- **Deployment**: Vercel/Netlify for frontend, Supabase for backend

### Blender Integration
- **Python Add-on**: Local WebSocket server in Blender
- **Real-time Sync**: Scene data, render progress, script execution
- **Security**: Token-based authentication
- **Commands**: Script execution, asset import/export, render management

## Project Structure

```
blendtools/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Layout components (Header, Sidebar)
│   │   ├── dashboard/       # Dashboard specific components
│   │   ├── scripts/         # Script Hub components
│   │   ├── shaders/         # Shader Library components
│   │   ├── render/          # Render Queue components
│   │   └── projects/        # Project Management components
│   ├── pages/               # Page components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and configurations
│   │   ├── supabase.ts      # Supabase client
│   │   ├── websocket.ts     # WebSocket manager
│   │   └── utils.ts         # Helper functions
│   ├── stores/              # Zustand stores
│   ├── types/               # TypeScript type definitions
│   └── assets/              # Static assets
├── blender-plugin/          # Blender Python add-on
│   ├── __init__.py          # Add-on registration
│   ├── websocket_server.py  # WebSocket server
│   ├── blender_bridge.py    # Blender API integration
│   └── ui.py                # Blender UI panels
├── public/                  # Public assets
├── docs/                    # Documentation
└── scripts/                 # Build and deployment scripts
```

## Key Features to Implement

### Core Modules
1. **Dashboard**: Project overview, analytics, render queue status
2. **Script Hub**: Python script management, installation, ratings
3. **Shader Library**: Material browser with visual previews
4. **Asset Optimizer**: Cleanup tools, export presets
5. **Render Queue**: Job scheduling, progress monitoring
6. **Project Management**: File organization, version control
7. **Team Collaboration**: Shared workspaces, permissions

### Blender Integration
- Real-time scene synchronization
- Script execution and management
- Asset import/export automation
- Render job submission and monitoring
- Material library sync

## Coding Standards & Conventions

### TypeScript
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use branded types for IDs (e.g., `ProjectId`, `ScriptId`)
- Prefer `type` over `interface` for simple structures
- Use utility types (Pick, Omit, Partial) appropriately

### React
- Functional components with hooks only
- Custom hooks for complex logic
- Use React.memo for performance optimization
- Prefer composition over inheritance
- Follow the "lift state up" principle

### Styling
- Use Tailwind CSS utility classes
- Create custom components with shadcn/ui
- Implement consistent design system
- Support dark/light themes
- Ensure responsive design for all viewports

### File Naming
- Components: PascalCase (e.g., `ScriptCard.tsx`)
- Hooks: camelCase with "use" prefix (e.g., `useWebSocket.ts`)
- Utilities: camelCase (e.g., `formatTime.ts`)
- Constants: SCREAMING_SNAKE_CASE
- Types: PascalCase (e.g., `Script`, `RenderJob`)

### State Management
- Use Zustand for global state
- Create separate stores for different domains
- Use React Query for server state
- Implement optimistic updates where appropriate
- Handle loading and error states consistently

## Database Schema

### Core Tables
```sql
-- Users and authentication
users (
  id uuid primary key,
  email text unique,
  username text unique,
  avatar_url text,
  created_at timestamptz
)

-- Projects
projects (
  id uuid primary key,
  name text not null,
  description text,
  owner_id uuid references users(id),
  created_at timestamptz,
  updated_at timestamptz
)

-- Scripts
scripts (
  id uuid primary key,
  name text not null,
  description text,
  category text,
  code text,
  author_id uuid references users(id),
  downloads integer default 0,
  rating numeric(3,2),
  created_at timestamptz
)

-- Shaders/Materials
shaders (
  id uuid primary key,
  name text not null,
  description text,
  category text,
  node_data jsonb,
  preview_url text,
  author_id uuid references users(id),
  created_at timestamptz
)

-- Render Jobs
render_jobs (
  id uuid primary key,
  name text not null,
  project_id uuid references projects(id),
  status text check (status in ('queued', 'rendering', 'completed', 'failed')),
  progress integer default 0,
  created_at timestamptz,
  completed_at timestamptz
)
```

## WebSocket API Specification

### Connection
- Endpoint: `ws://localhost:8765` (Blender plugin)
- Authentication: Bearer token in headers
- Heartbeat: 30-second ping/pong

### Message Types
```typescript
interface WebSocketMessage {
  id: string;
  type: 'command' | 'response' | 'event';
  action: string;
  payload: any;
  timestamp: number;
}

// Commands (Web App → Blender)
type BlenderCommand = 
  | { action: 'execute_script', payload: { code: string, context?: string } }
  | { action: 'get_scene_info', payload: {} }
  | { action: 'import_asset', payload: { path: string, type: string } }
  | { action: 'start_render', payload: { settings: RenderSettings } }

// Events (Blender → Web App)
type BlenderEvent =
  | { action: 'scene_changed', payload: SceneInfo }
  | { action: 'render_progress', payload: { jobId: string, progress: number } }
  | { action: 'script_executed', payload: { success: boolean, result?: any, error?: string } }
```

## Performance Considerations

### Frontend Optimization
- Implement virtualization for large lists (scripts, shaders)
- Use React.lazy for code splitting
- Optimize images with proper formats and sizes
- Cache frequently accessed data
- Implement skeleton loading states

### Backend Optimization
- Use database indexes on frequently queried columns
- Implement pagination for large datasets
- Cache expensive queries
- Use connection pooling
- Optimize file uploads with presigned URLs

### Real-time Features
- Debounce frequent updates
- Use efficient diff algorithms for scene sync
- Implement backpressure handling
- Use connection multiplexing where possible

## Security Guidelines

### Authentication & Authorization
- Implement JWT token refresh logic
- Use role-based access control (RBAC)
- Validate all user inputs
- Sanitize file uploads
- Implement rate limiting

### Blender Plugin Security
- Validate all incoming WebSocket messages
- Use secure token exchange
- Sandbox script execution where possible
- Log security-relevant events
- Implement connection whitelisting

## Testing Strategy

### Frontend Testing
- Unit tests: Jest + React Testing Library
- Integration tests: Test WebSocket connections
- E2E tests: Playwright for critical user flows
- Visual regression: Chromatic or similar
- Performance tests: Lighthouse CI

### Backend Testing
- API tests: Test Supabase functions
- Database tests: Test migrations and schemas
- Integration tests: Test real-time subscriptions
- Load tests: Test with multiple concurrent users

### Blender Plugin Testing
- Unit tests for Python modules
- Integration tests with mock Blender API
- Manual testing in actual Blender environment
- Cross-version compatibility testing

## Development Workflow

### Git Strategy
- Main branch for production
- Develop branch for integration
- Feature branches for new features
- Hotfix branches for critical fixes
- Semantic versioning for releases

### Code Review Process
- All code must be reviewed before merge
- Use pull request templates
- Run automated tests on all PRs
- Check code coverage requirements
- Verify performance impact

### Deployment Pipeline
- Automated testing on PR creation
- Staging deployment on develop branch
- Production deployment on main branch merge
- Database migration verification
- Rollback procedures documented

## Blender Plugin Development

### Plugin Structure
```python
# __init__.py - Add-on registration
bl_info = {
    "name": "BlendTools Bridge",
    "version": (1, 0, 0),
    "blender": (3, 0, 0),
    "category": "System",
}

# Key modules to implement
- websocket_server.py: Handle WebSocket connections
- blender_bridge.py: Interface with Blender API
- script_executor.py: Safe script execution
- ui.py: Blender UI integration
```

### Installation Process
1. Package as .zip for Blender installation
2. Auto-configuration wizard on first run
3. Generate secure connection tokens
4. Test connection with web app
5. Enable background operation

## Common Patterns & Best Practices

### Error Handling
```typescript
// Consistent error handling pattern
interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Use Result type for operations that can fail
type Result<T, E = ApiError> = 
  | { success: true; data: T }
  | { success: false; error: E }
```

### Loading States
```typescript
// Consistent loading state pattern
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}
```

### WebSocket Management
```typescript
// Robust WebSocket connection handling
class WebSocketManager {
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  
  // Implement exponential backoff
  // Handle connection state changes
  // Queue messages during disconnection
  // Provide connection status to UI
}
```

## Documentation Requirements

### Code Documentation
- JSDoc comments for all public functions
- README files for each major module
- API documentation with examples
- Architecture decision records (ADRs)

### User Documentation
- Installation guides for web app and Blender plugin
- Tutorial videos for key workflows
- FAQ for common issues
- Troubleshooting guides

Remember: This is a complex, feature-rich application. Implement incrementally, starting with core functionality and expanding based on user feedback. Prioritize performance, security, and user experience throughout development.