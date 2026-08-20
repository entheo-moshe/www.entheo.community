export const MEMBERSHIP_URL = 'https://forms.gle/pKi3Mt8LB2jjfWrLA'
export const DONATION_URL =
  'https://www.zeffy.com/en-US/organizations/entheo-community'
export const MEMBER_DASHBOARD_PATH = '/members/dashboard'
export const MEMBER_RESOURCES_PATH = '/members/resources'

type MemberReturnPath =
  | typeof MEMBER_DASHBOARD_PATH
  | typeof MEMBER_RESOURCES_PATH

function memberLoginUrl(returnTo: MemberReturnPath) {
  return `/api/auth/google?returnTo=${encodeURIComponent(returnTo)}`
}

export const MEMBER_LOGIN_URL = memberLoginUrl(MEMBER_DASHBOARD_PATH)
export const MEMBER_RESOURCES_LOGIN_URL = memberLoginUrl(MEMBER_RESOURCES_PATH)
