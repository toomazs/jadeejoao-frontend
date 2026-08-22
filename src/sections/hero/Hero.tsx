import { logo, siriguela } from '../../assets'
import { ButtonLink } from '../../components/ui/Button'
import { Markdown } from '../../components/ui/Markdown'
import type { HeroContent } from '../../lib/content'
import { formatEventDate, formatEventTimeShort, formatEventWeekday } from '../../lib/format'
import { uiStrings } from '../../lib/ui-strings'
import { useCountdown } from '../../lib/useCountdown'

interface HeroProps {
  content: HeroContent
}

/** One countdown cell: engraved numeral over its unit, on the deep-olive plaque. */
function CountdownCell({ value, unit }: { value: number; unit: string }) {
  return (
    <div className="flex min-w-14 flex-col items-center gap-1 sm:min-w-16">
      <span className="font-display text-3xl leading-none text-gold-sand tabular-nums sm:text-4xl">
        {String(value).padStart(2, '0')}
      </span>
      <span className="font-body text-xs tracking-[0.22em] text-cream-soft uppercase">{unit}</span>
    </div>
  )
}

/**
 * The gate: a full-height framed threshold on cream — monogram crest, the
 * couple's names at full display scale, the spelled-out date, the script city,
 * and the deep-olive countdown plaque ticking at the frame's foot.
 */
export function Hero({ content }: HeroProps) {
  const countdown = useCountdown(content.event_datetime)

  return (
    <section id="hero" aria-labelledby="hero-heading" className="px-4 pt-6 pb-4 sm:pt-10 sm:pb-6">
      <div className="relative mx-auto flex min-h-[calc(100svh-6.5rem)] w-full max-w-3xl flex-col items-center overflow-hidden border border-olive-line px-5 pt-12 pb-8 text-center sm:min-h-[calc(100svh-8rem)] sm:px-12 sm:pt-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-1.5 border border-sand-line sm:inset-2"
        />
        {/* The seriguela branch leans over the gate, as it does over the real garden. */}
        <img
          src={siriguela}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-14 h-72 w-auto rotate-[200deg] opacity-30 select-none sm:-top-20 sm:-right-12 sm:h-96"
        />
        <img
          src={siriguela}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-16 hidden h-80 w-auto rotate-[24deg] opacity-20 select-none sm:block"
        />

        <div className="relative my-auto flex flex-col items-center">
          <img src={logo} alt="" className="h-24 w-auto sm:h-32" />

          <p className="mt-7 font-body text-xl text-dark-gray italic sm:text-2xl">
            {content.title}
          </p>

          <h1
            id="hero-heading"
            className="mt-3 font-display text-[clamp(3.25rem,15vw,6rem)] leading-[1.05] text-balance text-olive"
          >
            {content.couple_names}
          </h1>

          <p className="mt-6 flex flex-col items-center gap-1 font-body text-xl text-ink sm:text-2xl">
            <span>
              {formatEventWeekday(content.event_datetime)} ·{' '}
              {formatEventDate(content.event_datetime)}
            </span>
            <span className="text-lg text-dark-gray sm:text-xl">
              {formatEventTimeShort(content.event_datetime)}
            </span>
          </p>

          <p className="mt-3 font-accent text-3xl text-terracotta sm:text-4xl">
            {content.city_label}
          </p>

          {content.body ? (
            <Markdown
              text={content.body}
              className="mt-6 max-w-md font-body text-lg leading-relaxed text-ink sm:text-xl"
            />
          ) : null}

          <ButtonLink href="#rsvp" className="mt-8">
            {uiStrings.confirmCta}
          </ButtonLink>
        </div>

        {/* The one live object on the page, seated at the gate's foot. */}
        {countdown ? (
          <div
            role="timer"
            aria-label={uiStrings.countdownLabel}
            className="relative mt-10 bg-deep-olive px-5 py-4 sm:px-8"
          >
            <div className="flex items-start divide-x divide-olive">
              <div className="pr-4 sm:pr-6">
                <CountdownCell value={countdown.days} unit={uiStrings.countdown.days} />
              </div>
              <div className="px-4 sm:px-6">
                <CountdownCell value={countdown.hours} unit={uiStrings.countdown.hours} />
              </div>
              <div className="px-4 sm:px-6">
                <CountdownCell value={countdown.minutes} unit={uiStrings.countdown.minutes} />
              </div>
              <div className="pl-4 sm:pl-6">
                <CountdownCell value={countdown.seconds} unit={uiStrings.countdown.seconds} />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
