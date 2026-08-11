import createFetchClient from 'openapi-fetch'
import createQueryClient from 'openapi-react-query'

import type { paths } from './schema'

/**
 * Dev-only escape hatch: with `VITE_MOCK_API=1` in a local `.env`, content is
 * served from fixtures so the visual work never depends on the API being up.
 * `import.meta.env.DEV` is statically false in production builds, so the whole
 * branch — dynamic import, mock, and fixtures — is dropped from the bundle.
 */
const mockFetch =
  import.meta.env.DEV && import.meta.env.VITE_MOCK_API === '1'
    ? async (request: Request) => (await import('../test/dev-mock')).devMockFetch(request)
    : undefined

/** Raw typed fetch client — every request goes to VITE_API_URL (AD-2). */
export const client = createFetchClient<paths>({
  baseUrl: import.meta.env.VITE_API_URL,
  fetch: mockFetch,
})

/** TanStack Query wrapper — components consume the API exclusively through this (AD-1). */
export const $api = createQueryClient(client)
