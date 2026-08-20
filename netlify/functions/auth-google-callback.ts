import type { Config } from '@netlify/functions'
import {
  ERROR_PATH,
  MEMBERSHIP_URL,
  getAirtableToken,
  getCanonicalAuthRedirect,
  getGoogleConfiguration,
  getSessionSecret,
} from './_shared/config'
import {
  exchangeGoogleCode,
  GoogleAuthenticationError,
  type GoogleConfiguration,
  type GoogleIdentity,
} from './_shared/google-identity'
import {
  clearFlowCookie,
  clearSessionCookie,
  getCookie,
  methodNotAllowed,
  redirectResponse,
  safeServerLog,
  setSessionCookie,
  singleQueryParameter,
} from './_shared/http'
import {
  decideMemberAccess,
  findMembersByEmail,
  type FindMembersByEmail,
} from './_shared/member-directory'
import {
  openOAuthFlow,
  sealMemberSession,
  SESSION_TTL_SECONDS,
  secretsMatch,
  type OAuthFlowClaims,
} from './_shared/tokens'

type ExchangeGoogleCode = (
  code: string,
  flow: OAuthFlowClaims,
  configuration: GoogleConfiguration,
) => Promise<GoogleIdentity>

function failedCallbackResponse(request: Request, reason: 'auth' | 'service') {
  return redirectResponse(`${ERROR_PATH}?reason=${reason}`, [
    clearFlowCookie(request),
  ])
}

export function createAuthGoogleCallbackHandler(
  exchangeCode: ExchangeGoogleCode = exchangeGoogleCode,
  findMembers: FindMembersByEmail = findMembersByEmail,
) {
  return async function authGoogleCallbackHandler(request: Request) {
    if (request.method !== 'GET') return methodNotAllowed(['GET'])

    const canonicalRedirect = getCanonicalAuthRedirect(request)
    if (canonicalRedirect) return redirectResponse(canonicalRedirect)

    const requestUrl = new URL(request.url)
    if (requestUrl.searchParams.has('error')) {
      return failedCallbackResponse(request, 'auth')
    }

    try {
      const code = singleQueryParameter(requestUrl, 'code')
      const state = singleQueryParameter(requestUrl, 'state')
      const sealedFlow = getCookie(request, 'flow')
      if (!code || !state || !sealedFlow) {
        return failedCallbackResponse(request, 'auth')
      }

      const configuration = getGoogleConfiguration(request)
      const sessionSecret = getSessionSecret(request, configuration.clientSecret)

      let flow: OAuthFlowClaims
      try {
        flow = await openOAuthFlow(sealedFlow, sessionSecret)
      } catch {
        return failedCallbackResponse(request, 'auth')
      }

      if (!secretsMatch(state, flow.state)) {
        return failedCallbackResponse(request, 'auth')
      }

      const identity = await exchangeCode(code, flow, configuration)
      const members = await findMembers(identity.email, getAirtableToken())
      const decision = decideMemberAccess(members)

      if (decision.kind === 'active') {
        const session = await sealMemberSession(
          { subject: identity.subject, email: identity.email },
          sessionSecret,
        )

        return redirectResponse(flow.returnTo, [
          clearFlowCookie(request),
          setSessionCookie(request, session, SESSION_TTL_SECONDS),
        ])
      }

      if (decision.kind === 'inactive') {
        return redirectResponse(`${ERROR_PATH}?reason=inactive`, [
          clearFlowCookie(request),
          clearSessionCookie(request),
        ])
      }

      if (decision.kind === 'not-member') {
        return redirectResponse(MEMBERSHIP_URL, [
          clearFlowCookie(request),
          clearSessionCookie(request),
        ])
      }

      safeServerLog('member_access_ambiguous')
      return failedCallbackResponse(request, 'service')
    } catch (error) {
      const reason = error instanceof GoogleAuthenticationError
        ? 'auth'
        : 'service'
      safeServerLog(reason === 'auth' ? 'google_callback_failed' : 'member_provider_failed')
      return failedCallbackResponse(request, reason)
    }
  }
}

export default createAuthGoogleCallbackHandler()

export const config: Config = {
  path: '/api/auth/google/callback',
}
