/* eslint-env node */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isBuild = command === 'build';
  return {
    plugins: [react()],
    base: isBuild ? process.env.VITE_BASE_URL || '/pokemon-felix/' : '/',
    optimizeDeps: {
      include: ['three', '@react-three/fiber', '@react-three/drei'],
    },
  };
});
