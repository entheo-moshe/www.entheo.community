import { OAuth2Client, type TokenPayload } from 'google-auth-library'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  DASHBOARD_PATH,
  DEVELOPMENT_SECRET_SENTINEL,
  LOCAL_AUTH_ORIGIN,
  PRODUCTION_ORIGIN,
  ConfigurationError,
  getAuthOrigin,
  getCanonicalAuthRedirect,
  getSessionSecret,
  isLocalRequest,
} from '../functions/_shared/config'
import {
  createGoogleAuthorizationRequest,
  exchangeGoogleCode,
  GoogleAuthenticationError,
  validateGoogleIdentityPayload,
  type GoogleConfiguration,
  type GoogleTokenExchangeClient,
} from '../functions/_shared/google-identity'
import {
  getCookie,
  safeServerLog,
  setFlowCookie,
  setSessionCookie,
  singleQueryParameter,
} from '../functions/_shared/http'
import {
  ACTIVE_MEMBERSHIP_STATUS,
  decideMemberAccess,
  type MemberRecord,
} from '../functions/_shared/member-access'
import { findMembersByEmail } from '../functions/_shared/member-directory'
import {
  openMemberSession,
  openOAuthFlow,
  sealMemberSession,
  sealOAuthFlow,
  type MemberSessionClaims,
  type OAuthFlowClaims,
} from '../functions/_shared/tokens'
import { normalizeVerifiedEmail } from '../functions/_shared/verified-email'
import { createAuthGoogleCallbackHandler } from '../functions/auth-google-callback'
import { createAuthGoogleHandler } from '../functions/auth-google'
import { createAuthLogoutHandler } from '../functions/auth-logout'
import { createMembersSessionHandler } from '../functions/members-session'

const TEST_SECRET = 'test-session-secret-with-at-least-thirty-two-characters'
const NOW = new Date('2026-08-20T12:00:00.000Z')
const configuration: GoogleConfiguration = {
  clientId: 'google-client-id',
  clientSecret: 'google-client-secret',
  redirectUri: `${LOCAL_AUTH_ORIGIN}/api/auth/google/callback`,
}
const flow: OAuthFlowClaims = {
  state: 'expected-state',
  nonce: 'expected-nonce',
  codeVerifier: 'expected-verifier',
  returnTo: DASHBOARD_PATH,
}

function request(origin: string, path: string, init: RequestInit = {}) {
  return new Request(`${origin}${path}`, init)
}

function googlePayload(overrides: Partial<TokenPayload> = {}): TokenPayload {
  return {
    iss: 'https://accounts.google.com',
    aud: configuration.clientId,
    sub: 'google-subject',
    email: 'member@example.com',
    email_verified: true,
    nonce: flow.nonce,
    iat: 1_755_691_200,
    exp: 1_755_694_800,
    ...overrides,
  }
}

function member(overrides: Partial<MemberRecord> = {}): MemberRecord {
  return {
    id: 'rec-member',
    email: 'member@example.com',
    goesBy: 'Miriam',
    firstName: 'Mary',
    membershipStatus: ACTIVE_MEMBERSHIP_STATUS,
    ...overrides,
  }
}

beforeEach(() => {
  vi.stubEnv('AUTH_SESSION_SECRET', TEST_SECRET)
  vi.stubEnv('GOOGLE_OAUTH_CLIENT_ID', configuration.clientId)
  vi.stubEnv('GOOGLE_OAUTH_CLIENT_SECRET', configuration.clientSecret)
  vi.stubEnv('AIRTABLE_API_TOKEN', 'airtable-token-for-tests')
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
})

describe('deployment configuration edges', () => {
  it('recognizes every loopback form and selects the canonical production origin otherwise', () => {
    expect(isLocalRequest(request('http://localhost:8888', '/'))).toBe(true)
    expect(isLocalRequest(request('http://127.0.0.1:8888', '/'))).toBe(true)
    expect(isLocalRequest(request('http://[::1]:8888', '/'))).toBe(true)
    expect(isLocalRequest(request(PRODUCTION_ORIGIN, '/'))).toBe(false)
    expect(getAuthOrigin(request(PRODUCTION_ORIGIN, '/'))).toBe(PRODUCTION_ORIGIN)
  })

  it('permits the development secret only on loopback and derives its fallback source', () => {
    vi.stubEnv('AUTH_SESSION_SECRET', DEVELOPMENT_SECRET_SENTINEL)

    expect(getSessionSecret(request(LOCAL_AUTH_ORIGIN, '/'))).toBe(
      `entheo-local-session:${configuration.clientSecret}`,
    )
    expect(() =>
      getSessionSecret(request(PRODUCTION_ORIGIN, '/'), configuration.clientSecret),
    ).toThrow(ConfigurationError)
  })

  it('rejects short production secrets and redirects noncanonical production hosts', () => {
    vi.stubEnv('AUTH_SESSION_SECRET', 'too-short')
    expect(() => getSessionSecret(request(PRODUCTION_ORIGIN, '/'))).toThrow(
      'at least 32 characters',
    )

    const canonicalRequest = request(PRODUCTION_ORIGIN, '/api/auth/google?returnTo=%2Fmembers%2Fdashboard')
    const alternateRequest = request(
      'https://entheo.community',
      '/api/auth/google?returnTo=%2Fmembers%2Fdashboard',
    )
    expect(getCanonicalAuthRedirect(canonicalRequest)).toBeNull()
    expect(getCanonicalAuthRedirect(alternateRequest)).toBe(
      `${PRODUCTION_ORIGIN}/api/auth/google?returnTo=%2Fmembers%2Fdashboard`,
    )
  })
})

