import { createFileRoute } from '@tanstack/react-router'
import { loadMemberResources } from '../features/members/member-access'
import { MemberResources } from '../features/members/member-resources-page'

export { MemberResources }
export const resolveMemberResourcesAccess = loadMemberResources

export const Route = createFileRoute('/members/resources')({
  loader: () => loadMemberResources(fetch),
  component: MemberResourcesRoute,
})

function MemberResourcesRoute() {
  return <MemberResources resources={Route.useLoaderData()} />
}
