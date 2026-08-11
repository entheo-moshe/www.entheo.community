import type { FetchImplementation } from './member-session'

export type MemberResourceId = 'ordination' | 'signal' | 'vault'

export interface MemberResourceDescriptionPart {
  text: string
  emphasis: boolean
}

export interface MemberResourceAction {
  label: string
  href: string
}

export interface MemberResource {
  id: MemberResourceId
  sealLabel: string
  kicker: string
  title: string
  description: MemberResourceDescriptionPart[]
  actions: MemberResourceAction[]
}

export type MemberResourcesOutcome =
  | { kind: 'active'; resources: MemberResource[] }
  | { kind: 'unauthenticated' }
  | { kind: 'inactive' }
  | { kind: 'not-member' }
  | { kind: 'service-error' }

const RESOURCE_IDS = new Set<MemberResourceId>([
  'ordination',
  'signal',
  'vault',
])

function record(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function text(value: unknown, maximumLength: number) {
  if (typeof value !== 'string') return null
  const safe = value.replace(/[\u0000-\u001f\u007f]/g, '').trim()
  return safe && safe.length <= maximumLength ? safe : null
}

function secureHref(value: unknown) {
  const href = text(value, 500)
  if (!href) return null

  try {
    return new URL(href).protocol === 'https:' ? href : null
  } catch {
    return null
  }
}

function parseResource(value: unknown): MemberResource | null {
  const candidate = record(value)
  if (!candidate || !RESOURCE_IDS.has(candidate.id as MemberResourceId)) return null

  const id = candidate.id as MemberResourceId
  const sealLabel = text(candidate.sealLabel, 80)
  const kicker = text(candidate.kicker, 80)
  const title = text(candidate.title, 120)
  if (!sealLabel || !kicker || !title) return null

  if (!Array.isArray(candidate.description) || candidate.description.length === 0) {
    return null
  }
  const description = candidate.description.map((part) => {
    const descriptionPart = record(part)
    const partText = text(descriptionPart?.text, 800)
    return partText && typeof descriptionPart?.emphasis === 'boolean'
      ? { text: partText, emphasis: descriptionPart.emphasis }
      : null
  })
  if (description.some((part) => part === null)) return null

  if (!Array.isArray(candidate.actions) || candidate.actions.length === 0) return null
  const actions = candidate.actions.map((action) => {
    const resourceAction = record(action)
    const label = text(resourceAction?.label, 100)
    const href = secureHref(resourceAction?.href)
    return label && href ? { label, href } : null
  })
  if (actions.some((action) => action === null)) return null

  return {
    id,
    sealLabel,
    kicker,
    title,
    description: description as MemberResourceDescriptionPart[],
    actions: actions as MemberResourceAction[],
  }
}

function parseResources(value: unknown) {
  const payload = record(value)
  if (!payload || !Array.isArray(payload.resources)) return null

  const resources = payload.resources.map(parseResource)
  if (resources.some((resource) => resource === null)) return null

  const parsed = resources as MemberResource[]
  const ids = new Set(parsed.map((resource) => resource.id))
  if (parsed.length !== RESOURCE_IDS.size || ids.size !== RESOURCE_IDS.size) return null
  if ([...RESOURCE_IDS].some((id) => !ids.has(id))) return null

  return parsed
}

export async function getMemberResources(
  fetchImplementation: FetchImplementation = fetch,
): Promise<MemberResourcesOutcome> {
  let response: Response

  try {
    response = await fetchImplementation('/api/members/resources', {
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
    const resources = parseResources(await response.json())
    return resources
      ? { kind: 'active', resources }
      : { kind: 'service-error' }
  } catch {
    return { kind: 'service-error' }
  }
}
