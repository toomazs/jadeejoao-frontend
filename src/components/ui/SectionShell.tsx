import type { ReactNode } from 'react'

import type { SectionSlug } from '../../lib/content'
import { LeafDivider } from './LeafDivider'

interface SectionShellProps {
  slug: SectionSlug
  title: string
  /**
   * Position on the walk through the site ("02"…"10"), engraved into the
   * frame's top border like a room plaque. Decorative — hidden from readers.
   */
  ordinal?: string
  /**
   * Room treatment: `framed` draws the double hairline frame on cream,
   * `veil` adds the gold-tinted fill for dense structured rooms,
   * `open` is a frameless prose passage (letter grammar).
   */
  variant?: 'framed' | 'veil' | 'open'
  /** The hero owns the page's single h1; every other section is an h2. */
  headingLevel?: 'h1' | 'h2'
  children?: ReactNode
}

/** Semantic landmark wrapper: `<section id={slug}>` labelled by its heading, anchor-navigable. */
export function SectionShell({
  slug,
  title,
  ordinal,
  variant = 'framed',
  headingLevel = 'h2',
  children,
}: SectionShellProps) {
  const Heading = headingLevel
  const headingId = `${slug}-heading`

  const heading = (
    <>
      <Heading
        id={headingId}
        className="text-center font-display text-[clamp(1.7rem,7.5vw,2.25rem)] leading-tight text-balance text-olive"
      >
        {title}
      </Heading>
      <LeafDivider className="mt-5" />
    </>
  )

  // Open passages have no frame to hold plaque hardware — the ordinal only
  // exists engraved into a framed room's border, never floating over a heading.
  if (variant === 'open') {
    return (
      <section id={slug} aria-labelledby={headingId} className="px-4 py-14 sm:py-20">
        <div className="mx-auto w-full max-w-2xl">
          {heading}
          <div className="mt-8">{children}</div>
        </div>
      </section>
    )
  }

  const fill = variant === 'veil' ? 'bg-veil' : 'bg-cream'

  return (
    <section id={slug} aria-labelledby={headingId} className="px-4 py-10 sm:py-14">
      <div className={`relative mx-auto w-full max-w-2xl border border-olive-line ${fill}`}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-1.5 border border-sand-line"
        />
        {ordinal ? (
          <span
            aria-hidden="true"
            className={`absolute -top-2.5 left-1/2 -translate-x-1/2 ${fill} px-3 font-body text-sm leading-5 tracking-[0.3em] text-olive`}
          >
            {ordinal}
          </span>
        ) : null}
        <div className="relative px-5 py-12 sm:px-10 sm:py-14">
          {heading}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </section>
  )
}
