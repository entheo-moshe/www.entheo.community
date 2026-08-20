import { createFileRoute } from '@tanstack/react-router'
import { loadMemberDashboard } from '../features/members/member-access'
import { MemberDashboard } from '../features/members/member-dashboard-page'

export { MemberDashboard }
export const resolveDashboardAccess = loadMemberDashboard

export const Route = createFileRoute('/members/dashboard')({
  loader: () => loadMemberDashboard(fetch),
  component: MemberDashboardRoute,
})

function MemberDashboardRoute() {
  return <MemberDashboard member={Route.useLoaderData()} />
}
