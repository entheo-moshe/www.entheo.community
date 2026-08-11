export const PRODUCTION_ORIGIN = 'https://www.entheo.community'
export const LOCAL_AUTH_ORIGIN = 'http://localhost:8888'
export const MEMBERSHIP_URL = 'https://forms.gle/pKi3Mt8LB2jjfWrLA'
export const DASHBOARD_PATH = '/members/dashboard'
export const ERROR_PATH = '/members/error'

export const AIRTABLE_BASE_ID = 'appbVGvgHR52W0qp5'
export const AIRTABLE_MEMBERS_TABLE_ID = 'tblKagCu0hrIBhvUd'

export const DEVELOPMENT_SECRET_SENTINEL =
  'derive-from-google-client-secret-for-local-dev-only'

export class ConfigurationError extends Error {
  readonly code = 'configuration_error'
}

function requiredEnvironment(name: string) {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new ConfigurationError(`Missing required environment variable: ${name}`)
  }

  return value
}

export function isLocalRequest(request: Request) {
  const hostname = new URL(request.url).hostname
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]'
}

export function getAuthOrigin(request: Request) {
  return isLocalRequest(request) ? LOCAL_AUTH_ORIGIN : PRODUCTION_ORIGIN
}

export function getGoogleConfiguration(request: Request) {
  return {
    clientId: requiredEnvironment('GOOGLE_OAUTH_CLIENT_ID'),
    clientSecret: requiredEnvironment('GOOGLE_OAUTH_CLIENT_SECRET'),
    redirectUri: `${getAuthOrigin(request)}/api/auth/google/callback`,
  }
}

export function getAirtableToken() {
  return requiredEnvironment('AIRTABLE_API_TOKEN')
}

export function getSessionSecret(request: Request, googleClientSecret?: string) {
  const configured = requiredEnvironment('AUTH_SESSION_SECRET')

  if (configured === DEVELOPMENT_SECRET_SENTINEL) {
    if (!isLocalRequest(request)) {
      throw new ConfigurationError('The development session secret cannot be used in production')
    }

    const sourceSecret = googleClientSecret ?? requiredEnvironment('GOOGLE_OAUTH_CLIENT_SECRET')
    return `entheo-local-session:${sourceSecret}`
  }

  if (configured.length < 32) {
    throw new ConfigurationError('AUTH_SESSION_SECRET must contain at least 32 characters')
  }

  return configured
}

export function allowReturnTo(value: string | null): typeof DASHBOARD_PATH {
  return value === DASHBOARD_PATH ? value : DASHBOARD_PATH
}

export function getCanonicalAuthRedirect(request: Request) {
  if (isLocalRequest(request)) return null

  const url = new URL(request.url)
  if (url.origin === PRODUCTION_ORIGIN) return null

  return new URL(`${url.pathname}${url.search}`, PRODUCTION_ORIGIN).toString()
}
