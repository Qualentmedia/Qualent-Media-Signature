import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The dashboard talks to the API server on :4000. In dev we proxy /api so the
// browser sees a same-origin app and cookies/credentials work seamlessly.
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
});
