import { getProtectedMemberData, type FetchImplementation } from './member-client'
import { record, sanitizedText } from './member-validation'

export interface DashboardMember {
  displayName: string
  membershipStatus: 'Active & Current'
}

function parseDashboardMember(value: unknown): DashboardMember | null {
  const payload = record(value)
  const member = record(payload?.member)
  const displayName = sanitizedText(member?.displayName)?.slice(0, 80)
  const membershipStatus = member?.membershipStatus

  if (!displayName || membershipStatus !== 'Active & Current') return null
  return { displayName, membershipStatus }
}

export function getMemberSession(fetchImplementation: FetchImplementation = fetch) {
  return getProtectedMemberData(
    '/api/members/session',
    parseDashboardMember,
    fetchImplementation,
  )
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
