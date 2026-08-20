import { expect, test, type Page, type Route } from '@playwright/test'

const activeMember = {
  member: {
    displayName: 'Miriam',
    membershipStatus: 'Active & Current',
  },
}

const resources = {
  resources: [
    {
      id: 'ordination',
      sealLabel: 'Practice & stewardship',
      kicker: 'Sacramental practice',
      title: 'Sacrament Minister Ordination',
      description: [{ text: 'Read the handbook and take the assessment.', emphasis: false }],
      actions: [{ label: 'Read the handbook', href: 'https://example.com/handbook' }],
    },
    {
      id: 'signal',
      sealLabel: 'Community channels',
      kicker: 'Gather & connect',
      title: 'Signal Chats',
      description: [
        { text: 'Connect in the', emphasis: false },
        { text: 'members chat', emphasis: true },
        { text: 'and follow announcements.', emphasis: false },
      ],
      actions: [{ label: 'Join the members chat', href: 'https://example.com/chat' }],
    },
    {
      id: 'vault',
      sealLabel: 'Recorded teachings',
      kicker: 'Learn & revisit',
      title: 'Monthly Teachings Vault',
      description: [{ text: 'Revisit monthly teachings.', emphasis: false }],
      actions: [{ label: 'Open the teachings vault', href: 'https://example.com/vault' }],
    },
  ],
}

interface RuntimeState {
  errors: string[]
  expectedErrors: RegExp[]
}

const runtimeStates = new WeakMap<Page, RuntimeState>()

