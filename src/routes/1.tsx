import type { CSSProperties, SVGProps } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useReveal, useTitle } from '../lib/hooks'
import '../designs/d1.css'

export const Route = createFileRoute('/')({ component: LandingPage })

const vars = (v: Record<string, string>) => v as CSSProperties
const MEMBERSHIP_URL = 'https://forms.gle/pKi3Mt8LB2jjfWrLA'
const ASSEMBLY_URL = 'https://www.entheo.community/events/weekly-assembly'

/* ---------------------------------------------------------------- engraving
   All illustrations are generated line work — an herbarium etched in code. */

function Stroke({
  d,
  w = 1.4,
  delay = 0,
  ...rest
}: { d: string; w?: number; delay?: number } & SVGProps<SVGPathElement>) {
  return (
    <path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      className="draw"
      style={vars({ '--d': `${delay}ms` })}
      {...rest}
    />
  )
}

function spiral(cx: number, cy: number, turns: number, maxR: number, inward = false) {
  const steps = 140
  const parts: string[] = []
  for (let s = 0; s <= steps; s++) {
    const t = s / steps
    const a = t * turns * Math.PI * 2 - Math.PI / 2
    const r = maxR * (inward ? 1 - t : t)
    const x = cx + Math.cos(a) * r
    const y = cy + Math.sin(a) * r
    parts.push(`${s === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return parts.join(' ')
}

function Fern({ flip = false }: { flip?: boolean }) {
  const pinnae: { d: string; delay: number }[] = []
  const count = 24
  for (let i = 0; i < count; i++) {
    const t = i / count
    const side = i % 2 === 0 ? -1 : 1
    const y = 244 - t * 212
    const x = 60 + Math.sin(t * 4.2) * 4
    const len = (1 - t) * 44 + 8
    const lift = len * 0.32
    pinnae.push({
      d: `M ${x} ${y} C ${x + side * len * 0.35} ${y - 2}, ${x + side * len * 0.72} ${
        y - lift * 0.45
      }, ${x + side * len} ${y - lift}`,
      delay: 300 + t * 1100,
    })
  }
  return (
    <svg
      viewBox="0 0 120 260"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      aria-hidden
    >
      <Stroke d="M 61 252 C 55 200, 65 122, 58 26" w={1.7} delay={0} />
      <Stroke d={spiral(58, 18, 1.6, 9, true)} w={1.3} delay={1300} />
      {pinnae.map((p, i) => (
        <Stroke key={i} d={p.d} w={1.15} delay={p.delay} />
      ))}
    </svg>
  )
}

function Sprig() {
  const leaves: { x: number; y: number; angle: number; scale: number; delay: number }[] = []
  const count = 9
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1)
    const side = i % 2 === 0 ? -1 : 1
    leaves.push({
      x: 70 + Math.sin(t * Math.PI * 1.7) * 9,
      y: 182 - t * 142,
      angle: side === 1 ? -34 - t * 12 : 214 + t * 12,
      scale: 1.05 - t * 0.5,
      delay: 250 + t * 900,
    })
  }
  const leafPath = 'M 0 0 Q 11 -9 23 -1.5 Q 11 6 0 0'
  return (
    <svg viewBox="0 0 140 200" aria-hidden>
      <Stroke d="M 70 192 C 84 150, 56 96, 70 28" w={1.7} />
      {leaves.map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.angle}) scale(${l.scale})`}>
          <Stroke d={leafPath} w={1.15} delay={l.delay} />
          <Stroke d="M 2 -0.6 L 17 -2" w={0.8} delay={l.delay + 160} />
        </g>
      ))}
      <Stroke d={spiral(70, 22, 1.4, 7, true)} w={1.2} delay={1150} />
    </svg>
  )
}

