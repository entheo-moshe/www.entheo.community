import { redirect } from '@tanstack/react-router'
import {
  MEMBER_LOGIN_URL,
  MEMBER_RESOURCES_LOGIN_URL,
  MEMBERSHIP_URL,
} from '../../config/member-navigation'
import type { FetchImplementation, MemberAccessOutcome } from './member-client'
import { getMemberResources } from './member-resources'
import { getMemberSession } from './member-session'

export function requireActiveMemberData<T>(
  outcome: MemberAccessOutcome<T>,
  loginUrl: string,
): T {
  if (outcome.kind === 'active') return outcome.data
  if (outcome.kind === 'unauthenticated') {
    throw redirect({ href: loginUrl, reloadDocument: true })
  }
  if (outcome.kind === 'inactive') {
    throw redirect({
      to: '/members/error',
      search: { reason: 'inactive' },
      replace: true,
    })
  }
  if (outcome.kind === 'not-member') {
    throw redirect({ href: MEMBERSHIP_URL, reloadDocument: true })
  }

  throw redirect({
    to: '/members/error',
    search: { reason: 'service' },
    replace: true,
  })
}

export async function loadMemberDashboard(
  fetchImplementation: FetchImplementation,
) {
  return requireActiveMemberData(
    await getMemberSession(fetchImplementation),
    MEMBER_LOGIN_URL,
  )
}

export async function loadMemberResources(
  fetchImplementation: FetchImplementation,
) {
  return requireActiveMemberData(
    await getMemberResources(fetchImplementation),
    MEMBER_RESOURCES_LOGIN_URL,
  )
}
