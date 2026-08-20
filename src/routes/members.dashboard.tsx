import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { MemberFolio } from '../components/member-folio'
import {
  MEMBER_LOGIN_URL,
  MEMBER_RESOURCES_PATH,
} from '../config/member-navigation'
import { requireActiveMemberData } from '../features/members/member-access'
import {
  getMemberSession,
  logoutMember,
  type DashboardMember,
} from '../features/members/member-session'
import type { FetchImplementation } from '../features/members/member-client'
import { useTitle } from '../lib/hooks'

export async function resolveDashboardAccess(
  fetchImplementation: FetchImplementation,
) {
  return requireActiveMemberData(
    await getMemberSession(fetchImplementation),
    MEMBER_LOGIN_URL,
  )
}

export const Route = createFileRoute('/members/dashboard')({
  loader: () => resolveDashboardAccess(fetch),
  component: MemberDashboardRoute,
})

function MemberDashboardRoute() {
  return <MemberDashboard member={Route.useLoaderData()} />
}

export function MemberDashboard({ member }: { member: DashboardMember }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState(false)
  useTitle(`Welcome home, ${member.displayName} — Entheo Community`)

  async function handleLogout() {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    setLogoutError(false)

    if (await logoutMember()) {
      window.location.assign('/')
      return
    }

    setLogoutError(true)
    setIsLoggingOut(false)
  }

  return (
    <MemberFolio section="dashboard">
      <p className="member-eyebrow">Members&rsquo; Hearth · Entry I</p>
      <h1 className="member-title">Welcome home, {member.displayName}.</h1>
      <p className="member-intro">Your place in the fellowship is open.</p>

      <div className="member-status" aria-label="Membership status">
        <p className="member-status-label">Membership</p>
        <p className="member-status-value">{member.membershipStatus}</p>
      </div>

      <p className="member-detail">
        This private folio confirms your current access. No broader member profile is
        displayed here.
      </p>

      <div className="member-actions">
        <a className="member-action" href="/">
          Home
        </a>
        <a className="member-action primary" href={MEMBER_RESOURCES_PATH}>
          Member resources
        </a>
        <button
          className="member-action"
          type="button"
          disabled={isLoggingOut}
          onClick={handleLogout}
        >
          {isLoggingOut ? 'Logging out…' : 'Log out'}
        </button>
      </div>
      {logoutError ? (
        <p className="member-error-note" role="status" aria-live="polite">
          We could not log you out. Please try again.
        </p>
      ) : null}
    </MemberFolio>
  )
}
