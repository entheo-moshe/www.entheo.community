export type FetchImplementation = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>

export type MemberAccessFailureKind =
  | 'unauthenticated'
  | 'inactive'
  | 'not-member'
  | 'service-error'

export type MemberAccessOutcome<T> =
  | { kind: 'active'; data: T }
  | { kind: MemberAccessFailureKind }

type PayloadParser<T> = (value: unknown) => T | null

function failureForStatus(status: number): MemberAccessFailureKind {
  if (status === 401) return 'unauthenticated'
  if (status === 403) return 'inactive'
  if (status === 404) return 'not-member'
  return 'service-error'
}

export async function getProtectedMemberData<T>(
  endpoint: string,
  parsePayload: PayloadParser<T>,
  fetchImplementation: FetchImplementation = fetch,
): Promise<MemberAccessOutcome<T>> {
  let response: Response

  try {
    response = await fetchImplementation(endpoint, {
      method: 'GET',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    })
  } catch {
    return { kind: 'service-error' }
  }

  if (response.status !== 200) {
    return { kind: failureForStatus(response.status) }
  }

  try {
    const data = parsePayload(await response.json())
    return data === null ? { kind: 'service-error' } : { kind: 'active', data }
  } catch {
    return { kind: 'service-error' }
  }
}
