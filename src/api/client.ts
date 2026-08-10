import createFetchClient from 'openapi-fetch'
import createQueryClient from 'openapi-react-query'

import type { paths } from './schema'

/** Raw typed fetch client — every request goes to VITE_API_URL (AD-2). */
export const client = createFetchClient<paths>({
  baseUrl: import.meta.env.VITE_API_URL,
})

/** TanStack Query wrapper — components consume the API exclusively through this (AD-1). */
export const $api = createQueryClient(client)
