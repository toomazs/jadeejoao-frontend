import createFetchClient from 'openapi-fetch'
import createQueryClient from 'openapi-react-query'

import type { paths } from './schema'
import { isPreview, previewFetch } from './preview'

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

/**
 * Preview transport, for when the admin panel is showing this site live in an
 * iframe. Unlike the dev mock, this ships in production — the couple edits the
 * real site, not a copy of it — but it is a runtime check, so a normal visit
 * never touches it. See `preview.ts`.
 */
const transport = isPreview() ? previewFetch : mockFetch

/** Raw typed fetch client — every request goes to VITE_API_URL (AD-2). */
export const client = createFetchClient<paths>({
  baseUrl: import.meta.env.VITE_API_URL,
  fetch: transport,
})

/** TanStack Query wrapper — components consume the API exclusively through this (AD-1). */
export const $api = createQueryClient(client)
