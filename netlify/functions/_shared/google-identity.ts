import { randomBytes } from 'node:crypto'
import {
  CodeChallengeMethod,
  OAuth2Client,
  type TokenPayload,
} from 'google-auth-library'
import type { OAuthFlowClaims } from './tokens'
import { normalizeVerifiedEmail } from './member-directory'
import { secretsMatch } from './tokens'

export interface GoogleConfiguration {
  clientId: string
  clientSecret: string
  redirectUri: string
}

export interface GoogleIdentity {
  subject: string
  email: string
}

export interface GoogleTokenExchangeClient {
  getToken(options: {
    code: string
    codeVerifier: string
    redirect_uri: string
  }): Promise<{ tokens: { id_token?: string | null } }>
  verifyIdToken(options: {
    idToken: string
    audience: string
  }): Promise<{ getPayload(): TokenPayload | undefined }>
}

export type GoogleTokenExchangeClientFactory = (
  configuration: GoogleConfiguration,
) => GoogleTokenExchangeClient

export class GoogleAuthenticationError extends Error {
  readonly code = 'google_authentication_failed'
}

export function validateGoogleIdentityPayload(
  payload: TokenPayload | undefined,
  expectedNonce: string,
): GoogleIdentity {
  if (
    !payload ||
    typeof payload.sub !== 'string' ||
    typeof payload.email !== 'string' ||
    payload.email_verified !== true ||
    typeof payload.nonce !== 'string' ||
    !secretsMatch(payload.nonce, expectedNonce)
  ) {
    throw new GoogleAuthenticationError('Invalid ID token claims')
  }

  let email: string
  try {
    email = normalizeVerifiedEmail(payload.email)
  } catch {
    throw new GoogleAuthenticationError('Invalid verified email claim')
  }

  return { subject: payload.sub, email }
}

export async function createGoogleAuthorizationRequest(
  configuration: GoogleConfiguration,
  returnTo: OAuthFlowClaims['returnTo'],
) {
  const client = new OAuth2Client(configuration)
  const { codeVerifier, codeChallenge } = await client.generateCodeVerifierAsync()
  if (!codeChallenge) throw new GoogleAuthenticationError('Missing PKCE challenge')

  const flow: OAuthFlowClaims = {
    state: randomBytes(32).toString('base64url'),
    nonce: randomBytes(32).toString('base64url'),
    codeVerifier,
    returnTo,
  }

  const authorizationUrl = client.generateAuthUrl({
    access_type: 'online',
    code_challenge: codeChallenge,
    code_challenge_method: CodeChallengeMethod.S256,
    nonce: flow.nonce,
    prompt: 'select_account',
    scope: ['openid', 'email'],
    state: flow.state,
  })

  const parsedAuthorizationUrl = new URL(authorizationUrl)
  if (
    parsedAuthorizationUrl.protocol !== 'https:' ||
    parsedAuthorizationUrl.hostname !== 'accounts.google.com'
  ) {
    throw new GoogleAuthenticationError('Unexpected Google authorization endpoint')
  }

  return { authorizationUrl, flow }
}

export async function exchangeGoogleCode(
  code: string,
  flow: OAuthFlowClaims,
  configuration: GoogleConfiguration,
  createClient: GoogleTokenExchangeClientFactory = (clientConfiguration) =>
    new OAuth2Client(clientConfiguration) as GoogleTokenExchangeClient,
): Promise<GoogleIdentity> {
  const client = createClient(configuration)

  let tokenResponse: { tokens: { id_token?: string | null } }
  try {
    tokenResponse = await client.getToken({
      code,
      codeVerifier: flow.codeVerifier,
      redirect_uri: configuration.redirectUri,
    })
  } catch {
    throw new GoogleAuthenticationError('Code exchange failed')
  }

  const idToken = tokenResponse.tokens.id_token
  if (!idToken) throw new GoogleAuthenticationError('Missing ID token')

  let payload
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: configuration.clientId,
    })
    payload = ticket.getPayload()
  } catch {
    throw new GoogleAuthenticationError('ID token verification failed')
  }

  return validateGoogleIdentityPayload(payload, flow.nonce)
}