function Psilocybe() {
  const shrooms = [
    { x: 42, h: 66, lean: -9, w: 12, delay: 200 },
    { x: 74, h: 96, lean: 2, w: 14, delay: 420 },
    { x: 104, h: 56, lean: 11, w: 11, delay: 640 },
  ]
  return (
    <svg viewBox="0 0 140 200" aria-hidden>
      {shrooms.map((m, i) => {
        const cx = m.x + m.lean
        const cy = 186 - m.h
        const ch = m.h * 0.3
        return (
          <g key={i}>
            <Stroke
              d={`M ${m.x - 2} 186 C ${m.x - 5} ${186 - m.h * 0.45}, ${cx - 3} ${
                186 - m.h * 0.8
              }, ${cx - 1.5} ${cy + 4}`}
              w={1.5}
              delay={m.delay}
            />
            <Stroke
              d={`M ${m.x + 4} 186 C ${m.x + 2} ${186 - m.h * 0.45}, ${cx + 4} ${
                186 - m.h * 0.8
              }, ${cx + 2.5} ${cy + 4}`}
              w={1.5}
              delay={m.delay + 80}
            />
            <Stroke
              d={`M ${cx - m.w} ${cy + 3} C ${cx - m.w * 0.92} ${cy - ch * 0.62}, ${
                cx - 4.5
              } ${cy - ch}, ${cx - 1.6} ${cy - ch - 2.5} Q ${cx} ${cy - ch - 6.5} ${
                cx + 1.6
              } ${cy - ch - 2.5} C ${cx + 4.5} ${cy - ch}, ${cx + m.w * 0.92} ${
                cy - ch * 0.62
              }, ${cx + m.w} ${cy + 3}`}
              w={1.5}
              delay={m.delay + 160}
            />
            <Stroke
              d={`M ${cx - m.w} ${cy + 3} Q ${cx} ${cy + 8.5} ${cx + m.w} ${cy + 3}`}
              w={1.1}
              delay={m.delay + 280}
            />
          </g>
        )
      })}
      {/* grass ticks */}
      <Stroke d="M 24 188 q 3 -9 6 -1" w={1} delay={880} />
      <Stroke d="M 58 189 q 2 -7 5 -1" w={1} delay={940} />
      <Stroke d="M 120 188 q 3 -8 6 0" w={1} delay={1000} />
      <Stroke d="M 88 189 q -2 -7 -5 -1" w={1} delay={1060} />
    </svg>
  )
}

function BreathSpiral() {
  const dashes = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2
    const r1 = 64
    const r2 = i % 3 === 0 ? 74 : 70
    return {
      d: `M ${70 + Math.cos(a) * r1} ${95 + Math.sin(a) * r1} L ${70 + Math.cos(a) * r2} ${
        95 + Math.sin(a) * r2
      }`,
      delay: 900 + i * 55,
    }
  })
  return (
    <svg viewBox="0 0 140 200" aria-hidden>
      <Stroke d={spiral(70, 95, 3.1, 54)} w={1.4} delay={150} />
      {dashes.map((p, i) => (
        <Stroke key={i} d={p.d} w={1.1} delay={p.delay} />
      ))}
    </svg>
  )
}

function Fleuron() {
  return (
    <svg viewBox="0 0 80 24" width="80" height="24" aria-hidden>
      <path d="M 40 5 L 47 12 L 40 19 L 33 12 Z" fill="currentColor" opacity={0.9} />
      <path
        d="M 29 12 Q 19 4 9 12 Q 19 20 29 12 M 51 12 Q 61 4 71 12 Q 61 20 51 12"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.1}
      />
      <circle cx="4" cy="12" r="1.3" fill="currentColor" />
      <circle cx="76" cy="12" r="1.3" fill="currentColor" />
    </svg>
  )
}

