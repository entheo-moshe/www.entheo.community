import { createFileRoute } from '@tanstack/react-router'
import { FellowshipMinistersPage } from '../features/ministers/ministers-page'
import '../designs/d1.css'
import '../designs/member-header.css'
import '../designs/ministers.css'

export { FellowshipMinistersPage }

export const Route = createFileRoute('/fellowship-ministers')({
  component: FellowshipMinistersPage,
})
