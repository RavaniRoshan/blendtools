export type Script = {
  id: string;
  name: string;
  category: string;
  rating: number;
  downloads: number;
  author: string;
  description: string;
  tags: string[];
  version: string;
  installed: boolean;
  reviews: Review[];
};

export type Review = {
  id: string;
  user: string;
  rating: number;
  comment: string;
};

export type NodeData = {
  id: string;
  type?: string;
  data: { label: string };
  position: { x: number; y: number };
};

export type EdgeData = {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
};

export type MaterialProperties = {
  baseColor?: string;
  metallic?: number;
  roughness?: number;
  // Add other material properties as needed
};

export type Shader = {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  tags: string[];
  node_data: (NodeData | EdgeData)[]; // This will be the data for react-flow
  properties: MaterialProperties; // This will be the material properties
  rating: number;
  downloads: number;
  author: string;
  reviews: Review[];
  description: string;
};

export interface WebSocketMessage {
  id: string;
  type: 'command' | 'response' | 'event';
  action: string;
  payload: BlenderCommand | BlenderEvent | unknown; // Changed from any
  timestamp: number;
}

export type BlenderCommand =
  | { action: 'execute_script', payload: { code: string, context?: string } }
  | { action: 'get_scene_info', payload: Record<string, never> } // Changed from {}
  | { action: 'import_asset', payload: { path: string, type: string } }
  | { action: 'start_render', payload: { settings: RenderSettings } };

export interface RenderSettings {
  // Define render settings properties here
  resolution_x: number;
  resolution_y: number;
  samples: number;
  // ... other settings
}

export interface SceneInfo {
  objects: { name: string; type: string; location: [number, number, number] }[];
  materials: { name: string; type: string }[];
  // ... other scene info
}

export type BlenderEvent =
  | { action: 'scene_changed', payload: SceneInfo }
  | { action: 'render_progress', payload: { jobId: string, progress: number } }
  | { action: 'script_executed', payload: { success: boolean, result?: unknown, error?: string } };

export interface AuthResponse {
  success: boolean;
  message?: string;
}
 // Changed from any
