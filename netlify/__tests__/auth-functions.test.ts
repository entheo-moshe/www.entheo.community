import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  DASHBOARD_PATH,
  MEMBERSHIP_URL,
  RESOURCES_PATH,
} from '../functions/_shared/config'
import { GoogleAuthenticationError } from '../functions/_shared/google-identity'
import { MEMBER_RESOURCES } from '../functions/_shared/member-resources'
import {
  ACTIVE_MEMBERSHIP_STATUS,
  type MemberRecord,
} from '../functions/_shared/member-directory'
import {
  openMemberSession,
  sealMemberSession,
  sealOAuthFlow,
  type OAuthFlowClaims,
} from '../functions/_shared/tokens'
import { createAuthGoogleCallbackHandler } from '../functions/auth-google-callback'
import { createAuthGoogleHandler } from '../functions/auth-google'
import { createAuthLogoutHandler } from '../functions/auth-logout'
import { createMembersSessionHandler } from '../functions/members-session'
import { createMemberResourcesHandler } from '../functions/members-resources'

const TEST_SECRET = 'test-session-secret-with-at-least-thirty-two-characters'
const GOOGLE_CLIENT_SECRET = 'google-client-secret-for-tests'
const AIRTABLE_TOKEN = 'airtable-token-for-tests'
const LOCAL_ORIGIN = 'http://localhost:8888'

const flow: OAuthFlowClaims = {
  state: 'expected-state',
  nonce: 'expected-nonce',
  codeVerifier: 'expected-verifier',
  returnTo: DASHBOARD_PATH,
}

function member(membershipStatus: string): MemberRecord {
  return {
    id: 'rec-member',
    email: 'member@example.com',
    goesBy: 'Miriam',
    firstName: 'Mary',
    membershipStatus,
  }
}

function request(
  path: string,
  init: RequestInit = {},
) {
  return new Request(`${LOCAL_ORIGIN}${path}`, init)
}

function setCookies(response: Response) {
  const headers = response.headers as Headers & { getSetCookie?: () => string[] }
  return headers.getSetCookie?.() ?? [response.headers.get('set-cookie') ?? '']
}

function cookieValue(response: Response, cookieName: string) {
  const allCookies = setCookies(response).join(', ')
  const match = allCookies.match(new RegExp(`(?:^|, )${cookieName}=([^;]+)`))
  return match?.[1] ?? null
}

async function callbackRequest(
  state = flow.state,
  code = 'authorization-code',
  sealedFlow?: string,
) {
  const token = sealedFlow ?? (await sealOAuthFlow(flow, TEST_SECRET))
  return request(
    `/api/auth/google/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`,
    { headers: { Cookie: `entheo_oauth_flow=${token}` } },
  )
}

async function sessionRequest(
  issuedAt = new Date(),
) {
  const session = await sealMemberSession(
    { subject: 'google-subject', email: 'member@example.com' },
    TEST_SECRET,
    issuedAt,
  )
  return request('/api/members/session', {
    headers: { Cookie: `entheo_member_session=${session}` },
  })
}

async function resourceRequest() {
  const session = await sealMemberSession(
    { subject: 'google-subject', email: 'member@example.com' },
    TEST_SECRET,
  )
  return request('/api/members/resources', {
    headers: { Cookie: `entheo_member_session=${session}` },
  })
}

beforeEach(() => {
  vi.stubEnv('AUTH_SESSION_SECRET', TEST_SECRET)
  vi.stubEnv('GOOGLE_OAUTH_CLIENT_ID', 'google-client-id')
  vi.stubEnv('GOOGLE_OAUTH_CLIENT_SECRET', GOOGLE_CLIENT_SECRET)
  vi.stubEnv('AIRTABLE_API_TOKEN', AIRTABLE_TOKEN)
  vi.spyOn(console, 'error').mockImplementation(() => undefined)
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
})

