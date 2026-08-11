import type { Config } from '@netlify/functions'
import {
  ERROR_PATH,
  getCanonicalAuthRedirect,
  getGoogleConfiguration,
  getSessionSecret,
  allowReturnTo,
} from './_shared/config'
import { createGoogleAuthorizationRequest } from './_shared/google-identity'
import {
  methodNotAllowed,
  redirectResponse,
  safeServerLog,
  setFlowCookie,
} from './_shared/http'
import { FLOW_TTL_SECONDS, sealOAuthFlow } from './_shared/tokens'

export type CreateAuthorizationRequest = typeof createGoogleAuthorizationRequest

export function createAuthGoogleHandler(
  createAuthorizationRequest: CreateAuthorizationRequest = createGoogleAuthorizationRequest,
) {
  return async function authGoogleHandler(request: Request) {
    if (request.method !== 'GET') return methodNotAllowed(['GET'])

    const canonicalRedirect = getCanonicalAuthRedirect(request)
    if (canonicalRedirect) return redirectResponse(canonicalRedirect)

    try {
      const configuration = getGoogleConfiguration(request)
      const sessionSecret = getSessionSecret(request, configuration.clientSecret)
      const requestUrl = new URL(request.url)
      const returnTo = allowReturnTo(requestUrl.searchParams.get('returnTo'))
      const { authorizationUrl, flow } = await createAuthorizationRequest(
        configuration,
        returnTo,
      )
      const sealedFlow = await sealOAuthFlow(flow, sessionSecret)

      return redirectResponse(authorizationUrl, [
        setFlowCookie(request, sealedFlow, FLOW_TTL_SECONDS),
      ])
    } catch {
      safeServerLog('google_authorization_start_failed')
      return redirectResponse(`${ERROR_PATH}?reason=service`)
    }
  }
}

export default createAuthGoogleHandler()

export const config: Config = {
  path: '/api/auth/google',
}
