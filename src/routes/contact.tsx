import { createFileRoute } from '@tanstack/react-router'
import { ContactPage } from '../features/contact/contact-page'
import '../designs/d1.css'
import '../designs/member-header.css'
import '../designs/contact.css'

export { ContactPage }

export const Route = createFileRoute('/contact')({ component: ContactPage })
