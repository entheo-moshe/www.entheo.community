import { mergeConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import type { UserConfig } from 'vite'
import viteConfig from './vite.config'

// Route generation, Tailwind, and React Fast Refresh are build-time concerns.
// Keeping their injected HMR callbacks out of unit transforms makes coverage
// describe the authored runtime while the production plugin stack is exercised
// by the build-backed Playwright suite.
const { plugins: _applicationPlugins, ...viteTestConfig } = viteConfig as UserConfig

export default mergeConfig(
  viteTestConfig,
  defineConfig({
    test: {
      exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json-summary', 'html'],
        reportsDirectory: 'coverage',
        include: [
          'src/**/*.{ts,tsx}',
          'netlify/functions/**/*.ts',
        ],
        exclude: [
          'src/**/*.test.{ts,tsx}',
          'src/**/__tests__/**',
          'src/routeTree.gen.ts',
        ],
        thresholds: {
          statements: 100,
          branches: 100,
          functions: 100,
          lines: 100,
        },
      },
    },
  }),
)
