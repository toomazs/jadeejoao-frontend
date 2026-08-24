import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import type { SectionSlug } from '../../lib/content'
import { BOTANICALS } from './Botanicals'
import { LeafDivider } from './LeafDivider'
import { Reveal } from './Reveal'

/** Full-bleed color rooms — the palette does the separating, not hairlines. */
const TONES = {
  cream: {
    section: 'bg-cream',
    kicker: 'text-terracotta',
    rule: 'bg-terracotta',
    title: 'text-olive',
    foliage: 'text-olive/25',
  },
  veil: {
    section: 'bg-veil',
    kicker: 'text-terracotta',
    rule: 'bg-terracotta',
    title: 'text-deep-olive',
    foliage: 'text-deep-olive/25',
  },
  terracotta: {
    section: 'bg-terracotta',
    kicker: 'text-gold-sand',
    rule: 'bg-gold-sand',
    title: 'text-cream',
    foliage: 'text-gold-sand/30',
  },
} as const

interface SectionShellProps {
  slug: SectionSlug
  title: string
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
  // Each room draws two different plants, cycling through the set so the
  // page never repeats the same pair twice in a row.
  const seed = slug.length
  const NearPlant = BOTANICALS[seed % BOTANICALS.length]
  const FarPlant = BOTANICALS[(seed + 2) % BOTANICALS.length]

  return (
    <section
      id={slug}
      aria-labelledby={headingId}
      className={`relative overflow-hidden ${palette.section} px-4 py-16 sm:px-8 sm:py-20 lg:py-24`}
    >
      {/* The garden behind the room: two plants of the set, faint, turning
          slowly enough that you notice only if you stop to look. */}
      <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${palette.foliage}`}>
        <NearPlant className="turn-slow absolute -top-16 -left-14 h-64 w-auto opacity-25 sm:h-80" />
        <FarPlant className="turn-slower absolute -right-16 -bottom-20 h-72 w-auto opacity-20 sm:h-96" />
      </div>

      <div className={`relative mx-auto w-full ${measure}`}>
        <Reveal className="flex flex-col items-center text-center">
          {Icon ? (
            <span aria-hidden="true" className={palette.kicker}>
              <Icon size={30} strokeWidth={1.6} />
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
