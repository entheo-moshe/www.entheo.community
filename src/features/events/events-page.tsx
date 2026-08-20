import { useTitle } from '../../lib/hooks'
import { FrameCorner } from '../landing/landing-illustrations'
import { ASSEMBLY_IMAGE_URL } from '../landing/landing-content'
import { PublicFooter } from '../public-site/public-footer'
import { PublicHeader } from '../public-site/public-header'
import {
  APPLE_CALENDAR_URL,
  EVENT_CALENDAR_EMBED_URL,
  EVENT_SHOWCASE_EMBED_URL,
  EVENT_SHOWCASE_URL,
  GOOGLE_CALENDAR_URL,
  MAILING_LIST_URL,
  MEETUP_URL,
  POST_EVENT_EMBED_URL,
  POST_EVENT_URL,
  WEEKLY_ASSEMBLY_PARAGRAPHS,
  WEEKLY_ASSEMBLY_REGISTRATION_URL,
} from './events-content'

const EVENT_PATHS = [
  {
    number: '01',
    verb: 'Discover',
    detail: 'Browse every listing',
    href: '#event-showcase',
  },
  {
    number: '02',
    verb: 'Gather',
    detail: 'Join Weekly Assembly',
    href: '#weekly-assembly',
  },
  {
    number: '03',
    verb: 'Host',
    detail: 'Post your event',
    href: '#post-an-event',
  },
] as const

function ExternalArrow() {
  return <span aria-hidden>↗</span>
}

