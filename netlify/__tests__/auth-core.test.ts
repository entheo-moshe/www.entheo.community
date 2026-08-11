import { createHash } from 'node:crypto'
import type { TokenPayload } from 'google-auth-library'
import { describe, expect, it, vi } from 'vitest'
import {
  DASHBOARD_PATH,
  RESOURCES_PATH,
  allowReturnTo,
} from '../functions/_shared/config'
import {
  createGoogleAuthorizationRequest,
  exchangeGoogleCode,
  GoogleAuthenticationError,
  validateGoogleIdentityPayload,
} from '../functions/_shared/google-identity'
import {
  ACTIVE_MEMBERSHIP_STATUS,
  decideMemberAccess,
  findMembersByEmail,
  type MemberRecord,
} from '../functions/_shared/member-directory'
import {
  FLOW_TTL_SECONDS,
  SESSION_TTL_SECONDS,
  openMemberSession,
  openOAuthFlow,
  sealMemberSession,
  sealOAuthFlow,
} from '../functions/_shared/tokens'

const TEST_SECRET = 'test-session-secret-with-at-least-thirty-two-characters'
const NOW = new Date('2026-08-11T12:00:00.000Z')

const flow = {
  state: 'state-value',
  nonce: 'nonce-value',
  codeVerifier: 'verifier-value',
  returnTo: DASHBOARD_PATH,
} as const

function member(
  membershipStatus: string | null,
  overrides: Partial<MemberRecord> = {},
): MemberRecord {
  return {
    id: 'rec-member',
    email: 'member@example.com',
    goesBy: 'Miriam',
    firstName: 'Miriam',
    membershipStatus,
    ...overrides,
  }
}

function googlePayload(overrides: Partial<TokenPayload> = {}): TokenPayload {
  return {
    iss: 'https://accounts.google.com',
    aud: 'client-id',
    sub: 'google-subject',
    email: 'Member@Example.com',
    email_verified: true,
    nonce: flow.nonce,
    iat: 1_754_913_600,
    exp: 1_754_917_200,
    ...overrides,
  }
}

describe('OAuth attempt and member session tokens', () => {
  it('round-trips an encrypted OAuth flow and rejects tampering or the wrong key', async () => {
    const token = await sealOAuthFlow(flow, TEST_SECRET, NOW)

    await expect(openOAuthFlow(token, TEST_SECRET, NOW)).resolves.toEqual(flow)
    await expect(openOAuthFlow(`${token}x`, TEST_SECRET, NOW)).rejects.toThrow()
    await expect(openOAuthFlow(token, `${TEST_SECRET}-wrong`, NOW)).rejects.toThrow()
    expect(token).not.toContain(flow.state)
    expect(token).not.toContain(flow.nonce)
  })

  it('expires OAuth flow state after ten minutes', async () => {
    const token = await sealOAuthFlow(flow, TEST_SECRET, NOW)
    const afterExpiry = new Date(NOW.getTime() + (FLOW_TTL_SECONDS + 1) * 1_000)

    await expect(openOAuthFlow(token, TEST_SECRET, afterExpiry)).rejects.toThrow()
  })

  it('round-trips a member session for twelve hours and isolates it from flow keys', async () => {
    const claims = { subject: 'google-subject', email: 'member@example.com' }
    const token = await sealMemberSession(claims, TEST_SECRET, NOW)

    await expect(openMemberSession(token, TEST_SECRET, NOW)).resolves.toEqual(claims)
    await expect(openOAuthFlow(token, TEST_SECRET, NOW)).rejects.toThrow()

    const afterExpiry = new Date(NOW.getTime() + (SESSION_TTL_SECONDS + 1) * 1_000)
    await expect(openMemberSession(token, TEST_SECRET, afterExpiry)).rejects.toThrow()
  })

  it('allows only the two protected member return paths', () => {
    expect(allowReturnTo(DASHBOARD_PATH)).toBe(DASHBOARD_PATH)
    expect(allowReturnTo(RESOURCES_PATH)).toBe(RESOURCES_PATH)
    expect(allowReturnTo('https://attacker.example/steal')).toBe(DASHBOARD_PATH)
    expect(allowReturnTo('//attacker.example')).toBe(DASHBOARD_PATH)
    expect(allowReturnTo('/members/error')).toBe(DASHBOARD_PATH)
    expect(allowReturnTo(null)).toBe(DASHBOARD_PATH)
  })

  it('round-trips the protected resources return path', async () => {
    const resourceFlow = { ...flow, returnTo: RESOURCES_PATH } as const
    const token = await sealOAuthFlow(resourceFlow, TEST_SECRET, NOW)

    await expect(openOAuthFlow(token, TEST_SECRET, NOW)).resolves.toEqual(resourceFlow)
  })
})

