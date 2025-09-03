import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for the green score frontend.
// This config enables the React plugin for Vite and can be
// extended later with additional plugins (e.g. aliasing or
// environment variables).

export default defineConfig({
  plugins: [react()],
  server: {
    // By default, Vite uses port 5173; you can change it here if
    // there's a conflict. The backend runs on 8000 by default.
    port: 5173,
    // Proxy API requests during development to the FastAPI backend.
    proxy: {
      '/green-score': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
});