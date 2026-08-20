// @vitest-environment jsdom

import { act, cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useReveal, useTitle } from './hooks'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

function TitleFixture() {
  useTitle('A considered title')
  return null
}

function RevealFixture() {
  useReveal()
  return <div data-reveal>Revealed content</div>
}

function EmptyRevealFixture() {
  useReveal()
  return null
}

function mediaQuery(matches: boolean) {
  return {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as unknown as MediaQueryList
}

describe('page hooks', () => {
  it('restores the previous document title on unmount', () => {
    document.title = 'Previous title'
    const view = render(<TitleFixture />)

    expect(document.title).toBe('A considered title')
    view.unmount()
    expect(document.title).toBe('Previous title')
  })

  it('reveals immediately when reduced motion is requested', () => {
    const observer = vi.fn()
    vi.stubGlobal('matchMedia', vi.fn(() => mediaQuery(true)))
    vi.stubGlobal('IntersectionObserver', observer)

    const { getByText } = render(<RevealFixture />)

    expect(getByText('Revealed content').classList.contains('is-seen')).toBe(true)
    expect(observer).not.toHaveBeenCalled()
  })

  it('does nothing when the page has no reveal targets', () => {
    const observer = vi.fn()
    vi.stubGlobal('IntersectionObserver', observer)

    render(<EmptyRevealFixture />)

    expect(observer).not.toHaveBeenCalled()
  })

  it('reveals intersecting targets once and leaves offscreen targets observed', () => {
    vi.useFakeTimers()
    vi.stubGlobal('matchMedia', vi.fn(() => mediaQuery(false)))

    let callback: IntersectionObserverCallback | undefined
    const unobserve = vi.fn()
    const disconnect = vi.fn()

    class ReportingIntersectionObserver {
      readonly root = null
      readonly rootMargin = ''
      readonly thresholds = [0.1]
      observe = vi.fn()
      unobserve = unobserve
      disconnect = disconnect
      takeRecords = vi.fn(() => [])

      constructor(nextCallback: IntersectionObserverCallback) {
        callback = nextCallback
      }
    }

    vi.stubGlobal('IntersectionObserver', ReportingIntersectionObserver)
    const view = render(<RevealFixture />)
    const content = view.getByText('Revealed content')

    act(() => {
      callback?.(
        [
          { isIntersecting: false, target: content },
          { isIntersecting: true, target: content },
        ] as unknown as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      )
    })

    expect(content.classList.contains('is-seen')).toBe(true)
    expect(unobserve).toHaveBeenCalledOnce()

    view.unmount()
    expect(disconnect).toHaveBeenCalledOnce()
  })

  it('uses the safety fallback when an observer never reports an intersection', () => {
    vi.useFakeTimers()
    vi.stubGlobal('matchMedia', vi.fn(() => mediaQuery(false)))

    class DormantIntersectionObserver {
      readonly root = null
      readonly rootMargin = ''
      readonly thresholds = [0.1]
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = vi.fn()
      takeRecords = vi.fn(() => [])
    }

    vi.stubGlobal('IntersectionObserver', DormantIntersectionObserver)
    const { getByText } = render(<RevealFixture />)
    const content = getByText('Revealed content')

    expect(content.classList.contains('is-seen')).toBe(false)
    act(() => vi.advanceTimersByTime(4_000))
    expect(content.classList.contains('is-seen')).toBe(true)
  })
})
