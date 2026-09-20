import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
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
              proxyReq.setHeader('X-Auth-Token', env.SCHEDULE_API_KEY)
            })
          },
        },
      },
    },
  }
})