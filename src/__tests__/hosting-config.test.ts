import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('public hosting policy', () => {
  it('allows only the event, calendar, and welcome-video frame providers', () => {
    const netlifyConfig = readFileSync(new URL('../../netlify.toml', import.meta.url), 'utf8')

    expect(netlifyConfig).toContain(
      "frame-src 'self' https://airtable.com https://calendar.google.com https://www.youtube-nocookie.com",
    )
    expect(netlifyConfig).toContain("frame-ancestors 'none'")
    expect(netlifyConfig).toContain('X-Frame-Options = "DENY"')
  })
})
