import type { CSSProperties } from 'react'

type CustomPropertyName = `--${string}`

export function cssVariables(
  values: Partial<Record<CustomPropertyName, string | number>>,
): CSSProperties {
  return values as CSSProperties
}
