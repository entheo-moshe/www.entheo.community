import { useReveal, useTitle } from '../../lib/hooks'
import { MEMBER_LOGIN_URL, MEMBERSHIP_URL } from '../../lib/member-session'
import { cssVariables } from '../../lib/css'
import {
  ASSEMBLY_URL,
  HERO_MOTE_POSITIONS,
  MINISTRY_STEPS,
  SACRAMENT_PLATES,
} from './landing-content'
import {
  Fern,
  Fleuron,
  FrameCorner,
  SacramentIllustration,
  SunGlyph,
  WaxSeal,
} from './landing-illustrations'

function OrnamentalDivider() {
  return (
    <div className="d1-divider" data-reveal>
      <span className="line" />
      <Fleuron />
      <span className="line flip" />
    </div>
  )
}

function LandingHeader() {
  return (
    <header className="d1-site-header d1-up">
      <a className="d1-brand" href="#top" aria-label="Entheo Community home">
        <span className="d1-brand-name">ENTHEO&nbsp;COMMUNITY</span>
        <span className="d1-brand-meta" aria-hidden>
          <span>Est. MMXXIII</span>
          <span>·</span>
          <span>Welcome Home</span>
        </span>
      </a>
      <nav className="d1-chapter-nav" aria-label="Primary">
        <div className="d1-index-links">
          <a href="#belief">Belief</a>
          <a href="#sacraments">Practice</a>
          <a href="#assembly">Gather</a>
          <a href="#path">Path</a>
        </div>
        <div className="d1-nav-actions">
          <a className="d1-nav-login" href={MEMBER_LOGIN_URL}>
            Log in
          </a>
          <a
            className="d1-nav-join"
            href={MEMBERSHIP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join Entheo Community (opens in a new tab)"
          >
            <span>
              Join<span className="d1-nav-join-us"> us</span>
            </span>{' '}
            <span aria-hidden>↗</span>
          </a>
        </div>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="d1-hero" aria-labelledby="hero-title">
      <div className="d1-flora left" aria-hidden>
        <Fern />
      </div>
      <div className="d1-flora right" aria-hidden>
        <Fern flip />
      </div>

      {HERO_MOTE_POSITIONS.map((left, index) => (
        <span
          key={left}
          className="d1-mote"
          style={{
            left: `${left}%`,
            animationDelay: `${index * 1.7}s`,
            animationDuration: `${9 + (index % 3) * 2.5}s`,
          }}
          aria-hidden
        />
      ))}

      <div className="d1-up" style={{ animationDelay: '120ms', color: 'var(--gold)' }}>
        <Fleuron />
      </div>
      <p className="d1-kicker d1-up" style={{ animationDelay: '220ms' }}>
        A Nationwide Fellowship of Entheists
      </p>
      <h1
        className="d1-title d1-up"
        id="hero-title"
        tabIndex={-1}
        style={{ animationDelay: '320ms' }}
      >
        The God <span className="gilt">Within</span>
      </h1>
      <p className="d1-sub d1-up" style={{ animationDelay: '460ms' }}>
        Entheo Community is a fellowship of seekers for whom sacred plants and wild
        places are not an escape from life — but the way home to it.
      </p>
      <div className="d1-cta-row d1-up" style={{ animationDelay: '600ms' }}>
        <WaxSeal label="JOIN US" href={MEMBERSHIP_URL} arcId="hero-seal-arc" />
        <a className="d1-quiet-link" href="#assembly">
          Attend the Weekly Assembly&nbsp;❧
        </a>
      </div>
    </section>
  )
}

function Creed() {
  return (
    <section className="d1-section" id="belief" aria-labelledby="belief-title">
      <h2 className="d1-sr-only" id="belief-title">
        What we believe
      </h2>
      <div className="d1-creed" data-reveal>
        <aside className="d1-marginalia">
          Entheos · ἔνθεος
          <em>“the god within” — the root of enthusiasm</em>
        </aside>
        <p className="d1-creed-text">
          We are Entheists: we hold that the divine is not housed in distant heavens
          but seeded in every living thing, waiting patiently beneath the noise of our
          days. To walk slowly into a forest, to take the sacrament with reverence, to
          sit in honest stillness — these are three ways of knocking on a door that
          opens from the inside. Founded in 2023, our fellowship now reaches across
          the country. Whatever tradition carried you here, there is a place set for
          you at this table.
        </p>
      </div>
    </section>
  )
}

function Sacraments() {
  return (
    <section className="d1-section" id="sacraments" aria-labelledby="sacraments-title">
      <header className="d1-sec-head" data-reveal>
        <p className="d1-sec-kicker">The Three Sacraments</p>
        <h2 className="d1-sec-title" id="sacraments-title">
          A Field Guide to Communion
        </h2>
      </header>
      <div className="d1-plates">
        {SACRAMENT_PLATES.map((plate, index) => (
          <article
            key={plate.number}
            className="d1-plate"
            data-reveal
            style={cssVariables({ '--d': `${index * 140}ms` })}
          >
            <p className="d1-plate-no">{plate.number}</p>
            <div className="d1-plate-art">
              <SacramentIllustration artwork={plate.artwork} />
            </div>
            <h3 className="d1-plate-title">{plate.title}</h3>
            <p className="d1-plate-latin">{plate.latin}</p>
            <p className="d1-plate-desc">{plate.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function WeeklyAssembly() {
  return (
    <section className="d1-section" id="assembly" aria-labelledby="assembly-title">
      <div className="d1-invite" data-reveal>
        <div style={{ color: 'var(--gold)' }}>
          <SunGlyph />
        </div>
        <p className="d1-sec-kicker" style={{ marginTop: '1rem' }}>
          You are invited
        </p>
        <h2 className="d1-invite-title" id="assembly-title">
          The Weekly Assembly
        </h2>
        <p className="d1-invite-when">Every Wednesday · Half Past Ten, Eastern</p>
        <p className="d1-invite-sub">
          An open circle for fellowship, shared experience & honest inquiry.
          Newcomers are always welcome; come simply to listen, if you like.
        </p>
        <ul className="d1-invite-details" aria-label="Assembly details">
          <li>
            <span>Where</span>Online
          </li>
          <li>
            <span>For whom</span>Newcomers welcome
          </li>
          <li>
            <span>How to arrive</span>Come as you are
          </li>
        </ul>
        <p className="d1-invite-action">
          <a
            className="d1-quiet-link"
            href={ASSEMBLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Reserve your seat at the Weekly Assembly (opens in a new tab)"
          >
            Reserve your seat <span aria-hidden>→</span>
          </a>
        </p>
      </div>
    </section>
  )
}

function MinistryPath() {
  return (
    <section className="d1-section" id="path" aria-labelledby="path-title">
      <header className="d1-sec-head" data-reveal>
        <p className="d1-sec-kicker">From Guest to Minister</p>
        <h2 className="d1-sec-title" id="path-title">
          The Path of Ministry
        </h2>
      </header>
      <div className="d1-path">
        <ol className="d1-steps">
          {MINISTRY_STEPS.map(([number, title, description], index) => (
            <li
              key={number}
              className="d1-step"
              data-reveal
              style={cssVariables({ '--d': `${index * 90}ms` })}
            >
              <span className="d1-step-no">{number}.</span>
              <h3 className="d1-step-title">{title}</h3>
              <p className="d1-step-desc">{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Finale() {
  return (
    <section className="d1-finale" data-reveal aria-labelledby="finale-title">
      <div style={{ color: 'var(--gold)', display: 'flex', justifyContent: 'center' }}>
        <Fleuron />
      </div>
      <h2 className="d1-finale-words" id="finale-title">
        However far you have wandered,
        <br />
        <span className="gilt-word">welcome home.</span>
      </h2>
      <div className="d1-cta-row">
        <WaxSeal label="BEGIN" href={MEMBERSHIP_URL} arcId="finale-seal-arc" />
      </div>
    </section>
  )
}

export function LandingPage() {
  useTitle('Entheo Community — Welcome Home')
  useReveal()

  return (
    <div className="d1" id="top">
      <a className="d1-skip" href="#hero-title">
        Skip to content
      </a>
      <div className="d1-grain" aria-hidden />
      <div className="d1-frame" aria-hidden>
        <FrameCorner position="tl" />
        <FrameCorner position="tr" />
        <FrameCorner position="bl" />
        <FrameCorner position="br" />
      </div>

      <div className="d1-shell">
        <LandingHeader />
        <main>
          <Hero />
          <OrnamentalDivider />
          <Creed />
          <Sacraments />
          <OrnamentalDivider />
          <WeeklyAssembly />
          <MinistryPath />
          <Finale />
        </main>

        <footer className="d1-colophon">
          Entheo Community · An Unincorporated Religious Fellowship · Est. 2023
          <br />
          <a href="mailto:info@entheo.community">info@entheo.community</a>
        </footer>
      </div>
    </div>
  )
}
