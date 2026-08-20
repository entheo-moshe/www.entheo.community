import { createFileRoute } from '@tanstack/react-router'
import { LandingPage } from '../features/landing/landing-page'
import '../designs/d1.css'
import '../designs/member-header.css'

export { LandingPage }

export const Route = createFileRoute('/')({ component: LandingPage })
