import { createFileRoute } from '@tanstack/react-router'
import { SacramentMinistersPage } from '../features/ministers/ministers-page'
import '../designs/d1.css'
import '../designs/member-header.css'
import '../designs/ministers.css'

export { SacramentMinistersPage }

export const Route = createFileRoute('/sacrament-ministers')({
  component: SacramentMinistersPage,
})
