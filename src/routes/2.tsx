import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Pager } from '../components/Pager'
import { prefersReducedMotion, useReveal, useTitle } from '../lib/hooks'
import '../designs/d2.css'

export const Route = createFileRoute('/2')({ component: DesignTwo })

const vars = (v: Record<string, string>) => v as CSSProperties

/* ------------------------------------------------------------ starfield */

function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    type Star = { x: number; y: number; r: number; tw: number; ph: number; vx: number }
    let stars: Star[] = []

    const seed = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(240, Math.floor((w * h) / 7000))
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.25 + 0.35,
        tw: 0.4 + Math.random() * 1.5,
        ph: Math.random() * Math.PI * 2,
        vx: 0.004 + Math.random() * 0.018,
      }))
    }

    let meteor: { x: number; y: number; vx: number; vy: number; life: number } | null = null
    let nextMeteor = 3500 + Math.random() * 5000

    const paint = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        const a = 0.3 + 0.6 * (0.5 + 0.5 * Math.sin(s.ph + t * 0.001 * s.tw))
        ctx.globalAlpha = a
        ctx.fillStyle = '#ccd6ff'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
        s.x -= s.vx
        if (s.x < -2) s.x = w + 2
      }
      if (!meteor && t > nextMeteor) {
        meteor = {
          x: w * (0.15 + Math.random() * 0.7),
          y: h * (0.05 + Math.random() * 0.25),
          vx: -(4.5 + Math.random() * 3),
          vy: 2.2 + Math.random() * 1.6,
          life: 0,
        }
      }
      if (meteor) {
        meteor.life += 0.022
        meteor.x += meteor.vx
        meteor.y += meteor.vy
        const fade = Math.max(0, 1 - meteor.life)
        const tail = 16
        const grad = ctx.createLinearGradient(
          meteor.x,
          meteor.y,
          meteor.x - meteor.vx * tail,
          meteor.y - meteor.vy * tail,
        )
        grad.addColorStop(0, `rgba(214, 245, 255, ${0.85 * fade})`)
        grad.addColorStop(1, 'rgba(214, 245, 255, 0)')
        ctx.globalAlpha = 1
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.moveTo(meteor.x, meteor.y)
        ctx.lineTo(meteor.x - meteor.vx * tail, meteor.y - meteor.vy * tail)
        ctx.stroke()
        if (meteor.life >= 1) {
          meteor = null
          nextMeteor = t + 5000 + Math.random() * 8000
        }
      }
      raf = requestAnimationFrame(paint)
    }

    seed()
    if (prefersReducedMotion()) {
      // a single static sky
      for (const s of stars) {
        ctx.globalAlpha = 0.6
        ctx.fillStyle = '#ccd6ff'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
    } else {
      raf = requestAnimationFrame(paint)
    }

    window.addEventListener('resize', seed)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', seed)
    }
  }, [])

  return <canvas ref={ref} className="d2-stars" aria-hidden />
}

/* -------------------------------------------------------- constellations */

type Pt = [number, number]

