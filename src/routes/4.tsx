import type { CSSProperties } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Pager } from '../components/Pager'
import { useReveal, useTitle } from '../lib/hooks'
import '../designs/d4.css'

export const Route = createFileRoute('/4')({ component: DesignFour })

const vars = (v: Record<string, string>) => v as CSSProperties

const polar = (cx: number, cy: number, r: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}

/* ------------------------------------------------------------------ sun */

function Rays() {
  const wedges: string[] = []
  const N = 28
  for (let i = 0; i < N; i++) {
    const mid = (i * 360) / N
    const [x1, y1] = polar(600, 600, 180, mid - 3.4)
    const [x2, y2] = polar(600, 600, 180, mid + 3.4)
    const [tx, ty] = polar(600, 600, i % 2 === 0 ? 565 : 455, mid)
    wedges.push(`M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${tx.toFixed(1)} ${ty.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)} Z`)
  }
  return (
    <div className="d4-rays" aria-hidden>
      <svg viewBox="0 0 1200 1200" width="100%" height="100%">
        {wedges.map((d, i) => (
          <path key={i} d={d} fill="currentColor" />
        ))}
      </svg>
    </div>
  )
}

function Scene() {
  return (
    <div className="d4-scene" aria-hidden>
      <svg viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax meet">
        <defs>
          <radialGradient id="d4-sun" cx="50%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#f6d06b" />
            <stop offset="55%" stopColor="#e8a33d" />
            <stop offset="100%" stopColor="#e2702a" />
          </radialGradient>
        </defs>
        {/* the sun */}
        <circle cx="720" cy="330" r="218" fill="url(#d4-sun)" />
        <circle cx="720" cy="330" r="218" fill="none" stroke="#3a2317" strokeWidth="3" />
        <circle cx="720" cy="330" r="252" fill="none" stroke="rgba(226,112,42,0.5)" strokeWidth="2" strokeDasharray="2 10" />
        {/* hills, back to front */}
        <path
          d="M 0 332 C 220 244, 430 246, 700 318 C 940 372, 1180 296, 1440 338 L 1440 420 L 0 420 Z"
          fill="#9aa86d"
        />
        <path
          d="M 0 332 C 220 244, 430 246, 700 318 C 940 372, 1180 296, 1440 338"
          fill="none"
          stroke="#3a2317"
          strokeWidth="3"
        />
        <path
          d="M 0 372 C 280 302, 560 338, 830 372 C 1090 402, 1260 352, 1440 384 L 1440 420 L 0 420 Z"
          fill="#e8a33d"
        />
        <path
          d="M 0 372 C 280 302, 560 338, 830 372 C 1090 402, 1260 352, 1440 384"
          fill="none"
          stroke="#3a2317"
          strokeWidth="3"
        />
        <path
          d="M 0 404 C 340 352, 680 400, 1020 404 C 1230 406, 1340 392, 1440 402 L 1440 420 L 0 420 Z"
          fill="#c4523a"
        />
        <path
          d="M 0 404 C 340 352, 680 400, 1020 404 C 1230 406, 1340 392, 1440 402"
          fill="none"
          stroke="#3a2317"
          strokeWidth="3"
        />
        <rect x="0" y="417" width="1440" height="3" fill="#3a2317" />
      </svg>
    </div>
  )
}

function ArcText() {
  return (
    <div className="d4-arc" aria-hidden>
      <svg viewBox="0 0 720 200">
        <defs>
          <path id="d4-arc-path" d="M 30 188 Q 360 18 690 188" fill="none" />
        </defs>
        <text
          fontFamily="'Shrikhand', serif"
          fontSize="25"
          letterSpacing="5"
          fill="currentColor"
        >
          <textPath href="#d4-arc-path" startOffset="50%" textAnchor="middle">
            ✿ WELCOME HOME ✿ WELCOME HOME ✿
          </textPath>
        </text>
      </svg>
    </div>
  )
}

