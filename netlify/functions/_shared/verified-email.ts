export function normalizeVerifiedEmail(value: string) {
  const email = value.trim().toLowerCase()
  const validEmail = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9.-]+$/i

  if (
    email.length > 254 ||
    !validEmail.test(email) ||
    email.includes('..') ||
    email.includes('"') ||
    email.includes('\\')
  ) {
    throw new Error('Invalid verified email')
  }

  return email
}
