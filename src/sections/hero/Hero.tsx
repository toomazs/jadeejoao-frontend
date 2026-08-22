import { siriguela } from '../../assets'
import { ButtonLink } from '../../components/ui/Button'
import { Markdown } from '../../components/ui/Markdown'
import type { HeroContent } from '../../lib/content'
import {
  formatEventDate,
  formatEventTimeShort,
  formatEventWeekday,
  formatMilestoneDate,
} from '../../lib/format'
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
 * The rotating wax-seal stamp of the reference, in our brand: circular text
 * around the seriguela sprig. Decorative — the invitation itself speaks.
 */
function InvitedStamp() {
  return (
    <div
      aria-hidden="true"
      className="relative h-28 w-28 select-none motion-safe:animate-[spin_32s_linear_infinite]"
    >
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <defs>
          <path id="stamp-circle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
        </defs>
        <text className="fill-dark-gray font-body text-[8.5px] tracking-[0.32em] uppercase">
          <textPath href="#stamp-circle">{uiStrings.invitedStamp}</textPath>
        </text>
      </svg>
      <img
        src={siriguela}
        alt=""
        className="absolute top-1/2 left-1/2 h-10 w-auto -translate-x-1/2 -translate-y-1/2 opacity-70"
      />
    </div>
  )
}

/**
 * One arch of the triptych: the arch-topped photo (or the seriguela while the
 * couple hasn't uploaded one), the oversized ordinal overlapping its foot,
 * the thin drop line, then date and label — all content from the API.
 */
function MilestoneArch({ milestone, index }: { milestone: Milestone; index: number }) {
  const ordinal = `0${index + 1}.`
  return (
    <figure className="flex w-[17rem] max-w-[72vw] shrink-0 snap-center flex-col items-center lg:w-auto lg:max-w-none lg:shrink">
      <div className="relative w-full">
        <div className="aspect-[10/16] w-full overflow-hidden rounded-t-full border border-olive-line bg-cream-soft">
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
        <span
          aria-hidden="true"
          className="absolute -right-2 -bottom-6 font-display text-6xl leading-none text-olive sm:text-7xl lg:-right-3"
        >
          {ordinal}
        </span>
      </div>
      <span aria-hidden="true" className="mt-8 h-10 w-px bg-olive-line" />
      <figcaption className="mt-4 flex flex-col items-center gap-1 text-center">
        {milestone.date ? (
          <span className="font-body text-xs tracking-[0.3em] text-dark-gray">
            {formatMilestoneDate(milestone.date)}
          </span>
        ) : null}
        <span className="font-display text-xl text-ink sm:text-2xl">{milestone.label}</span>
      </figcaption>
    </figure>
  )
}

/** The couple's names as the reference's stacked display block. */
function StackedNames({ names }: { names: string }) {
  const parts = names.split(/\s*&\s*/)
  if (parts.length !== 2) {
    return (
      <h1 id="hero-heading" className="font-display text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.98] text-olive">
        {names}
      </h1>
    )
  }
  return (
    <h1
      id="hero-heading"
      aria-label={names}
      className="flex flex-col font-display text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.98] text-olive"
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
 * The gate, desktop-first after the reference: editorial split hero — stacked
 * display names, date, city and the call to action on the left; the milestone
 * arch triptych on the right; the invited stamp sealing the corner. On phones
 * the triptych becomes a snap-scroll shelf.
 */
export function Hero({ content }: HeroProps) {
  const countdown = useCountdown(content.event_datetime)
  const milestones = content.milestones.slice(0, 3)

  return (
    <section id="hero" aria-labelledby="hero-heading" className="px-4 pt-8 sm:px-8 lg:px-14">
      <div className="mx-auto grid w-full max-w-[90rem] gap-14 lg:min-h-[calc(100svh-7.5rem)] lg:grid-cols-12 lg:items-center lg:gap-10">
        {/* Left column: the invitation. */}
        <div className="flex flex-col items-start lg:col-span-5">
          <p className="font-body text-lg text-dark-gray italic sm:text-xl">{content.title}</p>

          <div className="mt-4">
            <StackedNames names={content.couple_names} />
          </div>

          <p className="mt-8 font-body text-lg text-ink sm:text-xl">
            {formatEventWeekday(content.event_datetime)} ·{' '}
            {formatEventDate(content.event_datetime)} ·{' '}
            {formatEventTimeShort(content.event_datetime)}
          </p>
          <p className="mt-2 font-accent text-3xl text-terracotta sm:text-4xl">
            {content.city_label}
          </p>

          {content.body ? (
            <Markdown
              text={content.body}
              className="mt-6 max-w-md font-body text-base leading-relaxed text-dark-gray sm:text-lg"
            />
          ) : null}

          <div className="mt-9 flex flex-wrap items-center gap-6">
            <ButtonLink href="#rsvp">{uiStrings.confirmCta}</ButtonLink>
            <InvitedStamp />
          </div>

          {countdown ? (
            <div
              role="timer"
              aria-label={uiStrings.countdownLabel}
              className="mt-10 inline-flex items-start divide-x divide-olive bg-deep-olive px-4 py-3 sm:px-5"
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

        {/* Right column: the story triptych. */}
        {milestones.length > 0 ? (
          <div className="lg:col-span-7">
            <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-8 sm:justify-center lg:mx-0 lg:grid lg:grid-cols-3 lg:items-start lg:gap-8 lg:overflow-visible lg:px-0 lg:pb-0">
              {milestones.map((milestone, index) => (
                <MilestoneArch key={milestone.label} milestone={milestone} index={index} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
