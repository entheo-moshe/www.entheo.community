// @vitest-environment jsdom

import type { ReactNode } from 'react'
import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { DONATION_URL } from '../config/member-navigation'
import { ContactPage } from '../features/contact/contact-page'
import { EventsPage } from '../features/events/events-page'
import { FaqDetailPage } from '../features/faqs/faq-detail-page'
import { LandingPage } from '../features/landing/landing-page'
import {
  CeremonyMinistersPage,
  FellowshipMinistersPage,
  SacramentMinistersPage,
} from '../features/ministers/ministers-page'
import { PublicFooter } from '../features/public-site/public-footer'
import { ServicesPage } from '../features/services/services-page'

const EXPECTED_FOOTER_DESTINATIONS = [
  '/',
  '/#about',
  '/services',
  '/events',
  '/sacrament-ministers',
  '/fellowship-ministers',
  '/ceremony-ministers',
  '/#faqs',
  '/contact',
  DONATION_URL,
] as const

const PUBLIC_PAGE_FACTORIES: ReadonlyArray<[string, () => ReactNode]> = [
  ['landing', () => <LandingPage />],
  ['contact', () => <ContactPage />],
  ['services', () => <ServicesPage />],
  ['events', () => <EventsPage />],
  ['FAQ detail', () => <FaqDetailPage slug="legal-concerns" />],
  ['Sacrament Ministers', () => <SacramentMinistersPage />],
  ['Fellowship Ministers', () => <FellowshipMinistersPage />],
  ['Ceremony Ministers', () => <CeremonyMinistersPage />],
]

afterEach(() => cleanup())

describe('PublicFooter', () => {
  it('provides a complete, grouped index of the public website', () => {
    render(<PublicFooter />)

    const footer = screen.getByRole('contentinfo')
    const navigation = within(footer).getByRole('navigation', { name: 'Public site footer' })
    expect(within(navigation).getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual([
      'Explore',
      'Ministers',
      'Connect',
    ])
    expect(within(navigation).getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual(
      EXPECTED_FOOTER_DESTINATIONS,
    )

    expect(
      within(footer).getByRole('link', { name: 'Entheo Community home from footer' }).getAttribute(
        'href',
      ),
    ).toBe('/')
    expect(within(footer).getByRole('link', { name: 'info@entheo.community' }).getAttribute('href')).toBe(
      'mailto:info@entheo.community',
    )
    expect(within(footer).getByRole('link', { name: /Back to top/ }).getAttribute('href')).toBe(
      '#top',
    )
  })

  it('keeps the donation boundary explicit and safe', () => {
    render(<PublicFooter />)

    const donate = screen.getByRole('link', {
      name: 'Donate to Entheo Community (opens in a new tab)',
    })
    expect(donate.getAttribute('href')).toBe(DONATION_URL)
    expect(donate.getAttribute('target')).toBe('_blank')
    expect(donate.getAttribute('rel')).toContain('noopener')
    expect(donate.getAttribute('rel')).toContain('noreferrer')
  })

  it.each(PUBLIC_PAGE_FACTORIES)('stays complete and identical on the %s page', (_name, createPage) => {
    const { container } = render(createPage())

    expect(container.querySelectorAll('.public-footer')).toHaveLength(1)
    const navigation = screen.getByRole('navigation', { name: 'Public site footer' })
    expect(within(navigation).getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual(
      EXPECTED_FOOTER_DESTINATIONS,
    )
  })
})
