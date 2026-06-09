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
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-seen'))
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
    return () => io.disconnect()
  }, [])
}

/** True when the user prefers reduced motion. Read once; fine for canvases. */
export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}
