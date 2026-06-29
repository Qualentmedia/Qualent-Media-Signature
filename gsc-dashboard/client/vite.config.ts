import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Run from the gsc-dashboard root (e.g. `vite --config client/vite.config.ts`).
// `root` points Vite at the client/ folder; the production build is emitted to
// gsc-dashboard/dist/ which Vercel serves as the static site.
export default defineConfig({
  root: 'client',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    // Dev only: proxy API calls to the local Express server on :4000.
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
});
