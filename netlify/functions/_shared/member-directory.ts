import { AIRTABLE_BASE_ID, AIRTABLE_MEMBERS_TABLE_ID } from './config'

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

export class MemberDirectoryError extends Error {
  readonly code = 'member_directory_unavailable'

  constructor(readonly status?: number) {
    super('Member directory unavailable')
  }
}

type FetchImplementation = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>

function stringField(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function cleanDisplayName(value: string | null) {
  if (!value) return null
  const cleaned = value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 80)
  return cleaned || null
}

export function normalizeVerifiedEmail(value: string) {
  const email = value.trim().toLowerCase()
  const validEmail = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9.-]+$/i

  if (
    email.length > 254 ||
    !validEmail.test(email) ||
    email.includes('..') ||
    email.includes('"') ||
    email.includes('\\')
  ) {
    throw new Error('Invalid verified email')
  }

  return email
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export async function findMembersByEmail(
  verifiedEmail: string,
  apiToken: string,
  fetchImplementation: FetchImplementation = fetch,
) {
  const email = normalizeVerifiedEmail(verifiedEmail)
  const endpoint = new URL(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_MEMBERS_TABLE_ID}`,
  )
  endpoint.searchParams.set('filterByFormula', `LOWER({Email})=LOWER(${JSON.stringify(email)})`)
  endpoint.searchParams.set('maxRecords', '2')
  endpoint.searchParams.append('fields[]', 'Email')
  endpoint.searchParams.append('fields[]', 'Goes By')
  endpoint.searchParams.append('fields[]', 'First Name')
  endpoint.searchParams.append('fields[]', 'Membership Status')

  let response: Response

  try {
    response = await fetchImplementation(endpoint, {
      method: 'GET',
      headers: { Authorization: `Bearer ${apiToken}` },
      redirect: 'error',
      signal: AbortSignal.timeout(5_000),
    })
  } catch {
    throw new MemberDirectoryError()
  }

  if (!response.ok) throw new MemberDirectoryError(response.status)

  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    throw new MemberDirectoryError(response.status)
  }

  if (!isRecord(payload) || !Array.isArray(payload.records)) {
    throw new MemberDirectoryError(response.status)
  }

  const records: MemberRecord[] = []

  for (const rawRecord of payload.records) {
    if (!isRecord(rawRecord) || typeof rawRecord.id !== 'string' || !isRecord(rawRecord.fields)) {
      throw new MemberDirectoryError(response.status)
    }

    const recordEmail = stringField(rawRecord.fields.Email)
    if (!recordEmail) continue

    let normalizedRecordEmail: string
    try {
      normalizedRecordEmail = normalizeVerifiedEmail(recordEmail)
    } catch {
      continue
    }

    if (normalizedRecordEmail !== email) continue

    records.push({
      id: rawRecord.id,
      email: normalizedRecordEmail,
      goesBy: stringField(rawRecord.fields['Goes By']),
      firstName: stringField(rawRecord.fields['First Name']),
      membershipStatus: stringField(rawRecord.fields['Membership Status']),
    })
  }

  return records
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
