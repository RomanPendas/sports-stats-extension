import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  base: "./", // Ensures relative paths in build
  plugins: [react()],
  build: {
    outDir: "dist", // Ensure output is in dist
  },
})