describe('HTTP and token rejection edges', () => {
  it('uses host-prefixed secure cookies in production and ignores malformed cookie parts', () => {
    const productionRequest = request(PRODUCTION_ORIGIN, '/', {
      headers: {
        Cookie: 'malformed; other=value; __Host-entheo_member_session=sealed-session',
      },
    })

    expect(setFlowCookie(productionRequest, 'sealed-flow', 600)).toContain(
      '__Host-entheo_oauth_flow=sealed-flow',
    )
    expect(setSessionCookie(productionRequest, 'sealed-session', 600)).toContain('Secure')
    expect(getCookie(productionRequest, 'session')).toBe('sealed-session')
    expect(getCookie(productionRequest, 'flow')).toBeNull()
  })

  it('rejects duplicate query parameters and records only bounded server diagnostics', () => {
    const url = new URL(`${LOCAL_AUTH_ORIGIN}/callback?code=one&code=two`)
    expect(singleQueryParameter(url, 'code')).toBeNull()

    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    safeServerLog('provider_failed', 503)
    expect(error).toHaveBeenCalledWith('[member-auth] provider_failed status=503')
  })

  it('rejects structurally invalid claims after successful token decryption', async () => {
    const invalidFlow = await sealOAuthFlow(
      { ...flow, returnTo: '/not-allowed' } as unknown as OAuthFlowClaims,
      TEST_SECRET,
      NOW,
    )
    const invalidSession = await sealMemberSession(
      { subject: 'google-subject', email: 42 } as unknown as MemberSessionClaims,
      TEST_SECRET,
      NOW,
    )

    await expect(openOAuthFlow(invalidFlow, TEST_SECRET, NOW)).rejects.toThrow(
      'Invalid OAuth flow token',
    )
    await expect(openMemberSession(invalidSession, TEST_SECRET, NOW)).rejects.toThrow(
      'Invalid member session token',
    )
  })

  it('rejects malformed verified email values', () => {
    expect(() => normalizeVerifiedEmail('not an email')).toThrow('Invalid verified email')
  })
})

describe('Google identity failure edges', () => {
  it('maps a syntactically invalid verified email to an authentication error', () => {
    expect(() =>
      validateGoogleIdentityPayload(googlePayload({ email: 'not an email' }), flow.nonce),
    ).toThrow(GoogleAuthenticationError)
  })

  it('rejects missing PKCE challenges and unexpected authorization endpoints', async () => {
    vi.spyOn(OAuth2Client.prototype, 'generateCodeVerifierAsync').mockResolvedValueOnce({
      codeVerifier: 'verifier',
      codeChallenge: '',
    })
    await expect(
      createGoogleAuthorizationRequest(configuration, DASHBOARD_PATH),
    ).rejects.toThrow('Missing PKCE challenge')

    vi.spyOn(OAuth2Client.prototype, 'generateCodeVerifierAsync').mockResolvedValueOnce({
      codeVerifier: 'verifier',
      codeChallenge: 'challenge',
    })
    vi.spyOn(OAuth2Client.prototype, 'generateAuthUrl').mockReturnValueOnce(
      'http://accounts.google.com/o/oauth2/v2/auth',
    )
    await expect(
      createGoogleAuthorizationRequest(configuration, DASHBOARD_PATH),
    ).rejects.toThrow('Unexpected Google authorization endpoint')
  })

  it('uses the default Google client factory when no test seam is supplied', async () => {
    vi.spyOn(OAuth2Client.prototype, 'getToken').mockResolvedValue({
      tokens: { id_token: 'signed-id-token' },
    } as never)
    vi.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockResolvedValue({
      getPayload: () => googlePayload(),
    } as never)

    await expect(exchangeGoogleCode('authorization-code', flow, configuration)).resolves.toEqual({
      subject: 'google-subject',
      email: 'member@example.com',
    })
  })

  it('maps code-exchange failures and missing ID tokens to authentication errors', async () => {
    const rejectedClient: GoogleTokenExchangeClient = {
      getToken: vi.fn(async () => {
        throw new Error('provider detail')
      }),
      verifyIdToken: vi.fn(),
    }
    const missingTokenClient: GoogleTokenExchangeClient = {
      getToken: vi.fn(async () => ({ tokens: {} })),
      verifyIdToken: vi.fn(),
    }

    await expect(
      exchangeGoogleCode('authorization-code', flow, configuration, () => rejectedClient),
    ).rejects.toThrow('Code exchange failed')
    await expect(
      exchangeGoogleCode('authorization-code', flow, configuration, () => missingTokenClient),
    ).rejects.toThrow('Missing ID token')
  })
})

