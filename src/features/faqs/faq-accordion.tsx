import { useState } from 'react'
import { FAQ_ENTRIES, type FaqSlug } from './faq-content'

export function FaqAccordion() {
  const [openFaq, setOpenFaq] = useState<FaqSlug | null>(null)

  return (
    <section className="d1-section d1-faq-section" id="faqs" aria-labelledby="faq-title">
      <header className="d1-sec-head" data-reveal>
        <p className="d1-sec-kicker">Questions for the Path</p>
        <h2 className="d1-sec-title" id="faq-title">
          Frequently Asked Questions
        </h2>
        <p className="d1-section-intro">
          Begin with the short answer. Open the longer folios when you want the full story.
        </p>
      </header>

      <ul className="d1-faq-list" data-reveal>
        {FAQ_ENTRIES.map((faq) => {
          const isOpen = openFaq === faq.slug
          const triggerId = `faq-trigger-${faq.slug}`
          const panelId = `faq-panel-${faq.slug}`

          return (
            <li className={`d1-faq-item${isOpen ? ' is-open' : ''}`} key={faq.slug}>
              <h3 className="d1-faq-question">
                <button
                  type="button"
                  id={triggerId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenFaq(isOpen ? null : faq.slug)}
                >
                  <span>{faq.question}</span>
                  <span className="d1-faq-toggle-mark" aria-hidden />
                </button>
              </h3>
              <div
                className="d1-faq-panel"
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                hidden={!isOpen}
              >
                <div className="d1-faq-answer">
                  <p>{faq.summary}</p>
                  <a className="d1-faq-more" href={faq.landingAction.href}>
                    {faq.landingAction.label} <span aria-hidden>→</span>
                  </a>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
