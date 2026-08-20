import { getProtectedMemberData, type FetchImplementation } from './member-client'
import { parseArray, record, sanitizedText } from './member-validation'

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

const RESOURCE_IDS = new Set<MemberResourceId>([
  'ordination',
  'signal',
  'vault',
])

function boundedText(value: unknown, maximumLength: number) {
  const text = sanitizedText(value)
  return text && text.length <= maximumLength ? text : null
}

function secureHref(value: unknown) {
  const href = boundedText(value, 500)
  if (!href) return null

  try {
    return new URL(href).protocol === 'https:' ? href : null
  } catch {
    return null
  }
}

function memberResourceId(value: unknown): MemberResourceId | null {
  return typeof value === 'string' && RESOURCE_IDS.has(value as MemberResourceId)
    ? (value as MemberResourceId)
    : null
}

function parseDescriptionPart(value: unknown): MemberResourceDescriptionPart | null {
  const part = record(value)
  const text = boundedText(part?.text, 800)
  return text && typeof part?.emphasis === 'boolean'
    ? { text, emphasis: part.emphasis }
    : null
}

function parseAction(value: unknown): MemberResourceAction | null {
  const action = record(value)
  const label = boundedText(action?.label, 100)
  const href = secureHref(action?.href)
  return label && href ? { label, href } : null
}

function parseResource(value: unknown): MemberResource | null {
  const candidate = record(value)
  const id = memberResourceId(candidate?.id)
  const sealLabel = boundedText(candidate?.sealLabel, 80)
  const kicker = boundedText(candidate?.kicker, 80)
  const title = boundedText(candidate?.title, 120)
  const description = parseArray(candidate?.description, parseDescriptionPart)
  const actions = parseArray(candidate?.actions, parseAction)

  if (!id || !sealLabel || !kicker || !title || !description || !actions) {
    return null
  }

  return { id, sealLabel, kicker, title, description, actions }
}

function parseResources(value: unknown) {
  const payload = record(value)
  const resources = parseArray(payload?.resources, parseResource)
  if (!resources) return null

  const ids = new Set(resources.map((resource) => resource.id))
  if (resources.length !== RESOURCE_IDS.size || ids.size !== RESOURCE_IDS.size) {
    return null
  }
  if ([...RESOURCE_IDS].some((id) => !ids.has(id))) return null

  return resources
}

export function getMemberResources(fetchImplementation: FetchImplementation = fetch) {
  return getProtectedMemberData(
    '/api/members/resources',
    parseResources,
    fetchImplementation,
  )
}
