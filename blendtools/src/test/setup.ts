import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, vi } from 'vitest'

// Import jsdom to ensure DOM environment
if (typeof global !== 'undefined') {
  // Polyfill for jsdom
  global.TextEncoder = TextEncoder
  global.TextDecoder = TextDecoder
}

// Make vi global
Object.assign(global, { vi })

// Mock next-themes before any imports
vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}))

// Setup for testing environment
beforeAll(() => {
  // Mock window object FIRST - must be before any imports that use window
  if (typeof globalThis.window === 'undefined') {
    Object.defineProperty(globalThis, 'window', {
      value: {
        location: {
          origin: 'http://localhost:3000',
          href: 'http://localhost:3000',
        },
        innerWidth: 1024,
        innerHeight: 768,
      },
      writable: true,
      configurable: true,
    })
  }

  // Mock environment variables for testing
  Object.defineProperty(global, 'import.meta', {
    value: {
      env: {
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'test-anon-key',
      },
    },
  })

  // Mock IntersectionObserver
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  // Mock ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    }),
  })
})

// Cleanup after each test
afterEach(() => {
  cleanup()
})