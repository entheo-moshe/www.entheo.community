// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import {
  APPLE_CALENDAR_URL,
  EVENT_CALENDAR_EMBED_URL,
  EVENT_SHOWCASE_EMBED_URL,
  EVENT_SHOWCASE_URL,
  GOOGLE_CALENDAR_URL,
  MAILING_LIST_URL,
  MEETUP_URL,
  POST_EVENT_EMBED_URL,
  POST_EVENT_URL,
  WEEKLY_ASSEMBLY_PARAGRAPHS,
  WEEKLY_ASSEMBLY_REGISTRATION_URL,
} from '../features/events/events-content'
import { EventsPage } from '../features/events/events-page'

afterEach(() => cleanup())

describe('EventsPage', () => {
  it('creates one clear path from discovering an event to hosting one', () => {
    const { container } = render(<EventsPage />)

    expect(document.title).toBe('Events — Entheo Community')
    expect(screen.getByRole('heading', { level: 1, name: 'Upcoming Events' })).toBeTruthy()

    const rhythm = screen.getByRole('navigation', { name: 'Ways to participate in events' })
    const paths = within(rhythm).getAllByRole('link')
    expect(paths).toHaveLength(3)
    expect(paths.map((path) => path.getAttribute('href'))).toEqual([
      '#event-showcase',
      '#weekly-assembly',
      '#post-an-event',
    ])
    expect(rhythm.textContent).toContain('Discover')
    expect(rhythm.textContent).toContain('Gather')
    expect(rhythm.textContent).toContain('Host')

    expect(screen.getByRole('link', { name: 'Skip to events' }).getAttribute('href')).toBe(
      '#events-title',
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

  it('embeds the complete live Event Showcase with safe full-view fallbacks', () => {
    render(<EventsPage />)

    const showcase = screen.getByRole('region', { name: 'Event Showcase' })
    expect(showcase.textContent).toContain('full list of Entheo Community events')
    expect(showcase.textContent).toContain('state, event type, audience, and more')

    const frame = within(showcase).getByTitle('Entheo Community Event Showcase')
    expect(frame.getAttribute('src')).toBe(EVENT_SHOWCASE_EMBED_URL)
    expect(frame.getAttribute('loading')).toBe('lazy')
    expect(frame.getAttribute('referrerpolicy')).toBe('strict-origin-when-cross-origin')

    const fullView = within(showcase).getByRole('link', {
      name: 'Open Event Showcase in a new tab',
    })
    expect(fullView.getAttribute('href')).toBe(EVENT_SHOWCASE_URL)
    expect(fullView.getAttribute('target')).toBe('_blank')
    expect(fullView.getAttribute('rel')).toContain('noopener')

    const fallback = within(showcase).getByRole('link', {
      name: 'Open Event Showcase (opens in a new tab)',
    })
    expect(fallback.getAttribute('href')).toBe(EVENT_SHOWCASE_URL)
    expect(fallback.getAttribute('rel')).toContain('noreferrer')
  })

  it('preserves the full Weekly Assembly invitation and registration boundary', () => {
    render(<EventsPage />)

    const assembly = screen.getByRole('region', { name: 'Weekly Assembly' })
    expect(assembly.textContent).toContain('Every Wednesday · online')
    expect(assembly.textContent).toContain('10:30')
    expect(assembly.textContent).toContain('a.m.–noon ET')
    WEEKLY_ASSEMBLY_PARAGRAPHS.forEach((paragraph) => {
      expect(assembly.textContent).toContain(paragraph)
    })
    expect(assembly.textContent).toContain('We hope you’ll join us!')
    expect(
      within(assembly)
        .getByRole('img', { name: 'People gathered in a circle in a sunlit room' })
        .getAttribute('src'),
    ).toBe('/weekly-assembly.jpg')

    const register = within(assembly).getByRole('link', {
      name: 'Register for Weekly Assembly (opens in a new tab)',
    })
    expect(register.getAttribute('href')).toBe(WEEKLY_ASSEMBLY_REGISTRATION_URL)
    expect(register.getAttribute('target')).toBe('_blank')
    expect(register.getAttribute('rel')).toContain('noopener')
  })

  it('includes the public calendar, follow-up channels, and embedded event form', () => {
    render(<EventsPage />)

    const calendar = screen.getByRole('region', { name: 'Public Event Calendar' })
    expect(
      within(calendar).getByTitle('Entheo Community public event calendar').getAttribute('src'),
    ).toBe(EVENT_CALENDAR_EMBED_URL)

    const calendarLinks = [
      ['Add events to Google Calendar (opens in a new tab)', GOOGLE_CALENDAR_URL],
      ['Subscribe in Apple Calendar (opens in a new tab)', APPLE_CALENDAR_URL],
      ['View Entheo Community on Meetup (opens in a new tab)', MEETUP_URL],
      [
        'Open the Entheo Community mailing list signup (opens in a new tab)',
        MAILING_LIST_URL,
      ],
    ] as const
    calendarLinks.forEach(([name, href]) => {
      const link = within(calendar).getByRole('link', { name })
      expect(link.getAttribute('href')).toBe(href)
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toContain('noopener')
    })
    expect(calendar.textContent).toContain('Event Showcase is updated first')
    expect(calendar.textContent).toContain('Meetup listings may follow more slowly')

    const postEvent = screen.getByRole('region', { name: 'Post an Event' })
    expect(within(postEvent).getByTitle('Post an Entheo Community event').getAttribute('src')).toBe(
      POST_EVENT_EMBED_URL,
    )
    expect(within(postEvent).getByTitle('Post an Entheo Community event').getAttribute('loading')).toBe(
      'lazy',
    )

    const fullForm = within(postEvent).getByRole('link', {
      name: 'Open the Post an Event form in a new tab',
    })
    expect(fullForm.getAttribute('href')).toBe(POST_EVENT_URL)
    expect(fullForm.getAttribute('rel')).toContain('noopener')

    const fallback = within(postEvent).getByRole('link', {
      name: 'Open the Post an Event form (opens in a new tab)',
    })
    expect(fallback.getAttribute('href')).toBe(POST_EVENT_URL)
    expect(fallback.getAttribute('target')).toBe('_blank')
  })
})
