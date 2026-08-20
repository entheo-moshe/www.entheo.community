import type { SVGProps } from 'react'
import { cssVariables } from '../../lib/css'
import type { SacramentArtwork } from './landing-content'

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
      style={cssVariables({ '--d': `${delay}ms` })}
      {...rest}
    />
  )
}

function spiral(
  cx: number,
  cy: number,
  turns: number,
  maxRadius: number,
  inward = false,
) {
  const steps = 140
  const parts: string[] = []

  for (let step = 0; step <= steps; step++) {
    const progress = step / steps
    const angle = progress * turns * Math.PI * 2 - Math.PI / 2
    const radius = maxRadius * (inward ? 1 - progress : progress)
    const x = cx + Math.cos(angle) * radius
    const y = cy + Math.sin(angle) * radius
    parts.push(`${step === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
  }

  return parts.join(' ')
}

type CubicStem = {
  start: { x: number; y: number }
  controlStart: { x: number; y: number }
  controlEnd: { x: number; y: number }
  end: { x: number; y: number }
}

const FERN_STEM: CubicStem = {
  start: { x: 61, y: 252 },
  controlStart: { x: 55, y: 200 },
  controlEnd: { x: 65, y: 122 },
  end: { x: 58, y: 26 },
}

const SPRIG_STEM: CubicStem = {
  start: { x: 70, y: 192 },
  controlStart: { x: 84, y: 150 },
  controlEnd: { x: 56, y: 96 },
  end: { x: 70, y: 28 },
}

function pointOnStem(stem: CubicStem, progress: number) {
  const remaining = 1 - progress
  const startWeight = remaining ** 3
  const controlStartWeight = 3 * remaining ** 2 * progress
  const controlEndWeight = 3 * remaining * progress ** 2
  const endWeight = progress ** 3

  return {
    x:
      stem.start.x * startWeight +
      stem.controlStart.x * controlStartWeight +
      stem.controlEnd.x * controlEndWeight +
      stem.end.x * endWeight,
    y:
      stem.start.y * startWeight +
      stem.controlStart.y * controlStartWeight +
      stem.controlEnd.y * controlEndWeight +
      stem.end.y * endWeight,
  }
}

function stemPath(stem: CubicStem) {
  return `M ${stem.start.x} ${stem.start.y} C ${stem.controlStart.x} ${stem.controlStart.y}, ${stem.controlEnd.x} ${stem.controlEnd.y}, ${stem.end.x} ${stem.end.y}`
}

export function Fern({ flip = false }: { flip?: boolean }) {
  const pinnae: { d: string; delay: number }[] = []
  const count = 24

  for (let index = 0; index < count; index++) {
    const progress = index / count
    const stemPoint = pointOnStem(FERN_STEM, (index + 1) / (count + 1))
    const side = index % 2 === 0 ? -1 : 1
    const length = (1 - progress) * 44 + 8
    const lift = length * 0.32
    pinnae.push({
      d: `M ${stemPoint.x} ${stemPoint.y} C ${stemPoint.x + side * length * 0.35} ${stemPoint.y - 2}, ${
        stemPoint.x + side * length * 0.72
      } ${stemPoint.y - lift * 0.45}, ${stemPoint.x + side * length} ${stemPoint.y - lift}`,
      delay: 300 + progress * 1100,
    })
  }

  return (
    <svg
      viewBox="0 0 120 260"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      aria-hidden
    >
      <Stroke
        d={stemPath(FERN_STEM)}
        w={1.7}
        delay={0}
        data-fern-stem
      />
      <Stroke d={spiral(58, 18, 1.6, 9, true)} w={1.3} delay={1300} />
      {pinnae.map((pinna, index) => (
        <Stroke
          key={index}
          d={pinna.d}
          w={1.15}
          delay={pinna.delay}
          data-fern-pinna
        />
      ))}
    </svg>
  )
}

function Sprig() {
  const leaves: {
    x: number
    y: number
    angle: number
    scale: number
    delay: number
  }[] = []
  const count = 9

  for (let index = 0; index < count; index++) {
    const progress = index / (count - 1)
    const stemPoint = pointOnStem(SPRIG_STEM, (index + 1) / (count + 1))
    const side = index % 2 === 0 ? -1 : 1
    leaves.push({
      x: stemPoint.x,
      y: stemPoint.y,
      angle: side === 1 ? -34 - progress * 12 : 214 + progress * 12,
      scale: 1.05 - progress * 0.5,
      delay: 250 + progress * 900,
    })
  }

  const leafPath = 'M 0 0 Q 11 -9 23 -1.5 Q 11 6 0 0'

  return (
    <svg viewBox="0 0 140 200" aria-hidden>
      <Stroke d={stemPath(SPRIG_STEM)} w={1.7} data-sprig-stem />
      {leaves.map((leaf, index) => (
        <g
          key={index}
          transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.angle}) scale(${leaf.scale})`}
          data-sprig-leaf
        >
          <Stroke d={leafPath} w={1.15} delay={leaf.delay} />
          <Stroke d="M 2 -0.6 L 17 -2" w={0.8} delay={leaf.delay + 160} />
        </g>
      ))}
      <Stroke d={spiral(70, 22, 1.4, 7, true)} w={1.2} delay={1150} />
    </svg>
  )
}

