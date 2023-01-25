import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  plugins: [],
  test: {
    globals: true,
    include: ['test/*.test.ts'],
  },
  resolve: {
    alias: {
      '@server': path.resolve(__dirname, 'server.ts'),
    },
  },
})
