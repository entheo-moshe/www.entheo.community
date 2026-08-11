import { useEffect } from 'react'

/** Sets the document title for the lifetime of the page. */
export function useTitle(title: string) {
  useEffect(() => {
    const prev = document.title
    document.title = title
    return () => {
      document.title = prev
    }
  }, [title])
}

/**
 * Reveal-on-scroll: adds `.is-seen` to every `[data-reveal]` element as it
 * enters the viewport. Each design styles the transition itself.
 */
export function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (els.length === 0) return

    const revealAll = () => els.forEach((el) => el.classList.add('is-seen'))

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      revealAll()
      return
    }

    if (!('IntersectionObserver' in window)) {
      revealAll()
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-seen')
            io.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
    )
    els.forEach((el) => io.observe(el))

    // Critical content must never remain hidden when a browser restores a deep
    // scroll position, a screenshot tool does not scroll, or observers stall.
    const fallback = window.setTimeout(revealAll, 4_000)

    return () => {
      io.disconnect()
      window.clearTimeout(fallback)
    }
  }, [])
}