test.beforeEach(async ({ page }) => {
  const state: RuntimeState = { errors: [], expectedErrors: [] }
  runtimeStates.set(page, state)
  page.on('pageerror', (error) => state.errors.push(`pageerror: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error') state.errors.push(`console: ${message.text()}`)
  })
})

test.afterEach(async ({ page }) => {
  const state = runtimeStates.get(page)
  expect(state, 'browser runtime monitor').toBeDefined()

  for (const expectedError of state?.expectedErrors ?? []) {
    const matchingIndex = state?.errors.findIndex((error) => expectedError.test(error)) ?? -1
    expect(matchingIndex, `expected browser error ${expectedError}`).toBeGreaterThanOrEqual(0)
    state?.errors.splice(matchingIndex, 1)
  }

  expect(state?.errors, 'unexpected browser runtime errors').toEqual([])
})

function expectHttpFailureConsole(page: Page, status: number) {
  runtimeStates.get(page)?.expectedErrors.push(new RegExp(`status of ${status}`))
}

async function fulfillJson(route: Route, status: number, body: unknown) {
  await route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  })
}

async function mockActiveMemberApis(page: Page) {
  await page.route('**/api/members/session', (route) => fulfillJson(route, 200, activeMember))
  await page.route('**/api/members/resources', (route) => fulfillJson(route, 200, resources))
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }))
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1)
}

async function openPrimaryNavigation(page: Page) {
  const navigation = page.getByRole('navigation', { name: 'Primary' })
  const menuToggle = page.getByRole('button', { name: /navigation menu/ })

  if (await menuToggle.isVisible()) {
    if ((await menuToggle.getAttribute('aria-expanded')) !== 'true') {
      await menuToggle.click()
    }
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'true')
  }

  await expect(navigation).toBeVisible()
  return navigation
}

test('the public landing journey remains navigable and responsive', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Entheo Community/)
  await expect(page.getByRole('heading', { level: 1, name: 'The God Within' })).toBeVisible()

  const viewport = page.viewportSize()
  const menuToggle = page.getByRole('button', { name: 'Open navigation menu' })
  if ((viewport?.width ?? 0) <= 1024) {
    await expect(menuToggle).toBeVisible()
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'false')
    await expect(page.locator('.d1-frame')).toBeHidden()
    await expect
      .poll(async () => Math.round((await page.locator('.d1-site-header').boundingBox())?.y ?? -1))
      .toBe(0)

    const headerBounds = await page.locator('.d1-site-header').boundingBox()
    expect(Math.round(headerBounds?.x ?? -1)).toBe(0)
    expect(Math.round(headerBounds?.width ?? -1)).toBe(viewport?.width)
  } else {
    await expect(menuToggle).toBeHidden()
    await expect(page.locator('.d1-frame')).toBeVisible()
  }

  const primaryNavigation = await openPrimaryNavigation(page)
  await expect(primaryNavigation.getByRole('link', { name: 'About', exact: true })).toHaveAttribute(
    'href',
    '#about',
  )
  await expect(primaryNavigation.getByRole('link', { name: 'Services' })).toHaveAttribute(
    'href',
    '/services',
  )
  await expect(primaryNavigation.getByRole('link', { name: 'Events' })).toHaveAttribute(
    'href',
    '/events',
  )
  await expect(primaryNavigation.getByRole('link', { name: 'Ministers' })).toHaveAttribute(
    'href',
    '/sacrament-ministers',
  )
  const donateLink = primaryNavigation.getByRole('link', {
    name: 'Donate to Entheo Community (opens in a new tab)',
  })
  await expect(donateLink).toHaveAttribute(
    'href',
    'https://www.zeffy.com/en-US/organizations/entheo-community',
  )
  await expect(donateLink).toHaveAttribute('target', '_blank')
  await expect(donateLink).toHaveAttribute('rel', /noopener/)

  const heroMembershipAction = page.getByRole('link', {
    name: 'Join the community (opens in a new tab)',
  })
  await expect(heroMembershipAction).toBeVisible()
  await expect(heroMembershipAction).toHaveClass(/d1-membership-action/)
  await expect(heroMembershipAction).toHaveAttribute('target', '_blank')
  await expect(
    page.getByRole('link', {
      name: 'Become a member (opens in a new tab)',
      exact: true,
    }),
  ).toHaveClass(/d1-membership-action/)

  await (await openPrimaryNavigation(page)).getByRole('link', { name: 'About', exact: true }).click()
  await expect(page).toHaveURL(/#about$/)
  await expect(page.getByRole('region', { name: "What We're Creating" })).toBeVisible()
  await expect(page.locator('iframe[title="Introduction to Entheo Community"]')).toHaveAttribute(
    'src',
    /youtube-nocookie\.com\/embed\/DJhDSeH5ahY/,
  )

  await page.locator('#belief').scrollIntoViewIfNeeded()
  await expect(page.getByRole('region', { name: 'Our Beliefs' })).toBeVisible()

  await page.locator('#assembly').scrollIntoViewIfNeeded()
  const assemblyImage = page.getByRole('img', {
    name: 'People gathered in a circle in a sunlit room',
  })
  await expect(assemblyImage).toBeVisible()
  await expect
    .poll(() => assemblyImage.evaluate((image) => (image as HTMLImageElement).naturalWidth))
    .toBe(1120)

  await page.locator('#path').scrollIntoViewIfNeeded()
  const pathRegion = page.getByRole('region', { name: 'Your Path to Realization' })
  await expect(pathRegion).toBeVisible()
  await expect(pathRegion.getByRole('heading', { level: 3 })).toHaveCount(5)

  const joinLink = (await openPrimaryNavigation(page)).getByRole('link', {
    name: 'Join Entheo Community (opens in a new tab)',
  })
  await expect(joinLink).toHaveAttribute('target', '_blank')
  await expect(joinLink).toHaveAttribute('rel', /noopener/)
  await expectNoHorizontalOverflow(page)
})

test('the events hub connects discovery, Weekly Assembly, the calendar, and hosting', async ({ page }) => {
  await page.route('https://airtable.com/embed/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<!doctype html><title>Embedded Airtable boundary</title>',
    }),
  )
  await page.route('https://calendar.google.com/calendar/embed?**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<!doctype html><title>Embedded calendar boundary</title>',
    }),
  )

  await page.goto('/')
  const eventsLink = page
    .getByRole('navigation', { name: 'Public site footer' })
    .getByRole('link', { name: 'Events' })
  await expect(eventsLink).toHaveAttribute('href', '/events')
  await eventsLink.evaluate((link: HTMLAnchorElement) => link.click())

  await expect(page).toHaveURL(/\/events$/)
  await expect(page).toHaveTitle('Events — Entheo Community')
  await expect(page.getByRole('heading', { level: 1, name: 'Upcoming Events' })).toBeVisible()

  const rhythm = page.getByRole('navigation', { name: 'Ways to participate in events' })
  await expect(rhythm.getByRole('link')).toHaveCount(3)
  await expect(rhythm.getByRole('link', { name: /Discover/ })).toHaveAttribute(
    'href',
    '#event-showcase',
  )
  await expect(rhythm.getByRole('link', { name: /Gather/ })).toHaveAttribute(
    'href',
    '#weekly-assembly',
  )
  await expect(rhythm.getByRole('link', { name: /Host/ })).toHaveAttribute(
    'href',
    '#post-an-event',
  )

  const showcase = page.getByRole('region', { name: 'Event Showcase' })
  await expect(showcase).toContainText('state, event type, audience, and more')
  await expect(showcase.getByTitle('Entheo Community Event Showcase')).toHaveAttribute(
    'src',
    /airtable\.com\/embed\/appbVGvgHR52W0qp5\/shr8Q8Iz11qX8ZX4z/,
  )

  const assembly = page.getByRole('region', { name: 'Weekly Assembly' })
  await expect(assembly).toContainText('Every Wednesday')
  await expect(assembly).toContainText('10:30')
  await expect(assembly).toContainText('a.m.–noon ET')
  await expect(
    assembly.getByRole('link', { name: 'Register for Weekly Assembly (opens in a new tab)' }),
  ).toHaveAttribute('href', 'https://www.zeffy.com/en-US/ticketing/weekly-assembly')

  const calendar = page.getByRole('region', { name: 'Public Event Calendar' })
  await expect(calendar.getByTitle('Entheo Community public event calendar')).toHaveAttribute(
    'src',
    /calendar\.google\.com\/calendar\/embed/,
  )
  await expect(calendar).toContainText('Meetup listings may follow more slowly')

  const postEvent = page.getByRole('region', { name: 'Post an Event' })
  await expect(postEvent.getByTitle('Post an Entheo Community event')).toHaveAttribute(
    'src',
    /airtable\.com\/embed\/appbVGvgHR52W0qp5\/pagMi7VayL9nlUsol\/form/,
  )
  await expect(
    postEvent.getByRole('link', { name: 'Open the Post an Event form in a new tab' }),
  ).toHaveAttribute('target', '_blank')

  await rhythm.getByRole('link', { name: /Host/ }).click()
  await expect(page).toHaveURL(/\/events#post-an-event$/)
  const headerBounds = await page.locator('.d1-site-header').boundingBox()
  const postHeadingBounds = await page
    .getByRole('heading', { level: 2, name: 'Post an Event' })
    .boundingBox()
  expect(postHeadingBounds?.y ?? 0).toBeGreaterThanOrEqual(
    (headerBounds?.y ?? 0) + (headerBounds?.height ?? 0),
  )

  await expectNoHorizontalOverflow(page)
})

test('FAQ summaries expand accessibly and every answer uses its short route', async ({ page }) => {
  const faqPages = [
    ['who-were-for', 'Is Entheo Community a Good Fit for Me?'],
    ['why-we-were-founded', 'Why Was Entheo Community Founded?'],
    ['our-beliefs', "What are Entheo Community's Beliefs?"],
    ['protections-safety', 'What Protection does Entheo Community Offer Me?'],
    ['legal-concerns', 'How Does Entheo Community Address Legal Concerns?'],
    ['terminology', 'Why Do You Call Entheo Community a Church?'],
    ['ordinations', "What Are Entheo Community's Ordinations?"],
    ['sourcing', "How is Entheo Community's Sacrament Sourced?"],
  ] as const

  await page.goto('/#faqs')

  const faqSection = page.getByRole('region', { name: 'Frequently Asked Questions' })
  await expect(faqSection).toBeVisible()
  await expect(faqSection.getByRole('button')).toHaveCount(8)

  const protectionQuestion = faqSection.getByRole('button', {
    name: 'How does Entheo Community help protect me?',
  })
  await protectionQuestion.click()
  await expect(protectionQuestion).toHaveAttribute('aria-expanded', 'true')
  const protectionAnswer = faqSection.getByRole('region', {
    name: 'How does Entheo Community help protect me?',
  })
  await expect(protectionAnswer).toContainText('organizational structure')
  await expect(protectionAnswer.getByRole('link', { name: /More info/ })).toHaveAttribute(
    'href',
    '/protections-safety',
  )

  const legalQuestion = faqSection.getByRole('button', {
    name: 'How does Entheo Community address legal concerns?',
  })
  await legalQuestion.click()
  await expect(protectionQuestion).toHaveAttribute('aria-expanded', 'false')
  await expect(legalQuestion).toHaveAttribute('aria-expanded', 'true')

  const legalAnswer = faqSection.getByRole('region', {
    name: 'How does Entheo Community address legal concerns?',
  })
  const legalMoreInfo = legalAnswer.getByRole('link', { name: /More info/ })
  await expect(legalMoreInfo).toHaveAttribute('href', '/legal-concerns')
  await legalMoreInfo.click()
  await expect(page).toHaveURL(/\/legal-concerns$/)
  await expect(
    page.getByRole('heading', { level: 1, name: 'How Does Entheo Community Address Legal Concerns?' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Courts' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'IRS' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'DEA' })).toBeVisible()

  for (const [slug, title] of faqPages) {
    await page.goto(`/${slug}`)
    await expect(page).toHaveURL(new RegExp(`/${slug}$`))
    await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Still curious? Contact us' })).toHaveAttribute(
      'href',
      '/contact',
    )
    await expectNoHorizontalOverflow(page)
  }
})

test('the public contact route exposes every direct channel', async ({ page }) => {
  await page.goto('/')
  await page
    .getByRole('navigation', { name: 'Public site footer' })
    .getByRole('link', { name: 'Contact' })
    .click()

  await expect(page).toHaveURL(/\/contact$/)
  await expect(page).toHaveTitle('Contact — Entheo Community')
  await expect(page.getByRole('heading', { level: 1, name: 'Contact' })).toBeVisible()
  await expect(page.getByText('How to reach us')).toBeVisible()
  await expect(page.getByText('Preferred')).toBeVisible()

  const signalLink = page.getByRole('link', {
    name: 'Open the Signal app website for @entheo.111 (opens in a new tab)',
  })
  await expect(signalLink).toContainText('@entheo.111')
  await expect(signalLink).toHaveAttribute('href', 'https://www.signal.org/')
  await expect(signalLink).toHaveAttribute('target', '_blank')
  await expect(
    page.getByRole('link', { name: 'Email Entheo Community at info@entheo.community' }),
  ).toHaveAttribute('href', 'mailto:info@entheo.community')
  await expect(
    page.getByRole('link', { name: 'Call or text Entheo Community at 404-954-0420' }),
  ).toHaveAttribute('href', 'tel:+14049540420')
  await expect(
    (await openPrimaryNavigation(page)).getByRole('link', { name: 'About' }),
  ).toHaveAttribute('href', '/#about')
  await expectNoHorizontalOverflow(page)
})

test('the public services route preserves every offering and booking boundary', async ({ page }) => {
  await page.goto('/')
  await page
    .getByRole('navigation', { name: 'Public site footer' })
    .getByRole('link', { name: 'Services' })
    .click()

  await expect(page).toHaveURL(/\/services$/)
  await expect(page).toHaveTitle('Services — Entheo Community')
  await expect(page.getByRole('heading', { level: 1, name: 'Services' })).toBeVisible()
  await expect(page.getByText("Entheo Community's founding minister Moshe Jacobson")).toBeVisible()

  const register = page.getByRole('region', { name: "Moshe's Offerings" })
  await expect(register.getByRole('article')).toHaveCount(3)

  const privateCeremonies = register.getByRole('article', { name: 'Private Ceremonies' })
  await expect(privateCeremonies.getByRole('listitem')).toHaveCount(5)
  await expect(privateCeremonies).toContainText('$600 credit-card deposit')

  const microdosing = register.getByRole('article', { name: '6-Week Microdosing Course' })
  await expect(microdosing.getByRole('listitem')).toHaveCount(9)
  await expect(microdosing).toContainText('$650 plus $10 shipping')

  const bookingLinks = [
    page.getByRole('link', { name: 'Book a journey date (opens in a new tab)' }),
    page.getByRole('link', { name: 'Start a microdosing journey (opens in a new tab)' }),
  ]
  for (const bookingLink of bookingLinks) {
    await expect(bookingLink).toHaveAttribute(
      'href',
      'https://www.zeffy.com/en-US/ticketing/book-a-service-with-moshe',
    )
    await expect(bookingLink).toHaveAttribute('target', '_blank')
    await expect(bookingLink).toHaveAttribute('rel', /noopener/)
  }

  const integration = register.getByRole('article', { name: 'Integration Support' })
  await expect(integration).toContainText('$125 per hour or by donation')
  await expect(integration.getByRole('link', { name: 'Ask about integration support' })).toHaveAttribute(
    'href',
    '/contact',
  )

  const otherMinisters = page.getByRole('region', { name: "Other Ministers' Offerings" })
  await expect(otherMinisters).toContainText('Please check back later')
  await expectNoHorizontalOverflow(page)
})

test('the ordination path opens three complete public minister directories', async ({ page }) => {
  await page.goto('/#path')

  const pathRegion = page.getByRole('region', { name: 'Your Path to Realization' })
  const landingLinks = [
    ['Learn about Sacrament Ministers', '/sacrament-ministers'],
    ['Learn about Fellowship Ministers', '/fellowship-ministers'],
    ['Learn about Ceremony Ministers', '/ceremony-ministers'],
  ] as const

  for (const [name, href] of landingLinks) {
    const link = pathRegion.getByRole('link', { name })
    await expect(link).toHaveAttribute('href', href)
    await expect(link).not.toHaveAttribute('target')
  }

  await pathRegion.getByRole('link', { name: 'Learn about Sacrament Ministers' }).click()
  await expect(page).toHaveURL(/\/sacrament-ministers$/)

  const ministerPages = [
    {
      slug: 'sacrament-ministers',
      title: 'Sacrament Ministers',
      level: 'Sacrament',
      directory: 'Sacrament access contact',
      detail: '@entheo.111',
    },
    {
      slug: 'fellowship-ministers',
      title: 'Fellowship Ministers',
      level: 'Fellowship',
      directory: 'Public Fellowship Ministers',
      detail: 'Cannabis / THC, Psilocybin, LSD, DMT, Ketamine',
    },
    {
      slug: 'ceremony-ministers',
      title: 'Ceremony Ministers',
      level: 'Ceremony',
      directory: 'Public Ceremony Ministers',
      detail: 'Cannabis / THC, Psilocybin, DMT, MDMA, MDA',
    },
  ] as const

  for (const ministerPage of ministerPages) {
    await page.goto(`/${ministerPage.slug}`)
    await expect(page).toHaveURL(new RegExp(`/${ministerPage.slug}$`))
    await expect(page).toHaveTitle(`${ministerPage.title} — Entheo Community`)
    await expect(page.getByRole('heading', { level: 1, name: ministerPage.title })).toBeVisible()

    const spine = page.getByRole('navigation', { name: 'Ordination levels' })
    await expect(spine.getByRole('link')).toHaveCount(3)
    await expect(spine.getByRole('link', { name: ministerPage.level })).toHaveAttribute(
      'aria-current',
      'page',
    )

    const directory = page.getByRole('region', { name: ministerPage.directory })
    await expect(directory.getByRole('article')).toHaveCount(1)
    await expect(directory.getByRole('article', { name: 'Moshe Jacobson' })).toContainText(
      ministerPage.detail,
    )
    await expectNoHorizontalOverflow(page)
  }

  await page.goto('/sacrament-ministers')
  await expect(
    page.getByRole('region', { name: 'Sacrament Ministers overview' }),
  ).toContainText('safe sourcing, handling, storage and transport')
  await expect(
    page.getByRole('link', {
      name: 'Open the Minister of Sacrament Ordination Assessment (opens in a new tab)',
    }),
  ).toHaveAttribute('href', 'https://forms.gle/7xQKCGX23QjQE6od7')

  await page.goto('/fellowship-ministers')
  await expect(page.getByText(/still a work in progress/)).toBeVisible()
  const fellowshipListing = page.getByRole('link', {
    name: 'Request a Fellowship Minister public listing (opens in a new tab)',
  })
  await expect(fellowshipListing).toHaveAttribute(
    'href',
    'https://app.onechurchsoftware.com/ec/forms/1',
  )
  await expect(fellowshipListing).toHaveAttribute('rel', /noopener/)

  await page.goto('/ceremony-ministers')
  await expect(page.getByText('Greater Atlanta, GA')).toBeVisible()
  await expect(page.getByText('A Ceremony Minister must also be a Fellowship Minister.')).toBeVisible()
})

test('an active member can move from the hearth to protected resources', async ({ page }) => {
  await mockActiveMemberApis(page)
  await page.goto('/members/dashboard')

  await expect(page.getByRole('heading', { level: 1, name: 'Welcome home, Miriam.' })).toBeVisible()
  await expect(page.getByLabel('Membership status')).toContainText('Active & Current')
  await expect(page.getByRole('link', { name: 'Hearth' })).toHaveAttribute('aria-current', 'page')

  await page.getByRole('link', { name: 'Member resources', exact: true }).click()
  await expect(page).toHaveURL(/\/members\/resources$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Member Resources' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2 })).toHaveCount(3)
  await expect(page.getByRole('link', { name: 'Resources' })).toHaveAttribute('aria-current', 'page')
  await expect(page.getByRole('link', { name: 'Read the handbook' })).toHaveAttribute('target', '_blank')
  await expectNoHorizontalOverflow(page)
})

test('inactive member access fails closed with a reactivation path', async ({ page }) => {
  expectHttpFailureConsole(page, 403)
  await page.route('**/api/members/session', (route) =>
    fulfillJson(route, 403, { error: 'membership_inactive' }),
  )

  await page.goto('/members/dashboard')

  await expect(page).toHaveURL(/\/members\/error\?reason=inactive$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Your membership needs attention.' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Contact Moshe' })).toHaveAttribute(
    'href',
    'mailto:moshe@entheo.community',
  )
  await expectNoHorizontalOverflow(page)
})

test('signed-out resource access preserves the requested return path', async ({ page }) => {
  expectHttpFailureConsole(page, 401)
  await page.route('**/api/members/resources', (route) =>
    fulfillJson(route, 401, { error: 'authentication_required' }),
  )
  await page.route('**/api/auth/google?**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<!doctype html><title>OAuth boundary</title><main>OAuth boundary reached</main>',
    }),
  )

  await page.goto('/members/resources')

  await expect(page).toHaveURL(/\/api\/auth\/google\?returnTo=%2Fmembers%2Fresources$/)
  await expect(page.getByText('OAuth boundary reached')).toBeVisible()
})

test('logout failure is recoverable and a successful retry returns home', async ({ page }) => {
  await mockActiveMemberApis(page)
  expectHttpFailureConsole(page, 503)
  let logoutAttempts = 0
  await page.route('**/api/auth/logout', async (route) => {
    logoutAttempts += 1
    await route.fulfill({ status: logoutAttempts === 1 ? 503 : 204 })
  })
  await page.goto('/members/dashboard')

  await page.getByRole('button', { name: 'Log out' }).click()
  await expect(page.getByRole('status')).toHaveText('We could not log you out. Please try again.')
  await expect(page.getByRole('button', { name: 'Log out' })).toBeEnabled()

  await page.getByRole('button', { name: 'Log out' }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { level: 1, name: 'The God Within' })).toBeVisible()
  expect(logoutAttempts).toBe(2)
})

test('unknown member errors normalize to the generic service-safe page', async ({ page }) => {
  await page.goto('/members/error?reason=unexpected')

  await expect(page).toHaveURL(/\/members\/error\?reason=service$/)
  await expect(page.getByRole('heading', { level: 1, name: /folio is unavailable/i })).toBeVisible()
  await expect(page.getByText(/does not indicate a change to your membership/i)).toBeVisible()
  await expect(page.getByRole('link', { name: 'Try again' })).toHaveAttribute(
    'href',
    '/api/auth/google?returnTo=%2Fmembers%2Fdashboard',
  )
  await expectNoHorizontalOverflow(page)
})