describe('Google OpenID Connect request and identity claims', () => {
  it('constructs a Google authorization request with PKCE, state, nonce, and minimal scopes', async () => {
    const configuration = {
      clientId: 'google-client-id',
      clientSecret: 'google-client-secret',
      redirectUri: 'http://localhost:8888/api/auth/google/callback',
    }

    const result = await createGoogleAuthorizationRequest(configuration, DASHBOARD_PATH)
    const authorizationUrl = new URL(result.authorizationUrl)
    const expectedChallenge = createHash('sha256')
      .update(result.flow.codeVerifier)
      .digest('base64url')

    expect(authorizationUrl.origin).toBe('https://accounts.google.com')
    expect(authorizationUrl.searchParams.get('client_id')).toBe(configuration.clientId)
    expect(authorizationUrl.searchParams.get('redirect_uri')).toBe(configuration.redirectUri)
    expect(authorizationUrl.searchParams.get('response_type')).toBe('code')
    expect(authorizationUrl.searchParams.get('access_type')).toBe('online')
    expect(authorizationUrl.searchParams.get('prompt')).toBe('select_account')
    expect(authorizationUrl.searchParams.get('scope')?.split(' ').sort()).toEqual([
      'email',
      'openid',
    ])
    expect(authorizationUrl.searchParams.get('state')).toBe(result.flow.state)
    expect(authorizationUrl.searchParams.get('nonce')).toBe(result.flow.nonce)
    expect(authorizationUrl.searchParams.get('code_challenge_method')).toBe('S256')
    expect(authorizationUrl.searchParams.get('code_challenge')).toBe(expectedChallenge)
    expect(result.flow.state).toHaveLength(43)
    expect(result.flow.nonce).toHaveLength(43)
  })

  it('accepts only verified email claims with the expected nonce', () => {
    expect(validateGoogleIdentityPayload(googlePayload(), flow.nonce)).toEqual({
      subject: 'google-subject',
      email: 'member@example.com',
    })

    expect(() =>
      validateGoogleIdentityPayload(googlePayload({ nonce: 'wrong' }), flow.nonce),
    ).toThrow(GoogleAuthenticationError)
    expect(() =>
      validateGoogleIdentityPayload(googlePayload({ email_verified: false }), flow.nonce),
    ).toThrow(GoogleAuthenticationError)
    expect(() =>
      validateGoogleIdentityPayload(googlePayload({ email: undefined }), flow.nonce),
    ).toThrow(GoogleAuthenticationError)
    expect(() => validateGoogleIdentityPayload(undefined, flow.nonce)).toThrow(
      GoogleAuthenticationError,
    )
  })

  it('exchanges the code with the PKCE verifier and delegates signature, issuer, audience, and expiry checks to Google verification', async () => {
    const getToken = vi.fn(async () => ({ tokens: { id_token: 'signed-id-token' } }))
    const verifyIdToken = vi.fn(async () => ({
      getPayload: () => googlePayload(),
    }))
    const createClient = vi.fn(() => ({ getToken, verifyIdToken }))
    const configuration = {
      clientId: 'google-client-id',
      clientSecret: 'google-client-secret',
      redirectUri: 'http://localhost:8888/api/auth/google/callback',
    }

    await expect(
      exchangeGoogleCode('authorization-code', flow, configuration, createClient),
    ).resolves.toEqual({ subject: 'google-subject', email: 'member@example.com' })
    expect(createClient).toHaveBeenCalledWith(configuration)
    expect(getToken).toHaveBeenCalledWith({
      code: 'authorization-code',
      codeVerifier: flow.codeVerifier,
      redirect_uri: configuration.redirectUri,
    })
    expect(verifyIdToken).toHaveBeenCalledWith({
      idToken: 'signed-id-token',
      audience: configuration.clientId,
    })

    verifyIdToken.mockRejectedValueOnce(new Error('bad signature or expired token'))
    await expect(
      exchangeGoogleCode('authorization-code', flow, configuration, createClient),
    ).rejects.toThrow(GoogleAuthenticationError)
  })
})

