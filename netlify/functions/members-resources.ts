import type { Config } from '@netlify/functions'
import { MEMBER_RESOURCES } from './_shared/member-resources'
import { jsonResponse, methodNotAllowed } from './_shared/http'
import { createMembersSessionHandler } from './members-session'

type FindMembersByEmail = Parameters<typeof createMembersSessionHandler>[0]

export function createMemberResourcesHandler(findMembers?: FindMembersByEmail) {
  const authorizeMember = createMembersSessionHandler(findMembers)

  return async function memberResourcesHandler(request: Request) {
    if (request.method !== 'GET') return methodNotAllowed(['GET'])

    const accessResponse = await authorizeMember(request)
    if (accessResponse.status !== 200) return accessResponse

    return jsonResponse({ resources: MEMBER_RESOURCES }, 200)
  }
}

export default createMemberResourcesHandler()

export const config: Config = {
  path: '/api/members/resources',
}
