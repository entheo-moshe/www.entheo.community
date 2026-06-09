import type { CSSProperties } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Pager } from '../components/Pager'
import { useReveal, useTitle } from '../lib/hooks'
import '../designs/d3.css'

export const Route = createFileRoute('/3')({ component: DesignThree })

const vars = (v: Record<string, string>) => v as CSSProperties

const TICKER =
  'WELCOME HOME ✶ THE WEEKLY ASSEMBLY CONVENES WEDNESDAYS 10:30 AM ET ✶ MEMBERSHIP OPEN NATIONWIDE ✶ GOD IS WITHIN ✶ EST. 2023 ✶ ALL FAITHS WELCOME ✶ '

function Stamp() {
  return (
    <div className="d3-stamp" aria-hidden>
      <svg viewBox="0 0 116 116">
        <defs>
          <path
            id="d3-stamp-arc"
            d="M 58 58 m -44 0 a 44 44 0 1 1 88 0 a 44 44 0 1 1 -88 0"
          />
        </defs>
        <circle cx="58" cy="58" r="55" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="58" cy="58" r="32" fill="none" stroke="currentColor" strokeWidth="1" />
        <text fill="currentColor" fontSize="11.5" fontWeight="700" letterSpacing="3.4">
          <textPath href="#d3-stamp-arc">FOUNDED 2023 · NATIONWIDE · GOD WITHIN ·</textPath>
        </text>
        <text
          x="58"
          y="65"
          textAnchor="middle"
          fontSize="20"
          fill="currentColor"
          fontWeight="900"
        >
          ✶
        </text>
      </svg>
    </div>
  )
}

const NOTICES = [
  {
    tag: 'WED 10:30 ET',
    title: 'The Weekly Assembly',
    body: 'Open circle, online: relationship-building, experience-sharing & Q.A. Newcomers warmly received.',
    href: 'https://www.entheo.community/',
  },
  {
    tag: 'ONGOING',
    title: 'Membership open nationwide',
    body: 'Facilitated ceremonies, workshops, talks & social gatherings. Apply within.',
    href: 'https://www.entheo.community/',
  },
  {
    tag: 'TRAINING',
    title: 'Ministers sought',
    body: 'Of Sacrament, of Fellowship, of Ceremony. Study, stewardship & service. See THE LADDER, below.',
    href: '#ladder',
  },
]

const SACRAMENTS = [
  {
    no: '01',
    label: 'SEC. A — OUTDOORS',
    texture: 'dots',
    title: 'Nature Immersion',
    body: 'Sustained, unhurried contact with wild places. The fellowship regards the forest as the oldest house of worship still standing — roofless by design, open every hour.',
  },
  {
    no: '02',
    label: 'SEC. B — COMMUNION',
    texture: 'lines',
    title: 'Entheogenic Sacrament',
    body: 'Communion with entheogens, undertaken with reverence, preparation and care. Members study safe and lawful practice before self-guided ceremony.',
  },
  {
    no: '03',
    label: 'SEC. C — PRACTICE',
    texture: 'rings',
    title: 'States of Consciousness',
    body: 'Meditation, music, breathwork, dance. The quiet technologies — free, legal everywhere, and chronically underrated by the modern reader.',
  },
]

const LADDER = [
  ['TIER-00', 'The Guest', 'Public events & the Weekly Assembly. No dues, no pressure, no fine print.'],
  ['TIER-01', 'The Member', 'Facilitated ceremonies, workshops, talks & fellowship gatherings nationwide.'],
  ['TIER-02', 'Minister of Sacrament', 'Trained in safe handling, legal frameworks & self-guided ceremony.'],
  ['TIER-03', 'Minister of Fellowship', 'Leads a local circle; builds & tends community where they stand.'],
  ['TIER-04', 'Minister of Ceremony', 'Trained & evaluated to hold space and facilitate the rite itself.'],
] as const