function Constellation({ points, extra = [] }: { points: Pt[]; extra?: Pt[] }) {
  const line = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`).join(' ')
  const all = [...points, ...extra]
  return (
    <svg viewBox="0 0 200 150" width="100%" height="100%" aria-hidden>
      <path
        d={line}
        fill="none"
        stroke="rgba(160,190,255,0.5)"
        strokeWidth={0.8}
        pathLength={1}
        className="const-line"
      />
      {all.map(([x, y], i) => {
        const r = i % 3 === 0 ? 2.4 : 1.6
        return (
          <g key={i} className="const-star" style={vars({ '--tw': `${(i * 0.41) % 3}s` })}>
            <circle cx={x} cy={y} r={r * 2.6} fill="rgba(120,200,255,0.12)" />
            <circle cx={x} cy={y} r={r} fill="#dfe8ff" />
          </g>
        )
      })}
    </svg>
  )
}

/* leaf, mushroom and spiral picked out in stars */
const LEAF: Pt[] = [
  [18, 122], [44, 96], [66, 64], [96, 38], [134, 22], [168, 26],
  [156, 60], [128, 92], [94, 114], [56, 124], [18, 122],
]
const LEAF_EXTRA: Pt[] = [[88, 78], [120, 56], [60, 100]]

const MUSHROOM: Pt[] = [
  [40, 72], [62, 38], [100, 22], [138, 36], [162, 70],
  [124, 66], [118, 96], [114, 126], [86, 128], [84, 98], [78, 68], [40, 72],
]
const MUSHROOM_EXTRA: Pt[] = [[100, 48], [70, 52], [132, 52]]

const SPIRAL: Pt[] = (() => {
  const pts: Pt[] = []
  for (let i = 0; i < 11; i++) {
    const t = i / 10
    const a = t * Math.PI * 3.4 - Math.PI / 2
    const r = 6 + t * 58
    pts.push([
      Math.round(100 + Math.cos(a) * r * 1.16),
      Math.round(76 + Math.sin(a) * r * 0.92),
    ])
  }
  return pts
})()

/* ------------------------------------------------------------ moon row */

function Moon({ phase, size = 30 }: { phase: 0 | 1 | 2 | 3 | 4; size?: number }) {
  // new → full: a shadow disk slides off to the left, exposing the moon
  const shadowShift = [0, 7, 10.5, 16, 0][phase]
  return (
    <svg viewBox="0 0 30 30" width={size} height={size} aria-hidden>
      <defs>
        <clipPath id={`d2-moon-${phase}`}>
          <circle cx="15" cy="15" r="10.5" />
        </clipPath>
      </defs>
      <circle cx="15" cy="15" r="10.5" fill="rgba(223,230,255,0.92)" />
      {phase < 4 && (
        <circle
          cx={15 - shadowShift}
          cy="15"
          r="10.5"
          fill="#0a0f23"
          clipPath={`url(#d2-moon-${phase})`}
        />
      )}
      <circle cx="15" cy="15" r="10.5" fill="none" stroke="rgba(160,190,255,0.4)" strokeWidth="0.8" />
    </svg>
  )
}

/* ---------------------------------------------------------------- page */

const DOORS = [
  {
    no: '01',
    title: 'Wild Places',
    sky: <Constellation points={LEAF} extra={LEAF_EXTRA} />,
    body: 'Nature immersion as sacrament — long walks, dark skies, cold rivers. The first scripture was a forest.',
  },
  {
    no: '02',
    title: 'Sacred Medicine',
    sky: <Constellation points={MUSHROOM} extra={MUSHROOM_EXTRA} />,
    body: 'Communion with entheogens, held with reverence, preparation and care — a practice as old as the stars.',
  },
  {
    no: '03',
    title: 'The Inner Arts',
    sky: <Constellation points={SPIRAL} />,
    body: 'Meditation, music, breathwork and dance — quieter doorways into the same vast interior.',
  },
]

const ASCENT = [
  ['First light', 'Guest', 'Arrive as you are. Public gatherings are open to every curious soul.'],
  ['Waxing', 'Member', 'Step inside: facilitated ceremony, workshops, talks and true fellowship.'],
  ['Gibbous', 'Minister of Sacrament', 'Learn the safe, lawful and reverent keeping of the sacrament.'],
  ['Near full', 'Minister of Fellowship', 'Kindle and tend a local circle of your own.'],
  ['Full', 'Minister of Ceremony', 'Hold space and guide the rite — trained, evaluated, trusted.'],
] as const

