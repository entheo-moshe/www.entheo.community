// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { LandingPage } from '../routes/1'

const MEMBERSHIP_URL = 'https://forms.gle/pKi3Mt8LB2jjfWrLA'
const ASSEMBLY_URL = 'https://www.entheo.community/events/weekly-assembly'

afterEach(() => cleanup())

describe('LandingPage', () => {
  it('provides a clear semantic journey through the page', () => {
    const { container } = render(<LandingPage />)

    expect(document.title).toBe('Entheo Community — Welcome Home')
    expect(container.querySelectorAll('.d1-site-header')).toHaveLength(1)
    expect(container.querySelectorAll('.d1-site-header > .d1-brand')).toHaveLength(1)
    expect(container.querySelectorAll('.d1-site-header > nav[aria-label="Primary"]')).toHaveLength(1)
    expect(container.querySelectorAll('main')).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: 'The God Within' })).toBeTruthy()
    expect(screen.getByRole('region', { name: 'What we believe' })).toBeTruthy()
    expect(screen.getByRole('region', { name: 'A Field Guide to Communion' })).toBeTruthy()
    expect(screen.getByRole('region', { name: 'The Weekly Assembly' })).toBeTruthy()
    expect(screen.getByRole('region', { name: 'The Path of Ministry' })).toBeTruthy()
    expect(screen.getByRole('contentinfo')).toBeTruthy()

    const skipLink = screen.getByRole('link', { name: 'Skip to content' })
    expect(skipLink.getAttribute('href')).toBe('#hero-title')

    const navigation = screen.getByRole('navigation', { name: 'Primary' })
    expect(within(navigation).getByRole('link', { name: 'Belief' }).getAttribute('href')).toBe(
      '#belief',
    )
    expect(within(navigation).getByRole('link', { name: 'Practice' }).getAttribute('href')).toBe(
      '#sacraments',
    )
    expect(within(navigation).getByRole('link', { name: 'Gather' }).getAttribute('href')).toBe(
      '#assembly',
    )
    expect(within(navigation).getByRole('link', { name: 'Path' }).getAttribute('href')).toBe(
      '#path',
    )
  })

  it('keeps all external calls to action explicit and safe', () => {
    render(<LandingPage />)

    const joinLinks = screen.getAllByRole('link', {
      name: 'Join Entheo Community (opens in a new tab)',
    })
    expect(joinLinks).toHaveLength(2)

    for (const link of joinLinks) {
      expect(link.getAttribute('href')).toBe(MEMBERSHIP_URL)
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toContain('noopener')
    }

    const beginLink = screen.getByRole('link', {
      name: 'Begin joining Entheo Community (opens in a new tab)',
    })
    expect(beginLink.getAttribute('href')).toBe(MEMBERSHIP_URL)
    expect(beginLink.getAttribute('rel')).toContain('noopener')

    const assemblyLink = screen.getByRole('link', {
      name: 'Reserve your seat at the Weekly Assembly (opens in a new tab)',
    })
    expect(assemblyLink.getAttribute('href')).toBe(ASSEMBLY_URL)
    expect(assemblyLink.getAttribute('rel')).toContain('noopener')
  })

  it('renders unique IDs and reveals content without IntersectionObserver', () => {
    const { container } = render(<LandingPage />)
    const ids = Array.from(container.querySelectorAll<HTMLElement>('[id]')).map((element) => element.id)
    const revealElements = Array.from(container.querySelectorAll<HTMLElement>('[data-reveal]'))

    expect(new Set(ids).size).toBe(ids.length)
    expect(revealElements.length).toBeGreaterThan(0)
    expect(revealElements.every((element) => element.classList.contains('is-seen'))).toBe(true)
  })
})
