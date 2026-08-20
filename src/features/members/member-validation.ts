export function record(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

export function sanitizedText(value: unknown) {
  if (typeof value !== 'string') return null
  const sanitized = value.replace(/[\u0000-\u001f\u007f]/g, '').trim()
  return sanitized || null
}

export function parseArray<T>(
  value: unknown,
  parseItem: (item: unknown) => T | null,
): T[] | null {
  if (!Array.isArray(value) || value.length === 0) return null

  const parsed: T[] = []
  for (const item of value) {
    const result = parseItem(item)
    if (result === null) return null
    parsed.push(result)
  }

  return parsed
}