describe('Airtable member directory boundary', () => {
  it('queries only the primary Email and four approved fields with an encoded formula', async () => {
    let capturedInput: string | URL | Request | undefined
    let capturedInit: RequestInit | undefined
    const fetchImplementation = vi.fn(
      async (input: string | URL | Request, init?: RequestInit) => {
        capturedInput = input
        capturedInit = init
        return Response.json({
        records: [
          {
            id: 'rec-member',
            fields: {
              Email: 'MEMBER@example.com',
              'Goes By': 'Miriam',
              'First Name': 'Mary',
              'Membership Status': ACTIVE_MEMBERSHIP_STATUS,
              'Private Notes': 'must never be returned',
            },
          },
          ],
        })
      },
    )

    const records = await findMembersByEmail(
      ' Member@Example.com ',
      'airtable-secret-token',
      fetchImplementation,
    )
    if (!capturedInput) throw new Error('Airtable request was not captured')
    const endpoint = new URL(
      capturedInput instanceof Request ? capturedInput.url : capturedInput,
    )

    expect(endpoint.origin).toBe('https://api.airtable.com')
    expect(endpoint.searchParams.get('filterByFormula')).toBe(
      'LOWER({Email})=LOWER("member@example.com")',
    )
    expect(endpoint.searchParams.get('maxRecords')).toBe('2')
    expect(endpoint.searchParams.getAll('fields[]')).toEqual([
      'Email',
      'Goes By',
      'First Name',
      'Membership Status',
    ])
    expect(endpoint.toString()).not.toContain('airtable-secret-token')
    expect(capturedInit?.headers).toEqual({ Authorization: 'Bearer airtable-secret-token' })
    expect(records).toEqual([
      {
        id: 'rec-member',
        email: 'member@example.com',
        goesBy: 'Miriam',
        firstName: 'Mary',
        membershipStatus: ACTIVE_MEMBERSHIP_STATUS,
      },
    ])
    expect(JSON.stringify(records)).not.toContain('Private Notes')
  })

  it('rejects unavailable and malformed Airtable responses without exposing provider data', async () => {
    await expect(
      findMembersByEmail('member@example.com', 'secret', async () =>
        Response.json({ error: { message: 'provider detail' } }, { status: 500 }),
      ),
    ).rejects.toMatchObject({ code: 'member_directory_unavailable', status: 500 })

    await expect(
      findMembersByEmail('member@example.com', 'secret', async () =>
        Response.json({ records: 'not-an-array' }),
      ),
    ).rejects.toMatchObject({ code: 'member_directory_unavailable' })

    await expect(
      findMembersByEmail('member@example.com', 'secret', async () => {
        throw new Error('network secret detail')
      }),
    ).rejects.toMatchObject({ code: 'member_directory_unavailable' })
  })
})

describe('membership authorization decisions', () => {
  it('admits one active member and exposes only the minimized dashboard shape', () => {
    expect(decideMemberAccess([member(ACTIVE_MEMBERSHIP_STATUS)])).toEqual({
      kind: 'active',
      member: {
        displayName: 'Miriam',
        membershipStatus: ACTIVE_MEMBERSHIP_STATUS,
      },
    })
  })

  it.each(['Incomplete', 'Past Due', 'Expired', 'Archived'] as const)(
    'denies the %s membership status',
    (membershipStatus) => {
      expect(decideMemberAccess([member(membershipStatus)])).toEqual({
        kind: 'inactive',
        membershipStatus,
      })
    },
  )

  it('fails closed for no record, duplicates, and unknown statuses', () => {
    expect(decideMemberAccess([])).toEqual({ kind: 'not-member' })
    expect(decideMemberAccess([member(ACTIVE_MEMBERSHIP_STATUS), member('Expired')])).toEqual({
      kind: 'service-error',
    })
    expect(decideMemberAccess([member('Unexpected Status')])).toEqual({
      kind: 'service-error',
    })
    expect(decideMemberAccess([member(null)])).toEqual({ kind: 'service-error' })
  })

  it('sanitizes the preferred name and falls back without exposing other member fields', () => {
    const decision = decideMemberAccess([
      member(ACTIVE_MEMBERSHIP_STATUS, {
        goesBy: '\u0000  ',
        firstName: '  Miriam\u0007  ',
      }),
    ])

    expect(decision).toEqual({
      kind: 'active',
      member: { displayName: 'Miriam', membershipStatus: ACTIVE_MEMBERSHIP_STATUS },
    })
  })
})
