import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Update this with your actual GitHub repository name
  base: '/cam-portfolio/', // Replace 'cam-portfolio' with your repo name
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
