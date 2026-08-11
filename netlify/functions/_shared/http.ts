import { isLocalRequest } from './config'

const FLOW_COOKIE = 'entheo_oauth_flow'
const SESSION_COOKIE = 'entheo_member_session'

function cookieName(request: Request, kind: 'flow' | 'session') {
  const baseName = kind === 'flow' ? FLOW_COOKIE : SESSION_COOKIE
  return isLocalRequest(request) ? baseName : `__Host-${baseName}`
}

function baseHeaders() {
  return new Headers({
    'Cache-Control': 'no-store',
    'Content-Security-Policy': "default-src 'none'; base-uri 'none'; frame-ancestors 'none'",
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  })
}

function appendCookies(headers: Headers, cookies: string[]) {
  for (const cookie of cookies) headers.append('Set-Cookie', cookie)
}

export function redirectResponse(location: string, cookies: string[] = [], status = 302) {
  const headers = baseHeaders()
  headers.set('Location', location)
  appendCookies(headers, cookies)
  return new Response(null, { status, headers })
}

export function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  cookies: string[] = [],
) {
  const headers = baseHeaders()
  headers.set('Content-Type', 'application/json; charset=utf-8')
  headers.set('Vary', 'Cookie')
  appendCookies(headers, cookies)
  return Response.json(body, { status, headers })
}

export function emptyResponse(status: number, cookies: string[] = []) {
  const headers = baseHeaders()
  appendCookies(headers, cookies)
  return new Response(null, { status, headers })
}

export function methodNotAllowed(methods: string[]) {
  const response = jsonResponse({ error: 'method_not_allowed' }, 405)
  response.headers.set('Allow', methods.join(', '))
  return response
}

export function getCookie(request: Request, kind: 'flow' | 'session') {
  const name = cookieName(request, kind)
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return null

  for (const part of cookieHeader.split(';')) {
    const separator = part.indexOf('=')
    if (separator < 0) continue
    if (part.slice(0, separator).trim() === name) return part.slice(separator + 1).trim()
  }

  return null
}

function serializeCookie(
  request: Request,
  kind: 'flow' | 'session',
  value: string,
  maxAge: number,
) {
  const attributes = [
    `${cookieName(request, kind)}=${value}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
  ]

  if (!isLocalRequest(request)) attributes.push('Secure')
  return attributes.join('; ')
}

export function setFlowCookie(request: Request, value: string, maxAge: number) {
  return serializeCookie(request, 'flow', value, maxAge)
}

export function setSessionCookie(request: Request, value: string, maxAge: number) {
  return serializeCookie(request, 'session', value, maxAge)
}

export function clearFlowCookie(request: Request) {
  return serializeCookie(request, 'flow', '', 0)
}

export function clearSessionCookie(request: Request) {
  return serializeCookie(request, 'session', '', 0)
}

export function singleQueryParameter(url: URL, name: string) {
  const values = url.searchParams.getAll(name)
  return values.length === 1 ? values[0] : null
}

export function safeServerLog(code: string, status?: number) {
  const suffix = typeof status === 'number' ? ` status=${status}` : ''
  console.error(`[member-auth] ${code}${suffix}`)
}
