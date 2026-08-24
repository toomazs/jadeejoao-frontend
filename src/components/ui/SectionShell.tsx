import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import type { SectionSlug } from '../../lib/content'
import { LeafDivider } from './LeafDivider'
import { Reveal } from './Reveal'

/** Full-bleed color rooms — the palette does the separating, not hairlines. */
const TONES = {
  cream: {
    section: 'bg-cream',
    kicker: 'text-terracotta',
    rule: 'bg-terracotta',
    title: 'text-olive',
  },
  veil: {
    section: 'bg-veil',
    kicker: 'text-terracotta',
    rule: 'bg-terracotta',
    title: 'text-deep-olive',
  },
  terracotta: {
    section: 'bg-terracotta',
    kicker: 'text-gold-sand',
    rule: 'bg-gold-sand',
    title: 'text-cream',
  },
} as const

interface SectionShellProps {
  slug: SectionSlug
  title: string
  /** Position on the walk ("02"…"10"), spoken in the kicker line. */
  ordinal?: string
  /** The section's emblem, drawn above the title (lucide icon). */
  icon?: LucideIcon
  /** Room color from the brand palette — neighbors should differ. */
  tone?: keyof typeof TONES
  /** Desktop measure: `regular` for prose rooms, `wide` for grids and flows. */
  width?: 'regular' | 'wide'
  headingLevel?: 'h1' | 'h2'
  children?: ReactNode
}

/**
 * Semantic landmark wrapper: a full-bleed color block with an editorial
 * header — kicker (ordinal + rule) over a big bold display title, left-aligned
 * on desktop. Anchor-navigable, revealed on entry.
 */
export function SectionShell({
  slug,
  title,
  ordinal,
  icon: Icon,
  tone = 'cream',
  width = 'regular',
  headingLevel = 'h2',
  children,
}: SectionShellProps) {
  const Heading = headingLevel
  const headingId = `${slug}-heading`
  const palette = TONES[tone]
  const measure = width === 'wide' ? 'max-w-6xl' : 'max-w-4xl'

  return (
    <section
      id={slug}
      aria-labelledby={headingId}
      className={`${palette.section} px-4 py-16 sm:px-8 sm:py-20 lg:py-24`}
    >
      <div className={`mx-auto w-full ${measure}`}>
        <Reveal className="flex flex-col items-center text-center">
          {Icon ? (
            <span aria-hidden="true" className={palette.kicker}>
              <Icon size={30} strokeWidth={1.6} />
            </span>
          ) : null}
          {ordinal ? (
            <span
              aria-hidden="true"
              className={`mt-3 font-display text-base tracking-[0.35em] ${palette.kicker}`}
            >
              — {ordinal} —
            </span>
          ) : null}
          <Heading
            id={headingId}
            className={`mt-3 font-display text-[clamp(2.2rem,5.5vw,3.4rem)] leading-[1.05] text-balance ${palette.title}`}
          >
            {title}
          </Heading>
          <LeafDivider className="mt-5" />
        </Reveal>
        <Reveal delay={130} className="mt-10">
          {children}
        </Reveal>
      </div>
    </section>
  )
}
