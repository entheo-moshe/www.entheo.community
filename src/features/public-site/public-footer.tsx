import { DONATION_URL } from '../../config/member-navigation'

const FOOTER_GROUPS = [
  {
    label: 'Explore',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/#about' },
      { label: 'Services', href: '/services' },
      { label: 'Events', href: '/events' },
    ],
  },
  {
    label: 'Ministers',
    links: [
      { label: 'Sacrament Ministers', href: '/sacrament-ministers' },
      { label: 'Fellowship Ministers', href: '/fellowship-ministers' },
      { label: 'Ceremony Ministers', href: '/ceremony-ministers' },
    ],
  },
  {
    label: 'Connect',
    links: [
      { label: 'FAQs', href: '/#faqs' },
      { label: 'Contact', href: '/contact' },
      { label: 'Donate', href: DONATION_URL, external: true },
    ],
  },
] as const

export function PublicFooter() {
  return (
    <footer className="d1-colophon public-footer">
      <div className="public-footer-main">
        <div className="public-footer-identity">
          <a
            className="public-footer-brand"
            href="/"
            aria-label="Entheo Community home from footer"
          >
            Entheo Community
          </a>
          <p>A nationwide fellowship of Entheists.</p>
          <a className="public-footer-email" href="mailto:info@entheo.community">
            info@entheo.community
          </a>
        </div>

        <nav className="public-footer-index" aria-label="Public site footer">
          {FOOTER_GROUPS.map((group) => (
            <div className="public-footer-group" key={group.label}>
              <h2>{group.label}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={'external' in link && link.external ? '_blank' : undefined}
                      rel={'external' in link && link.external ? 'noopener noreferrer' : undefined}
                      aria-label={
                        'external' in link && link.external
                          ? `${link.label} to Entheo Community (opens in a new tab)`
                          : undefined
                      }
                    >
                      {link.label}
                      {'external' in link && link.external ? <span aria-hidden>↗</span> : null}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="public-footer-base">
        <p>Entheo Community · An Unincorporated Religious Fellowship · Est. 2023</p>
        <a href="#top">Back to top <span aria-hidden>↑</span></a>
      </div>
    </footer>
  )
}
