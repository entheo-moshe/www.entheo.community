import { describe, expect, it } from 'vitest'
import type { UserConfig } from 'vite'
import viteConfig from '../../vite.config'

describe('local development runtime', () => {
  it('forwards browser API requests to the Netlify Functions boundary', () => {
    const config = viteConfig as UserConfig

    expect(config.server?.proxy).toMatchObject({
      '/api': {
        target: 'http://localhost:8888',
        changeOrigin: true,
      },
    })
  })
})
