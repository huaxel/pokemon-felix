import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.{js,jsx}', 'backend/**/*.test.{js,jsx}'],
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 70,
      },
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/src/assets/**',
        '**/*.css',
        '**/backend/**',
        '**/openspec/**',
      ],
    },
  },
});
