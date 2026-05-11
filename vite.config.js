import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:5001'

  const config = {
    plugins: [react()],
    base: '/',
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }

  if (command === 'build') {
    config.base = '/busan-chatbot-frontend/'
  }

  return config
})
