import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ command, mode }) => {
  /**
   * A production build without VITE_API_URL still succeeds — it just bakes an
   * empty baseUrl into the client, so every request resolves against the
   * site's own origin, comes back as the SPA fallback HTML, and the guest sees
   * "Não conseguimos carregar o convite". Nothing in the build log hints at it.
   *
   * On Cloudflare Workers Builds this is easy to hit, because build variables
   * and runtime variables are configured in two different screens and only the
   * former reaches Vite. Fail loudly here instead.
   */
  if (command === 'build' && !loadEnv(mode, '.', '').VITE_API_URL) {
    throw new Error(
      'VITE_API_URL is missing. On Cloudflare Workers Builds set it under ' +
        'Settings > Build > "Build variables and secrets" — the runtime ' +
        'Variables & Secrets screen is not visible to the build.',
    )
  }

  return {
    plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
    test: {
      environment: 'jsdom',
    },
  }
})
