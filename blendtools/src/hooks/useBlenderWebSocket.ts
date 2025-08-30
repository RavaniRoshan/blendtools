import { useState, useEffect, useCallback } from 'react';
import { WebSocketManager, type WebSocketConnectionStatus } from '../lib/websocket';
import type { BlenderCommand, BlenderEvent, WebSocketMessage, SceneInfo, AuthResponse } from '../types';

interface UseBlenderWebSocketResult {
  status: WebSocketConnectionStatus;
  sceneInfo: SceneInfo | null;
  sendCommand: (command: BlenderCommand) => void;
  error: Error | null;
}

const BLENDER_WEBSOCKET_URL = 'ws://localhost:8765';
const AUTH_TOKEN = 'your_blender_auth_token'; // Placeholder for a secure token

export const useBlenderWebSocket = (): UseBlenderWebSocketResult => {
  const [status, setStatus] = useState<WebSocketConnectionStatus>('disconnected');
  const [sceneInfo, setSceneInfo] = useState<SceneInfo | null>(null);
  const [wsManager, setWsManager] = useState<WebSocketManager | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const manager = new WebSocketManager({
      url: BLENDER_WEBSOCKET_URL,
      reconnectInterval: 2000,
      maxReconnectAttempts: 10,
    });
    setWsManager(manager);

    manager.on('statusChange', (newStatus: WebSocketConnectionStatus) => {
      setStatus(newStatus);
      if (newStatus === 'connected') {
        // On successful connection, send authentication token
        manager.send(JSON.stringify({
          id: `${Date.now()}`,
          type: 'command',
          action: 'authenticate',
          payload: { token: AUTH_TOKEN },
          timestamp: Date.now(),
        }));
        // Request initial scene info
        manager.send(JSON.stringify({
          id: `${Date.now()}`,
          type: 'command',
          action: 'get_scene_info',
          payload: {},
          timestamp: Date.now(),
        }));
      }
    });

    manager.on('message', (message: string) => {
      try {
        const parsedMessage: WebSocketMessage = JSON.parse(message);
        if (parsedMessage.type === 'event') {
          const blenderEvent: BlenderEvent = parsedMessage.payload as BlenderEvent; // Assert type
          if (blenderEvent.action === 'scene_changed') {
            setSceneInfo(blenderEvent.payload);
          } else if (blenderEvent.action === 'render_progress') {
            console.log('Render Progress:', blenderEvent.payload);
          } else if (blenderEvent.action === 'script_executed') {
            console.log('Script Executed:', blenderEvent.payload);
          }
        } else if (parsedMessage.type === 'response') {
          // Handle command responses
          if (parsedMessage.action === 'authenticate' && !(parsedMessage.payload as AuthResponse).success) { // Assert type
            setError(new Error('Authentication failed'));
            manager.close();
          }
          console.log('Command Response:', parsedMessage);
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
        setError(err as Error);
      }
    });

    manager.on('error', (err: Error) => {
      console.error('WebSocket Manager Error:', err);
      setError(err);
    });

    return () => {
      manager.close();
    };
  }, []);

  const sendCommand = useCallback((command: BlenderCommand) => {
    if (!wsManager) {
      console.warn('WebSocket manager not initialized.');
      setError(new Error('WebSocket manager not initialized.'));
      return;
    }

    if (status !== 'connected') {
      console.warn('Cannot send command: WebSocket not connected.', command);
      setError(new Error('WebSocket not connected.'));
      return;
    }

    // Basic command validation (can be expanded)
    if (!command.action) {
      console.error('Invalid command: action is missing.', command);
      setError(new Error('Invalid command: action is missing.'));
      return;
    }

    const message: WebSocketMessage = {
      id: `${Date.now()}`,
      type: 'command',
      action: command.action,
      payload: command.payload,
      timestamp: Date.now(),
    };
    wsManager.send(JSON.stringify(message));
    setError(null); // Clear any previous errors on successful send
  }, [wsManager, status]);

  return {
    status,
    sceneInfo,
    sendCommand,
    error,
  };
};
