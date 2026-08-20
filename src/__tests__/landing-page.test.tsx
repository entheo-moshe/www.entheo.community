// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { LandingPage } from '../features/landing/landing-page'
import { DONATION_URL, MEMBER_LOGIN_URL } from '../config/member-navigation'
import { FAQ_ENTRIES } from '../features/faqs/faq-content'

const MEMBERSHIP_URL = 'https://forms.gle/pKi3Mt8LB2jjfWrLA'
const ASSEMBLY_URL = '/events#weekly-assembly'
const PUBLIC_EVENTS_URL = '/events'
const ENTHEISM_URL = 'https://entheism.org/'

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
    expect(screen.getByRole('region', { name: "What We're Creating" })).toBeTruthy()
    expect(screen.getByRole('region', { name: 'Our Beliefs' })).toBeTruthy()
    expect(screen.getByRole('region', { name: 'A Field Guide to Communion' })).toBeTruthy()
    expect(screen.getByRole('region', { name: 'The Weekly Assembly' })).toBeTruthy()
    expect(screen.getByRole('region', { name: 'Your Path to Realization' })).toBeTruthy()
    expect(screen.getByRole('region', { name: 'Frequently Asked Questions' })).toBeTruthy()
    expect(screen.getByRole('contentinfo')).toBeTruthy()

    const skipLink = screen.getByRole('link', { name: 'Skip to content' })
    expect(skipLink.getAttribute('href')).toBe('#hero-title')

    const navigation = screen.getByRole('navigation', { name: 'Primary' })
    expect(navigation.getAttribute('id')).toBe('primary-navigation')
    expect(within(navigation).getByRole('link', { name: 'About' }).getAttribute('href')).toBe(
      '#about',
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

    const actions = navigation.querySelector('.d1-nav-actions')
    expect(actions).not.toBeNull()
    const [loginAction, joinAction] = within(actions as HTMLElement).getAllByRole('link')
    expect(loginAction.textContent).toMatch(/log in/i)
    expect(loginAction.getAttribute('href')).toBe(MEMBER_LOGIN_URL)
    expect(joinAction.getAttribute('aria-label')).toBe(
      'Join Entheo Community (opens in a new tab)',
    )

    const openMenu = screen.getByRole('button', { name: 'Open navigation menu' })
    expect(openMenu.getAttribute('aria-controls')).toBe('primary-navigation')
    expect(openMenu.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(openMenu)

    const closeMenu = screen.getByRole('button', { name: 'Close navigation menu' })
    expect(closeMenu.getAttribute('aria-expanded')).toBe('true')
    expect(navigation.classList.contains('is-open')).toBe(true)

    fireEvent.click(within(navigation).getByRole('link', { name: 'About' }))
    expect(screen.getByRole('button', { name: 'Open navigation menu' }).getAttribute('aria-expanded')).toBe(
      'false',
    )
    expect(navigation.classList.contains('is-open')).toBe(false)
  })

  it('reveals one concise FAQ answer at a time and links longer answers to short slugs', () => {
    render(<LandingPage />)

    const faqRegion = screen.getByRole('region', { name: 'Frequently Asked Questions' })
    const questionButtons = within(faqRegion).getAllByRole('button')
    expect(questionButtons).toHaveLength(FAQ_ENTRIES.length)
    questionButtons.forEach((button) => expect(button.getAttribute('aria-expanded')).toBe('false'))

    const protectionQuestion = within(faqRegion).getByRole('button', {
      name: 'How does Entheo Community help protect me?',
    })
    fireEvent.click(protectionQuestion)

    expect(protectionQuestion.getAttribute('aria-expanded')).toBe('true')
    const protectionAnswer = within(faqRegion).getByRole('region', {
      name: 'How does Entheo Community help protect me?',
    })
    expect(protectionAnswer.textContent).toContain(
      'organizational structure, education, written documentation, privacy',
    )
    expect(within(protectionAnswer).getByRole('link', { name: /More info/ }).getAttribute('href')).toBe(
      '/protections-safety',
    )

    const legalQuestion = within(faqRegion).getByRole('button', {
      name: 'How does Entheo Community address legal concerns?',
    })
    fireEvent.click(legalQuestion)
    expect(protectionQuestion.getAttribute('aria-expanded')).toBe('false')
    expect(legalQuestion.getAttribute('aria-expanded')).toBe('true')
    expect(
      within(faqRegion).queryByRole('region', {
        name: 'How does Entheo Community help protect me?',
      }),
    ).toBeNull()

    fireEvent.click(legalQuestion)
    expect(legalQuestion.getAttribute('aria-expanded')).toBe('false')

    const beliefsQuestion = within(faqRegion).getByRole('button', {
      name: "What are Entheo Community's beliefs?",
    })
    fireEvent.click(beliefsQuestion)
    const beliefsAnswer = within(faqRegion).getByRole('region', {
      name: "What are Entheo Community's beliefs?",
    })
    expect(
      within(beliefsAnswer).getByRole('link', { name: /Read our beliefs/ }).getAttribute('href'),
    ).toBe('#belief')
    expect(within(beliefsAnswer).queryByRole('link', { name: /More info/ })).toBeNull()
  })

  it('brings every About page chapter, destination, and media item into the landing journey', () => {
    const { container } = render(<LandingPage />)
    const pageText = container.textContent?.replace(/\s+/g, ' ') ?? ''

    expect(pageText).toContain(
      'Entheo Community is a nationwide fellowship of individuals for whom entheogens and nature immersion are part of a spiritual way of life.',
    )
    expect(pageText).toContain(
      'Our faith-based nonprofit was established in 2023 as a way to provide greater and safer access to these sacraments within the context of sincere religious exercise, supported by community and comprehensive education.',
    )
    expect(pageText).toContain(
      'We identify as an Entheist community, but we welcome and embrace the gifts of all faiths.',
    )
    expect(pageText).toContain(
      'We are unincorporated and remain independent of state or federal oversight.',
    )
    expect(pageText).toContain(
      'We believe in the existence of a transcendent and divine presence that is the source of, and is manifest in, all that exists in the physical and nonphysical world.',
    )
    expect(pageText).toContain('Spirit unconditionally loves us and guides us')
    expect(pageText).toContain('Divine guidance comes in various ways')
    expect(pageText).toContain(
      'Our sacraments are the practices by which we alter and explore consciousness',
    )
    expect(pageText).toContain(
      'This religious practice of cultivating inner awareness to connect to Source is called Entheism: The belief that God is within.',
    )
    expect(pageText).toContain(
      'Our sacraments and beliefs are only for those who feel aligned with them',
    )
    expect(pageText).toContain(
      'all of our sacraments are essential parts of our ability to connect with our highest divine guidance.',
    )
    expect(pageText).toContain(
      'Non-members are welcome to join any of the Entheo Community Public Events',
    )
    expect(pageText).toContain(
      'Our most fundamental ordination ensures competency with sacraments',
    )
    expect(pageText).toContain(
      'You will build your own fellowship within Entheo Community by hosting regular events',
    )
    expect(pageText).toContain(
      'You will go through a process of training and evaluation so that you can officially facilitate under the Entheo Community umbrella.',
    )
    expect(pageText).toContain(
      'Newcomers as well as members come together every Wednesday 10:30am ET to build meaningful relationships, share experiences, receive support, and get answers to all types of questions.',
    )

    const video = container.querySelector<HTMLIFrameElement>(
      'iframe[title="Introduction to Entheo Community"]',
    )
    expect(video?.getAttribute('src')).toContain(
      'youtube-nocookie.com/embed/DJhDSeH5ahY',
    )
    expect(video?.hasAttribute('allowfullscreen')).toBe(true)

    expect(
      screen
        .getByRole('img', { name: 'People gathered in a circle in a sunlit room' })
        .getAttribute('src'),
    ).toBe('/weekly-assembly.jpg')

    const entheismLinks = screen.getAllByRole('link', {
      name: 'Learn about Entheism (opens in a new tab)',
    })
    expect(entheismLinks).toHaveLength(2)
    entheismLinks.forEach((link) => expect(link.getAttribute('href')).toBe(ENTHEISM_URL))

    expect(
      screen
        .getByRole('link', { name: 'Explore Entheo Community Public Events' })
        .getAttribute('href'),
    ).toBe(PUBLIC_EVENTS_URL)
    const footer = screen.getByRole('contentinfo')
    const footerNavigation = within(footer).getByRole('navigation', {
      name: 'Public site footer',
    })
    const eventsLink = within(footerNavigation).getByRole('link', { name: 'Events' })
    expect(eventsLink.getAttribute('href')).toBe('/events')
    expect(eventsLink.getAttribute('target')).toBeNull()
    const servicesLink = within(footerNavigation).getByRole('link', { name: 'Services' })
    expect(servicesLink.getAttribute('href')).toBe('/services')
    expect(servicesLink.getAttribute('target')).toBeNull()
    const ministersLink = within(footerNavigation).getByRole('link', {
      name: 'Sacrament Ministers',
    })
    expect(ministersLink.getAttribute('href')).toBe('/sacrament-ministers')
    expect(ministersLink.getAttribute('target')).toBeNull()
    const contactLink = within(footerNavigation).getByRole('link', { name: 'Contact' })
    expect(contactLink.getAttribute('href')).toBe('/contact')
    expect(contactLink.getAttribute('target')).toBeNull()
  })

  it('keeps all external calls to action explicit and safe', () => {
    const { container } = render(<LandingPage />)

    const headerJoinLink = screen.getByRole('link', {
      name: 'Join Entheo Community (opens in a new tab)',
    })
    const membershipLinks = [
      screen.getByRole('link', {
        name: 'Join the community (opens in a new tab)',
      }),
      screen.getByRole('link', {
        name: 'Become a member (opens in a new tab)',
      }),
    ]

    for (const link of [headerJoinLink, ...membershipLinks]) {
      expect(link.getAttribute('href')).toBe(MEMBERSHIP_URL)
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toContain('noopener')
    }

    expect(container.querySelectorAll('.d1-membership-action')).toHaveLength(2)
    expect(container.querySelector('.d1-seal')).toBeNull()

    const assemblyLink = screen.getByRole('link', { name: 'Learn more about Weekly Assembly' })
    expect(assemblyLink.getAttribute('href')).toBe(ASSEMBLY_URL)
    expect(assemblyLink.getAttribute('target')).toBeNull()
    expect(assemblyLink.getAttribute('rel')).toBeNull()

    const publicEventsLink = screen.getByRole('link', {
      name: 'Explore Entheo Community Public Events',
    })
    expect(publicEventsLink.getAttribute('target')).toBeNull()
    expect(publicEventsLink.getAttribute('rel')).toBeNull()

    const internalOrdinationLinks = [
      screen.getByRole('link', { name: 'Learn about Sacrament Ministers' }),
      screen.getByRole('link', { name: 'Learn about Fellowship Ministers' }),
      screen.getByRole('link', { name: 'Learn about Ceremony Ministers' }),
    ]
    internalOrdinationLinks.forEach((link) => {
      expect(link.getAttribute('target')).toBeNull()
      expect(link.getAttribute('rel')).toBeNull()
    })
  })

  it('renders unique IDs and reveals content without IntersectionObserver', () => {
    const { container } = render(<LandingPage />)
    const ids = Array.from(container.querySelectorAll<HTMLElement>('[id]')).map((element) => element.id)
    const revealElements = Array.from(container.querySelectorAll<HTMLElement>('[data-reveal]'))

    expect(new Set(ids).size).toBe(ids.length)
    expect(revealElements.length).toBeGreaterThan(0)
    expect(revealElements.every((element) => element.classList.contains('is-seen'))).toBe(true)
  })

  it('starts every hero fern branch on the stem curve', () => {
    const { container } = render(<LandingPage />)
    const pinnae = container.querySelectorAll<SVGPathElement>(
      '.d1-flora.left [data-fern-pinna]',
    )

    expect(container.querySelectorAll('.d1-flora [data-fern-stem]')).toHaveLength(2)
    expect(pinnae).toHaveLength(24)

    pinnae.forEach((pinna, index) => {
      const progress = (index + 1) / (pinnae.length + 1)
      const remaining = 1 - progress
      const d = pinna.getAttribute('d') ?? ''
      const match = /^M ([\d.]+) ([\d.]+) /.exec(d)
      const expectedX =
        61 * remaining ** 3 +
        3 * 55 * remaining ** 2 * progress +
        3 * 65 * remaining * progress ** 2 +
        58 * progress ** 3
      const expectedY =
        252 * remaining ** 3 +
        3 * 200 * remaining ** 2 * progress +
        3 * 122 * remaining * progress ** 2 +
        26 * progress ** 3

      expect(match).not.toBeNull()
      expect(Number(match?.[1])).toBeCloseTo(expectedX, 10)
      expect(Number(match?.[2])).toBeCloseTo(expectedY, 10)
    })
  })

  it('starts every plate one sprig leaf on the stem curve', () => {
    const { container } = render(<LandingPage />)
    const leaves = container.querySelectorAll<SVGGElement>('[data-sprig-leaf]')

    expect(container.querySelectorAll('[data-sprig-stem]')).toHaveLength(1)
    expect(leaves).toHaveLength(9)

    leaves.forEach((leaf, index) => {
      const progress = (index + 1) / (leaves.length + 1)
      const remaining = 1 - progress
      const transform = leaf.getAttribute('transform') ?? ''
      const match = /^translate\(([\d.]+) ([\d.]+)\)/.exec(transform)
      const expectedX =
        70 * remaining ** 3 +
        3 * 84 * remaining ** 2 * progress +
        3 * 56 * remaining * progress ** 2 +
        70 * progress ** 3
      const expectedY =
        192 * remaining ** 3 +
        3 * 150 * remaining ** 2 * progress +
        3 * 96 * remaining * progress ** 2 +
        28 * progress ** 3

      expect(match).not.toBeNull()
      expect(Number(match?.[1])).toBeCloseTo(expectedX, 10)
      expect(Number(match?.[2])).toBeCloseTo(expectedY, 10)
    })
  })
})
