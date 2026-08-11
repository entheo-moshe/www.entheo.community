import type { Config } from '@netlify/functions'
import { getAuthOrigin, getCanonicalAuthRedirect } from './_shared/config'
import {
  clearFlowCookie,
  clearSessionCookie,
  emptyResponse,
  jsonResponse,
  methodNotAllowed,
  redirectResponse,
} from './_shared/http'

export function createAuthLogoutHandler() {
  return async function authLogoutHandler(request: Request) {
    if (request.method !== 'POST') return methodNotAllowed(['POST'])

    const canonicalRedirect = getCanonicalAuthRedirect(request)
    if (canonicalRedirect) return redirectResponse(canonicalRedirect)

    if (
      request.headers.get('origin') !== getAuthOrigin(request) ||
      request.headers.get('x-entheo-action') !== 'logout'
    ) {
      return jsonResponse({ error: 'request_forbidden' }, 403)
    }

    return emptyResponse(204, [
      clearFlowCookie(request),
      clearSessionCookie(request),
    ])
  }
}

export default createAuthLogoutHandler()

export const config: Config = {
  path: '/api/auth/logout',
}
