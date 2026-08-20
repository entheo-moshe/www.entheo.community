import { createFileRoute } from '@tanstack/react-router'
import { EventsPage } from '../features/events/events-page'
import '../designs/d1.css'
import '../designs/member-header.css'
import '../designs/events.css'

export { EventsPage }

export const Route = createFileRoute('/events')({ component: EventsPage })
