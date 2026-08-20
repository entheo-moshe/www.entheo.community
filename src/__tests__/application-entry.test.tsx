// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const entrypoint = vi.hoisted(() => ({
  createRoot: vi.fn(),
  render: vi.fn(),
}))

vi.mock('react-dom/client', () => ({
  default: {
    createRoot: entrypoint.createRoot,
  },
}))

vi.mock('@tanstack/react-router', () => ({
  RouterProvider: () => null,
}))

vi.mock('../router', () => ({
  router: { id: 'application-router' },
}))

beforeEach(() => {
  vi.resetModules()
  entrypoint.createRoot.mockReset()
  entrypoint.render.mockReset()
  entrypoint.createRoot.mockReturnValue({ render: entrypoint.render })
  document.body.innerHTML = '<div id="root"></div>'
})

afterEach(() => {
  document.body.innerHTML = ''
})

describe('browser application entrypoint', () => {
  it('mounts the router into the application root', async () => {
    const root = document.getElementById('root')

    await import('../main')

    expect(entrypoint.createRoot).toHaveBeenCalledWith(root)
    expect(entrypoint.render).toHaveBeenCalledOnce()
  })

  it('fails explicitly when the host document omits the application root', async () => {
    document.body.innerHTML = ''

    await expect(import('../main')).rejects.toThrow('Application root element is missing')
    expect(entrypoint.createRoot).not.toHaveBeenCalled()
  })
})
