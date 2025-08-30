import React from 'react'
import { useStoreInitialization, useAuthSync, useRealtimeSubscriptions } from '../hooks/useStoreHelpers'

/**
 * Component responsible for initializing all stores and setting up real-time subscriptions
 * This component ensures proper hook ordering and prevents React hook errors
 */
export const StoreInitializer: React.FC = () => {
  // Initialize stores and sync auth state
  useStoreInitialization()
  useAuthSync()
  useRealtimeSubscriptions()

  // This component doesn't render anything - it's just for hook initialization
  return null
}