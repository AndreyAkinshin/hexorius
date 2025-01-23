import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { routes } from './src/scripts/generateStaticRoutes'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
  base: './',
  experimental: {
    renderBuiltUrl(filename: string) {
      return `./${filename}`
    },
  },
})
