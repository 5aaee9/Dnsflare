import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const path = require("path")

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.cloudflare.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/client/v4')
      },
    },
  },
})
