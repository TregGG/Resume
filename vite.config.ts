import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' keeps asset paths relative so the build works on GitHub Pages at any sub-path.
// Two pages: / (v2, mono + orange, main) and /v1/ (neon).
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        v1: resolve(__dirname, 'v1/index.html'),
      },
    },
  },
});
