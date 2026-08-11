import type { ReactNode } from 'react'
import { MEMBER_RESOURCES_PATH } from '../lib/member-session'
import '../designs/members.css'

type MemberFolioSection = 'dashboard' | 'resources'

interface MemberFolioProps {
  children: ReactNode
  section?: MemberFolioSection
  variant?: 'leaf' | 'archive'
}

function MemberEmblem() {
  return (
    <svg className="member-emblem" viewBox="0 0 108 108" aria-hidden="true">
      <circle cx="54" cy="54" r="45" />
      <circle cx="54" cy="54" r="37" />
      <path d="M54 76 C45 65 43 51 51 34 C61 43 66 57 54 76Z" />
      <path d="M54 75 C57 60 57 48 52 35" />
      <path d="M47 51 C38 49 33 43 31 34 C41 34 49 39 52 47" />
      <path d="M58 55 C67 51 75 44 78 34 C67 34 59 40 56 49" />
      <path d="M24 54H14M94 54H84M54 24V14M54 94V84" />
    </svg>
  )
}

export function MemberFolio({
  children,
  section,
  variant = 'leaf',
}: MemberFolioProps) {
  return (
    <div className="member-page">
      <a className="member-skip" href="#member-main">
        Skip to member content
      </a>
      <div className="member-grain" aria-hidden="true" />
      <div className="member-folio">
        <header className="member-masthead">
          <a className="member-brand" href="/" aria-label="Entheo Community home">
            Entheo Community
          </a>
          <div className="member-masthead-tools">
            <p className="member-masthead-mark">
              <span aria-hidden="true">Private</span>
              <span>Members&rsquo; Folio</span>
            </p>
            {section ? (
              <nav className="member-nav" aria-label="Member area">
                <a
                  href="/members/dashboard"
                  aria-current={section === 'dashboard' ? 'page' : undefined}
                >
                  Hearth
                </a>
                <a
                  href={MEMBER_RESOURCES_PATH}
                  aria-current={section === 'resources' ? 'page' : undefined}
                >
                  Resources
                </a>
              </nav>
            ) : null}
          </div>
        </header>

        <main className="member-main" id="member-main" tabIndex={-1}>
          <article
            className={`member-leaf${variant === 'archive' ? ' member-leaf--archive' : ''}`}
          >
            <MemberEmblem />
            {children}
          </article>
        </main>

        <footer className="member-colophon">
          <span>Entheo Community</span>
          <span aria-hidden="true">✦</span>
          <span>Welcome Home</span>
        </footer>
      </div>
    </div>
  )
}