describe('GET /api/auth/google', () => {
  it('sets a short-lived HttpOnly flow cookie and sends the browser to Google', async () => {
    const createAuthorizationRequest = vi.fn(async (_configuration, returnTo) => ({
      authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth?safe=1',
      flow: { ...flow, returnTo },
    }))
    const handler = createAuthGoogleHandler(createAuthorizationRequest)
    const response = await handler(
      request('/api/auth/google?returnTo=https://attacker.example/steal'),
    )

    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toBe(
      'https://accounts.google.com/o/oauth2/v2/auth?safe=1',
    )
    expect(createAuthorizationRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        clientId: 'google-client-id',
        clientSecret: GOOGLE_CLIENT_SECRET,
        redirectUri: `${LOCAL_ORIGIN}/api/auth/google/callback`,
      }),
      DASHBOARD_PATH,
    )

    const cookies = setCookies(response).join('; ')
    expect(cookies).toContain('entheo_oauth_flow=')
    expect(cookies).toContain('Path=/')
    expect(cookies).toContain('HttpOnly')
    expect(cookies).toContain('SameSite=Lax')
    expect(cookies).toContain('Max-Age=600')
    expect(cookies).not.toContain('Secure')
  })

  it('rejects non-GET requests and fails closed for missing configuration', async () => {
    const handler = createAuthGoogleHandler()
    const methodResponse = await handler(request('/api/auth/google', { method: 'POST' }))
    expect(methodResponse.status).toBe(405)
    expect(methodResponse.headers.get('allow')).toBe('GET')

    vi.stubEnv('GOOGLE_OAUTH_CLIENT_ID', '')
    const failureResponse = await handler(request('/api/auth/google'))
    expect(failureResponse.status).toBe(302)
    expect(failureResponse.headers.get('location')).toBe('/members/error?reason=service')
  })

  it('preserves the allowlisted resources return path', async () => {
    const createAuthorizationRequest = vi.fn(async (_configuration, returnTo) => ({
      authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth?safe=1',
      flow: { ...flow, returnTo },
    }))
    const handler = createAuthGoogleHandler(createAuthorizationRequest)

    await handler(request(`/api/auth/google?returnTo=${encodeURIComponent(RESOURCES_PATH)}`))

    expect(createAuthorizationRequest).toHaveBeenCalledWith(
      expect.any(Object),
      RESOURCES_PATH,
    )
  })
})

