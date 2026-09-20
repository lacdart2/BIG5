import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        manifest: false,
        includeAssets: [
          'favicon.png',
          'pwa-192.png',
          'pwa-512.png',
          'manifest.webmanifest',
        ],
        workbox: {
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\//],
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2,webmanifest}'],
          cleanupOutdatedCaches: true,
        },
      }),
    ],

    server: {
      proxy: {
        '/api/schedule': {
          target: 'https://api.football-data.org/v4',
          changeOrigin: true,

          rewrite: (path) => {
            const url = new URL(path, 'http://localhost')
            const endpoint = url.searchParams.get('endpoint') ?? ''

            url.searchParams.delete('endpoint')

            const qs = url.searchParams.toString()

            return `/${endpoint}${qs ? `?${qs}` : ''}`
          },

          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader(
                'X-Auth-Token',
                env.SCHEDULE_API_KEY
              )
            })
          },
        },
      },
    },
  }
})