function Psilocybe() {
  const mushrooms = [
    { x: 42, height: 66, lean: -9, width: 12, delay: 200 },
    { x: 74, height: 96, lean: 2, width: 14, delay: 420 },
    { x: 104, height: 56, lean: 11, width: 11, delay: 640 },
  ]

  return (
    <svg viewBox="0 0 140 200" aria-hidden>
      {mushrooms.map((mushroom, index) => {
        const centerX = mushroom.x + mushroom.lean
        const centerY = 186 - mushroom.height
        const capHeight = mushroom.height * 0.3

        return (
          <g key={index}>
            <Stroke
              d={`M ${mushroom.x - 2} 186 C ${mushroom.x - 5} ${186 - mushroom.height * 0.45}, ${centerX - 3} ${
                186 - mushroom.height * 0.8
              }, ${centerX - 1.5} ${centerY + 4}`}
              w={1.5}
              delay={mushroom.delay}
            />
            <Stroke
              d={`M ${mushroom.x + 4} 186 C ${mushroom.x + 2} ${186 - mushroom.height * 0.45}, ${centerX + 4} ${
                186 - mushroom.height * 0.8
              }, ${centerX + 2.5} ${centerY + 4}`}
              w={1.5}
              delay={mushroom.delay + 80}
            />
            <Stroke
              d={`M ${centerX - mushroom.width} ${centerY + 3} C ${centerX - mushroom.width * 0.92} ${centerY - capHeight * 0.62}, ${
                centerX - 4.5
              } ${centerY - capHeight}, ${centerX - 1.6} ${centerY - capHeight - 2.5} Q ${centerX} ${centerY - capHeight - 6.5} ${
                centerX + 1.6
              } ${centerY - capHeight - 2.5} C ${centerX + 4.5} ${centerY - capHeight}, ${centerX + mushroom.width * 0.92} ${
                centerY - capHeight * 0.62
              }, ${centerX + mushroom.width} ${centerY + 3}`}
              w={1.5}
              delay={mushroom.delay + 160}
            />
            <Stroke
              d={`M ${centerX - mushroom.width} ${centerY + 3} Q ${centerX} ${centerY + 8.5} ${centerX + mushroom.width} ${centerY + 3}`}
              w={1.1}
              delay={mushroom.delay + 280}
            />
          </g>
        )
      })}
      <Stroke d="M 24 188 q 3 -9 6 -1" w={1} delay={880} />
      <Stroke d="M 58 189 q 2 -7 5 -1" w={1} delay={940} />
      <Stroke d="M 120 188 q 3 -8 6 0" w={1} delay={1000} />
      <Stroke d="M 88 189 q -2 -7 -5 -1" w={1} delay={1060} />
    </svg>
  )
}

function BreathSpiral() {
  const dashes = Array.from({ length: 12 }, (_, index) => {
    const angle = (index / 12) * Math.PI * 2
    const innerRadius = 64
    const outerRadius = index % 3 === 0 ? 74 : 70

    return {
      d: `M ${70 + Math.cos(angle) * innerRadius} ${95 + Math.sin(angle) * innerRadius} L ${70 + Math.cos(angle) * outerRadius} ${
        95 + Math.sin(angle) * outerRadius
      }`,
      delay: 900 + index * 55,
    }
  })

  return (
    <svg viewBox="0 0 140 200" aria-hidden>
      <Stroke d={spiral(70, 95, 3.1, 54)} w={1.4} delay={150} />
      {dashes.map((dash, index) => (
        <Stroke key={index} d={dash.d} w={1.1} delay={dash.delay} />
      ))}
    </svg>
  )
}

export function SacramentIllustration({
  artwork,
}: {
  artwork: SacramentArtwork
}) {
  if (artwork === 'sprig') return <Sprig />
  if (artwork === 'psilocybe') return <Psilocybe />
  return <BreathSpiral />
}

export function Fleuron() {
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

export function FrameCorner({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  return (
    <svg className={`d1-corner ${position}`} viewBox="0 0 44 44" aria-hidden>
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

export function SunGlyph() {
  const rays = Array.from({ length: 12 }, (_, index) => {
    const angle = (index / 12) * Math.PI * 2
    const innerRadius = 16
    const outerRadius = index % 2 === 0 ? 25 : 21

    return `M ${30 + Math.cos(angle) * innerRadius} ${30 + Math.sin(angle) * innerRadius} L ${30 + Math.cos(angle) * outerRadius} ${
      30 + Math.sin(angle) * outerRadius
    }`
  })

  return (
    <svg
      viewBox="0 0 60 60"
      width="52"
      height="52"
      aria-hidden
      style={{ margin: '0 auto' }}
    >
      <circle cx="30" cy="30" r="11" fill="none" stroke="currentColor" strokeWidth={1.4} />
      <circle cx="30" cy="30" r="3" fill="currentColor" />
      {rays.map((path, index) => (
        <path
          key={index}
          d={path}
          stroke="currentColor"
          strokeWidth={1.2}
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}
