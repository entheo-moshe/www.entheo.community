// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { isRedirect, type AnyRedirect } from '@tanstack/react-router'
import {
  getMemberResources,
  type MemberResource,
} from '../features/members/member-resources'
import {
  MEMBER_LOGIN_URL,
  MEMBER_RESOURCES_LOGIN_URL,
  MEMBERSHIP_URL,
} from '../config/member-navigation'
import {
  getMemberSession,
  logoutMember,
} from '../features/members/member-session'
import type { FetchImplementation } from '../features/members/member-client'
import {
  MemberDashboard,
  resolveDashboardAccess,
} from '../routes/members.dashboard'
import {
  MemberErrorPage,
  normalizeMemberErrorReason,
} from '../routes/members.error'
import {
  MemberResources,
  resolveMemberResourcesAccess,
} from '../routes/members.resources'

afterEach(() => cleanup())

function response(status: number, body?: unknown) {
  return body === undefined
    ? new Response(null, { status })
    : Response.json(body, { status })
}

function fetchResponse(value: Response): FetchImplementation {
  return async () => value
}

const MEMBER_RESOURCES_FIXTURE: MemberResource[] = [
  {
    id: 'ordination',
    sealLabel: 'Practice & stewardship',
    kicker: 'Sacramental practice',
    title: 'Sacrament Minister Ordination',
    description: [
      {
        text: 'Read the Sacrament Minister Handbook and then pass the Ordination Assessment.',
        emphasis: false,
      },
    ],
    actions: [
      {
        label: 'Read the handbook',
        href: 'https://docs.google.com/document/d/1lqO1uW1rlbscVpJObPjRSyZyvRhXbWVWFgvMCr9bxKI/edit?usp=sharing',
      },
      {
        label: 'Take the assessment',
        href: 'https://forms.gle/7xQKCGX23QjQE6od7',
      },
    ],
  },
  {
    id: 'signal',
    sealLabel: 'Community channels',
    kicker: 'Gather & connect',
    title: 'Signal Chats',
    description: [
      { text: 'Connect in the', emphasis: false },
      { text: 'Entheo Members chat', emphasis: true },
      { text: 'and follow announcements.', emphasis: false },
    ],
    actions: [
      {
        label: 'Join Entheo Members chat',
        href: 'https://signal.group/#members-invite',
      },
      {
        label: 'Join Entheo Announce channel',
        href: 'https://signal.group/#announcements-invite',
      },
    ],
  },
  {
    id: 'vault',
    sealLabel: 'Recorded teachings',
    kicker: 'Learn & revisit',
    title: 'Monthly Teachings Vault',
    description: [
      { text: 'Access the monthly teaching recordings.', emphasis: false },
    ],
    actions: [
      {
        label: 'Open the teachings vault',
        href: 'https://drive.google.com/drive/folders/teachings-vault',
      },
    ],
  },
]

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
      data: { displayName: 'Miriam', membershipStatus: 'Active & Current' },
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

describe('member resources client boundary', () => {
  it('requests the protected resource endpoint and accepts its bounded shape', async () => {
    let capturedInput: RequestInfo | URL | undefined
    let capturedInit: RequestInit | undefined
    const fetchImplementation: FetchImplementation = async (input, init) => {
      capturedInput = input
      capturedInit = init
      return response(200, { resources: MEMBER_RESOURCES_FIXTURE })
    }

    await expect(getMemberResources(fetchImplementation)).resolves.toEqual({
      kind: 'active',
      data: MEMBER_RESOURCES_FIXTURE,
    })
    expect(capturedInput).toBe('/api/members/resources')
    expect(capturedInit).toEqual({
      method: 'GET',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    })
  })

  it('fails closed for malformed catalogs, insecure links, and network errors', async () => {
    const insecureFixture = structuredClone(MEMBER_RESOURCES_FIXTURE)
    insecureFixture[0].actions[0].href = 'http://example.com/not-secure'

    for (const body of [
      { resources: MEMBER_RESOURCES_FIXTURE.slice(0, 2) },
      { resources: insecureFixture },
      { resources: [{ id: 'unknown' }] },
    ]) {
      await expect(
        getMemberResources(fetchResponse(response(200, body))),
      ).resolves.toEqual({ kind: 'service-error' })
    }

    await expect(
      getMemberResources(async () => {
        throw new Error('network unavailable')
      }),
    ).resolves.toEqual({ kind: 'service-error' })
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

describe('protected resource route decisions', () => {
  it('returns the authenticated server catalog', async () => {
    await expect(
      resolveMemberResourcesAccess(
        fetchResponse(response(200, { resources: MEMBER_RESOURCES_FIXTURE })),
      ),
    ).resolves.toEqual(MEMBER_RESOURCES_FIXTURE)
  })

  it('returns signed-out visitors to the requested resource page after login', async () => {
    const redirect = await caughtRedirect(
      resolveMemberResourcesAccess(fetchResponse(response(401))),
    )

    expect(redirect.options.href).toBe(MEMBER_RESOURCES_LOGIN_URL)
    expect(redirect.options.reloadDocument).toBe(true)
  })

  it.each([
    [403, 'inactive'],
    [500, 'service'],
  ] as const)('fails closed for a %i response', async (status, reason) => {
    const redirect = await caughtRedirect(
      resolveMemberResourcesAccess(fetchResponse(response(status))),
    )

    expect(redirect.options.to).toBe('/members/error')
    expect(redirect.options.search).toEqual({ reason })
  })
})

describe('member route presentation', () => {
  it('renders the protected dashboard with status and member navigation', () => {
    const { container } = render(
      <MemberDashboard
        member={{ displayName: 'Miriam', membershipStatus: 'Active & Current' }}
      />,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Welcome home, Miriam.' })).toBeTruthy()
    expect(screen.getByText('Active & Current')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Home' }).getAttribute('href')).toBe('/')
    expect(
      screen.getByRole('link', { name: 'Member resources' }).getAttribute('href'),
    ).toBe('/members/resources')
    expect(screen.getByRole('button', { name: 'Log out' })).toBeTruthy()
    expect(container.textContent).not.toContain('@')
    expect(container.querySelectorAll('main')).toHaveLength(1)
  })

  it('recreates every member resource with its verified destination', () => {
    render(<MemberResources resources={MEMBER_RESOURCES_FIXTURE} />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Member Resources' }),
    ).toBeTruthy()
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Sacrament Minister Ordination',
      }),
    ).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: 'Signal Chats' })).toBeTruthy()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Monthly Teachings Vault' }),
    ).toBeTruthy()

    const expectedLinks = [
      ['Read the handbook', MEMBER_RESOURCES_FIXTURE[0].actions[0].href],
      ['Take the assessment', MEMBER_RESOURCES_FIXTURE[0].actions[1].href],
      ['Join Entheo Members chat', MEMBER_RESOURCES_FIXTURE[1].actions[0].href],
      ['Join Entheo Announce channel', MEMBER_RESOURCES_FIXTURE[1].actions[1].href],
      ['Open the teachings vault', MEMBER_RESOURCES_FIXTURE[2].actions[0].href],
    ] as const

    for (const [name, href] of expectedLinks) {
      const link = screen.getByRole('link', { name })
      expect(link.getAttribute('href')).toBe(href)
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toBe('noreferrer')
    }

    expect(
      screen.getByRole('link', { name: 'Resources' }).getAttribute('aria-current'),
    ).toBe('page')
    expect(
      screen
        .getByRole('link', { name: /Return to the members’ hearth/i })
        .getAttribute('href'),
    ).toBe('/members/dashboard')
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
