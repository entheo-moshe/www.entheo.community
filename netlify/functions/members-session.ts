import type { Config } from '@netlify/functions'
import type { FindMembersByEmail } from './_shared/member-directory'
import { createProtectedMemberHandler } from './_shared/protected-member-handler'

export function createMembersSessionHandler(
  findMembers?: FindMembersByEmail,
) {
  return createProtectedMemberHandler((member) => ({ member }), findMembers)
}

export default createMembersSessionHandler()

export const config: Config = {
  path: '/api/members/session',
}
