import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Lenis from 'lenis'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { isPreview, installPreviewBridge } from './api/preview'
import { App } from './App'
import './styles/global.css'

// Lenis smooth scrolling — skipped under reduced motion, and skipped in the
// admin preview: it owns the scroll position, so the panel asking the page to
// jump to a chapter was quietly overruled and nothing moved. A working surface
// wants to arrive, not to glide four thousand pixels.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && !isPreview()) {
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
      // A guest may leave the tab sleeping for hours, so coming back is a
      // good moment to check. In the preview it is the opposite: the couple
      // clicks between the panel and the site constantly, and every one of
      // those clicks would be a round of refetches for a page whose data the
      // panel is already handing over.
      refetchOnWindowFocus: !isPreview(),
      refetchOnReconnect: true,
    },
  },
})

// In preview, every draft the panel posts must reach the screen. Only the two
// endpoints the draft actually carries are invalidated: a bare
// invalidateQueries() also refetched the Instagram feeds and the gift list,
// which the transport hands to the network — so a single typed letter fired
// four requests at the real API, and a sentence fired a hundred.
if (isPreview()) {
  installPreviewBridge(() => {
    void queryClient.invalidateQueries({
      predicate: (query) => {
        const path = query.queryKey[1]
        return path === '/api/v1/content' || path === '/api/v1/gifts'
      },
    })
  })
}

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
