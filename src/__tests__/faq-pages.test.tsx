// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { FaqDetailPage } from '../features/faqs/faq-detail-page'
import { FAQ_ENTRIES, FAQ_SLUGS } from '../features/faqs/faq-content'

afterEach(() => cleanup())

describe('FAQ content and detail pages', () => {
  it('keeps the live question order and uses the requested root-level slugs', () => {
    expect(FAQ_ENTRIES.map((faq) => faq.slug)).toEqual(FAQ_SLUGS)
    expect(FAQ_ENTRIES.map((faq) => faq.question)).toEqual([
      'Is Entheo Community a good fit for me?',
      'Why was Entheo Community founded?',
      "What are Entheo Community's beliefs?",
      'How does Entheo Community help protect me?',
      'How does Entheo Community address legal concerns?',
      'Why do you call Entheo Community a Church or Ministry?',
      "What are Entheo Community's minister ordinations?",
      'How is sacrament sourced in Entheo Community?',
    ])

    const moreInfoEntries = FAQ_ENTRIES.filter((faq) => faq.landingAction.label === 'More info')
    expect(moreInfoEntries).toHaveLength(7)
    moreInfoEntries.forEach((faq) => {
      expect(faq.landingAction.href).toBe(`/${faq.slug}`)
      expect(faq.landingAction.href).not.toContain('/about/faqs')
    })

    expect(FAQ_ENTRIES.find((faq) => faq.slug === 'our-beliefs')?.landingAction).toEqual({
      label: 'Read our beliefs',
      href: '#belief',
    })
  })

  it('renders every full answer with safe links, navigation, and source-derived sections', () => {
    for (const faq of FAQ_ENTRIES) {
      const view = render(<FaqDetailPage slug={faq.slug} />)

      expect(document.title).toBe(`${faq.title} — Entheo Community`)
      expect(screen.getByRole('heading', { level: 1, name: faq.title })).toBeTruthy()
      expect(screen.getByText(faq.summary)).toBeTruthy()
      expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeTruthy()
      expect(screen.getAllByRole('link', { name: /Return to all questions/ })[0].getAttribute('href')).toBe(
        '/#faqs',
      )
      expect(screen.getByRole('link', { name: 'Still curious? Contact us' }).getAttribute('href')).toBe(
        '/contact',
      )
      expect(
        within(screen.getByRole('navigation', { name: 'Public site footer' }))
          .getByRole('link', { name: 'Services' })
          .getAttribute('href'),
      ).toBe('/services')
      expect(
        within(screen.getByRole('navigation', { name: 'Public site footer' }))
          .getByRole('link', { name: 'FAQs' })
          .getAttribute('href'),
      ).toBe('/#faqs')
      expect(view.container.querySelectorAll('.faq-document-section')).toHaveLength(
        faq.sections.length,
      )

      const externalLinks = Array.from(view.container.querySelectorAll<HTMLAnchorElement>('a')).filter(
        (link) => link.href.startsWith('http') && !link.href.startsWith('http://localhost'),
      )
      expect(externalLinks.length).toBeGreaterThan(0)
      externalLinks.forEach((link) => {
        expect(link.getAttribute('target')).toBe('_blank')
        expect(link.getAttribute('rel')).toContain('noopener')
      })

      view.unmount()
    }
  })

  it('preserves the substantive content of every source answer', () => {
    const expectations = [
      {
        slug: 'who-were-for',
        headings: ['1. The Practitioner', '5. The Advocate', '10. The Builder'],
        text: 'If one or more of these descriptions feels familiar',
      },
      {
        slug: 'why-we-were-founded',
        headings: ['From practice to church', 'A nationwide vision'],
        text: 'On October 3, 2023',
      },
      {
        slug: 'our-beliefs',
        headings: [],
        text: 'compatible with spiritual seekers from many faith traditions',
      },
      {
        slug: 'protections-safety',
        headings: ['Organizational structure', 'Education', 'Documentation', 'Privacy', 'Numbers', 'Confidence'],
        text: 'Minister of Sacrament training',
      },
      {
        slug: 'legal-concerns',
        headings: ['Courts', 'IRS', 'DEA', 'Conclusion'],
        text: 'membership cannot prevent arrest',
      },
      {
        slug: 'terminology',
        headings: [],
        text: 'Words carry power. Use them wisely.',
      },
      {
        slug: 'ordinations',
        headings: [
          'Introduction',
          'Minister of Sacrament',
          'Minister of Fellowship',
          'Minister of Ceremony',
          'How to get started',
        ],
        text: 'shadowing and co-facilitating six journeys',
      },
      {
        slug: 'sourcing',
        headings: ['Responsibility for testing'],
        text: 'not a guarantee of that provider or their sacrament',
      },
    ] as const

    expectations.forEach(({ slug, headings, text }) => {
      const view = render(<FaqDetailPage slug={slug} />)
      headings.forEach((heading) => {
        expect(screen.getByRole('heading', { level: 2, name: heading })).toBeTruthy()
      })
      expect(view.container.textContent).toContain(text)
      view.unmount()
    })
  })

  it('renders a useful fallback for an unknown short slug', () => {
    render(<FaqDetailPage slug="missing-question" />)

    expect(document.title).toBe('FAQ Not Found — Entheo Community')
    expect(screen.getByRole('heading', { name: 'We could not find that answer.' })).toBeTruthy()
    expect(screen.getByRole('link', { name: /Return to all questions/ }).getAttribute('href')).toBe(
      '/#faqs',
    )
    expect(screen.getByRole('link', { name: 'Skip to page message' }).getAttribute('href')).toBe(
      '#faq-not-found-title',
    )
  })

  it('uses ordered and unordered source lists where the information calls for them', () => {
    const ordinations = render(<FaqDetailPage slug="ordinations" />)
    const ordinationsMain = within(ordinations.container).getByRole('main')
    expect(within(ordinationsMain).getByRole('list').tagName).toBe('OL')
    expect(within(ordinationsMain).getAllByRole('listitem')).toHaveLength(3)
    ordinations.unmount()

    render(<FaqDetailPage slug="protections-safety" />)
    const education = screen.getByRole('heading', { name: 'Education' }).closest('section')
    expect(education).not.toBeNull()
    expect(within(education as HTMLElement).getByRole('list').tagName).toBe('UL')
    expect(within(education as HTMLElement).getAllByRole('listitem')).toHaveLength(6)
  })
})