function Birds({ className }: { className: string }) {
  return (
    <svg className={`d4-birds ${className}`} viewBox="0 0 36 14" aria-hidden>
      <path
        d="M 2 11 Q 9.5 2 17 11 M 17 11 Q 24.5 2 32 11"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* --------------------------------------------------------------- icons */

const ICON_STROKE = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

function SunIcon() {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const [x1, y1] = polar(40, 40, 24, i * 45)
    const [x2, y2] = polar(40, 40, 33, i * 45)
    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`
  })
  return (
    <svg viewBox="0 0 80 80" width="84" height="84">
      <circle cx="40" cy="40" r="16" fill="#fdf3e3" stroke="currentColor" strokeWidth="2.6" />
      <circle cx="40" cy="40" r="5.5" fill="currentColor" />
      {rays.map((d, i) => (
        <path key={i} d={d} {...ICON_STROKE} />
      ))}
    </svg>
  )
}

function MushroomIcon() {
  return (
    <svg viewBox="0 0 80 80" width="84" height="84">
      <path
        d="M 12 42 C 14 18 66 18 68 42 C 68 47 56 49 40 49 C 24 49 12 47 12 42 Z"
        fill="#fdf3e3"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <circle cx="30" cy="32" r="3.4" fill="#c63d2f" />
      <circle cx="47" cy="27" r="2.8" fill="#c63d2f" />
      <circle cx="54" cy="38" r="3" fill="#c63d2f" />
      <path
        d="M 33 49 C 33 60 31 66 28 70 L 50 70 C 47 66 46 60 46 49"
        fill="#fdf3e3"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path d="M 22 70 L 58 70" {...ICON_STROKE} />
    </svg>
  )
}

function SongIcon() {
  return (
    <svg viewBox="0 0 80 80" width="84" height="84">
      <circle cx="22" cy="42" r="8" fill="#fdf3e3" stroke="currentColor" strokeWidth="2.6" />
      <path d="M 38 28 A 22 22 0 0 1 38 56" {...ICON_STROKE} />
      <path d="M 47 20 A 33 33 0 0 1 47 64" {...ICON_STROKE} />
      <path d="M 56 12 A 44 44 0 0 1 56 72" {...ICON_STROKE} />
      <path d="M 14 22 l 2.6 5.4 5.4 2.6 -5.4 2.6 -2.6 5.4 -2.6 -5.4 -5.4 -2.6 5.4 -2.6 Z" fill="#e8a33d" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

/* -------------------------------------------------------------- mandala */

function Mandala() {
  const petals12 = Array.from({ length: 12 }, (_, i) => i * 30)
  const petals8 = Array.from({ length: 8 }, (_, i) => i * 45 + 22.5)
  const dots = Array.from({ length: 36 }, (_, i) => polar(200, 200, 186, i * 10))
  return (
    <div className="d4-mandala" aria-hidden>
      <svg viewBox="0 0 400 400">
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 4 : 2.4} fill={i % 3 === 0 ? '#8e3b66' : '#e2702a'} />
        ))}
        <g className="turn">
          {petals12.map((a) => (
            <path
              key={a}
              d="M 200 52 C 217 96 217 138 200 170 C 183 138 183 96 200 52 Z"
              fill="rgba(226,112,42,0.3)"
              stroke="#3a2317"
              strokeWidth="2.2"
              transform={`rotate(${a} 200 200)`}
            />
          ))}
        </g>
        <g className="turn rev">
          {petals8.map((a) => (
            <path
              key={a}
              d="M 200 116 C 211 144 211 168 200 188 C 189 168 189 144 200 116 Z"
              fill="rgba(142,59,102,0.32)"
              stroke="#3a2317"
              strokeWidth="2"
              transform={`rotate(${a} 200 200)`}
            />
          ))}
        </g>
        <circle cx="200" cy="200" r="30" fill="#e8a33d" stroke="#3a2317" strokeWidth="2.6" />
        <circle cx="200" cy="200" r="10" fill="#3a2317" />
      </svg>
    </div>
  )
}

/* ----------------------------------------------------------------- road */

const MILESTONES = [
  { x: 40, y: 60, t: 'The Guest', s: 'drop in, look around' },
  { x: 241, y: 120, t: 'The Member', s: 'ceremony & workshops' },
  { x: 450, y: 180, t: 'Min. of Sacrament', s: 'study the medicine' },
  { x: 659, y: 240, t: 'Min. of Fellowship', s: 'host a circle' },
  { x: 860, y: 300, t: 'Min. of Ceremony', s: 'hold the space' },
]

function Road() {
  return (
    <div className="d4-road">
      <svg viewBox="0 0 900 380">
        <path
          d="M 40 60 C 240 60 240 180 450 180 C 660 180 660 300 860 300"
          fill="none"
          stroke="#3a2317"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="road-line"
        />
        {/* little house at the end of the road */}
        <g transform="translate(842 236)" stroke="#3a2317" strokeWidth="2.6" strokeLinejoin="round">
          <rect x="6" y="16" width="26" height="20" fill="#fdf3e3" />
          <path d="M 2 18 L 19 4 L 36 18 Z" fill="#c63d2f" />
          <rect x="15" y="24" width="8" height="12" fill="#e8a33d" />
        </g>
        {MILESTONES.map((m, i) => (
          <g key={m.t}>
            <circle cx={m.x} cy={m.y} r="11" fill="#fdf3e3" stroke="#3a2317" strokeWidth="3.4" />
            <circle cx={m.x} cy={m.y} r="4" fill={i % 2 ? '#8e3b66' : '#e2702a'} />
            <text
              x={m.x + (i === 0 ? 18 : 0)}
              y={m.y + (i % 2 === 0 ? 42 : -34)}
              textAnchor={i === 0 ? 'start' : 'middle'}
              fontFamily="'Karla', sans-serif"
              fontWeight="800"
              fontSize="16"
              fill="#3a2317"
              style={{ textTransform: 'uppercase', letterSpacing: 1 }}
            >
              {m.t}
            </text>
            <text
              x={m.x + (i === 0 ? 18 : 0)}
              y={m.y + (i % 2 === 0 ? 60 : -16)}
              textAnchor={i === 0 ? 'start' : 'middle'}
              fontFamily="'Karla', sans-serif"
              fontWeight="600"
              fontSize="13"
              fill="rgba(58,35,23,0.7)"
            >
              {m.s}
            </text>
          </g>
        ))}
      </svg>
      <ul className="d4-road-list">
        {MILESTONES.map((m) => (
          <li key={m.t}>
            <span className="t">{m.t}</span>
            <span className="s">{m.s}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ----------------------------------------------------------------- page */

const TICKETS = [
  {
    cls: 't1',
    icon: <SunIcon />,
    title: 'Sunshine & Soil',
    body: 'Nature immersion: long walks, bare feet, big skies. The original church service.',
  },
  {
    cls: 't2',
    icon: <MushroomIcon />,
    title: 'The Sacrament',
    body: 'Entheogenic communion, taken with reverence, preparation & care. The oldest door in the house.',
  },
  {
    cls: 't3',
    icon: <SongIcon />,
    title: 'Song & Stillness',
    body: 'Breathwork, music, dance & meditation. Free medicine for every nervous system.',
  },
]

const STRIP = '✿ JOY ✿ REVERENCE ✿ FELLOWSHIP ✿ WONDER ✿ SONG ✿ SUNLIGHT ✿ STILLNESS '

function DesignFour() {
  useTitle('Entheo Community — The Golden Hour')
  useReveal()

  return (
    <div className="d4">
      <div className="d4-grain" aria-hidden />

      <div className="d4-shell">
        <nav className="d4-nav">
          <a className="d4-logo" href="#top">
            Entheo <span className="sun">☼</span> Community
          </a>
          <div className="d4-nav-links">
            <a href="#medicine">The Medicine</a>
            <a href="#assembly">Wednesdays</a>
            <a href="#road">The Road</a>
            <a
              className="d4-btn hot"
              href="https://www.entheo.community/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join the circle
            </a>
          </div>
        </nav>
      </div>

      {/* ------------------------------------------------------------ hero */}
      <header className="d4-hero" id="top">
        <Rays />
        <Birds className="one" />
        <Birds className="two" />
        <div className="d4-shell d4-hero-inner">
          <div className="d4-pop">
            <ArcText />
          </div>
          <h1 className="d4-h1 d4-display d4-pop" style={{ animationDelay: '120ms' }}>
            There is a <span className="pop">light</span> in you.
          </h1>
          <p className="d4-hero-sub d4-pop" style={{ animationDelay: '240ms' }}>
            Entheo Community is a nationwide circle of friends who meet the divine in
            forests, in sacrament, in song — and in each other. Est. 2023, all faiths
            welcome, always.
          </p>
          <div className="d4-hero-ctas d4-pop" style={{ animationDelay: '360ms' }}>
            <a
              className="d4-btn hot"
              href="https://www.entheo.community/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join the circle
            </a>
            <a className="d4-btn" href="#assembly">
              Come Wednesday
            </a>
          </div>
        </div>
        <Scene />
      </header>

      {/* --------------------------------------------------------- tickets */}
      <section className="d4-section" id="medicine">
        <div className="d4-shell">
          <p className="d4-kicker" data-reveal>
            The Good Medicine
          </p>
          <h2 className="d4-h2 d4-display" data-reveal>
            Three tickets, <span className="pop">one</span> destination
          </h2>
          <div className="d4-tickets">
            {TICKETS.map((t, i) => (
              <div key={t.title} data-reveal style={vars({ '--d': `${i * 140}ms` })}>
                <article className={`d4-ticket ${t.cls}`}>
                  <div className="d4-ticket-art">{t.icon}</div>
                  <h3>{t.title}</h3>
                  <p>{t.body}</p>
                  <div className="d4-ticket-stub">
                    <span>ADMIT: EVERYONE</span>
                    <span>NO EXP. DATE</span>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- creed */}
      <section className="d4-section">
        <div className="d4-shell d4-creed">
          <div data-reveal>
            <Mandala />
          </div>
          <div className="d4-creed-copy" data-reveal style={vars({ '--d': '140ms' })}>
            <p className="d4-kicker">What we believe</p>
            <h2 className="d4-h2 d4-display">
              God grows <span className="pop2">wild</span> — everywhere
            </h2>
            <p>
              We’re Entheists: we trust that the divine lives inside every person and
              every living thing. Whatever name you carry for it — keep it! Every
              tradition is welcome around this fire. We practice awareness, alignment
              &amp; attunement to the present moment, where the guidance comes through
              clearest.
            </p>
            <div className="d4-house-rule">
              <span className="big">“Welcome home.”</span>
              <span className="small">— the only rule of the house</span>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- assembly */}
      <section className="d4-poster-wrap" id="assembly">
        <div className="d4-shell">
          <div className="d4-poster" data-reveal>
            <p className="tiny">The Weekly Assembly · live & online</p>
            <p className="when d4-display">
              Every <span className="pop">Wednesday</span>
            </p>
            <p className="where">10:30 AM Eastern · gathered online · all souls welcome</p>
            <p className="blurb">
              Stories, questions, laughter &amp; integration with fellow travelers.
              Bring tea. Come just to listen, if that’s your speed.
            </p>
            <a
              className="d4-btn sunny"
              href="https://www.entheo.community/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Save me a seat
            </a>
            <p className="stars" aria-hidden>
              ✶ ✶ ✶ ✶ ✶
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ road */}
      <section className="d4-section" id="road">
        <div className="d4-shell">
          <p className="d4-kicker" data-reveal>
            Your trip itinerary
          </p>
          <h2 className="d4-h2 d4-display" data-reveal>
            The long &amp; winding road <span className="pop">home</span>
          </h2>
          <div data-reveal style={vars({ '--d': '160ms' })}>
            <Road />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- finale */}
      <div className="d4-strip" aria-hidden>
        <div className="d4-strip-track">
          <span>{STRIP.repeat(4)}</span>
          <span>{STRIP.repeat(4)}</span>
        </div>
      </div>

      <section className="d4-finale">
        <div className="d4-shell" data-reveal>
          <p className="d4-kicker">No matter how far you’ve wandered</p>
          <h2 className="d4-h2 d4-display" style={{ maxWidth: '14ch' }}>
            The porch light is <span className="pop">always on</span>
          </h2>
          <div className="d4-hero-ctas">
            <a
              className="d4-btn hot"
              href="https://www.entheo.community/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Become a member
            </a>
            <a className="d4-btn" href="#top">
              Back to the sunrise
            </a>
          </div>
        </div>
      </section>

      <footer className="d4-foot">
        <div className="d4-shell">
          Entheo Community <span className="sun">☼</span> est. 2023{' '}
          <span className="sun">☼</span>{' '}
          <a href="https://www.entheo.community/" target="_blank" rel="noopener noreferrer">
            entheo.community
          </a>
          <p className="fine">An unincorporated religious fellowship — God is within</p>
        </div>
      </footer>

      <Pager current={4} />
    </div>
  )
}
