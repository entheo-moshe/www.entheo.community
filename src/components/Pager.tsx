import { Link } from '@tanstack/react-router'

const PATHS = ['/1', '/2', '/3', '/4', '/5'] as const
const NUMERALS = ['I', 'II', 'III', 'IV', 'V'] as const

/** Floating switcher between the five explorations. Skinned per design. */
export function Pager({ current }: { current: number }) {
  return (
    <nav className="pager" aria-label="Homepage explorations">
      <Link to="/" className="pager-home" title="All explorations" aria-label="All explorations">
        ✦
      </Link>
      {PATHS.map((path, i) => (
        <Link
          key={path}
          to={path}
          aria-current={current === i + 1 ? 'page' : undefined}
          title={`Exploration ${NUMERALS[i]}`}
        >
          {NUMERALS[i]}
        </Link>
      ))}
    </nav>
  )
}
