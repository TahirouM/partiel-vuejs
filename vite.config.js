import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Le front appelle /api/... ; en dev, Vite proxifie ces requêtes vers l'API Node.
// Ça évite tout souci de CORS et garde les mêmes URLs qu'en production.
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_TARGET || 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
