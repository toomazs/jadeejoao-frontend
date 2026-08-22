import { logo, siriguela } from '../../assets'
import { ButtonLink } from '../../components/ui/Button'
import type { HeroContent } from '../../lib/content'
import { formatEventDate, formatEventWeekday, formatMilestoneDate } from '../../lib/format'
import { uiStrings } from '../../lib/ui-strings'
import { useCountdown } from '../../lib/useCountdown'

interface HeroProps {
  content: HeroContent
}

type Milestone = HeroContent['milestones'][number]

/** One countdown cell: engraved numeral over its unit, on the deep-olive plaque. */
function CountdownCell({ value, unit }: { value: number; unit: string }) {
  return (
    <div className="flex min-w-12 flex-col items-center gap-0.5 sm:min-w-14">
      <span className="font-display text-2xl leading-none text-gold-sand tabular-nums sm:text-3xl">
        {String(value).padStart(2, '0')}
      </span>
      <span className="font-body text-[0.65rem] tracking-[0.22em] text-cream-soft uppercase">
        {unit}
      </span>
    </div>
  )
}

/**
 * One circle of the story row: the couple's photo (or the seriguela while it
 * is empty), date and label beneath — every word from the API.
 */
function MilestoneCircle({ milestone }: { milestone: Milestone }) {
  return (
    <figure className="flex w-40 shrink-0 snap-center flex-col items-center sm:w-48 lg:w-56">
      <div className="aspect-square w-full overflow-hidden rounded-full border border-olive-line bg-cream-soft">
        {milestone.image_url ? (
          <img
            src={milestone.image_url}
            alt={milestone.label}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="relative h-full w-full">
            <img
              src={siriguela}
              alt=""
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 h-3/5 w-auto -translate-x-1/2 -translate-y-1/2 opacity-25 select-none"
            />
          </div>
        )}
      </div>
      <figcaption className="mt-4 flex flex-col items-center gap-1 text-center">
        {milestone.date ? (
          <span className="font-body text-xs tracking-[0.3em] text-dark-gray">
            {formatMilestoneDate(milestone.date)}
          </span>
        ) : null}
        <span className="font-display text-lg text-ink sm:text-xl">{milestone.label}</span>
      </figcaption>
    </figure>
  )
}

/** The couple's names as a stacked display block, the script "e" from the logo between them. */
function StackedNames({ names }: { names: string }) {
  const parts = names.split(/\s*&\s*/)
  if (parts.length !== 2) {
    return (
      <h1
        id="hero-heading"
        className="font-display text-[clamp(3.25rem,8vw,7rem)] leading-[0.98] text-olive"
      >
        {names}
      </h1>
    )
  }
  return (
    <h1
      id="hero-heading"
      aria-label={names}
      className="flex flex-col items-center font-display text-[clamp(3.25rem,8vw,7rem)] leading-[0.98] text-olive"
    >
      <span>{parts[0]}</span>
      <span className="flex items-baseline gap-4">
        <span aria-hidden="true" className="font-accent text-[0.55em] text-terracotta">
          e
        </span>
        <span>{parts[1]}</span>
      </span>
    </h1>
  )
}

/**
 * The gate, quiet and monumental: monogram, the stacked names, one date line,
 * the city, one welcome sentence, the call to action and the countdown — then
 * the story circles beneath. Nothing else competes with the names.
 */
export function Hero({ content }: HeroProps) {
  const countdown = useCountdown(content.event_datetime)
  const milestones = content.milestones.slice(0, 3)

  return (
    <section id="hero" aria-labelledby="hero-heading" className="px-4 pt-10 sm:px-8 lg:pt-14">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center text-center">
        <img src={logo} alt="" className="h-24 w-auto sm:h-28" />

        <div className="mt-8">
          <StackedNames names={content.couple_names} />
        </div>

        <p className="mt-8 font-body text-lg text-ink sm:text-xl">
          {formatEventWeekday(content.event_datetime)} ·{' '}
          {formatEventDate(content.event_datetime)}
        </p>
        <p className="mt-2 font-accent text-3xl text-terracotta sm:text-4xl">
          {content.city_label}
        </p>

        {content.body ? (
          <p className="mt-6 max-w-xl font-body text-lg leading-relaxed text-dark-gray sm:text-xl">
            {content.body}
          </p>
        ) : null}

        <div className="mt-9 flex flex-col items-center gap-8">
          <ButtonLink href="#rsvp">{uiStrings.confirmCta}</ButtonLink>

          {countdown ? (
            <div
              role="timer"
              aria-label={uiStrings.countdownLabel}
              className="inline-flex items-start divide-x divide-olive bg-deep-olive px-4 py-3 sm:px-5"
            >
              <div className="pr-3 sm:pr-5">
                <CountdownCell value={countdown.days} unit={uiStrings.countdown.days} />
              </div>
              <div className="px-3 sm:px-5">
                <CountdownCell value={countdown.hours} unit={uiStrings.countdown.hours} />
              </div>
              <div className="px-3 sm:px-5">
                <CountdownCell value={countdown.minutes} unit={uiStrings.countdown.minutes} />
              </div>
              <div className="pl-3 sm:pl-5">
                <CountdownCell value={countdown.seconds} unit={uiStrings.countdown.seconds} />
              </div>
            </div>
          ) : null}
        </div>

        {milestones.length > 0 ? (
          <div className="mt-14 w-full lg:mt-16">
            <div className="-mx-4 flex snap-x snap-mandatory justify-start gap-8 overflow-x-auto px-4 pb-4 sm:justify-center lg:gap-14 lg:overflow-visible lg:pb-0">
              {milestones.map((milestone) => (
                <MilestoneCircle key={milestone.label} milestone={milestone} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
