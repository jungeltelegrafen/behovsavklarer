import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiPort = process.env.API_PORT || env.API_PORT || '3000'

  return {
    base: mode === 'production' ? '/behovsavklarer/' : '/',
    plugins: [react()],
    server: {
      port: 5174,
      proxy: {
        '/api': {
          target: `http://localhost:${apiPort}`,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('error', () => {})
          },
        },
      },
    },
  }
})