function DesignThree() {
  useTitle('Entheo Community — The Bulletin')
  useReveal()

  return (
    <div className="d3">
      {/* ---------------------------------------------------------- ticker */}
      <div className="d3-ticker" aria-hidden>
        <div className="d3-ticker-track">
          <span>{TICKER.repeat(3)}</span>
          <span>{TICKER.repeat(3)}</span>
        </div>
      </div>

      <div className="d3-shell">
        {/* ------------------------------------------------------ masthead */}
        <header>
          <div className="d3-topline d3-mono">
            <span>VOL. IV · NO. 23</span>
            <span className="mid">THE COMMUNITY ORGAN OF RECORD — INNER WEATHER: CLEAR & STILL</span>
            <span>PRICE: FREE, FOREVER</span>
          </div>
          <h1 className="d3-masthead">
            ENTHE<span className="o">O</span>
          </h1>
          <div className="d3-dateline d3-mono">
            <span>★ A NATIONWIDE FELLOWSHIP OF ENTHEISTS</span>
            <span>EST. 2023</span>
            <span>“GOD IS WITHIN”</span>
            <span>WEDNESDAY EDITION</span>
          </div>
        </header>

        {/* ---------------------------------------------------- front page */}
        <main className="d3-front">
          <article className="d3-lead" data-reveal>
            <p className="d3-kicker d3-mono">THE LEAD · FROM THE FELLOWSHIP DESK</p>
            <h2 className="d3-headline">
              God, it turns out, was <span className="u">inside you</span> the whole time.
            </h2>
            <p className="d3-standfirst">
              Correspondents nationwide confirm: the divine presence long sought in
              distant heavens has been located considerably closer to home. A fellowship
              assembles weekly to compare notes.
            </p>
            <p className="d3-byline d3-mono">BY THE MEMBERS, FOR ANYONE · FILED FROM EVERYWHERE</p>
            <div className="d3-body-cols">
              <p>
                Entheo Community, established 2023, is a nationwide fellowship of
                individuals for whom entheogens and nature immersion are part of a
                spiritual way of life. Its members call themselves Entheists — from the
                Greek <em>éntheos</em>, “the god within” — and report that awareness of a
                transcendent and divine presence is best cultivated through three
                sacraments: immersion in the natural world, communion with entheogens,
                and the deliberate shifting of consciousness through meditation, music,
                breathwork and dance.
              </p>
              <p>
                The fellowship is inclusive of all faith traditions and operates as an
                unincorporated religious community, placing personal spiritual autonomy
                at the center of its practice. Divine guidance, members report, “comes in
                various ways through our physical and nonphysical senses, and is clearest
                when we attune to the present moment.”
              </p>
              <p className="d3-continued">— continued inward, indefinitely.</p>
            </div>
            <Stamp />
          </article>

          <aside className="d3-aside">
            <section className="d3-notices" data-reveal style={vars({ '--d': '120ms' })}>
              <div className="d3-notices-head">
                <span className="d3-mono">PUBLIC NOTICES</span>
                <span className="d3-mono">№ 1–3</span>
              </div>
              {NOTICES.map((n) => (
                <a
                  key={n.title}
                  className="d3-notice"
                  href={n.href}
                  {...(n.href.startsWith('http')
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  <span className="d3-notice-tag d3-mono">{n.tag}</span>
                  <span>
                    <h4>{n.title}</h4>
                    <p>{n.body}</p>
                  </span>
                </a>
              ))}
            </section>

            <nav className="d3-index d3-mono" data-reveal style={vars({ '--d': '220ms' })}>
              <a href="#sacraments">
                <span>THE THREE SACRAMENTS</span>
                <span className="dots" />
                <span>SEC. A–C</span>
              </a>
              <a href="#ladder">
                <span>THE LADDER (MEMBERSHIP)</span>
                <span className="dots" />
                <span>SEC. D</span>
              </a>
              <a href="#welcome">
                <span>WELCOME HOME</span>
                <span className="dots" />
                <span>BACK PAGE</span>
              </a>
            </nav>
          </aside>
        </main>

        {/* ---------------------------------------------------- pull quote */}
        <figure className="d3-quote" data-reveal>
          <blockquote>
            <span className="mark">“</span>We are not waiting for heaven. We are
            remembering it.<span className="mark">”</span>
          </blockquote>
          <figcaption className="d3-mono">— OVERHEARD AT THE WEEKLY ASSEMBLY</figcaption>
        </figure>

        {/* ---------------------------------------------------- sacraments */}
        <section className="d3-sacraments" id="sacraments">
          {SACRAMENTS.map((s, i) => (
            <article key={s.no} className="d3-sac" data-reveal style={vars({ '--d': `${i * 130}ms` })}>
              <div className="d3-sac-no">
                <strong>{s.no}</strong>
                <span className="d3-mono">{s.label}</span>
              </div>
              <div className={`d3-texture ${s.texture}`} aria-hidden />
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </article>
          ))}
        </section>

        {/* -------------------------------------------------------- ladder */}
        <section id="ladder">
          <div className="d3-ladder-head" data-reveal>
            <h2>The Ladder</h2>
            <span className="d3-mono">SEC. D — CLASSIFIEDS OF THE SPIRIT</span>
          </div>
          <div data-reveal>
            {LADDER.map(([code, name, desc]) => (
              <a
                key={code}
                className="d3-row"
                href="https://www.entheo.community/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="d3-row-code d3-mono">{code}</span>
                <span className="d3-row-name">{name}</span>
                <span className="d3-row-desc">{desc}</span>
                <span className="d3-row-go">APPLY →</span>
              </a>
            ))}
          </div>
        </section>
      </div>

      {/* ------------------------------------------------------------ finale */}
      <footer className="d3-finale" id="welcome">
        <div className="d3-shell d3-finale-inner">
          <p className="d3-finale-word" data-reveal>
            Welcome home<span className="stop">.</span>
          </p>
          <div className="d3-finale-links d3-mono" data-reveal style={vars({ '--d': '150ms' })}>
            <a href="https://www.entheo.community/" target="_blank" rel="noopener noreferrer">
              JOIN THE FELLOWSHIP →
            </a>
            <a href="https://www.entheo.community/" target="_blank" rel="noopener noreferrer">
              ATTEND AN ASSEMBLY →
            </a>
            <a href="#sacraments">READ THE SACRAMENTS →</a>
          </div>
          <div className="d3-colophon d3-mono">
            <span>
              ENTHEO COMMUNITY · AN UNINCORPORATED RELIGIOUS FELLOWSHIP
              <br />
              PUBLISHED WHEREVER TWO OR MORE GATHER
            </span>
            <span>
              <span className="d3-barcode" aria-hidden />
              <span className="code">ISSN ENTHEO-2023-∞</span>
            </span>
          </div>
        </div>
      </footer>

      <Pager current={3} />
    </div>
  )
}
