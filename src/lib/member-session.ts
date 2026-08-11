export const MEMBERSHIP_URL = 'https://forms.gle/pKi3Mt8LB2jjfWrLA'
export const MEMBER_DASHBOARD_PATH = '/members/dashboard'
export const MEMBER_LOGIN_URL =
  '/api/auth/google?returnTo=%2Fmembers%2Fdashboard'

export interface DashboardMember {
  displayName: string
  membershipStatus: 'Active & Current'
}

export type MemberSessionOutcome =
  | { kind: 'active'; member: DashboardMember }
  | { kind: 'unauthenticated' }
  | { kind: 'inactive' }
  | { kind: 'not-member' }
  | { kind: 'service-error' }

export type FetchImplementation = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>

function minimizedMember(value: unknown): DashboardMember | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null

  const member = (value as { member?: unknown }).member
  if (typeof member !== 'object' || member === null || Array.isArray(member)) return null

  const displayName = (member as { displayName?: unknown }).displayName
  const membershipStatus = (member as { membershipStatus?: unknown }).membershipStatus
  if (
    typeof displayName !== 'string' ||
    !displayName.trim() ||
    membershipStatus !== 'Active & Current'
  ) {
    return null
  }

  const safeDisplayName = displayName
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim()
    .slice(0, 80)

  if (!safeDisplayName) return null
  return { displayName: safeDisplayName, membershipStatus }
}

export async function getMemberSession(
  fetchImplementation: FetchImplementation = fetch,
): Promise<MemberSessionOutcome> {
  let response: Response

  try {
    response = await fetchImplementation('/api/members/session', {
      method: 'GET',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    })
  } catch {
    return { kind: 'service-error' }
  }

  if (response.status === 401) return { kind: 'unauthenticated' }
  if (response.status === 403) return { kind: 'inactive' }
  if (response.status === 404) return { kind: 'not-member' }
  if (response.status !== 200) return { kind: 'service-error' }

  try {
    const member = minimizedMember(await response.json())
    return member ? { kind: 'active', member } : { kind: 'service-error' }
  } catch {
    return { kind: 'service-error' }
  }
}

export async function logoutMember(
  fetchImplementation: FetchImplementation = fetch,
) {
  try {
    const response = await fetchImplementation('/api/auth/logout', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'X-Entheo-Action': 'logout',
      },
    })
    return response.status === 204
  } catch {
    return false
  }
}