describe('GET /api/auth/google/callback', () => {
  const identity = { subject: 'google-subject', email: 'member@example.com' }

  it('creates a minimized session only after state, Google, and active membership checks', async () => {
    const exchangeCode = vi.fn(async () => identity)
    const findMembers = vi.fn(async () => [member(ACTIVE_MEMBERSHIP_STATUS)])
    const handler = createAuthGoogleCallbackHandler(exchangeCode, findMembers)
    const response = await handler(await callbackRequest())

    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toBe(DASHBOARD_PATH)
    expect(exchangeCode).toHaveBeenCalledWith(
      'authorization-code',
      flow,
      expect.objectContaining({
        clientId: 'google-client-id',
        redirectUri: `${LOCAL_ORIGIN}/api/auth/google/callback`,
      }),
    )
    expect(findMembers).toHaveBeenCalledWith(identity.email, AIRTABLE_TOKEN)

    const sessionToken = cookieValue(response, 'entheo_member_session')
    expect(sessionToken).not.toBeNull()
    await expect(openMemberSession(sessionToken ?? '', TEST_SECRET)).resolves.toEqual({
      subject: identity.subject,
      email: identity.email,
    })

    const cookies = setCookies(response).join('; ')
    expect(cookies).toContain('entheo_oauth_flow=;')
    expect(cookies).toContain('Max-Age=43200')
    expect(cookies).not.toContain(GOOGLE_CLIENT_SECRET)
    expect(cookies).not.toContain(AIRTABLE_TOKEN)
  })

  it('returns an active member to the protected resource page they requested', async () => {
    const resourceFlow: OAuthFlowClaims = { ...flow, returnTo: RESOURCES_PATH }
    const sealedFlow = await sealOAuthFlow(resourceFlow, TEST_SECRET)
    const handler = createAuthGoogleCallbackHandler(
      async () => identity,
      async () => [member(ACTIVE_MEMBERSHIP_STATUS)],
    )
    const response = await handler(
      await callbackRequest(resourceFlow.state, 'authorization-code', sealedFlow),
    )

    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toBe(RESOURCES_PATH)
  })

  it('rejects a missing or mismatched callback state before code exchange', async () => {
    const exchangeCode = vi.fn(async () => identity)
    const findMembers = vi.fn(async () => [member(ACTIVE_MEMBERSHIP_STATUS)])
    const handler = createAuthGoogleCallbackHandler(exchangeCode, findMembers)

    const missingState = await handler(request('/api/auth/google/callback?code=a'))
    const wrongState = await handler(await callbackRequest('wrong-state'))

    for (const response of [missingState, wrongState]) {
      expect(response.status).toBe(302)
      expect(response.headers.get('location')).toBe('/members/error?reason=auth')
    }
    expect(exchangeCode).not.toHaveBeenCalled()
    expect(findMembers).not.toHaveBeenCalled()
  })

  it.each(['Incomplete', 'Past Due', 'Expired', 'Archived'])(
    'redirects %s members to the reactivation screen and clears sessions',
    async (status) => {
      const handler = createAuthGoogleCallbackHandler(
        async () => identity,
        async () => [member(status)],
      )
      const response = await handler(await callbackRequest())

      expect(response.status).toBe(302)
      expect(response.headers.get('location')).toBe('/members/error?reason=inactive')
      expect(setCookies(response).join('; ')).toContain('entheo_member_session=;')
    },
  )

  it('sends non-members to the existing Join Us form', async () => {
    const handler = createAuthGoogleCallbackHandler(
      async () => identity,
      async () => [],
    )
    const response = await handler(await callbackRequest())

    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toBe(MEMBERSHIP_URL)
    expect(setCookies(response).join('; ')).toContain('entheo_member_session=;')
  })

  it('fails closed for duplicate records and provider failures without leaking secrets', async () => {
    const duplicateHandler = createAuthGoogleCallbackHandler(
      async () => identity,
      async () => [member(ACTIVE_MEMBERSHIP_STATUS), member(ACTIVE_MEMBERSHIP_STATUS)],
    )
    const duplicateResponse = await duplicateHandler(await callbackRequest())
    expect(duplicateResponse.headers.get('location')).toBe('/members/error?reason=service')

    const providerHandler = createAuthGoogleCallbackHandler(
      async () => identity,
      async () => {
        throw new Error(`provider failed ${AIRTABLE_TOKEN} ${identity.email}`)
      },
    )
    const providerResponse = await providerHandler(await callbackRequest())
    const serializedResponse = `${providerResponse.headers.get('location')} ${setCookies(providerResponse).join(' ')}`

    expect(providerResponse.status).toBe(302)
    expect(providerResponse.headers.get('location')).toBe('/members/error?reason=service')
    expect(serializedResponse).not.toContain(AIRTABLE_TOKEN)
    expect(serializedResponse).not.toContain(identity.email)
  })

  it('maps Google verification failures to the non-membership auth error', async () => {
    const handler = createAuthGoogleCallbackHandler(
      async () => {
        throw new GoogleAuthenticationError('bad token with private detail')
      },
      async () => [member(ACTIVE_MEMBERSHIP_STATUS)],
    )
    const response = await handler(await callbackRequest())

    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toBe('/members/error?reason=auth')
  })
})

describe('GET /api/members/session', () => {
  it('rechecks Airtable and returns only the approved active-member shape', async () => {
    const handler = createMembersSessionHandler(async () => [
      member(ACTIVE_MEMBERSHIP_STATUS),
    ])
    const response = await handler(await sessionRequest())

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({
      member: {
        displayName: 'Miriam',
        membershipStatus: ACTIVE_MEMBERSHIP_STATUS,
      },
    })
  })

  it('returns 401 for missing, expired, or tampered sessions and clears invalid cookies', async () => {
    const handler = createMembersSessionHandler(async () => [
      member(ACTIVE_MEMBERSHIP_STATUS),
    ])
    const missingResponse = await handler(request('/api/members/session'))
    const expiredResponse = await handler(
      await sessionRequest(new Date('2000-01-01T00:00:00.000Z')),
    )
    const tamperedResponse = await handler(
      request('/api/members/session', {
        headers: { Cookie: 'entheo_member_session=tampered' },
      }),
    )

    expect(missingResponse.status).toBe(401)
    expect(expiredResponse.status).toBe(401)
    expect(tamperedResponse.status).toBe(401)
    expect(setCookies(expiredResponse).join('; ')).toContain('entheo_member_session=;')
    expect(setCookies(tamperedResponse).join('; ')).toContain('entheo_member_session=;')
  })

  it.each([
    ['Incomplete', 403, 'membership_inactive'],
    ['Past Due', 403, 'membership_inactive'],
    ['Expired', 403, 'membership_inactive'],
    ['Archived', 403, 'membership_inactive'],
  ] as const)('denies a %s member with status %i', async (status, expectedCode, error) => {
    const handler = createMembersSessionHandler(async () => [member(status)])
    const response = await handler(await sessionRequest())

    expect(response.status).toBe(expectedCode)
    expect(await response.json()).toEqual({ error })
    expect(setCookies(response).join('; ')).toContain('entheo_member_session=;')
  })

  it('returns 404 and clears the session when no primary-email member exists', async () => {
    const handler = createMembersSessionHandler(async () => [])
    const response = await handler(await sessionRequest())

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ error: 'membership_not_found' })
    expect(setCookies(response).join('; ')).toContain('entheo_member_session=;')
  })

  it('returns a generic 503 for duplicates, unknown statuses, and Airtable outages', async () => {
    const duplicateHandler = createMembersSessionHandler(async () => [
      member(ACTIVE_MEMBERSHIP_STATUS),
      member(ACTIVE_MEMBERSHIP_STATUS),
    ])
    const unknownHandler = createMembersSessionHandler(async () => [member('Unexpected')])
    const outageHandler = createMembersSessionHandler(async () => {
      throw new Error(`outage ${AIRTABLE_TOKEN}`)
    })

    for (const handler of [duplicateHandler, unknownHandler, outageHandler]) {
      const response = await handler(await sessionRequest())
      expect(response.status).toBe(503)
      expect(await response.json()).toEqual({ error: 'member_service_unavailable' })
    }
  })
})

