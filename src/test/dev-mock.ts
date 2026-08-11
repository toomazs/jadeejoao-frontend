import { fixtureContent } from './fixtures/content'

/**
 * Dev-only mock transport for the openapi-fetch client.
 * Serves the fixture payload for `GET /api/v1/content` and passes every other
 * request through to the real network. Reached exclusively behind the
 * `import.meta.env.DEV && VITE_MOCK_API === '1'` guard in `src/api/client.ts`,
 * so production builds tree-shake this module (and the fixtures) away entirely.
 */
export function devMockFetch(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url)

  if (request.method === 'GET' && pathname === '/api/v1/content') {
    return Promise.resolve(
      new Response(JSON.stringify(fixtureContent), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
  }

  return fetch(request)
}
