import type { Config } from '@netlify/functions'
import { MEMBER_RESOURCES } from './_shared/member-resources'
import type { FindMembersByEmail } from './_shared/member-directory'
import { createProtectedMemberHandler } from './_shared/protected-member-handler'

export function createMemberResourcesHandler(findMembers?: FindMembersByEmail) {
  return createProtectedMemberHandler(
    () => ({ resources: MEMBER_RESOURCES }),
    findMembers,
  )
}

export default createMemberResourcesHandler()

export const config: Config = {
  path: '/api/members/resources',
}
