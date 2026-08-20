import { Fragment, type ReactNode } from 'react'
import { useTitle } from '../../lib/hooks'
import { FrameCorner } from '../landing/landing-illustrations'
import { PublicFooter } from '../public-site/public-footer'
import { PublicHeader } from '../public-site/public-header'
import {
  getFaqEntry,
  type FaqParagraph,
} from './faq-content'

interface FaqDetailPageProps {
  slug: string
}

interface FaqDocumentShellProps {
  children: ReactNode
  skipTarget: string
  skipLabel: string
}

function FaqDocumentShell({ children, skipTarget, skipLabel }: FaqDocumentShellProps) {
  return (
    <div className="d1 faq-document-page" id="top">
      <a className="d1-skip" href={`#${skipTarget}`}>
        {skipLabel}
      </a>
      <div className="d1-grain" aria-hidden />
      <div className="d1-frame" aria-hidden>
        <FrameCorner position="tl" />
        <FrameCorner position="tr" />
        <FrameCorner position="bl" />
        <FrameCorner position="br" />
      </div>

      <div className="d1-shell faq-document-shell">
        <PublicHeader />
        {children}
        <PublicFooter />
      </div>
    </div>
  )
}

function FaqInlineText({ content }: Pick<FaqParagraph, 'content'>) {
  if (typeof content === 'string') return content

  return content.map((fragment, index) => (
    <Fragment key={`${fragment.text}-${index}`}>
      {fragment.href ? (
        <FaqInlineLink href={fragment.href} text={fragment.text} />
      ) : (
        fragment.text
      )}
    </Fragment>
  ))
}

function FaqInlineLink({ href, text }: { href: string; text: string }) {
  const external = href.startsWith('http')

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      aria-label={external ? `${text} (opens in a new tab)` : undefined}
    >
      {text}
      {external ? <span aria-hidden> ↗</span> : null}
    </a>
  )
}

export function FaqDetailPage({ slug }: FaqDetailPageProps) {
  const faq = getFaqEntry(slug)
  useTitle(faq ? `${faq.title} — Entheo Community` : 'FAQ Not Found — Entheo Community')

  if (!faq) {
    return (
      <FaqDocumentShell skipTarget="faq-not-found-title" skipLabel="Skip to page message">
        <main className="faq-document-main">
          <article className="faq-document faq-document-not-found">
            <p className="faq-document-eyebrow">Questions &amp; Answers</p>
            <h1 id="faq-not-found-title" tabIndex={-1}>
              We could not find that answer.
            </h1>
            <p>The question may have moved, or the address may be incomplete.</p>
            <a className="faq-document-return" href="/#faqs">
              Return to all questions <span aria-hidden>→</span>
            </a>
          </article>
        </main>
      </FaqDocumentShell>
    )
  }

  return (
    <FaqDocumentShell skipTarget="faq-detail-title" skipLabel="Skip to answer">
      <main className="faq-document-main">
        <article className="faq-document" aria-labelledby="faq-detail-title">
          <nav className="faq-breadcrumb" aria-label="Breadcrumb">
            <a href="/#faqs">Frequently asked questions</a>
            <span aria-hidden>◆</span>
            <span>Answer</span>
          </nav>

          <header className="faq-document-header d1-up">
            <p className="faq-document-eyebrow">Questions &amp; Answers</p>
            <h1 id="faq-detail-title" tabIndex={-1}>
              {faq.title}
            </h1>
            <p className="faq-document-lede">{faq.summary}</p>
          </header>

          {faq.notice ? (
            <aside className="faq-document-notice" aria-label="Important context">
              <span aria-hidden>Note</span>
              <p>{faq.notice}</p>
            </aside>
          ) : null}

          <div className="faq-document-body">
            {faq.sections.map((section, sectionIndex) => {
              const List = section.ordered ? 'ol' : 'ul'

              return (
                <section
                  className="faq-document-section"
                  key={`${faq.slug}-${section.title ?? 'opening'}-${sectionIndex}`}
                >
                  {section.title ? <h2>{section.title}</h2> : null}
                  {section.paragraphs.map((paragraph, paragraphIndex) => (
                    <p key={`${faq.slug}-paragraph-${sectionIndex}-${paragraphIndex}`}>
                      {paragraph.label ? <strong>{paragraph.label}: </strong> : null}
                      <FaqInlineText content={paragraph.content} />
                    </p>
                  ))}
                  {section.items ? (
                    <List>
                      {section.items.map((item, itemIndex) => (
                        <li key={`${faq.slug}-item-${sectionIndex}-${itemIndex}`}>
                          <FaqInlineText content={item} />
                        </li>
                      ))}
                    </List>
                  ) : null}
                </section>
              )
            })}
          </div>

          <footer className="faq-document-actions">
            <a className="faq-document-return" href="/#faqs">
              Return to all questions <span aria-hidden>→</span>
            </a>
            <a className="faq-document-contact" href="/contact">
              Still curious? Contact us
            </a>
          </footer>
        </article>
      </main>
    </FaqDocumentShell>
  )
}
