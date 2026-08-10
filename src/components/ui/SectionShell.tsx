import type { ReactNode } from 'react'

import type { SectionSlug } from '../../lib/content'

interface SectionShellProps {
  slug: SectionSlug
  title: string
  /** The hero owns the page's single h1; every other section is an h2. */
  headingLevel?: 'h1' | 'h2'
  children?: ReactNode
}

/** Semantic landmark wrapper: `<section id={slug}>` labelled by its heading, anchor-navigable. */
export function SectionShell({ slug, title, headingLevel = 'h2', children }: SectionShellProps) {
  const Heading = headingLevel
  const headingId = `${slug}-heading`

  return (
    <section id={slug} aria-labelledby={headingId} className="mx-auto w-full max-w-3xl px-4 py-12">
      <Heading id={headingId} className="font-display text-2xl text-olive">
        {title}
      </Heading>
      {children}
    </section>
  )
}
