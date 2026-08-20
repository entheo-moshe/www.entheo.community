import { createFileRoute } from '@tanstack/react-router'
import {
  MemberErrorPage,
  normalizeMemberErrorReason,
} from '../features/members/member-error-page'

export { MemberErrorPage, normalizeMemberErrorReason }
export type { MemberErrorReason } from '../features/members/member-error-page'

export const Route = createFileRoute('/members/error')({
  validateSearch: (search: Record<string, unknown>) => ({
    reason: normalizeMemberErrorReason(search.reason),
  }),
  component: MemberErrorRoute,
})

function MemberErrorRoute() {
  return <MemberErrorPage reason={Route.useSearch().reason} />
}
