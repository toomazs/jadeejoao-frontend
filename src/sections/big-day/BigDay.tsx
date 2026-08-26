import {
  Baby,
  Bus,
  Cake,
  Camera,
  Car,
  Church,
  ClipboardCheck,
  Clock,
  Coffee,
  Disc3,
  Dog,
  DoorOpen,
  Flame,
  Flower,
  Flower2,
  Gem,
  Gift,
  GlassWater,
  Guitar,
  HandHeart,
  Heart,
  HeartHandshake,
  IceCreamCone,
  Images,
  Martini,
  Mic,
  Moon,
  Music,
  PartyPopper,
  Sparkles,
  Sunset,
  Users,
  Utensils,
  UtensilsCrossed,
  Waves,
  Wine,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Inline, Markdown } from '../../components/ui/Markdown'
import { Reveal } from '../../components/ui/Reveal'
import type { BigDayContent } from '../../lib/content'
import { formatEventDate, ceremonyMoment } from '../../lib/format'
import { uiStrings } from '../../lib/ui-strings'
import { useCountdown } from '../../lib/useCountdown'

interface BigDayProps {
  content: BigDayContent
  /** Composition from the hero payload: the countdown target. */
  eventDate?: string
}

type ProgrammeItem = BigDayContent['programme'][number]

/**
 * The emblems the couple can choose from in the admin. The payload carries a
 * name, this file draws it — so the schedule is editable without a deploy.
 */
/**
 * The little glyph beside an hour on the programme.
 *
 * Keyed by an English word rather than an icon name, so the panel can offer a
 * fixed set and the drawing can change without rewriting anybody's payload.
 * The first ten are the ones the couple already used; the rest are there so
 * choosing one is picking from a list instead of guessing a word.
 */
const PROGRAMME_ICONS: Record<string, LucideIcon> = {
  guests: Users,
  ceremony: Church,
  vows: Heart,
  rings: Gem,
  party: PartyPopper,
  music: Music,
  toast: Martini,
  cake: Cake,
  photo: Camera,
  flowers: Flower2,
  arrival: DoorOpen,
  welcome: HandHeart,
  blessing: HeartHandshake,
  speech: Mic,
  dinner: UtensilsCrossed,
  lunch: Utensils,
  drinks: Wine,
  bar: GlassWater,
  coffee: Coffee,
  dessert: IceCreamCone,
  dance: Disc3,
  band: Guitar,
  candles: Flame,
  sparklers: Sparkles,
  sunset: Sunset,
  night: Moon,
  bouquet: Flower,
  car: Car,
  shuttle: Bus,
  gifts: Gift,
  children: Baby,
  pets: Dog,
  photos: Images,
  checkin: ClipboardCheck,
  clock: Clock,
  farewell: Waves,
}

/** One unit of the countdown: the numeral leads, its name whispers beneath. */
function CountdownUnit({ value, unit }: { value: number; unit: string }) {
  return (
    <div className="flex min-w-[4.5rem] flex-col items-center">
      <span
        key={value}
        className="tick font-display text-[clamp(2.6rem,7vw,4rem)] leading-none text-olive tabular-nums"
      >
        {String(value).padStart(2, '0')}
      </span>
      <span className="mt-2 font-body text-[0.7rem] tracking-[0.3em] text-terracotta uppercase">
        {unit}
      </span>
    </div>
  )
}

/** One line of the programme, hung on the rail. */
function ProgrammeRow({
  id,
  item,
  index,
}: {
  /** Addressable, so the panel can show the hour being edited. */
  id?: string
  item: ProgrammeItem
  index: number
}) {
  const Icon = item.icon ? (PROGRAMME_ICONS[item.icon] ?? null) : null
  return (
    <Reveal
      as="li"
      id={id}
      delay={Math.min(index, 6) * 60}
      className="relative grid grid-cols-[4.5rem_2.5rem_1fr] items-baseline"
    >
      <time
        className={`pb-8 text-right font-display tabular-nums ${
          Icon ? 'text-2xl text-olive' : 'text-lg text-dark-gray'
        }`}
      >
        {item.time}
      </time>

      {/* The rail passes through this column; the marker sits on it. */}
      <span aria-hidden="true" className="relative flex justify-center self-stretch">
        {Icon ? (
          <span className="relative z-10 mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-olive bg-cream text-olive">
            <Icon size={17} strokeWidth={1.7} />
          </span>
        ) : (
          <span className="relative z-10 mt-2.5 h-1.5 w-1.5 rotate-45 bg-terracotta" />
        )}
      </span>

      <span
        className={`pb-8 font-body ${Icon ? 'text-lg text-ink' : 'text-base text-dark-gray'}`}
      >
        <Inline text={item.label} />
      </span>
    </Reveal>
  )
}

/**
 * The day itself, on cream: the countdown, the
 * couple's guidance, and the programme hung on a single gold rail — the
 * moments that anchor the day carrying an emblem, the steps between them
 * kept quiet.
 */
export function BigDay({ content, eventDate }: BigDayProps) {
  // The countdown lands on the ceremony hour, which the payload no longer
  // carries — it is a constant of the day, not something to edit.
  const countdown = useCountdown(ceremonyMoment(eventDate ?? ''))
  const programme = content.programme

  return (
    <section
      id="big_day"
      aria-labelledby="big_day-heading"
      className="relative overflow-hidden bg-cream px-4 py-20 sm:px-8 sm:py-28"
    >
      <div className="relative mx-auto w-full max-w-3xl">
        <Reveal className="flex flex-col items-center text-center">
          <h2
            id="big_day-heading"
            className="font-display text-[clamp(2.4rem,6vw,3.8rem)] leading-[1.05] text-balance text-olive"
          >
            {content.title}
          </h2>
        </Reveal>

        {countdown ? (
          <Reveal delay={110}>
            <div
              role="timer"
              aria-label={uiStrings.countdownLabel}
              className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-8 border-y border-sand-line py-8 sm:gap-x-12"
            >
              <CountdownUnit value={countdown.days} unit={uiStrings.countdown.days} />
              <CountdownUnit value={countdown.hours} unit={uiStrings.countdown.hours} />
              <CountdownUnit value={countdown.minutes} unit={uiStrings.countdown.minutes} />
              <CountdownUnit value={countdown.seconds} unit={uiStrings.countdown.seconds} />
            </div>
            {eventDate ? (
              <p className="mt-4 text-center font-body text-xs tracking-[0.28em] text-dark-gray uppercase">
                {formatEventDate(eventDate)}
              </p>
            ) : null}
          </Reveal>
        ) : null}

        {content.body ? (
          <Reveal delay={130}>
            <Markdown
              text={content.body}
              className="mx-auto mt-12 max-w-prose text-center font-body text-lg leading-relaxed"
            />
          </Reveal>
        ) : null}

        {programme.length > 0 ? (
          <div className="relative mx-auto mt-14 w-fit">
            {/* One continuous rail behind every marker. */}
            <span
              aria-hidden="true"
              className="absolute top-2 bottom-6 left-[5.75rem] w-px bg-sand-line"
            />
            <ol className="relative">
              {programme.map((item, index) => (
                <ProgrammeRow
                  key={`${item.time}-${item.label}`}
                  id={`programme-${index}`}
                  item={item}
                  index={index}
                />
              ))}
            </ol>
          </div>
        ) : null}

        {content.venue_notes ? (
          <Reveal className="mt-10 flex flex-col items-center">
            <p className="max-w-prose border-t border-sand-line pt-6 text-center font-body text-base text-dark-gray italic">
              <Inline text={content.venue_notes} />
            </p>
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}
