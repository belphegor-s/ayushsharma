import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: { postcss: { config: false } },
  // SPA is the app root ("/"), served by the Worker's ASSETS binding pointed at
  // console-app/dist. Docs and legal pages are separate server-rendered routes.
  base: '/',
  server: {
    proxy: {
      '/api/auth': 'http://localhost:8787',
      '/console/api': 'http://localhost:8787',
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    modulePreload: false,
    manifest: false,
    assetsInlineLimit: 0,
  },
});
