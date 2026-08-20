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

test('the public landing journey remains navigable and responsive', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Entheo Community/)
  await expect(page.getByRole('heading', { level: 1, name: 'The God Within' })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible()

  await page.getByRole('link', { name: 'Belief' }).click()
  await expect(page).toHaveURL(/#belief$/)
  await expect(page.getByRole('region', { name: 'What we believe' })).toBeVisible()

  const joinLink = page.getByRole('navigation', { name: 'Primary' }).getByRole('link', {
    name: 'Join Entheo Community (opens in a new tab)',
  })
  await expect(joinLink).toHaveAttribute('target', '_blank')
  await expect(joinLink).toHaveAttribute('rel', /noopener/)
  await expectNoHorizontalOverflow(page)
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
