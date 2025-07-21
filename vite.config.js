import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  // 기본 설정
  const config = {
    plugins: [react()],
    base: '/', // 개발 서버(npm run dev)에서는 기본 경로를 사용
  }

  // 'build' 명령어 (배포용)일 때만 base 경로를 변경합니다.
  if (command === 'build') {
    config.base = '/busan-chatbot-frontend/'
  }

  return config
})