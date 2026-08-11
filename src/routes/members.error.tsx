import { createFileRoute } from '@tanstack/react-router'
import { MemberFolio } from '../components/member-folio'
import { MEMBER_LOGIN_URL } from '../lib/member-session'
import { useTitle } from '../lib/hooks'

export type MemberErrorReason = 'inactive' | 'auth' | 'service'

export function normalizeMemberErrorReason(value: unknown): MemberErrorReason {
  return value === 'inactive' || value === 'auth' || value === 'service'
    ? value
    : 'service'
}

export const Route = createFileRoute('/members/error')({
  validateSearch: (search: Record<string, unknown>) => ({
    reason: normalizeMemberErrorReason(search.reason),
  }),
  component: MemberErrorRoute,
})

function MemberErrorRoute() {
  return <MemberErrorPage reason={Route.useSearch().reason} />
}

const ERROR_COPY = {
  inactive: {
    eyebrow: 'Membership Access · Paused',
    title: 'Your membership needs attention.',
    intro: 'Your sign-in was successful, but your membership is not currently active.',
  },
  auth: {
    eyebrow: 'Member Sign-in · Unfinished',
    title: 'We could not complete sign-in.',
    intro: 'No member information was changed. Please try signing in again.',
  },
  service: {
    eyebrow: 'Members’ Folio · Temporarily Closed',
    title: 'The members’ folio is unavailable.',
    intro: 'We could not safely verify access just now. Please try again in a little while.',
  },
} as const

export function MemberErrorPage({ reason }: { reason: MemberErrorReason }) {
  const copy = ERROR_COPY[reason]
  useTitle(`${copy.title} — Entheo Community`)

  return (
    <MemberFolio>
      <p className="member-eyebrow">{copy.eyebrow}</p>
      <h1 className="member-title">{copy.title}</h1>
      <p className="member-intro">{copy.intro}</p>

      {reason === 'inactive' ? (
        <p className="member-detail">
          Please contact Moshe at{' '}
          <a className="member-contact" href="mailto:moshe@entheo.community">
            moshe@entheo.community
          </a>{' '}
          to reactivate your account.
        </p>
      ) : (
        <p className="member-detail">
          This is a technical access error and does not indicate a change to your
          membership.
        </p>
      )}

      <div className="member-actions">
        <a className="member-action" href="/">
          Home
        </a>
        {reason === 'inactive' ? (
          <a className="member-action primary" href="mailto:moshe@entheo.community">
            Contact Moshe
          </a>
        ) : (
          <a className="member-action primary" href={MEMBER_LOGIN_URL}>
            Try again
          </a>
        )}
      </div>
    </MemberFolio>
  )
}
