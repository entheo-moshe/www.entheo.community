// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import {
  SERVICE_BOOKING_URL,
  SERVICE_INTRO,
  SERVICE_NOTICE,
  SERVICE_OFFERINGS,
} from '../features/services/services-content'
import { ServicesPage } from '../features/services/services-page'

afterEach(() => cleanup())

describe('ServicesPage', () => {
  it('presents the complete service register from the source page', () => {
    render(<ServicesPage />)

    expect(document.title).toBe('Services — Entheo Community')
    expect(screen.getByRole('heading', { level: 1, name: 'Services' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: 'What We Offer' })).toBeTruthy()
    expect(screen.getByText(SERVICE_INTRO)).toBeTruthy()
    expect(screen.getByText(SERVICE_NOTICE)).toBeTruthy()

    const register = screen.getByRole('region', { name: "Moshe's Offerings" })
    const articles = within(register).getAllByRole('article')
    expect(articles).toHaveLength(SERVICE_OFFERINGS.length)

    expect(within(register).getByRole('article', { name: 'Private Ceremonies' })).toBeTruthy()
    expect(
      within(register).getByRole('article', { name: '6-Week Microdosing Course' }),
    ).toBeTruthy()
    expect(within(register).getByRole('article', { name: 'Integration Support' })).toBeTruthy()
  })

  it('keeps each inclusion, schedule, sacrament option, and requested donation visible', () => {
    render(<ServicesPage />)

    const privateCeremonies = screen.getByRole('article', { name: 'Private Ceremonies' })
    expect(within(privateCeremonies).getAllByRole('listitem')).toHaveLength(5)
    expect(privateCeremonies.textContent).toContain('approximately 9:00am to 3:00pm')
    expect(privateCeremonies.textContent).toContain('every Wednesday at 10:30am ET')
    expect(privateCeremonies.textContent).toContain('$600 credit-card deposit')
    expect(privateCeremonies.textContent).toContain('A couples journey adds $300')

    const microdosing = screen.getByRole('article', { name: '6-Week Microdosing Course' })
    expect(within(microdosing).getAllByRole('listitem')).toHaveLength(9)
    expect(microdosing.textContent).toContain('Nonviolent Communication')
    expect(microdosing.textContent).toContain('powdered mushrooms, mushroom chocolates')
    expect(microdosing.textContent).toContain('$650 plus $10 shipping')
    expect(microdosing.textContent).toContain('second supply may be added for $150')

    const integration = screen.getByRole('article', { name: 'Integration Support' })
    expect(within(integration).queryByRole('list')).toBeNull()
    expect(integration.textContent).toContain('private integration sessions by phone or video')
    expect(integration.textContent).toContain('$125 per hour or by donation')
  })

  it('uses safe booking links and an internal contact path for integration support', () => {
    render(<ServicesPage />)

    const bookingLinks = [
      screen.getByRole('link', { name: 'Book a journey date (opens in a new tab)' }),
      screen.getByRole('link', { name: 'Start a microdosing journey (opens in a new tab)' }),
    ]
    bookingLinks.forEach((link) => {
      expect(link.getAttribute('href')).toBe(SERVICE_BOOKING_URL)
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toContain('noopener')
    })

    const integrationLink = screen.getByRole('link', { name: 'Ask about integration support' })
    expect(integrationLink.getAttribute('href')).toBe('/contact')
    expect(integrationLink.getAttribute('target')).toBeNull()
    expect(integrationLink.getAttribute('rel')).toBeNull()
  })

  it('provides a useful future-minister state and coherent public navigation', () => {
    const { container } = render(<ServicesPage />)

    const otherOfferings = screen.getByRole('region', { name: "Other Ministers' Offerings" })
    expect(otherOfferings.textContent).toContain('Please check back later')
    expect(
      within(otherOfferings).getByRole('link', { name: /Contact us with a question/ }).getAttribute(
        'href',
      ),
    ).toBe('/contact')

    expect(screen.getByRole('link', { name: 'Skip to services' }).getAttribute('href')).toBe(
      '#services-title',
    )
    expect(screen.getByRole('link', { name: 'Entheo Community home' }).getAttribute('href')).toBe(
      '/',
    )
    expect(
      within(screen.getByRole('navigation', { name: 'Public site footer' }))
        .getByRole('link', { name: 'Home' })
        .getAttribute('href'),
    ).toBe('/')

    const ids = Array.from(container.querySelectorAll<HTMLElement>('[id]')).map(
      (element) => element.id,
    )
    expect(new Set(ids).size).toBe(ids.length)
  })
})
