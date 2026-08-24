import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Lenis from 'lenis'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App'
import './styles/global.css'

// Lenis smooth scrolling — skipped entirely under reduced motion.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const lenis = new Lenis({ lerp: 0.12, anchors: true })
  const raf = (time: number) => {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
}

/**
 * A guest may open the invitation on a flaky phone connection, or leave the
 * tab sleeping for hours. Queries retry with backoff and revalidate when the
 * page or the network comes back, so a single hiccup never leaves a section
 * stuck on its empty state.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 4,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 15000),
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
})

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element #root not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
