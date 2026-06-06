import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/ts-campston-project-space/',  // Add this line
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://api.le-systeme-solaire.net",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  }
})
