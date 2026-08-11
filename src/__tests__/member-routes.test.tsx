// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { isRedirect, type AnyRedirect } from '@tanstack/react-router'
import {
  MEMBER_LOGIN_URL,
  MEMBERSHIP_URL,
  getMemberSession,
  logoutMember,
  type FetchImplementation,
} from '../lib/member-session'
import {
  MemberDashboard,
  resolveDashboardAccess,
} from '../routes/members.dashboard'
import {
  MemberErrorPage,
  normalizeMemberErrorReason,
} from '../routes/members.error'

afterEach(() => cleanup())

function response(status: number, body?: unknown) {
  return body === undefined
    ? new Response(null, { status })
    : Response.json(body, { status })
}

function fetchResponse(value: Response): FetchImplementation {
  return async () => value
}

async function caughtRedirect(promise: Promise<unknown>) {
  try {
    await promise
  } catch (error) {
    expect(isRedirect(error)).toBe(true)
    return error as AnyRedirect
  }

  throw new Error('Expected a route redirect')
}

describe('member session client boundary', () => {
  it('minimizes an active response and discards unapproved fields', async () => {
    const outcome = await getMemberSession(
      fetchResponse(
        response(200, {
          member: {
            displayName: '  Miriam\u0007 ',
            membershipStatus: 'Active & Current',
            email: 'must-not-reach-the-page@example.com',
            firstName: 'Private',
          },
        }),
      ),
    )

    expect(outcome).toEqual({
      kind: 'active',
      member: { displayName: 'Miriam', membershipStatus: 'Active & Current' },
    })
    expect(JSON.stringify(outcome)).not.toContain('must-not-reach-the-page@example.com')
    expect(JSON.stringify(outcome)).not.toContain('Private')
  })

  it.each([
    [401, 'unauthenticated'],
    [403, 'inactive'],
    [404, 'not-member'],
    [500, 'service-error'],
    [503, 'service-error'],
  ] as const)('maps status %i to %s', async (status, kind) => {
    await expect(getMemberSession(fetchResponse(response(status)))).resolves.toEqual({ kind })
  })

  it('fails closed for malformed success data and network errors', async () => {
    await expect(
      getMemberSession(
        fetchResponse(
          response(200, {
            member: { displayName: 'Miriam', membershipStatus: 'Expired' },
          }),
        ),
      ),
    ).resolves.toEqual({ kind: 'service-error' })

    await expect(
      getMemberSession(async () => {
        throw new Error('network unavailable')
      }),
    ).resolves.toEqual({ kind: 'service-error' })
  })

  it('posts logout with same-origin credentials and the explicit intent header', async () => {
    let capturedInput: RequestInfo | URL | undefined
    let capturedInit: RequestInit | undefined
    const fetchImplementation: FetchImplementation = async (input, init) => {
      capturedInput = input
      capturedInit = init
      return response(204)
    }

    await expect(logoutMember(fetchImplementation)).resolves.toBe(true)
    expect(capturedInput).toBe('/api/auth/logout')
    expect(capturedInit).toEqual({
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'X-Entheo-Action': 'logout',
      },
    })
    await expect(logoutMember(fetchResponse(response(403)))).resolves.toBe(false)
  })
})

describe('protected dashboard route decisions', () => {
  it('returns only active member display data', async () => {
    await expect(
      resolveDashboardAccess(
        fetchResponse(
          response(200, {
            member: {
              displayName: 'Miriam',
              membershipStatus: 'Active & Current',
              email: 'private@example.com',
            },
          }),
        ),
      ),
    ).resolves.toEqual({
      displayName: 'Miriam',
      membershipStatus: 'Active & Current',
    })
  })

  it('sends unauthenticated visitors into Google login as a document navigation', async () => {
    const redirect = await caughtRedirect(
      resolveDashboardAccess(fetchResponse(response(401))),
    )

    expect(redirect.options.href).toBe(MEMBER_LOGIN_URL)
    expect(redirect.options.reloadDocument).toBe(true)
  })

  it('sends inactive members to the reactivation route', async () => {
    const redirect = await caughtRedirect(
      resolveDashboardAccess(fetchResponse(response(403))),
    )

    expect(redirect.options.to).toBe('/members/error')
    expect(redirect.options.search).toEqual({ reason: 'inactive' })
  })

  it('sends non-members to the Join Us form', async () => {
    const redirect = await caughtRedirect(
      resolveDashboardAccess(fetchResponse(response(404))),
    )

    expect(redirect.options.href).toBe(MEMBERSHIP_URL)
    expect(redirect.options.reloadDocument).toBe(true)
  })

  it('sends provider and malformed-response failures to a technical error', async () => {
    const providerRedirect = await caughtRedirect(
      resolveDashboardAccess(fetchResponse(response(503))),
    )
    const malformedRedirect = await caughtRedirect(
      resolveDashboardAccess(
        fetchResponse(response(200, { member: { displayName: 'Miriam' } })),
      ),
    )

    for (const redirect of [providerRedirect, malformedRedirect]) {
      expect(redirect.options.to).toBe('/members/error')
      expect(redirect.options.search).toEqual({ reason: 'service' })
    }
  })
})

describe('member route presentation', () => {
  it('renders a welcome-only dashboard with status, Home, and Log out actions', () => {
    const { container } = render(
      <MemberDashboard
        member={{ displayName: 'Miriam', membershipStatus: 'Active & Current' }}
      />,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Welcome home, Miriam.' })).toBeTruthy()
    expect(screen.getByText('Active & Current')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Home' }).getAttribute('href')).toBe('/')
    expect(screen.getByRole('button', { name: 'Log out' })).toBeTruthy()
    expect(container.textContent).not.toContain('@')
    expect(container.querySelectorAll('main')).toHaveLength(1)
  })

  it('renders the exact inactive reactivation note with an accessible mail link', () => {
    const { container } = render(<MemberErrorPage reason="inactive" />)
    const normalizedText = container.textContent?.replace(/\s+/g, ' ')

    expect(normalizedText).toContain(
      'Please contact Moshe at moshe@entheo.community to reactivate your account.',
    )
    expect(
      screen.getByRole('link', { name: 'moshe@entheo.community' }).getAttribute('href'),
    ).toBe('mailto:moshe@entheo.community')
  })

  it.each(['auth', 'service'] as const)(
    'keeps the %s error technical and separate from membership status',
    (reason) => {
      render(<MemberErrorPage reason={reason} />)

      expect(screen.getByText(/technical access error/i)).toBeTruthy()
      expect(screen.queryByText(/reactivate/i)).toBeNull()
      expect(screen.getByRole('link', { name: 'Try again' }).getAttribute('href')).toBe(
        MEMBER_LOGIN_URL,
      )
    },
  )

  it('validates error reasons and defaults unknown values to service', () => {
    expect(normalizeMemberErrorReason('inactive')).toBe('inactive')
    expect(normalizeMemberErrorReason('auth')).toBe('auth')
    expect(normalizeMemberErrorReason('service')).toBe('service')
    expect(normalizeMemberErrorReason('expired')).toBe('service')
    expect(normalizeMemberErrorReason(['inactive'])).toBe('service')
    expect(normalizeMemberErrorReason(undefined)).toBe('service')
  })
})
