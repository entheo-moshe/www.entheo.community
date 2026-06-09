import { Link, createFileRoute } from '@tanstack/react-router'
import { useTitle } from '../lib/hooks'
import '../designs/gallery.css'

export const Route = createFileRoute('/')({ component: Gallery })

const DOORS = [
  {
    path: '/1',
    numeral: 'I',
    name: 'The Illuminated Herbarium',
    desc: 'An engraved field guide to the sacred — parchment, ink & gold leaf.',
    skin: 'door-1',
  },
  {
    path: '/2',
    numeral: 'II',
    name: 'The Night Ceremony',
    desc: 'A sky full of quiet fire — stars, aurora & one long breath.',
    skin: 'door-2',
  },
  {
    path: '/3',
    numeral: 'III',
    name: 'The Bulletin',
    desc: 'Front-page news, lovingly typeset: God found within.',
    skin: 'door-3',
  },
  {
    path: '/4',
    numeral: 'IV',
    name: 'The Golden Hour',
    desc: 'Nineteen-seventy-something, forever. Sunshine as sacrament.',
    skin: 'door-4',
  },
  {
    path: '/5',
    numeral: 'V',
    name: 'Stillness',
    desc: 'Paper, ink, breath. Almost nothing — and everything.',
    skin: 'door-5',
  },
] as const

function Gallery() {
  useTitle('Entheo Community — Five Explorations')
  return (
    <div className="gallery">
      <header className="gallery-head">
        <div>
          <p className="gallery-brand">Entheo Community · Homepage Explorations</p>
          <h1 className="gallery-title">
            Five doors. <em>One home.</em>
          </h1>
        </div>
        <p className="gallery-note">
          Five distinct directions for entheo.community. Step through any door —
          a quiet pager at the foot of each page moves you between them.
        </p>
      </header>

      <main className="gallery-doors">
        {DOORS.map((door) => (
          <Link key={door.path} to={door.path} className={`door ${door.skin}`}>
            <span className="door-inner">
              <span className="door-numeral">{door.numeral}</span>
              <span className="door-meta">
                <span className="door-name">{door.name}</span>
                <span className="door-desc">{door.desc}</span>
                <span className="door-enter">Enter →</span>
              </span>
            </span>
          </Link>
        ))}
      </main>

      <footer className="gallery-foot">
        <span>Welcome home</span>
        <span>EST. 2023 · A nationwide fellowship</span>
      </footer>
    </div>
  )
}
