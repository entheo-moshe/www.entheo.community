// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
  SIGNAL_HANDLE,
  SIGNAL_URL,
} from '../features/contact/contact-content'
import { ContactPage } from '../features/contact/contact-page'
import { DONATION_URL } from '../config/member-navigation'

afterEach(() => cleanup())

describe('ContactPage', () => {
  it('presents every contact method from the source page as an actionable link', () => {
    render(<ContactPage />)

    expect(document.title).toBe('Contact — Entheo Community')
    expect(screen.getByRole('heading', { level: 1, name: 'Contact' })).toBeTruthy()
    expect(screen.getByText('How to reach us')).toBeTruthy()
    expect(screen.getByText('Preferred')).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: 'Signal app' })).toBeTruthy()

    const signalLink = screen.getByRole('link', {
      name: `Open the Signal app website for ${SIGNAL_HANDLE} (opens in a new tab)`,
    })
    expect(signalLink.textContent).toContain(SIGNAL_HANDLE)
    expect(signalLink.getAttribute('href')).toBe(SIGNAL_URL)
    expect(signalLink.getAttribute('target')).toBe('_blank')
    expect(signalLink.getAttribute('rel')).toContain('noopener')

    const emailLink = screen.getByRole('link', {
      name: `Email Entheo Community at ${CONTACT_EMAIL}`,
    })
    expect(emailLink.textContent).toContain(CONTACT_EMAIL)
    expect(emailLink.getAttribute('href')).toBe(`mailto:${CONTACT_EMAIL}`)

    const phoneLink = screen.getByRole('link', {
      name: `Call or text Entheo Community at ${CONTACT_PHONE_DISPLAY}`,
    })
    expect(phoneLink.textContent).toContain(CONTACT_PHONE_DISPLAY)
    expect(phoneLink.getAttribute('href')).toBe(CONTACT_PHONE_HREF)
  })

  it('provides coherent navigation back into the landing journey', () => {
    render(<ContactPage />)

    expect(screen.getByRole('link', { name: 'Skip to contact information' }).getAttribute('href')).toBe(
      '#contact-title',
    )
    expect(screen.getByRole('link', { name: 'Entheo Community home' }).getAttribute('href')).toBe(
      '/',
    )

    const navigation = screen.getByRole('navigation', { name: 'Primary' })
    expect(within(navigation).getByRole('link', { name: 'About' }).getAttribute('href')).toBe(
      '/#about',
    )
    expect(within(navigation).getByRole('link', { name: 'Services' }).getAttribute('href')).toBe(
      '/services',
    )
    expect(within(navigation).getByRole('link', { name: 'Events' }).getAttribute('href')).toBe(
      '/events',
    )
    expect(within(navigation).getByRole('link', { name: 'Ministers' }).getAttribute('href')).toBe(
      '/sacrament-ministers',
    )
    const donateLink = within(navigation).getByRole('link', {
      name: 'Donate to Entheo Community (opens in a new tab)',
    })
    expect(donateLink.getAttribute('href')).toBe(DONATION_URL)
    expect(donateLink.getAttribute('target')).toBe('_blank')
    expect(donateLink.getAttribute('rel')).toContain('noopener')
    const footerNavigation = screen.getByRole('navigation', { name: 'Public site footer' })
    expect(
      within(footerNavigation).getByRole('link', { name: 'Home' }).getAttribute('href'),
    ).toBe('/')
    expect(
      within(footerNavigation).getByRole('link', { name: 'Services' }).getAttribute('href'),
    ).toBe('/services')
  })
})
