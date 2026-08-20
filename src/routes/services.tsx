import { createFileRoute } from '@tanstack/react-router'
import { ServicesPage } from '../features/services/services-page'
import '../designs/d1.css'
import '../designs/member-header.css'
import '../designs/services.css'

export { ServicesPage }

export const Route = createFileRoute('/services')({ component: ServicesPage })
