export const ACTIVE_MEMBERSHIP_STATUS = 'Active & Current' as const
export const INACTIVE_MEMBERSHIP_STATUSES = [
  'Incomplete',
  'Past Due',
  'Expired',
  'Archived',
] as const

export type InactiveMembershipStatus = (typeof INACTIVE_MEMBERSHIP_STATUSES)[number]
export type KnownMembershipStatus =
  | typeof ACTIVE_MEMBERSHIP_STATUS
  | InactiveMembershipStatus

export interface MemberRecord {
  id: string
  email: string
  goesBy: string | null
  firstName: string | null
  membershipStatus: string | null
}

export type MemberAccessDecision =
  | {
      kind: 'active'
      member: {
        displayName: string
        membershipStatus: typeof ACTIVE_MEMBERSHIP_STATUS
      }
    }
  | { kind: 'inactive'; membershipStatus: InactiveMembershipStatus }
  | { kind: 'not-member' }
  | { kind: 'service-error' }

function cleanDisplayName(value: string | null) {
  if (!value) return null
  const cleaned = value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 80)
  return cleaned || null
}

export function decideMemberAccess(records: MemberRecord[]): MemberAccessDecision {
  if (records.length === 0) return { kind: 'not-member' }
  if (records.length !== 1) return { kind: 'service-error' }

  const member = records[0]
  if (member.membershipStatus === ACTIVE_MEMBERSHIP_STATUS) {
    return {
      kind: 'active',
      member: {
        displayName:
          cleanDisplayName(member.goesBy) ?? cleanDisplayName(member.firstName) ?? 'Member',
        membershipStatus: ACTIVE_MEMBERSHIP_STATUS,
      },
    }
  }

  if (
    INACTIVE_MEMBERSHIP_STATUSES.includes(
      member.membershipStatus as InactiveMembershipStatus,
    )
  ) {
    return {
      kind: 'inactive',
      membershipStatus: member.membershipStatus as InactiveMembershipStatus,
    }
  }

  return { kind: 'service-error' }
}
