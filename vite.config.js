/* eslint-env node */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_URL || '/pokemon-felix/',
  server: {
    hmr: {
      path: '/pokemon-felix/',
    },
  },
});
