import type { CSSProperties } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Pager } from '../components/Pager'
import { useReveal, useTitle } from '../lib/hooks'
import '../designs/d5.css'

export const Route = createFileRoute('/5')({ component: DesignFive })

const vars = (v: Record<string, string>) => v as CSSProperties

/* An ensō — one breath, one stroke, imperfect and complete. */
function Enso() {
  return (
    <svg viewBox="0 0 320 320" aria-hidden>
      <defs>
        <filter id="d5-rough" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.016 0.024" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="9" />
        </filter>
      </defs>
      <g filter="url(#d5-rough)">
        <path
          d="M 95 47.4 A 130 130 0 1 1 47.4 95"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
          pathLength={1}
          className="enso-stroke"
        />
        <path
          d="M 97 53 A 124 124 0 1 1 53 97"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.4"
          pathLength={1}
          className="enso-ghost"
        />
      </g>
    </svg>
  )
}

function Hanko() {
  return (
    <div className="d5-hanko" data-reveal>
      <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden>
        <rect x="1" y="1" width="62" height="62" rx="9" fill="#b5402c" />
        <path
          d="M 24.5 15.5 A 17 17 0 1 1 15.5 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.4"
          strokeLinecap="round"
          transform="translate(8 8)"
        />
        <text
          x="32"
          y="56"
          textAnchor="middle"
          fontSize="7"
          letterSpacing="1.5"
          fill="rgba(243,237,225,0.85)"
          fontFamily="'Zen Kaku Gothic New', sans-serif"
        >
          EST 2023
        </text>
      </svg>
    </div>
  )
}

const GlyphStroke = ({ d, w = 2.4, delay = 0 }: { d: string; w?: number; delay?: number }) => (
  <path
    d={d}
    fill="none"
    stroke="currentColor"
    strokeWidth={w}
    strokeLinecap="round"
    strokeLinejoin="round"
    pathLength={1}
    className="glyph-stroke"
    style={vars({ '--d': `${delay}ms` })}
  />
)

function PineGlyph() {
  return (
    <svg viewBox="0 0 100 100" width="84" height="84" aria-hidden>
      <GlyphStroke d="M 50 88 L 50 22" />
      <GlyphStroke d="M 50 42 L 31 27" delay={350} />
      <GlyphStroke d="M 50 42 L 69 27" delay={450} />
      <GlyphStroke d="M 50 62 L 28 46" delay={550} />
      <GlyphStroke d="M 50 62 L 72 46" delay={650} />
      <GlyphStroke d="M 34 88 L 66 88" w={2} delay={800} />
    </svg>
  )
}

function MushroomGlyph() {
  return (
    <svg viewBox="0 0 100 100" width="84" height="84" aria-hidden>
      <GlyphStroke d="M 22 52 A 28 28 0 0 1 78 52" />
      <GlyphStroke d="M 22 52 L 78 52" delay={400} />
      <GlyphStroke d="M 46 52 C 46 66 44 78 41 86 M 54 52 C 54 66 56 78 59 86" delay={550} />
      <GlyphStroke d="M 34 90 L 66 90" w={2} delay={800} />
    </svg>
  )
}

function BreathGlyph() {
  return (
    <svg viewBox="0 0 100 100" width="84" height="84" aria-hidden>
      <GlyphStroke d="M 18 38 Q 34 27 50 38 T 82 38" />
      <GlyphStroke d="M 18 56 Q 34 45 50 56 T 82 56" delay={350} />
      <GlyphStroke d="M 18 74 Q 34 63 50 74 T 82 74" delay={700} />
    </svg>
  )
}

const DOORS = [
  {
    no: '01',
    glyph: <PineGlyph />,
    name: 'Forest',
    body: 'Nature immersion — the door that is always unlocked.',
  },
  {
    no: '02',
    glyph: <MushroomGlyph />,
    name: 'Sacrament',
    body: 'Entheogenic communion, held with reverence and care.',
  },
  {
    no: '03',
    glyph: <BreathGlyph />,
    name: 'Breath',
    body: 'Meditation, music, dance — stillness in motion.',
  },
]

const STONES = [
  ['Guest', 'arrive'],
  ['Member', 'enter ceremony'],
  ['Sacrament', 'keep the medicine'],
  ['Fellowship', 'tend a circle'],
  ['Ceremony', 'hold the space'],
] as const

