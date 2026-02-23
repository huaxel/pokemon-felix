import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.{js,jsx}', 'backend/**/*.test.{js,jsx}'],
    environment: 'jsdom',
  },
});
