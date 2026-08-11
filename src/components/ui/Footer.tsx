import { formatEventDate } from '../../lib/format'
import { LeafGlyph } from './LeafGlyph'

interface FooterProps {
  /** From the hero payload — the footer restates the invitation's signature. */
  coupleNames?: string
  eventDatetime?: string
}

/**
 * The farewell: the page's dark close in deep olive. Brand artwork is
 * olive-on-transparent (invisible here), so the motif renders as the authored
 * gold leaf glyph instead.
 */
export function Footer({ coupleNames, eventDatetime }: FooterProps) {
  if (!coupleNames && !eventDatetime) {
    return null
  }

  return (
    <footer className="mt-10 bg-deep-olive px-4 py-16 text-center sm:py-20">
      <LeafGlyph className="mx-auto h-7 w-7 -rotate-12 text-gold-sand" />
      {coupleNames ? (
        <p className="mt-5 font-display text-3xl text-cream sm:text-4xl">{coupleNames}</p>
      ) : null}
      {eventDatetime ? (
        <p className="mt-3 font-body text-lg text-gold-sand italic">
          {formatEventDate(eventDatetime)}
        </p>
      ) : null}
    </footer>
  )
}
