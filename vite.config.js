import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  base: '/', // replace 'portfolio' with your repository name
  define: {
    global: 'globalThis',
    'process.env': '{}',
    'process.browser': true,
    'process.version': '"v16.14.0"'
  }
})