function DesignFive() {
  useTitle('Entheo Community — Stillness')
  useReveal()

  return (
    <div className="d5">
      <div className="d5-grain" aria-hidden />

      {/* -------------------------------------------------------------- hero */}
      <section className="d5-hero">
        <nav className="d5-nav">
          <span>Entheo Community</span>
          <a
            className="join"
            href="https://www.entheo.community/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Join
          </a>
        </nav>

        <div className="d5-enso d5-appear">
          <Enso />
          <div className="d5-enso-core">
            <p className="d5-hero-kicker">entheos · the god within</p>
            <h1 className="d5-hero-title d5-serif">
              Welcome
              <br />
              home.
            </h1>
          </div>
        </div>

        <p className="d5-hero-line d5-appear" style={{ animationDelay: '900ms' }}>
          A nationwide fellowship of those who meet the sacred in nature, in sacrament,
          in stillness.
        </p>
        <span className="d5-hero-link d5-appear" style={{ animationDelay: '1200ms' }}>
          <a className="d5-link" href="#assembly">
            Come sit with us
          </a>
        </span>

        <span className="d5-vertical" aria-hidden>
          est. two thousand twenty-three
        </span>
        <span className="d5-scrolldown" aria-hidden />
      </section>

      {/* ------------------------------------------------------------- creed */}
      <section className="d5-section">
        <div className="d5-vline" data-reveal aria-hidden />
        <div style={{ height: 'clamp(2.5rem, 6vw, 4rem)' }} />
        <p className="d5-creed d5-serif" data-reveal>
          We believe the divine is not far away.
          <br />
          It waits, patiently, <span className="accent">within</span> —
          <br />
          and the door opens from the inside.
        </p>
        <p className="d5-footnote" data-reveal style={vars({ '--d': '250ms' })}>
          Open to every tradition · and to none
        </p>
      </section>

      {/* ------------------------------------------------------------- doors */}
      <section className="d5-section">
        <p className="d5-kicker" data-reveal>
          Three doors
        </p>
        <div className="d5-doors">
          {DOORS.map((door, i) => (
            <div
              key={door.no}
              className="d5-door"
              data-reveal
              style={vars({ '--d': `${i * 220}ms` })}
            >
              <span className="no">{door.no}</span>
              <div className="glyph">{door.glyph}</div>
              <h3>{door.name}</h3>
              <p>{door.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- assembly */}
      <section className="d5-section" id="assembly">
        <Hanko />
        <p className="d5-kicker" data-reveal>
          The weekly assembly
        </p>
        <p className="d5-when d5-serif" data-reveal style={vars({ '--d': '150ms' })}>
          Wednesdays, half past ten in the morning.
        </p>
        <p className="d5-where" data-reveal style={vars({ '--d': '300ms' })}>
          Eastern time · online · newcomers welcome
        </p>
        <span data-reveal style={vars({ '--d': '420ms' })}>
          <a
            className="d5-link"
            href="https://www.entheo.community/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Reserve a cushion
          </a>
        </span>
      </section>

      {/* ------------------------------------------------------------ stones */}
      <section className="d5-section">
        <p className="d5-kicker" data-reveal>
          The path
        </p>
        <p className="d5-creed d5-serif" data-reveal style={{ maxWidth: '26ch' }}>
          Five stones across the water.
        </p>
        <div className="d5-stones" data-reveal style={vars({ '--d': '250ms' })}>
          {STONES.map(([name, role]) => (
            <a
              key={name}
              className="d5-stone"
              href="https://www.entheo.community/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="dot" aria-hidden />
              <span className="name d5-serif">{name}</span>
              <span className="role">{role}</span>
            </a>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ finale */}
      <section className="d5-section">
        <div className="d5-vline" data-reveal aria-hidden />
        <div style={{ height: 'clamp(2.5rem, 6vw, 4rem)' }} />
        <p className="d5-finale-words d5-serif" data-reveal>
          The door is open<span className="accent">.</span>
        </p>
        <div style={{ height: '2.4rem' }} />
        <span data-reveal style={vars({ '--d': '300ms' })}>
          <a
            className="d5-link"
            href="https://www.entheo.community/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Become a member
          </a>
        </span>
      </section>

      <footer className="d5-foot">
        <span>Entheo Community</span>
        <span>
          <a href="https://www.entheo.community/" target="_blank" rel="noopener noreferrer">
            entheo.community
          </a>
        </span>
        <span>est. 2023</span>
      </footer>

      <Pager current={5} />
    </div>
  )
}
