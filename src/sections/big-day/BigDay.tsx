import { CalendarHeart, Church, MapPin, PartyPopper } from 'lucide-react'

import { ButtonLink } from '../../components/ui/Button'
import { Markdown } from '../../components/ui/Markdown'
import { Reveal } from '../../components/ui/Reveal'
import { SectionShell } from '../../components/ui/SectionShell'
import type { BigDayContent } from '../../lib/content'
import { formatEventDate } from '../../lib/format'
import { uiStrings } from '../../lib/ui-strings'
import { useCountdown } from '../../lib/useCountdown'

interface BigDayProps {
  content: BigDayContent
  ordinal?: string
  /** Composition from the hero payload: the countdown target and date line. */
  eventDatetime?: string
}

/** One countdown pill: bordered square, bold numeral over its unit. */
function CountdownPill({ value, unit }: { value: number; unit: string }) {
  return (
    <div className="flex min-w-[4.5rem] flex-col items-center gap-1 border-2 border-olive bg-cream px-3 py-3">
      <span key={value} className="tick font-display text-3xl leading-none text-olive tabular-nums sm:text-4xl">
        {String(value).padStart(2, '0')}
      </span>
      <span className="font-body text-xs tracking-[0.2em] text-terracotta uppercase">
        {unit}
      </span>
    </div>
  )
}

/** One moment card (ceremony / party): icon, time, guidance and the map action. */
function MomentCard({
  icon: Icon,
  label,
  time,
  dateLine,
}: {
  icon: typeof Church
  label: string
  time?: string
  dateLine?: string
}) {
  return (
    <div className="lift flex flex-col items-center border-2 border-olive-line bg-cream px-6 py-8 text-center">
      <Icon aria-hidden="true" size={34} strokeWidth={1.5} className="text-terracotta" />
      <p className="mt-4 font-display text-2xl text-olive">{label}</p>
      {dateLine ? <p className="mt-2 font-body text-base text-ink">{dateLine}</p> : null}
      {time ? (
        <p className="mt-1 font-display text-3xl text-terracotta">{time}</p>
      ) : null}
      <ButtonLink href="#getting_there" variant="outline" className="mt-6">
        <MapPin aria-hidden="true" size={18} strokeWidth={2} />
        {uiStrings.openMap}
      </ButtonLink>
    </div>
  )
}

/**
 * The day itself: countdown pills under the emblem, the ceremony and party
 * cards, then the full stemmed programme — times engraved, moments beside.
 */
export function BigDay({ content, ordinal, eventDatetime }: BigDayProps) {
  const countdown = useCountdown(eventDatetime ?? '')
  const programme = content.programme
  const ceremonyTime = programme.find((item) => /cerim/i.test(item.label))?.time ?? programme[0]?.time
  const partyTime = programme[programme.length - 1]?.time
  const dateLine = eventDatetime ? formatEventDate(eventDatetime) : undefined

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

      <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
        <Reveal>
          <MomentCard
            icon={Church}
            label={uiStrings.bigDay.ceremony}
            time={ceremonyTime}
            dateLine={dateLine}
          />
        </Reveal>
        <Reveal delay={120}>
          <MomentCard
            icon={PartyPopper}
            label={uiStrings.bigDay.party}
            time={partyTime}
            dateLine={dateLine}
          />
        </Reveal>
      </div>

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

      {content.venue_notes ? (
        <p className="mx-auto mt-10 max-w-prose border-t border-sand-line pt-6 text-center font-body text-base text-dark-gray italic">
          {content.venue_notes}
        </p>
      ) : null}
    </SectionShell>
  )
}
