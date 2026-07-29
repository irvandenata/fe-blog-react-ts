import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { seoConfigApi } from './src/plugins/seoConfigApi'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), seoConfigApi()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    // Split chunks so a visitor landing on an article downloads React and the
    // router, not the editor and table libraries only the admin panel needs.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          motion: ['framer-motion'],
        },
      },
    },
    // Raised only because the vendor chunk is legitimately large; the warning
    // firing on every build would hide real regressions.
    chunkSizeWarningLimit: 700,
    cssCodeSplit: true,
    sourcemap: false,
  }
})
