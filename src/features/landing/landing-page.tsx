import { MEMBERSHIP_URL } from '../../config/member-navigation'
import { useReveal, useTitle } from '../../lib/hooks'
import { cssVariables } from '../../lib/css'
import {
  ASSEMBLY_IMAGE_URL,
  ASSEMBLY_URL,
  ENTHEISM_URL,
  HERO_MOTE_POSITIONS,
  MINISTRY_STEPS,
  SACRAMENT_PLATES,
  WELCOME_VIDEO_URL,
} from './landing-content'
import {
  Fern,
  Fleuron,
  FrameCorner,
  SacramentIllustration,
  SunGlyph,
} from './landing-illustrations'
import { MembershipAction } from './membership-action'
import { FaqAccordion } from '../faqs'
import { PublicFooter } from '../public-site/public-footer'
import { PublicHeader } from '../public-site/public-header'

function OrnamentalDivider() {
  return (
    <div className="d1-divider" data-reveal>
      <span className="line" />
      <Fleuron />
      <span className="line flip" />
    </div>
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
        Entheo Community is a nationwide fellowship of individuals for whom entheogens
        and nature immersion are part of a spiritual way of life.
      </p>
      <div className="d1-cta-row d1-up" style={{ animationDelay: '600ms' }}>
        <MembershipAction label="Join the community" href={MEMBERSHIP_URL} />
        <a className="d1-quiet-link" href="#about">
          Discover the community&nbsp;❧
        </a>
      </div>
    </section>
  )
}

