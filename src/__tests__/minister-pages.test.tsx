// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import {
  MEMBERSHIP_FORM_URL,
  MINISTER_CONTACT_FORM_URL,
  MINISTER_LEVELS,
  MINISTER_PAGES,
  SACRAMENT_ASSESSMENT_URL,
} from '../features/ministers/ministers-content'
import {
  CeremonyMinistersPage,
  FellowshipMinistersPage,
  SacramentMinistersPage,
} from '../features/ministers/ministers-page'

afterEach(() => cleanup())

describe('minister directory pages', () => {
  it.each([
    ['sacrament-ministers', SacramentMinistersPage],
    ['fellowship-ministers', FellowshipMinistersPage],
    ['ceremony-ministers', CeremonyMinistersPage],
  ] as const)('renders the shared ordination spine for %s', (slug, Page) => {
    render(<Page />)

    const content = MINISTER_PAGES[slug]
    expect(document.title).toBe(`${content.title} — Entheo Community`)
    expect(screen.getByRole('heading', { level: 1, name: content.title })).toBeTruthy()
    expect(screen.getByText(content.thesis)).toBeTruthy()

    const spine = screen.getByRole('navigation', { name: 'Ordination levels' })
    const levelLinks = within(spine).getAllByRole('link')
    expect(levelLinks).toHaveLength(MINISTER_LEVELS.length)
    expect(within(spine).getByRole('link', { name: content.shortTitle }).getAttribute('aria-current')).toBe(
      'page',
    )
  })

  it('preserves the Sacrament Minister training, authority, and two-step entry path', () => {
    render(<SacramentMinistersPage />)

    const overview = screen.getByRole('region', { name: 'Sacrament Ministers overview' })
    expect(overview.textContent).toContain('safe sourcing, handling, storage and transport')
    expect(overview.textContent).toContain('emergency preparedness; ethics; and informed consent')
    expect(overview.textContent).toContain('receive sacraments from and share sacraments with')

    const memberLink = screen.getByRole('link', {
      name: 'Become an Entheo Community member (opens in a new tab)',
    })
    expect(memberLink.getAttribute('href')).toBe(MEMBERSHIP_FORM_URL)
    expect(memberLink.getAttribute('target')).toBe('_blank')
    expect(memberLink.getAttribute('rel')).toContain('noopener')

    const assessmentLink = screen.getByRole('link', {
      name: 'Open the Minister of Sacrament Ordination Assessment (opens in a new tab)',
    })
    expect(assessmentLink.getAttribute('href')).toBe(SACRAMENT_ASSESSMENT_URL)
    expect(assessmentLink.getAttribute('target')).toBe('_blank')

    const directory = screen.getByRole('region', { name: 'Sacrament access contact' })
    const moshe = within(directory).getByRole('article', { name: 'Moshe Jacobson' })
    expect(moshe.textContent).toContain('Official supplies contact')
    expect(moshe.textContent).toContain('@entheo.111')
    const contactLink = within(directory).getByRole('link', { name: /Contact Entheo Community/ })
    expect(contactLink.getAttribute('href')).toBe('/contact')
    expect(contactLink.getAttribute('target')).toBeNull()
  })

  it('preserves the Fellowship Minister role, work-in-progress assessment, and public listing', () => {
    render(<FellowshipMinistersPage />)

    const overview = screen.getByRole('region', { name: 'Fellowship Ministers overview' })
    expect(overview.textContent).toContain('official Entheo Community events')
    expect(overview.textContent).toContain('weekly or monthly events')
    expect(overview.textContent).toContain('still a work in progress')

    const prerequisite = within(overview).getByRole('link', {
      name: 'Learn about Sacrament Ministers',
    })
    expect(prerequisite.getAttribute('href')).toBe('/sacrament-ministers')
    expect(prerequisite.getAttribute('target')).toBeNull()
    expect(prerequisite.getAttribute('rel')).toBeNull()

    const directory = screen.getByRole('region', { name: 'Public Fellowship Ministers' })
    const moshe = within(directory).getByRole('article', { name: 'Moshe Jacobson' })
    expect(moshe.textContent).toContain('National, GA')
    expect(moshe.textContent).toContain('@entheo.111')
    expect(moshe.textContent).toContain('Cannabis / THC, Psilocybin, LSD, DMT, Ketamine')
    expect(moshe.textContent).toContain('2C-B, Amanita Muscaria')

    const listingLink = within(directory).getByRole('link', {
      name: 'Request a Fellowship Minister public listing (opens in a new tab)',
    })
    expect(listingLink.getAttribute('href')).toBe(MINISTER_CONTACT_FORM_URL)
    expect(listingLink.getAttribute('target')).toBe('_blank')
    expect(listingLink.getAttribute('rel')).toContain('noopener')
  })

  it('preserves the Ceremony Minister prerequisite, authority, and facilitation listing', () => {
    render(<CeremonyMinistersPage />)

    const overview = screen.getByRole('region', { name: 'Ceremony Ministers overview' })
    expect(screen.getByText(/facilitated private and group ceremonies/)).toBeTruthy()
    expect(overview.textContent).toContain('must also be a Fellowship Minister')

    const prerequisite = within(overview).getByRole('link', {
      name: 'Learn about Fellowship Ministers',
    })
    expect(prerequisite.getAttribute('href')).toBe('/fellowship-ministers')
    expect(prerequisite.getAttribute('target')).toBeNull()

    const ordinationLink = within(overview).getByRole('link', {
      name: 'Ask about Ceremony Minister ordination (opens in a new tab)',
    })
    expect(ordinationLink.getAttribute('href')).toBe(MINISTER_CONTACT_FORM_URL)
    expect(ordinationLink.getAttribute('target')).toBe('_blank')

    const directory = screen.getByRole('region', { name: 'Public Ceremony Ministers' })
    const moshe = within(directory).getByRole('article', { name: 'Moshe Jacobson' })
    expect(moshe.textContent).toContain('Greater Atlanta, GA')
    expect(moshe.textContent).toContain('Cannabis / THC, Psilocybin, DMT, MDMA, MDA')
    expect(
      within(directory).getByRole('link', {
        name: 'Request a Ceremony Minister public listing (opens in a new tab)',
      }),
    ).toBeTruthy()
  })

  it.each([
    SacramentMinistersPage,
    FellowshipMinistersPage,
    CeremonyMinistersPage,
  ])('keeps page IDs unique and public navigation coherent', (Page) => {
    const { container } = render(<Page />)
    const ids = Array.from(container.querySelectorAll<HTMLElement>('[id]')).map(
      (element) => element.id,
    )

    expect(new Set(ids).size).toBe(ids.length)
    expect(screen.getByRole('link', { name: 'Skip to minister information' }).getAttribute('href')).toBe(
      '#minister-title',
    )
    expect(screen.getByRole('link', { name: 'Entheo Community home' }).getAttribute('href')).toBe('/')
    expect(screen.getByRole('navigation', { name: 'Public site footer' })).toBeTruthy()
  })
})
