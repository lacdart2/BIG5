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
        injectRegister: false,
        strategies: 'generateSW',

        includeAssets: [
          'favicon.png',
          'pwa-192.png',
          'pwa-512.png',
        ],

        manifest: {
          id: '/',
          name: 'BIG5 Football',
          short_name: 'BIG5',
          description: 'Live scores, fixtures and standings across Europe’s Big Five leagues.',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          orientation: 'portrait-primary',
          lang: 'en',
          categories: ['sports'],
          background_color: '#000000',
          theme_color: '#000000',
          prefer_related_applications: false,

          icons: [
            {
              src: '/pwa-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },

        workbox: {
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\//],
          globPatterns: [
            '**/*.{js,css,html,ico,png,svg,webp,woff2}',
          ],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
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
