import { logo } from '../../assets'
import { formatEventDate } from '../../lib/format'

interface FooterProps {
  /** From the hero payload — the footer restates the invitation's signature. */
  coupleNames?: string
  eventDatetime?: string
}

/**
 * The farewell: the page's dark close in deep olive, sealed with the couple's
 * monogram — inverted to cream so the olive artwork reads on the dark ground.
 */
export function Footer({ coupleNames, eventDatetime }: FooterProps) {
  if (!coupleNames && !eventDatetime) {
    return null
  }

  return (
    <footer className="mt-10 bg-deep-olive px-4 py-16 text-center sm:py-20">
      <img
        src={logo}
        alt=""
        aria-hidden="true"
        className="mx-auto h-16 w-auto brightness-0 invert opacity-90 select-none"
      />
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
