import { AIRTABLE_BASE_ID, AIRTABLE_MEMBERS_TABLE_ID } from './config'
import type { MemberRecord } from './member-access'
import { normalizeVerifiedEmail } from './verified-email'

export type FindMembersByEmail = (
  email: string,
  apiToken: string,
) => Promise<MemberRecord[]>

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
