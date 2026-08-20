import {
  getAirtableToken,
  getCanonicalAuthRedirect,
  getGoogleConfiguration,
  getSessionSecret,
} from './config'
import {
  clearSessionCookie,
  getCookie,
  jsonResponse,
  methodNotAllowed,
  redirectResponse,
  safeServerLog,
} from './http'
import {
  decideMemberAccess,
  findMembersByEmail,
  type FindMembersByEmail,
  type MemberAccessDecision,
} from './member-directory'
import { openMemberSession } from './tokens'

type ActiveMember = Extract<
  MemberAccessDecision,
  { kind: 'active' }
>['member']

type CreateSuccessBody = (member: ActiveMember) => Record<string, unknown>

export function createProtectedMemberHandler(
  createSuccessBody: CreateSuccessBody,
  findMembers: FindMembersByEmail = findMembersByEmail,
) {
  return async function protectedMemberHandler(request: Request) {
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
        return jsonResponse(createSuccessBody(decision.member), 200)
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
