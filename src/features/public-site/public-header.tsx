import { useState } from 'react'
import {
  DONATION_URL,
  MEMBER_LOGIN_URL,
  MEMBERSHIP_URL,
} from '../../config/member-navigation'

type PublicHeaderProps = {
  onLandingPage?: boolean
}

export function PublicHeader({ onLandingPage = false }: PublicHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const homeHref = onLandingPage ? '#top' : '/'
  const aboutHref = onLandingPage ? '#about' : '/#about'
  const closeMenu = () => setMenuOpen(false)
  const toggleMenu = () => setMenuOpen((current) => !current)

  return (
    <header className="d1-site-header d1-up">
      <a
        className="d1-brand"
        href={homeHref}
        aria-label="Entheo Community home"
        onClick={closeMenu}
      >
        <span className="d1-brand-name">ENTHEO&nbsp;COMMUNITY</span>
        <span className="d1-brand-meta" aria-hidden>
          <span>Est. MMXXIII</span>
          <span>·</span>
          <span>Welcome Home</span>
        </span>
      </a>
      <button
        className={`d1-menu-toggle${menuOpen ? ' is-open' : ''}`}
        type="button"
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        onClick={toggleMenu}
      >
        <span className="d1-menu-icon" aria-hidden>
          <span />
          <span />
          <span />
        </span>
      </button>
      <nav
        className={`d1-chapter-nav${menuOpen ? ' is-open' : ''}`}
        id="primary-navigation"
        aria-label="Primary"
      >
        <div className="d1-index-links">
          <a href={aboutHref} onClick={closeMenu}>About</a>
          <a href="/services" onClick={closeMenu}>Services</a>
          <a href="/events" onClick={closeMenu}>Events</a>
          <a href="/sacrament-ministers" onClick={closeMenu}>Ministers</a>
          <a
            className="d1-nav-donate"
            href={DONATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Donate to Entheo Community (opens in a new tab)"
            onClick={closeMenu}
          >
            <span>Donate</span>
            <span aria-hidden>↗</span>
          </a>
        </div>
        <div className="d1-nav-actions">
          <a className="d1-nav-login" href={MEMBER_LOGIN_URL} onClick={closeMenu}>
            Log in
          </a>
          <a
            className="d1-nav-join"
            href={MEMBERSHIP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join Entheo Community (opens in a new tab)"
            onClick={closeMenu}
          >
            <span>
              Join<span className="d1-nav-join-us"> us</span>
            </span>{' '}
            <span aria-hidden>↗</span>
          </a>
        </div>
      </nav>
    </header>
  )
}