describe('member directory and access rejection edges', () => {
  it('rejects invalid JSON and malformed record structures', async () => {
    await expect(
      findMembersByEmail('member@example.com', 'token', async () =>
        new Response('{', { status: 200, headers: { 'Content-Type': 'application/json' } }),
      ),
    ).rejects.toMatchObject({ code: 'member_directory_unavailable', status: 200 })

    for (const rawRecord of [null, { id: 1, fields: {} }, { id: 'rec', fields: [] }]) {
      await expect(
        findMembersByEmail('member@example.com', 'token', async () =>
          Response.json({ records: [rawRecord] }),
        ),
      ).rejects.toMatchObject({ code: 'member_directory_unavailable' })
    }
  })

  it('skips blank, invalid, and nonmatching provider emails', async () => {
    const records = await findMembersByEmail('member@example.com', 'token', async () =>
      Response.json({
        records: [
          { id: 'blank', fields: { Email: '   ' } },
          { id: 'invalid', fields: { Email: 'not an email' } },
          { id: 'different', fields: { Email: 'other@example.com' } },
          {
            id: 'matching',
            fields: {
              Email: 'member@example.com',
              'Goes By': null,
              'First Name': null,
              'Membership Status': ACTIVE_MEMBERSHIP_STATUS,
            },
          },
        ],
      }),
    )

    expect(records).toEqual([
      {
        id: 'matching',
        email: 'member@example.com',
        goesBy: null,
        firstName: null,
        membershipStatus: ACTIVE_MEMBERSHIP_STATUS,
      },
    ])
  })

  it('uses the generic member display name only when both approved names are absent', () => {
    expect(decideMemberAccess([member({ goesBy: null, firstName: null })])).toEqual({
      kind: 'active',
      member: {
        displayName: 'Member',
        membershipStatus: ACTIVE_MEMBERSHIP_STATUS,
      },
    })
  })
})

describe('function routing edges', () => {
  it('redirects every authentication boundary from a noncanonical production host', async () => {
    const alternateOrigin = 'https://entheo.community'
    const cases = [
      [createAuthGoogleHandler(), request(alternateOrigin, '/api/auth/google')],
      [
        createAuthGoogleCallbackHandler(),
        request(alternateOrigin, '/api/auth/google/callback'),
      ],
      [
        createAuthLogoutHandler(),
        request(alternateOrigin, '/api/auth/logout', { method: 'POST' }),
      ],
      [createMembersSessionHandler(), request(alternateOrigin, '/api/members/session')],
    ] as const

    for (const [handler, boundaryRequest] of cases) {
      const response = await handler(boundaryRequest)
      expect(response.status).toBe(302)
      expect(response.headers.get('location')).toMatch(/^https:\/\/www\.entheo\.community\//)
    }
  })

  it('rejects callback methods, provider cancellations, and unreadable flow cookies', async () => {
    const handler = createAuthGoogleCallbackHandler()
    const wrongMethod = await handler(
      request(LOCAL_AUTH_ORIGIN, '/api/auth/google/callback', { method: 'POST' }),
    )
    const providerCancellation = await handler(
      request(LOCAL_AUTH_ORIGIN, '/api/auth/google/callback?error=access_denied'),
    )
    const unreadableFlow = await handler(
      request(
        LOCAL_AUTH_ORIGIN,
        '/api/auth/google/callback?code=authorization-code&state=expected-state',
        { headers: { Cookie: 'entheo_oauth_flow=not-a-token' } },
      ),
    )

    expect(wrongMethod.status).toBe(405)
    expect(providerCancellation.headers.get('location')).toBe('/members/error?reason=auth')
    expect(unreadableFlow.headers.get('location')).toBe('/members/error?reason=auth')
  })
})
