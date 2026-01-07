import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/jund_music/',
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
  },
})
