import { useTitle } from '../../lib/hooks'
import { FrameCorner } from '../landing/landing-illustrations'
import { PublicFooter } from '../public-site/public-footer'
import { PublicHeader } from '../public-site/public-header'
import {
  MINISTER_LEVELS,
  MINISTER_PAGES,
  type MinisterAction,
  type MinisterPageSlug,
} from './ministers-content'

function MinisterActionLink({ action }: { action: MinisterAction }) {
  return (
    <a
      className="minister-action"
      href={action.href}
      target={action.external ? '_blank' : undefined}
      rel={action.external ? 'noopener noreferrer' : undefined}
      aria-label={action.accessibleLabel}
    >
      {action.label} <span aria-hidden>{action.external ? '↗' : '→'}</span>
    </a>
  )
}

export function MinistersPage({ slug }: { slug: MinisterPageSlug }) {
  const content = MINISTER_PAGES[slug]
  useTitle(`${content.title} — Entheo Community`)

  return (
    <div className="d1 minister-page" id="top">
      <a className="d1-skip" href="#minister-title">
        Skip to minister information
      </a>
      <div className="d1-grain" aria-hidden />
      <div className="d1-frame" aria-hidden>
        <FrameCorner position="tl" />
        <FrameCorner position="tr" />
        <FrameCorner position="bl" />
        <FrameCorner position="br" />
      </div>

      <div className="d1-shell minister-shell">
        <PublicHeader />

        <main className="minister-main">
          <section className="minister-hero" aria-labelledby="minister-title">
            <div className="minister-hero-copy d1-up">
              <p className="minister-eyebrow">Ordination {content.ordinal} of III</p>
              <h1 id="minister-title" tabIndex={-1}>
                {content.title}
              </h1>
              <p className="minister-thesis">{content.thesis}</p>
            </div>

            <nav className="minister-spine d1-up" aria-label="Ordination levels">
              <ol>
                {MINISTER_LEVELS.map((level) => {
                  const active = level.slug === slug

                  return (
                    <li key={level.slug}>
                      <a
                        className={active ? 'is-active' : undefined}
                        href={`/${level.slug}`}
                        aria-current={active ? 'page' : undefined}
                      >
                        <span aria-hidden>{level.ordinal}</span>
                        <strong>{level.shortTitle}</strong>
                      </a>
                    </li>
                  )
                })}
              </ol>
            </nav>
          </section>

          <section className="minister-briefing" aria-label={`${content.title} overview`}>
            <div className="minister-overview d1-up" style={{ animationDelay: '90ms' }}>
              <p className="minister-section-label">Role &amp; authority</p>
              <div>
                {content.overview.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="minister-pathway d1-up" style={{ animationDelay: '160ms' }}>
              <header>
                <p className="minister-section-label">The path forward</p>
                <h2>{content.pathwayTitle}</h2>
              </header>
              <ol>
                {content.pathway.map((step) => (
                  <li key={step.number}>
                    <span className="minister-path-number" aria-hidden>
                      {step.number}
                    </span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                      {step.action ? <MinisterActionLink action={step.action} /> : null}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="minister-directory" aria-labelledby="minister-directory-title">
            <header className="minister-directory-heading">
              <div>
                <p className="minister-section-label">Community register</p>
                <h2 id="minister-directory-title">{content.directoryTitle}</h2>
              </div>
              <p>{content.directoryIntro}</p>
            </header>

            <div className="minister-records">
              {content.records.map((record) => (
                <article
                  className="minister-record d1-up"
                  aria-labelledby={`${record.id}-name`}
                  key={record.id}
                >
                  <header>
                    <p>{record.role}</p>
                    <h3 id={`${record.id}-name`}>{record.name}</h3>
                  </header>
                  <dl>
                    {record.fields.map((field) => (
                      <div key={field.label}>
                        <dt>{field.label}</dt>
                        <dd>{field.value}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              ))}
            </div>

            <footer className="minister-directory-footer">
              <p>{content.directoryNote}</p>
              {content.directoryAction ? (
                <MinisterActionLink action={content.directoryAction} />
              ) : (
                <a className="minister-action" href="/contact">
                  Contact Entheo Community <span aria-hidden>→</span>
                </a>
              )}
            </footer>
          </section>
        </main>

        <PublicFooter />
      </div>
    </div>
  )
}

export function SacramentMinistersPage() {
  return <MinistersPage slug="sacrament-ministers" />
}

export function FellowshipMinistersPage() {
  return <MinistersPage slug="fellowship-ministers" />
}

export function CeremonyMinistersPage() {
  return <MinistersPage slug="ceremony-ministers" />
}