function Introduction() {
  return (
    <section className="d1-section" id="about" aria-labelledby="about-title">
      <header className="d1-sec-head" data-reveal>
        <p className="d1-sec-kicker">Welcome home.</p>
        <h2 className="d1-sec-title" id="about-title">
          What We&apos;re Creating
        </h2>
      </header>

      <div className="d1-introduction">
        <figure className="d1-film-plate" data-reveal>
          <div className="d1-film-frame">
            <iframe
              src={WELCOME_VIDEO_URL}
              title="Introduction to Entheo Community"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <figcaption>
            <span>Moving plate · 00</span>
            Introduction to Entheo Community
          </figcaption>
        </figure>

        <article
          className="d1-creating-copy"
          data-reveal
          style={cssVariables({ '--d': '120ms' })}
        >
          <p className="d1-creating-lede">
            Our faith-based nonprofit was established in 2023 as a way to provide
            greater and safer access to these sacraments within the context of sincere
            religious exercise, supported by community and comprehensive education.
          </p>
          <p>
            We identify as an{' '}
            <a
              href={ENTHEISM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Learn about Entheism (opens in a new tab)"
            >
              Entheist
            </a>{' '}
            community, but we welcome and embrace the gifts of all faiths.
          </p>
          <p>
            We are unincorporated and remain independent of state or federal oversight.
            We are grateful that the United States recognizes our inherent freedom as
            free men &amp; women to teach and practice our sacraments.
          </p>
        </article>
      </div>
    </section>
  )
}

function Beliefs() {
  return (
    <section className="d1-section" id="belief" aria-labelledby="belief-title">
      <header className="d1-sec-head" data-reveal>
        <p className="d1-sec-kicker">A faith of inner awareness</p>
        <h2 className="d1-sec-title" id="belief-title">
          Our Beliefs
        </h2>
      </header>

      <div className="d1-belief-folio" data-reveal>
        <p className="d1-belief-lede">
          We believe in the existence of a transcendent and divine presence that is the
          source of, and is manifest in, all that exists in the physical and nonphysical
          world. It cannot be named, though we can relate to its aspects using terms such
          as God, Source, Creator, Spirit, or Universe.
        </p>
        <aside className="d1-divine-names" aria-label="Names for the divine">
          <span>God</span>
          <span>Source</span>
          <span>Creator</span>
          <span>Spirit</span>
          <span>Universe</span>
        </aside>
      </div>

      <div className="d1-belief-columns">
        <p data-reveal>
          Spirit unconditionally loves us and guides us toward that which is in greatest
          alignment with our highest purpose. Listening to and aligning ourselves with
          this divine guidance brings great joy and wellbeing for ourselves, our families
          and our communities.
        </p>
        <p data-reveal style={cssVariables({ '--d': '100ms' })}>
          Divine guidance comes in various ways through our physical and nonphysical
          senses and is clearest when we attune to the present moment by practicing
          awareness. Our sacraments are the most effective ways we know to cultivate this
          awareness.
        </p>
      </div>

      <div className="d1-entheism-declaration" data-reveal>
        <p className="d1-entheism-mark" aria-hidden>
          EN · THEISM
        </p>
        <p>
          This religious practice of cultivating inner awareness to connect to Source is
          called{' '}
          <a
            href={ENTHEISM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Learn about Entheism (opens in a new tab)"
          >
            Entheism
          </a>
          : The belief that God is within.
        </p>
      </div>

      <aside className="d1-belief-boundary" data-reveal aria-label="A matter of personal alignment">
        <div className="d1-belief-fleuron" aria-hidden>
          <Fleuron />
        </div>
        <p>
          Our sacraments and beliefs are only for those who feel aligned with them; and we
          do not attempt to persuade anyone of our beliefs or practices. Even those who
          choose to practice with our sacraments may also choose to stop doing so at any
          point, just as followers of any tradition or modality may choose to stop when
          they feel they have outgrown their need for that practice.
        </p>
        <p>
          However, for those of us who are seeking these practices, all of our sacraments
          are essential parts of our ability to connect with our highest divine guidance.
        </p>
      </aside>
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
        <p className="d1-section-intro">
          Our sacraments are the practices by which we alter and explore consciousness in
          order to achieve a deeper awareness of our true nature. Specifically, they are:
          (1) nature immersion, (2) communion with entheogens and similar substances, and
          (3) other entheogenic or consciousness-altering modalities such as meditation,
          music, breath work, and dance.
        </p>
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
        <figure className="d1-assembly-figure">
          <img
            src={ASSEMBLY_IMAGE_URL}
            alt="People gathered in a circle in a sunlit room"
            loading="lazy"
          />
          <figcaption>Fellowship · support · shared experience</figcaption>
        </figure>

        <div className="d1-invite-copy">
          <div className="d1-invite-glyph" aria-hidden>
            <SunGlyph />
          </div>
          <p className="d1-sec-kicker">You are invited</p>
          <h2 className="d1-invite-title" id="assembly-title">
            The Weekly Assembly
          </h2>
          <p className="d1-invite-when">Every Wednesday · 10:30 a.m. ET</p>
          <p className="d1-invite-sub">
            Newcomers as well as members come together every Wednesday 10:30am ET to
            build meaningful relationships, share experiences, receive support, and get
            answers to all types of questions.
          </p>
          <ul className="d1-invite-details" aria-label="Assembly details">
            <li>
              <span>Where</span>Online
            </li>
            <li>
              <span>For whom</span>Newcomers &amp; members
            </li>
            <li>
              <span>What to bring</span>Your questions
            </li>
          </ul>
          <p className="d1-invite-action">
            <a
              className="d1-quiet-link"
              href={ASSEMBLY_URL}
              aria-label="Learn more about Weekly Assembly"
            >
              Weekly Assembly info &amp; RSVP <span aria-hidden>→</span>
            </a>
          </p>
        </div>
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
          Your Path to Realization
        </h2>
      </header>
      <div className="d1-path">
        <ol className="d1-steps">
          {MINISTRY_STEPS.map((step, index) => (
            <li
              key={step.number}
              className="d1-step"
              data-reveal
              style={cssVariables({ '--d': `${index * 90}ms` })}
            >
              <span className="d1-step-no">{step.number}.</span>
              <h3 className="d1-step-title">{step.title}</h3>
              <p className="d1-step-desc">{step.description}</p>
              <p className="d1-step-action">
                <a
                  href={step.action.href}
                  target={step.action.external ? '_blank' : undefined}
                  rel={step.action.external ? 'noopener noreferrer' : undefined}
                  aria-label={step.action.accessibleLabel}
                >
                  {step.action.label}{' '}
                  <span aria-hidden>{step.action.external ? '↗' : '→'}</span>
                </a>
              </p>
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
      <div className="d1-finale-fleuron" aria-hidden>
        <Fleuron />
      </div>
      <h2 className="d1-finale-words" id="finale-title">
        However far you have wandered,
        <br />
        <span className="gilt-word">welcome home.</span>
      </h2>
      <div className="d1-cta-row">
        <MembershipAction label="Become a member" href={MEMBERSHIP_URL} />
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
        <PublicHeader onLandingPage />
        <main>
          <Hero />
          <OrnamentalDivider />
          <Introduction />
          <Beliefs />
          <Sacraments />
          <OrnamentalDivider />
          <WeeklyAssembly />
          <MinistryPath />
          <FaqAccordion />
          <Finale />
        </main>

        <PublicFooter />
      </div>
    </div>
  )
}
