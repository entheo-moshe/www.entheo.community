import { useTitle } from '../../lib/hooks'
import { FrameCorner } from '../landing/landing-illustrations'
import { PublicFooter } from '../public-site/public-footer'
import { PublicHeader } from '../public-site/public-header'
import {
  SERVICE_INTRO,
  SERVICE_NOTICE,
  SERVICE_OFFERINGS,
} from './services-content'

export function ServicesPage() {
  useTitle('Services — Entheo Community')

  return (
    <div className="d1 services-page" id="top">
      <a className="d1-skip" href="#services-title">
        Skip to services
      </a>
      <div className="d1-grain" aria-hidden />
      <div className="d1-frame" aria-hidden>
        <FrameCorner position="tl" />
        <FrameCorner position="tr" />
        <FrameCorner position="bl" />
        <FrameCorner position="br" />
      </div>

      <div className="d1-shell services-shell">
        <PublicHeader />

        <main className="services-main">
          <section className="services-hero" aria-labelledby="services-title">
            <div className="services-hero-heading d1-up">
              <p className="services-eyebrow">Guided Offerings</p>
              <h1 id="services-title" tabIndex={-1}>
                Services
              </h1>
            </div>
            <div className="services-hero-intro d1-up" style={{ animationDelay: '120ms' }}>
              <h2>What We Offer</h2>
              <p>{SERVICE_INTRO}</p>
            </div>
          </section>

          <aside className="services-notice" aria-label="Important service context">
            <span aria-hidden>Before you inquire</span>
            <p>{SERVICE_NOTICE}</p>
          </aside>

          <section className="services-register" aria-labelledby="moshe-offerings-title">
            <header className="services-register-heading">
              <p>Founding Minister · Moshe Jacobson</p>
              <h2 id="moshe-offerings-title">Moshe's Offerings</h2>
            </header>

            <div className="services-offering-list">
              {SERVICE_OFFERINGS.map((offering, index) => (
                <article
                  className="services-offering d1-up"
                  id={offering.id}
                  key={offering.id}
                  aria-labelledby={`${offering.id}-title`}
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <p className="services-offering-category">{offering.category}</p>
                  <div className="services-offering-content">
                    <header>
                      <h3 id={`${offering.id}-title`}>{offering.title}</h3>
                    </header>

                    <div className="services-offering-description">
                      {offering.description.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>

                    {offering.details ? (
                      <section className="services-includes" aria-label={offering.detailsTitle}>
                        <h4>{offering.detailsTitle}</h4>
                        <ul>
                          {offering.details.map((detail) => (
                            <li key={detail}>{detail}</li>
                          ))}
                        </ul>
                      </section>
                    ) : null}

                    <footer className="services-offering-footer">
                      <div className="services-donation">
                        <span>Requested donation</span>
                        <p>{offering.donation}</p>
                      </div>
                      <a
                        className="services-action"
                        href={offering.action.href}
                        target={offering.action.external ? '_blank' : undefined}
                        rel={offering.action.external ? 'noopener noreferrer' : undefined}
                        aria-label={
                          offering.action.external
                            ? `${offering.action.label} (opens in a new tab)`
                            : undefined
                        }
                      >
                        {offering.action.label}{' '}
                        <span aria-hidden>{offering.action.external ? '↗' : '→'}</span>
                      </a>
                    </footer>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="services-other" aria-labelledby="other-offerings-title">
            <div>
              <p className="services-eyebrow">Community Directory</p>
              <h2 id="other-offerings-title">Other Ministers' Offerings</h2>
            </div>
            <div className="services-other-message">
              <p>
                This space will hold a directory of other Entheo Community ministers and the
                services they offer. Please check back later.
              </p>
              <a href="/contact">
                Contact us with a question <span aria-hidden>→</span>
              </a>
            </div>
          </section>
        </main>

        <PublicFooter />
      </div>
    </div>
  )
}
