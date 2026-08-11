import type { Config } from '@netlify/functions'
import {
  getAirtableToken,
  getCanonicalAuthRedirect,
  getGoogleConfiguration,
  getSessionSecret,
} from './_shared/config'
import {
  clearSessionCookie,
  getCookie,
  jsonResponse,
  methodNotAllowed,
  redirectResponse,
  safeServerLog,
} from './_shared/http'
import {
  decideMemberAccess,
  findMembersByEmail,
  type MemberRecord,
} from './_shared/member-directory'
import { openMemberSession } from './_shared/tokens'

type FindMembersByEmail = (
  email: string,
  apiToken: string,
) => Promise<MemberRecord[]>

export function createMembersSessionHandler(
  findMembers: FindMembersByEmail = findMembersByEmail,
) {
  return async function membersSessionHandler(request: Request) {
    if (request.method !== 'GET') return methodNotAllowed(['GET'])

    const canonicalRedirect = getCanonicalAuthRedirect(request)
    if (canonicalRedirect) return redirectResponse(canonicalRedirect)

    const sealedSession = getCookie(request, 'session')
    if (!sealedSession) {
      return jsonResponse({ error: 'authentication_required' }, 401)
    }

    try {
      const configuration = getGoogleConfiguration(request)
      const sessionSecret = getSessionSecret(request, configuration.clientSecret)

      let session
      try {
        session = await openMemberSession(sealedSession, sessionSecret)
      } catch {
        return jsonResponse(
          { error: 'authentication_required' },
          401,
          [clearSessionCookie(request)],
        )
      }

      const members = await findMembers(session.email, getAirtableToken())
      const decision = decideMemberAccess(members)

      if (decision.kind === 'active') {
        return jsonResponse({ member: decision.member }, 200)
      }

      if (decision.kind === 'inactive') {
        return jsonResponse(
          { error: 'membership_inactive' },
          403,
          [clearSessionCookie(request)],
        )
      }

      if (decision.kind === 'not-member') {
        return jsonResponse(
          { error: 'membership_not_found' },
          404,
          [clearSessionCookie(request)],
        )
      }

      safeServerLog('member_access_ambiguous')
      return jsonResponse({ error: 'member_service_unavailable' }, 503)
    } catch {
      safeServerLog('member_session_provider_failed')
      return jsonResponse({ error: 'member_service_unavailable' }, 503)
    }
  }
}

export default createMembersSessionHandler()

export const config: Config = {
  path: '/api/members/session',
}
