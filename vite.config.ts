import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animation: ['framer-motion', 'gsap'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          utils: ['axios', 'zustand']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true,
    open: true,
    cors: true
  },
  preview: {
    port: 4173,
    host: true
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'gsap',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'axios',
      'zustand',

      'react-router-dom'
    ]
  }
})
