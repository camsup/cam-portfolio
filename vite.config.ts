import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use relative paths for custom domain compatibility
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
