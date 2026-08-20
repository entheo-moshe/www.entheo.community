// @vitest-environment jsdom

import type { ComponentType } from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const routeRuntime = vi.hoisted(() => {
  const createFileRoute = vi.fn(
    (_path: string) =>
      (options: Record<string, unknown>) => ({
        options,
        useLoaderData: vi.fn(),
        useSearch: vi.fn(),
      }),
  )
  const createRootRoute = vi.fn((options: Record<string, unknown>) => ({ options }))

  return {
    createFileRoute,
    createRootRoute,
    Outlet: vi.fn(() => null),
  }
})

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  createFileRoute: routeRuntime.createFileRoute,
  createRootRoute: routeRuntime.createRootRoute,
  Outlet: routeRuntime.Outlet,
}))

import { LandingPage } from '../features/landing/landing-page'
import { Route as RootRoute } from '../routes/__root'
import { Route as IndexRoute } from '../routes/index'
import { Route as DashboardRoute } from '../routes/members.dashboard'
import { Route as ErrorRoute } from '../routes/members.error'
import { Route as ResourcesRoute } from '../routes/members.resources'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

interface RuntimeRoute<TLoaderData = unknown, TSearch = unknown> {
  options: {
    loader?: () => Promise<TLoaderData>
    validateSearch?: (search: Record<string, unknown>) => TSearch
    component: ComponentType
  }
  useLoaderData: ReturnType<typeof vi.fn<() => TLoaderData>>
  useSearch: ReturnType<typeof vi.fn<() => TSearch>>
}

function runtimeRoute<TLoaderData = unknown, TSearch = unknown>(route: unknown) {
  return route as RuntimeRoute<TLoaderData, TSearch>
}

describe('TanStack route adapters', () => {
  it('wires the root outlet and landing component to their file routes', () => {
    const root = runtimeRoute(RootRoute)
    const index = runtimeRoute(IndexRoute)
    const RootComponent = root.options.component

    render(<RootComponent />)

    expect(routeRuntime.Outlet).toHaveBeenCalledOnce()
    expect(index.options.component).toBe(LandingPage)
    expect(routeRuntime.createRootRoute).toHaveBeenCalledOnce()
    expect(routeRuntime.createFileRoute).toHaveBeenCalledWith('/')
  })

  it('loads and renders the dashboard through the route boundary', async () => {
    const dashboard = runtimeRoute<{
      displayName: string
      membershipStatus: 'Active & Current'
    }>(DashboardRoute)
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({
          member: {
            displayName: 'Miriam',
            membershipStatus: 'Active & Current',
          },
        }),
      ),
    )

    const member = await dashboard.options.loader!()
    dashboard.useLoaderData.mockReturnValue(member)
    const DashboardComponent = dashboard.options.component
    render(<DashboardComponent />)

    expect(screen.getByRole('heading', { name: 'Welcome home, Miriam.' })).toBeTruthy()
    expect(routeRuntime.createFileRoute).toHaveBeenCalledWith('/members/dashboard')
  })

  it('normalizes and renders member errors through the route boundary', () => {
    const error = runtimeRoute<unknown, { reason: 'inactive' | 'auth' | 'service' }>(
      ErrorRoute,
    )
    const search = error.options.validateSearch!({ reason: 'inactive' })
    error.useSearch.mockReturnValue(search)
    const ErrorComponent = error.options.component

    render(<ErrorComponent />)

    expect(screen.getByRole('heading', { name: 'Your membership needs attention.' })).toBeTruthy()
    expect(routeRuntime.createFileRoute).toHaveBeenCalledWith('/members/error')
  })

  it('loads and renders protected resources through the route boundary', async () => {
    const resources = runtimeRoute<
      Array<{
        id: 'ordination' | 'signal' | 'vault'
        sealLabel: string
        kicker: string
        title: string
        description: Array<{ text: string; emphasis: boolean }>
        actions: Array<{ label: string; href: string }>
      }>
    >(ResourcesRoute)
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({
          resources: [
            {
              id: 'ordination',
              sealLabel: 'Practice',
              kicker: 'Learn',
              title: 'Ordination',
              description: [{ text: 'Read the guide.', emphasis: false }],
              actions: [{ label: 'Open guide', href: 'https://example.com/guide' }],
            },
            {
              id: 'signal',
              sealLabel: 'Community',
              kicker: 'Gather',
              title: 'Signal',
              description: [{ text: 'Join the conversation.', emphasis: true }],
              actions: [{ label: 'Open chat', href: 'https://example.com/chat' }],
            },
            {
              id: 'vault',
              sealLabel: 'Archive',
              kicker: 'Revisit',
              title: 'Vault',
              description: [{ text: 'Watch the teachings.', emphasis: false }],
              actions: [{ label: 'Open vault', href: 'https://example.com/vault' }],
            },
          ],
        }),
      ),
    )

    const catalog = await resources.options.loader!()
    resources.useLoaderData.mockReturnValue(catalog)
    const ResourcesComponent = resources.options.component
    render(<ResourcesComponent />)

    expect(screen.getByRole('heading', { name: 'Member Resources' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Ordination' })).toBeTruthy()
    expect(routeRuntime.createFileRoute).toHaveBeenCalledWith('/members/resources')
  })
})