function EmbedFallback({ href, label }: { href: string; label: string }) {
  return (
    <p className="events-embed-fallback">
      If the live view does not appear,{' '}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label} (opens in a new tab)`}
      >
        {label.toLowerCase()} <ExternalArrow />
      </a>
      .
    </p>
  )
}

export function EventsPage() {
  useTitle('Events — Entheo Community')

  return (
    <div className="d1 events-page" id="top">
      <a className="d1-skip" href="#events-title">
        Skip to events
      </a>
      <div className="d1-grain" aria-hidden />
      <div className="d1-frame" aria-hidden>
        <FrameCorner position="tl" />
        <FrameCorner position="tr" />
        <FrameCorner position="bl" />
        <FrameCorner position="br" />
      </div>

      <div className="d1-shell events-shell">
        <PublicHeader />

        <main className="events-main">
          <section className="events-hero" aria-labelledby="events-title">
            <div className="events-hero-heading d1-up">
              <p className="events-eyebrow">The Community Calendar</p>
              <h1 id="events-title" tabIndex={-1}>
                Upcoming <span>Events</span>
              </h1>
            </div>
            <div className="events-hero-copy d1-up" style={{ animationDelay: '120ms' }}>
              <p>
                Find public gatherings, join our weekly online circle, or share an event
                of your own. The live Event Showcase is the quickest way to see what is
                happening throughout the community.
              </p>
            </div>
          </section>

          <nav className="events-rhythm" aria-label="Ways to participate in events">
            {EVENT_PATHS.map((path, index) => (
              <a href={path.href} key={path.number} className="d1-up" style={{ animationDelay: `${180 + index * 80}ms` }}>
                <span className="events-rhythm-number">{path.number}</span>
                <span className="events-rhythm-copy">
                  <strong>{path.verb}</strong>
                  <small>{path.detail}</small>
                </span>
                <span className="events-rhythm-arrow" aria-hidden>↓</span>
              </a>
            ))}
          </nav>

          <section
            className="events-chapter events-showcase"
            id="event-showcase"
            aria-labelledby="event-showcase-title"
          >
            <header className="events-section-heading">
              <div>
                <p className="events-eyebrow">01 · Discover</p>
                <h2 id="event-showcase-title">Event Showcase</h2>
              </div>
              <p>
                This is the full list of Entheo Community events. Filter it by state,
                event type, audience, and more to find the gathering that fits you.
              </p>
            </header>

            <div className="events-live-window">
              <div className="events-window-bar">
                <span><i aria-hidden /> Live community listings</span>
                <a
                  href={EVENT_SHOWCASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open Event Showcase in a new tab"
                >
                  Open full view <ExternalArrow />
                </a>
              </div>
              <iframe
                className="events-showcase-frame"
                src={EVENT_SHOWCASE_EMBED_URL}
                title="Entheo Community Event Showcase"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <EmbedFallback href={EVENT_SHOWCASE_URL} label="Open Event Showcase" />
          </section>

          <section
            className="events-chapter events-assembly"
            id="weekly-assembly"
            aria-labelledby="weekly-assembly-title"
          >
            <div className="events-assembly-visual">
              <figure>
                <img
                  src={ASSEMBLY_IMAGE_URL}
                  alt="People gathered in a circle in a sunlit room"
                  loading="lazy"
                />
                <figcaption>Every Wednesday · online</figcaption>
              </figure>
              <p className="events-assembly-time">
                <span>10:30</span>
                <small>a.m.–noon ET</small>
              </p>
            </div>

            <div className="events-assembly-copy">
              <p className="events-eyebrow">02 · Gather</p>
              <h2 id="weekly-assembly-title">Weekly Assembly</h2>
              {WEEKLY_ASSEMBLY_PARAGRAPHS.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p className="events-assembly-closing">We hope you’ll join us!</p>
              <a
                className="events-primary-action"
                href={WEEKLY_ASSEMBLY_REGISTRATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Register for Weekly Assembly (opens in a new tab)"
              >
                Register for Weekly Assembly <ExternalArrow />
              </a>
            </div>
          </section>

          <section
            className="events-chapter events-calendar"
            id="event-calendar"
            aria-labelledby="event-calendar-title"
          >
            <header className="events-section-heading events-calendar-heading">
              <div>
                <p className="events-eyebrow">Plan ahead</p>
                <h2 id="event-calendar-title">Public Event Calendar</h2>
              </div>
              <p>
                Scan the agenda here, or subscribe from Google or Apple Calendar so new
                dates stay close at hand.
              </p>
            </header>

            <div className="events-calendar-layout">
              <div className="events-live-window events-calendar-window">
                <div className="events-window-bar">
                  <span><i aria-hidden /> Public calendar</span>
                  <span>Eastern Time</span>
                </div>
                <iframe
                  className="events-calendar-frame"
                  src={EVENT_CALENDAR_EMBED_URL}
                  title="Entheo Community public event calendar"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>

              <aside className="events-calendar-notes" aria-label="More ways to follow events">
                <div>
                  <span className="events-note-number">A</span>
                  <h3>Keep the calendar</h3>
                  <p>Subscribe once and upcoming community dates will appear in your calendar.</p>
                  <p className="events-note-links">
                    <a
                      href={GOOGLE_CALENDAR_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Add events to Google Calendar (opens in a new tab)"
                    >
                      Google Calendar <ExternalArrow />
                    </a>
                    <a
                      href={APPLE_CALENDAR_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Subscribe in Apple Calendar (opens in a new tab)"
                    >
                      Apple Calendar <ExternalArrow />
                    </a>
                  </p>
                </div>

                <div>
                  <span className="events-note-number">B</span>
                  <h3>Follow announcements</h3>
                  <p>
                    The Event Showcase is updated first. Meetup listings may follow more
                    slowly, and event news also appears through the community mailing list.
                  </p>
                  <p className="events-note-links">
                    <a
                      href={MEETUP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View Entheo Community on Meetup (opens in a new tab)"
                    >
                      Meetup <ExternalArrow />
                    </a>
                    <a
                      href={MAILING_LIST_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open the Entheo Community mailing list signup (opens in a new tab)"
                    >
                      Mailing list <ExternalArrow />
                    </a>
                  </p>
                </div>
              </aside>
            </div>
          </section>

          <section
            className="events-chapter events-post"
            id="post-an-event"
            aria-labelledby="post-an-event-title"
          >
            <header className="events-section-heading">
              <div>
                <p className="events-eyebrow">03 · Host</p>
                <h2 id="post-an-event-title">Post an Event</h2>
              </div>
              <p>
                Hosting something for the community? Share the details through the form
                below so the event can be considered for the public showcase.
              </p>
            </header>

            <div className="events-live-window events-form-window">
              <div className="events-window-bar">
                <span><i aria-hidden /> Event submission form</span>
                <a
                  href={POST_EVENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open the Post an Event form in a new tab"
                >
                  Open full form <ExternalArrow />
                </a>
              </div>
              <iframe
                className="events-form-frame"
                src={POST_EVENT_EMBED_URL}
                title="Post an Entheo Community event"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <EmbedFallback href={POST_EVENT_URL} label="Open the Post an Event form" />
          </section>
        </main>

        <PublicFooter />
      </div>
    </div>
  )
}