function FrameCorner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  return (
    <svg className={`d1-corner ${pos}`} viewBox="0 0 44 44" aria-hidden>
      <path
        d="M 1.5 43 L 1.5 11 Q 1.5 1.5 11 1.5 L 43 1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
      />
      <path
        d="M 9 9 q 11 -2.5 13.5 7.5 q 1.8 8 -5.2 8.4 q -5.6 0.3 -5.2 -4.8 q 0.4 -4.4 5 -3.4"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.1}
      />
      <circle cx="30" cy="9" r="1.4" fill="currentColor" />
      <circle cx="9" cy="30" r="1.4" fill="currentColor" />
    </svg>
  )
}

function SunGlyph() {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2
    const r1 = 16
    const r2 = i % 2 === 0 ? 25 : 21
    return `M ${30 + Math.cos(a) * r1} ${30 + Math.sin(a) * r1} L ${30 + Math.cos(a) * r2} ${
      30 + Math.sin(a) * r2
    }`
  })
  return (
    <svg viewBox="0 0 60 60" width="52" height="52" aria-hidden style={{ margin: '0 auto' }}>
      <circle cx="30" cy="30" r="11" fill="none" stroke="currentColor" strokeWidth={1.4} />
      <circle cx="30" cy="30" r="3" fill="currentColor" />
      {rays.map((d, i) => (
        <path key={i} d={d} stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
      ))}
    </svg>
  )
}

function WaxSeal({
  label,
  href,
  arcId,
}: {
  label: string
  href: string
  arcId: string
}) {
  return (
    <a
      className="d1-seal"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={
        label === 'BEGIN'
          ? 'Begin joining Entheo Community (opens in a new tab)'
          : 'Join Entheo Community (opens in a new tab)'
      }
    >
      <svg viewBox="0 0 108 108" aria-hidden>
        <defs>
          <path
            id={arcId}
            d="M 54 54 m -36 0 a 36 36 0 1 1 72 0 a 36 36 0 1 1 -72 0"
          />
        </defs>
        <circle
          cx="54"
          cy="54"
          r="45"
          fill="none"
          stroke="rgba(246,231,210,0.5)"
          strokeWidth="1"
          strokeDasharray="2 3"
        />
        <text fill="rgba(246,231,210,0.85)" fontSize="8.4" letterSpacing="2.6">
          <textPath href={`#${arcId}`} startOffset="0">
            ENTHEO COMMUNITY · EST MMXXIII ·
          </textPath>
        </text>
      </svg>
      <span className="d1-seal-text" aria-hidden>
        {label}
        <br />✦
      </span>
    </a>
  )
}

/* ------------------------------------------------------------------- page */

const PLATES = [
  {
    no: 'Plate I',
    art: <Sprig />,
    title: 'Nature Immersion',
    latin: 'Silva — the oldest cathedral',
    desc: 'Unhurried hours in wild places, where attention itself becomes prayer and the forest does the preaching.',
  },
  {
    no: 'Plate II',
    art: <Psilocybe />,
    title: 'Entheogenic Communion',
    latin: 'Teonanácatl — flesh of the gods',
    desc: 'The sacrament, taken with reverence, preparation & care — a door that has opened for seekers across millennia.',
  },
  {
    no: 'Plate III',
    art: <BreathSpiral />,
    title: 'The Quiet Arts',
    latin: 'Pneuma — breath, song & stillness',
    desc: 'Meditation, music, breathwork and dance: humbler vessels, carrying the same light inward.',
  },
]

