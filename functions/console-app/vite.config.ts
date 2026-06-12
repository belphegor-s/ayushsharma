import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: { postcss: { config: false } },
  server: {
    proxy: {
      '/api/auth': 'http://localhost:8787',
      '/console/api': 'http://localhost:8787',
    },
  },
  build: {
    modulePreload: false,
    manifest: true,
    assetsInlineLimit: 0,
  },
});
