import type { ReactNode } from 'react'
import { MEMBER_DASHBOARD_PATH } from '../../config/member-navigation'
import { useTitle } from '../../lib/hooks'
import { MemberFolio } from './member-folio'
import type { MemberResource, MemberResourceId } from './member-resources'

function ResourceSeal({ kind }: { kind: MemberResourceId }) {
  if (kind === 'ordination') {
    return (
      <svg viewBox="0 0 180 180" aria-hidden="true">
        <circle cx="90" cy="90" r="72" />
        <circle cx="90" cy="90" r="64" />
        <path d="M49 60c18-5 31-1 41 9 10-10 23-14 41-9v61c-17-4-30-1-41 8-11-9-24-12-41-8Z" />
        <path d="M90 69v60M59 76c11-1 19 2 25 8M121 76c-11-1-19 2-25 8" />
        <path d="M90 106c-10-8-13-18-8-30 10 5 15 14 8 30Z" />
      </svg>
    )
  }

  if (kind === 'signal') {
    return (
      <svg viewBox="0 0 180 180" aria-hidden="true">
        <circle cx="90" cy="90" r="72" />
        <circle cx="90" cy="90" r="64" />
        <circle cx="90" cy="90" r="12" />
        <path d="M65 112a36 36 0 0 1 0-44M115 68a36 36 0 0 1 0 44" />
        <path d="M48 128a55 55 0 0 1 0-76M132 52a55 55 0 0 1 0 76" />
        <path d="M90 78v24M78 90h24" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 180 180" aria-hidden="true">
      <circle cx="90" cy="90" r="72" />
      <circle cx="90" cy="90" r="64" />
      <path d="M52 65h76v62H52ZM61 76h58M61 116h58" />
      <path d="M68 76v40M84 76v40M104 76v40" />
      <path d="m84 90 16 9-16 9Z" />
      <path d="M67 53c8-9 19-12 31-8-9 1-15 7-17 15" />
    </svg>
  )
}

interface ResourceActionProps {
  href: string
  children: ReactNode
}

function ResourceAction({ href, children }: ResourceActionProps) {
  return (
    <a className="resource-action" href={href} target="_blank" rel="noreferrer">
      <span>{children}</span>
      <span className="resource-action-mark" aria-hidden="true">
        ↗
      </span>
    </a>
  )
}

function ResourceDescription({ resource }: { resource: MemberResource }) {
  return (
    <p>
      {resource.description.map((part, index) => {
        const copy = `${index === 0 ? '' : ' '}${part.text}`
        return part.emphasis ? (
          <strong key={`${resource.id}-${index}`}>{copy}</strong>
        ) : (
          <span key={`${resource.id}-${index}`}>{copy}</span>
        )
      })}
    </p>
  )
}

export function MemberResources({ resources }: { resources: MemberResource[] }) {
  useTitle('Member resources — Entheo Community')

  return (
    <MemberFolio section="resources" variant="archive">
      <header className="resource-heading">
        <p className="member-eyebrow">Members&rsquo; Folio · Resource Index</p>
        <h1 className="member-title">Member Resources</h1>
        <p className="member-intro">
          Guides, gathering places, and teachings reserved for the fellowship.
        </p>
      </header>

      <div className="resource-ledger">
        {resources.map((resource) => {
          const headingId = `resource-${resource.id}-title`

          return (
            <section
              className="resource-entry"
              aria-labelledby={headingId}
              key={resource.id}
            >
              <div className="resource-seal">
                <ResourceSeal kind={resource.id} />
                <span>{resource.sealLabel}</span>
              </div>
              <div className="resource-copy">
                <p className="resource-kicker">{resource.kicker}</p>
                <h2 id={headingId}>{resource.title}</h2>
                <ResourceDescription resource={resource} />
                <div className="resource-actions">
                  {resource.actions.map((action) => (
                    <ResourceAction href={action.href} key={action.href}>
                      {action.label}
                    </ResourceAction>
                  ))}
                </div>
              </div>
            </section>
          )
        })}
      </div>

      <a className="resource-return" href={MEMBER_DASHBOARD_PATH}>
        <span aria-hidden="true">←</span> Return to the members&rsquo; hearth
      </a>
    </MemberFolio>
  )
}
