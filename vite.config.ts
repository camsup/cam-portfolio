import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages deployment path
  base: '/cam-portfolio/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
