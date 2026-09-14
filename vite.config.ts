import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        // Forwards /schedule-api/* to football-data.org server-side,
        // sidestepping their broken CORS setup and keeping the key
        // out of the browser entirely.
        '/schedule-api': {
          target: env.VITE_SCHEDULE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/schedule-api/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('X-Auth-Token', env.VITE_SCHEDULE_API_KEY)
            })
          },
        },
      },
    },
  }
})