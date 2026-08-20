import { useTitle } from '../../lib/hooks'
import { FrameCorner } from '../landing/landing-illustrations'
import { PublicFooter } from '../public-site/public-footer'
import { PublicHeader } from '../public-site/public-header'
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
  SIGNAL_HANDLE,
  SIGNAL_URL,
} from './contact-content'

export function ContactPage() {
  useTitle('Contact — Entheo Community')

  return (
    <div className="d1 contact-page" id="top">
      <a className="d1-skip" href="#contact-title">
        Skip to contact information
      </a>
      <div className="d1-grain" aria-hidden />
      <div className="d1-frame" aria-hidden>
        <FrameCorner position="tl" />
        <FrameCorner position="tr" />
        <FrameCorner position="bl" />
        <FrameCorner position="br" />
      </div>

      <div className="d1-shell contact-shell">
        <PublicHeader />

        <main className="contact-main">
          <section className="contact-hero" aria-labelledby="contact-title">
            <div className="contact-heading d1-up" style={{ animationDelay: '120ms' }}>
              <p className="contact-eyebrow">Entheo Community</p>
              <h1 className="contact-title" id="contact-title" tabIndex={-1}>
                Contact
              </h1>
            </div>
            <div className="contact-intro d1-up" style={{ animationDelay: '240ms' }}>
              <p>How to reach us</p>
            </div>
          </section>

          <address className="contact-ledger" aria-label="How to reach Entheo Community">
            <ul>
              <li className="contact-channel contact-channel-preferred d1-up">
                <div className="contact-channel-heading">
                  <span className="contact-preferred">Preferred</span>
                  <h2>Signal app</h2>
                </div>
                <a
                  className="contact-channel-link"
                  href={SIGNAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open the Signal app website for ${SIGNAL_HANDLE} (opens in a new tab)`}
                >
                  <span className="contact-channel-value">{SIGNAL_HANDLE}</span>
                  <span className="contact-channel-action">
                    Open Signal <span aria-hidden>↗</span>
                  </span>
                </a>
              </li>

              <li
                className="contact-channel d1-up"
                style={{ animationDelay: '100ms' }}
              >
                <div className="contact-channel-heading">
                  <h2>Email</h2>
                </div>
                <a
                  className="contact-channel-link"
                  href={`mailto:${CONTACT_EMAIL}`}
                  aria-label={`Email Entheo Community at ${CONTACT_EMAIL}`}
                >
                  <span className="contact-channel-value">{CONTACT_EMAIL}</span>
                  <span className="contact-channel-action">
                    Write an email <span aria-hidden>→</span>
                  </span>
                </a>
              </li>

              <li
                className="contact-channel d1-up"
                style={{ animationDelay: '200ms' }}
              >
                <div className="contact-channel-heading">
                  <h2>Phone or text</h2>
                </div>
                <a
                  className="contact-channel-link"
                  href={CONTACT_PHONE_HREF}
                  aria-label={`Call or text Entheo Community at ${CONTACT_PHONE_DISPLAY}`}
                >
                  <span className="contact-channel-value">{CONTACT_PHONE_DISPLAY}</span>
                  <span className="contact-channel-action">
                    Call or text <span aria-hidden>→</span>
                  </span>
                </a>
              </li>
            </ul>
          </address>
        </main>

        <PublicFooter />
      </div>
    </div>
  )
}
