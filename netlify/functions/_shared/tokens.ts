import { hkdfSync, timingSafeEqual } from 'node:crypto'
import { EncryptJWT, jwtDecrypt } from 'jose'
import {
  DASHBOARD_PATH,
  RESOURCES_PATH,
  type MemberReturnPath,
} from './config'

const TOKEN_ISSUER = 'https://www.entheo.community'
const FLOW_AUDIENCE = 'entheo-oauth-flow'
const SESSION_AUDIENCE = 'entheo-member-session'
const KEY_SALT = Buffer.from('entheo-community-auth-v1', 'utf8')

export const FLOW_TTL_SECONDS = 10 * 60
export const SESSION_TTL_SECONDS = 12 * 60 * 60

export interface OAuthFlowClaims {
  state: string
  nonce: string
  codeVerifier: string
  returnTo: MemberReturnPath
}

export interface MemberSessionClaims {
  subject: string
  email: string
}

function deriveKey(secret: string, purpose: 'flow' | 'session') {
  return new Uint8Array(
    hkdfSync('sha256', Buffer.from(secret, 'utf8'), KEY_SALT, Buffer.from(purpose), 32),
  )
}

function epochSeconds(date: Date) {
  return Math.floor(date.getTime() / 1_000)
}

export async function sealOAuthFlow(
  claims: OAuthFlowClaims,
  secret: string,
  now = new Date(),
) {
  const issuedAt = epochSeconds(now)

  return new EncryptJWT({ ...claims, kind: 'oauth-flow' })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM', typ: 'JWT' })
    .setIssuer(TOKEN_ISSUER)
    .setAudience(FLOW_AUDIENCE)
    .setIssuedAt(issuedAt)
    .setExpirationTime(issuedAt + FLOW_TTL_SECONDS)
    .encrypt(deriveKey(secret, 'flow'))
}

export async function openOAuthFlow(token: string, secret: string, now = new Date()) {
  const { payload } = await jwtDecrypt(token, deriveKey(secret, 'flow'), {
    issuer: TOKEN_ISSUER,
    audience: FLOW_AUDIENCE,
    currentDate: now,
  })

  if (
    payload.kind !== 'oauth-flow' ||
    typeof payload.state !== 'string' ||
    typeof payload.nonce !== 'string' ||
    typeof payload.codeVerifier !== 'string' ||
    payload.returnTo !== DASHBOARD_PATH &&
    payload.returnTo !== RESOURCES_PATH
  ) {
    throw new Error('Invalid OAuth flow token')
  }

  return {
    state: payload.state,
    nonce: payload.nonce,
    codeVerifier: payload.codeVerifier,
    returnTo: payload.returnTo,
  } satisfies OAuthFlowClaims
}

export async function sealMemberSession(
  claims: MemberSessionClaims,
  secret: string,
  now = new Date(),
) {
  const issuedAt = epochSeconds(now)

  return new EncryptJWT({ ...claims, kind: 'member-session' })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM', typ: 'JWT' })
    .setIssuer(TOKEN_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setSubject(claims.subject)
    .setIssuedAt(issuedAt)
    .setExpirationTime(issuedAt + SESSION_TTL_SECONDS)
    .encrypt(deriveKey(secret, 'session'))
}

export async function openMemberSession(token: string, secret: string, now = new Date()) {
  const { payload } = await jwtDecrypt(token, deriveKey(secret, 'session'), {
    issuer: TOKEN_ISSUER,
    audience: SESSION_AUDIENCE,
    currentDate: now,
  })

  if (
    payload.kind !== 'member-session' ||
    typeof payload.subject !== 'string' ||
    typeof payload.email !== 'string' ||
    payload.sub !== payload.subject
  ) {
    throw new Error('Invalid member session token')
  }

  return {
    subject: payload.subject,
    email: payload.email,
  } satisfies MemberSessionClaims
}

export function secretsMatch(left: string, right: string) {
  const leftBytes = Buffer.from(left)
  const rightBytes = Buffer.from(right)

  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes)
}
