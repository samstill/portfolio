import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/portfolio/', // replace 'portfolio' with your repository name
  define: {
    global: 'globalThis',
    'process.env': '{}',
    'process.browser': true,
    'process.version': '"v16.14.0"'
  }
})
