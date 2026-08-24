import { logo } from '../../assets'
import { formatEventDate } from '../../lib/format'
import { uiStrings } from '../../lib/ui-strings'

interface FooterProps {
  /** From the hero payload — the footer restates the invitation's signature. */
  coupleNames?: string
  eventDatetime?: string
}

/** The couple's names with the logo's script "e" in place of the ampersand. */
function Signature({ names }: { names: string }) {
  const parts = names.split(/\s*&\s*/)
  if (parts.length !== 2) {
    return <span>{names}</span>
  }
  return (
    <span aria-label={names}>
      <span aria-hidden="true">{parts[0]}</span>
      <span aria-hidden="true" className="font-accent text-[0.8em] text-gold-sand">
        {' '}
        e{' '}
      </span>
      <span aria-hidden="true">{parts[1]}</span>
    </span>
  )
}

/**
 * The farewell: the couple's monogram and signature on the left, the date
 * beneath — and the maker's line kept small on the right, as a colophon.
 */
export function Footer({ coupleNames, eventDatetime }: FooterProps) {
  if (!coupleNames && !eventDatetime) {
    return null
  }

  return (
    <footer className="bg-deep-olive px-5 py-14 sm:px-10 sm:py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-5">
          <img
            src={logo}
            alt=""
            aria-hidden="true"
            className="h-14 w-auto shrink-0 brightness-0 invert opacity-90 select-none sm:h-16"
          />
          <div>
            {coupleNames ? (
              <p className="font-display text-3xl leading-none text-cream sm:text-4xl">
                <Signature names={coupleNames} />
              </p>
            ) : null}
            {eventDatetime ? (
              <p className="mt-2.5 font-body text-sm tracking-[0.22em] text-gold-sand uppercase">
                {formatEventDate(eventDatetime)}
              </p>
            ) : null}
          </div>
        </div>

        <p className="font-body text-xs tracking-[0.12em] text-cream/50 sm:text-right">
          {uiStrings.madeBy}{' '}
          <a
            href="https://instagram.com/tomazdudux"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-cream/30 underline-offset-4 transition-colors hover:text-gold-sand"
          >
            Eduardo Tomaz
          </a>
        </p>
      </div>
    </footer>
  )
}
