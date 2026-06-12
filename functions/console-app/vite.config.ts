import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: { postcss: { config: false } },
  // SPA is served under /console by the Worker, so emit assets at that path and
  // nest the build under dist/console - the Worker points its ASSETS binding
  // straight at console-app/dist, no post-build copy/rewrite step needed.
  base: '/console/',
  server: {
    proxy: {
      '/api/auth': 'http://localhost:8787',
      '/console/api': 'http://localhost:8787',
    },
  },
  build: {
    outDir: 'dist/console',
    emptyOutDir: true,
    modulePreload: false,
    manifest: false,
    assetsInlineLimit: 0,
  },
});
