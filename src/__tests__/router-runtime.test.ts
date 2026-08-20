import { describe, expect, it } from 'vitest'
import { routeTree } from '../routeTree.gen'
import { router } from '../router'

describe('application router', () => {
  it('uses the generated route tree with intentional navigation defaults', () => {
    expect(router.routeTree).toBe(routeTree)
    expect(router.options.scrollRestoration).toBe(true)
    expect(router.options.defaultPreload).toBe('intent')
    expect(router.options.defaultPreloadStaleTime).toBe(0)
  })
})
