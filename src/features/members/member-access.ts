import { redirect } from '@tanstack/react-router'
import { MEMBERSHIP_URL } from '../../config/member-navigation'
import type { MemberAccessOutcome } from './member-client'

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
