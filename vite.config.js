import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from 'vite-plugin-commonjs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    commonjs({
      transformMixedEsModules: true,
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://applicationform-backend-3.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