describe('GET /api/members/resources', () => {
  it('returns the private catalog only after rechecking active membership', async () => {
    const findMembers = vi.fn(async () => [member(ACTIVE_MEMBERSHIP_STATUS)])
    const handler = createMemberResourcesHandler(findMembers)
    const response = await handler(await resourceRequest())

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ resources: MEMBER_RESOURCES })
    expect(findMembers).toHaveBeenCalledWith('member@example.com', AIRTABLE_TOKEN)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(response.headers.get('vary')).toBe('Cookie')
  })

  it('does not disclose the catalog without an active session', async () => {
    const activeHandler = createMemberResourcesHandler(async () => [
      member(ACTIVE_MEMBERSHIP_STATUS),
    ])
    const inactiveHandler = createMemberResourcesHandler(async () => [
      member('Expired'),
    ])
    const missingResponse = await activeHandler(request('/api/members/resources'))
    const inactiveResponse = await inactiveHandler(await resourceRequest())

    expect(missingResponse.status).toBe(401)
    expect(inactiveResponse.status).toBe(403)
    expect(JSON.stringify(await missingResponse.json())).not.toContain('signal.group')
    expect(JSON.stringify(await inactiveResponse.json())).not.toContain('signal.group')
  })

  it('allows only GET requests', async () => {
    const handler = createMemberResourcesHandler(async () => [
      member(ACTIVE_MEMBERSHIP_STATUS),
    ])
    const response = await handler(
      request('/api/members/resources', { method: 'POST' }),
    )

    expect(response.status).toBe(405)
    expect(response.headers.get('allow')).toBe('GET')
  })
})

describe('POST /api/auth/logout', () => {
  it('requires a same-origin intent header and clears both cookies', async () => {
    const handler = createAuthLogoutHandler()
    const response = await handler(
      request('/api/auth/logout', {
        method: 'POST',
        headers: {
          Origin: LOCAL_ORIGIN,
          'X-Entheo-Action': 'logout',
          Cookie: 'entheo_member_session=existing',
        },
      }),
    )

    expect(response.status).toBe(204)
    const cookies = setCookies(response).join('; ')
    expect(cookies).toContain('entheo_oauth_flow=;')
    expect(cookies).toContain('entheo_member_session=;')
  })

  it('rejects cross-origin, missing-intent, and non-POST logout attempts', async () => {
    const handler = createAuthLogoutHandler()
    const crossOrigin = await handler(
      request('/api/auth/logout', {
        method: 'POST',
        headers: { Origin: 'https://attacker.example', 'X-Entheo-Action': 'logout' },
      }),
    )
    const noIntent = await handler(
      request('/api/auth/logout', {
        method: 'POST',
        headers: { Origin: LOCAL_ORIGIN },
      }),
    )
    const wrongMethod = await handler(request('/api/auth/logout'))

    expect(crossOrigin.status).toBe(403)
    expect(noIntent.status).toBe(403)
    expect(wrongMethod.status).toBe(405)
  })
})
