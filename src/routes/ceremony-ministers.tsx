import { createFileRoute } from '@tanstack/react-router'
import { CeremonyMinistersPage } from '../features/ministers/ministers-page'
import '../designs/d1.css'
import '../designs/member-header.css'
import '../designs/ministers.css'

export { CeremonyMinistersPage }

export const Route = createFileRoute('/ceremony-ministers')({
  component: CeremonyMinistersPage,
})
