import { createFileRoute } from '@tanstack/react-router'
import { FaqDetailPage } from '../features/faqs/faq-detail-page'
import '../designs/d1.css'
import '../designs/member-header.css'
import '../designs/faqs.css'

export function FaqRoutePage() {
  const { faqSlug } = Route.useParams()
  return <FaqDetailPage slug={faqSlug} />
}

export const Route = createFileRoute('/$faqSlug')({ component: FaqRoutePage })
