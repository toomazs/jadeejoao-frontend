import { CalendarHeart, MapPin } from 'lucide-react'

import { ButtonLink } from '../../components/ui/Button'
import { Markdown } from '../../components/ui/Markdown'
import { Reveal } from '../../components/ui/Reveal'
import { SectionShell } from '../../components/ui/SectionShell'
import type { BigDayContent } from '../../lib/content'
import { uiStrings } from '../../lib/ui-strings'
import { useCountdown } from '../../lib/useCountdown'

interface BigDayProps {
  content: BigDayContent
  ordinal?: string
  /** Composition from the hero payload: the countdown target. */
  eventDatetime?: string
}

/** One countdown pill: bordered square, numeral over its unit. */
function CountdownPill({ value, unit }: { value: number; unit: string }) {
  return (
    <div className="flex min-w-[4.5rem] flex-col items-center gap-1 border-2 border-olive bg-cream px-3 py-3">
      <span
        key={value}
        className="tick font-display text-3xl leading-none text-olive tabular-nums sm:text-4xl"
      >
        {String(value).padStart(2, '0')}
      </span>
      <span className="font-body text-xs tracking-[0.2em] text-terracotta uppercase">{unit}</span>
    </div>
  )
}

/**
 * The day itself: the countdown, the guidance, then the full programme as a
 * stemmed timeline — everything happens in one place, so one map action.
 */
export function BigDay({ content, ordinal, eventDatetime }: BigDayProps) {
  const countdown = useCountdown(eventDatetime ?? '')
  const programme = content.programme

  return (
    <SectionShell
      slug="big_day"
      title={content.title}
      ordinal={ordinal}
      icon={CalendarHeart}
      tone="cream"
      width="wide"
    >
      {countdown ? (
        <div
          role="timer"
          aria-label={uiStrings.countdownLabel}
          className="flex flex-wrap justify-center gap-3 sm:gap-4"
        >
          <CountdownPill value={countdown.days} unit={uiStrings.countdown.days} />
          <CountdownPill value={countdown.hours} unit={uiStrings.countdown.hours} />
          <CountdownPill value={countdown.minutes} unit={uiStrings.countdown.minutes} />
          <CountdownPill value={countdown.seconds} unit={uiStrings.countdown.seconds} />
        </div>
      ) : null}

      {content.body ? (
        <Markdown
          text={content.body}
          className="mx-auto mt-10 max-w-prose text-center font-body text-lg leading-relaxed"
        />
      ) : null}

      {programme.length > 0 ? (
        <ol className="relative mx-auto mt-12 max-w-md">
          <span aria-hidden="true" className="absolute inset-y-1 left-[5.5rem] w-px bg-sand-line" />
          {programme.map((item, index) => (
            <Reveal
              as="li"
              key={`${item.time}-${item.label}`}
              delay={index * 60}
              className="relative grid grid-cols-[4rem_1fr] gap-x-12 pb-6 last:pb-0"
            >
              <span
                aria-hidden="true"
                className="absolute top-2 left-[5.5rem] h-2 w-2 -translate-x-1/2 rotate-45 bg-terracotta"
              />
              <time className="text-right font-display text-xl leading-6 text-olive">
                {item.time}
              </time>
              <span className="font-body text-lg leading-6">{item.label}</span>
            </Reveal>
          ))}
        </ol>
      ) : null}

      <div className="mt-10 flex justify-center">
        <ButtonLink href="#getting_there" variant="outline">
          <MapPin aria-hidden="true" size={18} strokeWidth={2} />
          {uiStrings.openMap}
        </ButtonLink>
      </div>

      {content.venue_notes ? (
        <p className="mx-auto mt-10 max-w-prose border-t border-sand-line pt-6 text-center font-body text-base text-dark-gray italic">
          {content.venue_notes}
        </p>
      ) : null}
    </SectionShell>
  )
}