function DesignTwo() {
  useTitle('Entheo Community — The Night Ceremony')
  useReveal()

  return (
    <div className="d2">
      <Starfield />
      <div className="d2-aurora" aria-hidden>
        <span className="a" />
        <span className="b" />
        <span className="c" />
      </div>
      {Array.from({ length: 9 }, (_, i) => (
        <span
          key={i}
          className="d2-fly"
          aria-hidden
          style={vars({
            left: `${(i * 12.5 + 6) % 96}%`,
            top: `${58 + ((i * 17) % 38)}%`,
            '--dur': `${13 + (i % 5) * 3}s`,
            '--delay': `${i * 1.9}s`,
          })}
        />
      ))}

      <div className="d2-shell">
        <header className="d2-nav">
          <a className="d2-wordmark" href="#top">
            ENTHEO<span className="tick">✦</span>COMMUNITY
          </a>
          <nav className="d2-nav-links">
            <a href="#doorways">Doorways</a>
            <a href="#assembly">Assembly</a>
            <a href="#path">The Path</a>
            <a
              className="d2-btn"
              href="https://www.entheo.community/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join
            </a>
          </nav>
        </header>

        {/* ------------------------------------------------------- hero */}
        <section className="d2-hero" id="top">
          <div className="d2-halo" aria-hidden>
            <span className="ring r1" />
            <span className="ring r2" />
            <span className="ring r3" />
            <span className="core" />
          </div>

          <div className="d2-breath-label d2-fade-up" aria-hidden>
            <span>breathe in</span>
            <span className="out">breathe out</span>
          </div>
          <h1 className="d2-h1 d2-fade-up" style={{ animationDelay: '150ms' }}>
            The divine is not distant.
            <br />
            <em>It is within you.</em>
          </h1>
          <p className="d2-hero-sub d2-fade-up" style={{ animationDelay: '320ms' }}>
            Entheo Community is a nationwide fellowship practicing communion with
            entheogens, deep nature, and the quiet technologies of consciousness.
            Welcome home.
          </p>
          <div className="d2-hero-ctas d2-fade-up" style={{ animationDelay: '480ms' }}>
            <a className="d2-btn solid" href="#doorways">
              Begin the journey
            </a>
            <a className="d2-btn" href="#assembly">
              Visit an assembly
            </a>
          </div>

          <div className="d2-scrollcue" aria-hidden>
            <span className="track" />
            <span>descend</span>
          </div>
        </section>

        {/* --------------------------------------------------- doorways */}
        <section className="d2-section" id="doorways">
          <div className="d2-center" data-reveal>
            <p className="d2-eyebrow">Three doorways, one interior</p>
            <h2 className="d2-h2">Every night sky is a map home</h2>
            <p className="d2-lead">
              We hold three sacraments. Each is a constellation we navigate by — drawn
              here, as everywhere, from points of light.
            </p>
          </div>
          <div className="d2-doors">
            {DOORS.map((d, i) => (
              <article
                key={d.no}
                className="d2-door"
                data-reveal
                style={vars({ '--d': `${i * 150}ms` })}
              >
                <p className="d2-door-no">{d.no}</p>
                <div className="d2-door-sky">{d.sky}</div>
                <h3>{d.title}</h3>
                <p>{d.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------- assembly */}
        <section className="d2-section" id="assembly">
          <div className="d2-assembly" data-reveal>
            <div className="d2-moons" aria-hidden>
              <Moon phase={0} />
              <Moon phase={1} />
              <Moon phase={2} />
              <Moon phase={3} />
              <Moon phase={4} />
            </div>
            <p className="d2-eyebrow">The Weekly Assembly</p>
            <h2 className="d2-h2">We gather beneath the same sky</h2>
            <p className="d2-when">
              Every Wednesday <span className="dot">✦</span> 10:30 AM Eastern{' '}
              <span className="dot">✦</span> online from anywhere
            </p>
            <p className="body">
              An open circle for stories, questions and integration — the company of
              fellow travelers, wherever the road found you. Come simply to listen, if
              you like.
            </p>
            <a
              className="d2-btn solid"
              href="https://www.entheo.community/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join this Wednesday
            </a>
          </div>
        </section>

        {/* ------------------------------------------------------- path */}
        <section className="d2-section" id="path">
          <div className="d2-center" data-reveal>
            <p className="d2-eyebrow">The ascension</p>
            <h2 className="d2-h2">A path that brightens as you walk it</h2>
          </div>
          <div className="d2-asc">
            {ASCENT.map(([stage, title, body], i) => (
              <div
                key={title}
                className="d2-asc-step"
                data-reveal
                style={vars({ '--d': `${i * 110}ms` })}
              >
                <h3>
                  <span className="stage">{stage}</span>
                  {title}
                </h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ----------------------------------------------------- finale */}
        <section className="d2-finale">
          <div data-reveal>
            <p className="d2-eyebrow">Est. 2023 · open to all faiths</p>
            <h2 className="d2-h2">
              However dark the night,
              <br />
              <em style={{ fontStyle: 'normal' }} className="glow">
                you carry the light.
              </em>
            </h2>
            <p className="d2-lead" style={{ maxWidth: '44ch' }}>
              Become a member, or simply sit with us a while. The door was never locked.
            </p>
            <div className="d2-hero-ctas">
              <a
                className="d2-btn solid"
                href="https://www.entheo.community/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Become a member
              </a>
              <a className="d2-btn" href="#top">
                Return to the surface
              </a>
            </div>
          </div>
        </section>
      </div>

      <footer className="d2-foot">
        <div className="d2-shell">
          Entheo Community ✦ a nationwide fellowship ✦{' '}
          <a href="https://www.entheo.community/" target="_blank" rel="noopener noreferrer">
            entheo.community
          </a>
        </div>
      </footer>

      <Pager current={2} />
    </div>
  )
}