const STEPS = [
  ['I', 'The Guest', 'Cross the threshold — join our public gatherings and see whether this feels like home.'],
  ['II', 'The Member', 'Enter facilitated ceremony, workshops, talks & the steady fellowship of kindred souls.'],
  ['III', 'Minister of Sacrament', 'Study the safe, lawful & reverent keeping of the sacrament for your own practice.'],
  ['IV', 'Minister of Fellowship', 'Gather a local circle and tend it; hold the hearth so others may warm themselves.'],
  ['V', 'Minister of Ceremony', 'Train, under guidance & evaluation, to hold space and lead the rite itself.'],
] as const

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
        <FrameCorner pos="tl" />
        <FrameCorner pos="tr" />
        <FrameCorner pos="bl" />
        <FrameCorner pos="br" />
      </div>

      <div className="d1-shell">
        <header className="d1-site-header">
          <div className="d1-nav d1-up">
            <span className="left">Est. MMXXIII</span>
            <a className="d1-brand" href="#top" aria-label="Entheo Community home">
              ENTHEO&nbsp;COMMUNITY
            </a>
            <span className="right">Welcome Home</span>
          </div>
          <div className="d1-nav-rule d1-up" />
        </header>
        <nav className="d1-chapter-nav d1-up" aria-label="Primary">
          <div className="d1-index-links">
            <a href="#belief">Belief</a>
            <a href="#sacraments">Practice</a>
            <a href="#assembly">Gather</a>
            <a href="#path">Path</a>
          </div>
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
        </nav>

        <main>
          {/* ------------------------------------------------ frontispiece */}
          <section className="d1-hero" aria-labelledby="hero-title">
            <div className="d1-flora left" aria-hidden>
              <Fern />
            </div>
            <div className="d1-flora right" aria-hidden>
              <Fern flip />
            </div>

            {[12, 28, 46, 62, 78, 90].map((left, i) => (
              <span
                key={i}
                className="d1-mote"
                style={{
                  left: `${left}%`,
                  animationDelay: `${i * 1.7}s`,
                  animationDuration: `${9 + (i % 3) * 2.5}s`,
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

          <div className="d1-divider" data-reveal>
            <span className="line" />
            <Fleuron />
            <span className="line flip" />
          </div>

          {/* ------------------------------------------------------- creed */}
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

          {/* ------------------------------------------------------ plates */}
          <section className="d1-section" id="sacraments" aria-labelledby="sacraments-title">
            <header className="d1-sec-head" data-reveal>
              <p className="d1-sec-kicker">The Three Sacraments</p>
              <h2 className="d1-sec-title" id="sacraments-title">
                A Field Guide to Communion
              </h2>
            </header>
            <div className="d1-plates">
              {PLATES.map((p, i) => (
                <article
                  key={p.no}
                  className="d1-plate"
                  data-reveal
                  style={vars({ '--d': `${i * 140}ms` })}
                >
                  <p className="d1-plate-no">{p.no}</p>
                  <div className="d1-plate-art">{p.art}</div>
                  <h3 className="d1-plate-title">{p.title}</h3>
                  <p className="d1-plate-latin">{p.latin}</p>
                  <p className="d1-plate-desc">{p.desc}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="d1-divider" data-reveal>
            <span className="line" />
            <Fleuron />
            <span className="line flip" />
          </div>

          {/* ---------------------------------------------------- assembly */}
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

          {/* -------------------------------------------------------- path */}
          <section className="d1-section" id="path" aria-labelledby="path-title">
            <header className="d1-sec-head" data-reveal>
              <p className="d1-sec-kicker">From Guest to Minister</p>
              <h2 className="d1-sec-title" id="path-title">
                The Path of Ministry
              </h2>
            </header>
            <div className="d1-path">
              <ol className="d1-steps">
                {STEPS.map(([no, title, desc], i) => (
                  <li
                    key={no}
                    className="d1-step"
                    data-reveal
                    style={vars({ '--d': `${i * 90}ms` })}
                  >
                    <span className="d1-step-no">{no}.</span>
                    <h3 className="d1-step-title">{title}</h3>
                    <p className="d1-step-desc">{desc}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* ------------------------------------------------------ finale */}
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
        </main>

        <footer className="d1-colophon">
          Entheo Community · An Unincorporated Religious Fellowship · Est. 2023
          <br />
          <a href="mailto:info@entheo.community">
            info@entheo.community
          </a>
        </footer>
      </div>
    </div>
  )
}
