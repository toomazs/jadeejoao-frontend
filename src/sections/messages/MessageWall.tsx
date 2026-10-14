import { useLayoutEffect, useRef, useState } from 'react'

import { Markdown } from '../../components/ui/Markdown'
import { Modal } from '../../components/ui/Modal'
import { usePrefersReducedMotion } from '../../lib/scrollytelling'

/** One recado as the public endpoint hands it over. */
export interface WallMessage {
  message_id: string
  author_name: string
  body: string
}

/**
 * Seconds a single card takes to cross, which sets the pace for any number of
 * them. A fixed duration would mean six recados crawl and sixty race past.
 */
const SECONDS_PER_CARD = 13

/** Below this there is no wall to speak of — they simply sit there, centred. */
const ENOUGH_TO_SCROLL = 4

function Card({
  message,
  onOpen,
  echo,
}: {
  message: WallMessage
  onOpen: () => void
  /** The second copy, which exists only so the loop can close. */
  echo?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      // The echo is the same wall again, not a second one: screen readers skip
      // it, and the keyboard never stops on it twice.
      aria-hidden={echo}
      tabIndex={echo ? -1 : undefined}
      aria-label={`Ler o recado de ${message.author_name}`}
      // A fixed height, not a clamp. A recado may run to two thousand
      // characters across several paragraphs, and line-clamp cannot count lines
      // through paragraph elements — it needs one block of inline text. Giving
      // the card its height and letting the body be cut keeps every card in the
      // row the same size whatever anybody wrote.
      // The space between cards is the card's own right margin, not a flex gap
      // on the track. A gap sits *between* items, so a track of two identical
      // halves is one gap short of twice a half — and the loop, which travels
      // exactly half the width, would land half a gap off and visibly jump.
      className="mr-3 flex h-[9.5rem] w-[14rem] shrink-0 cursor-pointer flex-col border border-gold-sand/35 bg-cream/10 px-4 py-3 text-left transition-colors hover:border-gold-sand focus-visible:border-gold-sand focus-visible:outline-none sm:mr-4 sm:h-[11.5rem] sm:w-[21rem] sm:px-5 sm:py-4"
    >
      <p className="shrink-0 font-display text-base leading-tight text-gold-sand sm:text-lg">
        {message.author_name}
      </p>
      {/* Where it is cut, it fades rather than stopping mid-letter, so a long
          recado reads as continuing — and the whole card opens it. */}
      <div className="mt-2 flex-1 overflow-hidden [mask-image:linear-gradient(to_bottom,black_70%,transparent)]">
        <Markdown
          text={message.body}
          className="font-body text-sm leading-relaxed text-cream sm:text-base"
        />
      </div>
    </button>
  )
}

function Row({
  messages,
  back,
  onOpen,
}: {
  messages: WallMessage[]
  back?: boolean
  onOpen: (message: WallMessage) => void
}) {
  const frame = useRef<HTMLDivElement>(null)
  const unit = useRef<HTMLDivElement>(null)
  /**
   * How many times the recados are laid end to end to make one half of the
   * track.
   *
   * Seven recados do not reach across a window, and a half shorter than the
   * window means a hole travels round behind them — which is what a wall of
   * four or five messages looked like. So they repeat until there is always
   * something on screen.
   *
   * Measured rather than worked out from the card's width: the width is a
   * class on the card and changes at a breakpoint, and a constant here would be
   * a second copy of it, wrong the first time either one moved.
   */
  const [runs, setRuns] = useState(1)

  useLayoutEffect(() => {
    const measure = () => {
      const across = frame.current?.getBoundingClientRect().width ?? 0
      const once = unit.current?.getBoundingClientRect().width ?? 0
      if (!across || !once) return
      // One more than strictly fits, so the join is never on screen at rest.
      setRuns(Math.max(1, Math.ceil(across / once) + 1))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [messages.length])

  if (messages.length === 0) return null

  // Twice however many it takes: two identical halves, so travelling -50% lands
  // exactly where it started.
  const halves = Array.from({ length: runs * 2 }, (_, index) => index)

  return (
    // Both ends dissolve, so cards arrive and leave rather than being cut
    // against an edge. The fade is generous now that the wall has the whole
    // window to cross — in the width of a text column it was eating the cards.
    // The fade is a share of the screen, not a fixed distance: 7rem off each end
    // of a desk is a margin, and off each end of a phone is more than half the
    // width of the wall.
    <div
      ref={frame}
      className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_2rem,black_calc(100%-2rem),transparent)] sm:[mask-image:linear-gradient(to_right,transparent,black_7rem,black_calc(100%-7rem),transparent)]"
    >
      <div
        className={`flex w-max ${back ? 'marquee-track-back' : 'marquee-track'}`}
        // The pace is per card, so six recados and sixty travel at one speed.
        style={{ animationDuration: `${messages.length * runs * SECONDS_PER_CARD}s` }}
      >
        {halves.map((run) => (
          <div key={run} ref={run === 0 ? unit : undefined} className="flex" aria-hidden={run > 0}>
            {messages.map((message) => (
              <Card
                key={`${run}-${message.message_id}`}
                message={message}
                onOpen={() => onOpen(message)}
                echo={run > 0}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * The recados, going past.
 *
 * Two rows travelling opposite ways, slowly, pausing whenever somebody hovers
 * or tabs into them — the point is to be read, and a wall that will not hold
 * still cannot be. Under prefers-reduced-motion nothing moves at all: the
 * animation lives inside a no-preference block, and the layout below is a wrap
 * that reads perfectly well standing still.
 *
 * A card is a button, because a card is a preview. Someone who writes two
 * paragraphs has their recado cut off at the card's edge, and the one person
 * who most wants it read whole is the one who wrote it — so clicking opens it.
 */
export function MessageWall({ messages }: { messages: WallMessage[] }) {
  const reduced = usePrefersReducedMotion()
  /**
   * Which recado the sheet holds, and whether the sheet is up — two things, not
   * one.
   *
   * Tying the content to the open state emptied the sheet the instant it was
   * dismissed, while it was still fading: for a few frames you got a blank
   * cream box with a close button in it. What is leaving has to keep its words
   * until it has gone. So this is never cleared — the next card overwrites it,
   * and a shut dialog holding the last recado's text costs nothing.
   */
  const [reading, setReading] = useState<WallMessage | null>(null)
  const [open, setOpen] = useState(false)

  const read = (message: WallMessage) => {
    setReading(message)
    setOpen(true)
  }

  if (messages.length === 0) return null

  const sheet = (
    <Modal open={open} onClose={() => setOpen(false)} title={reading?.author_name ?? ''}>
      <Markdown
        text={reading?.body ?? ''}
        className="font-body text-lg leading-relaxed text-ink"
      />
    </Modal>
  )

  if (reduced || messages.length < ENOUGH_TO_SCROLL) {
    return (
      <>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {messages.map((message) => (
            <Card key={message.message_id} message={message} onOpen={() => read(message)} />
          ))}
        </div>
        {sheet}
      </>
    )
  }

  // Alternating rather than splitting down the middle, so both rows fill up
  // from the first few recados instead of one sitting empty until there are
  // enough to reach it.
  const top = messages.filter((_, index) => index % 2 === 0)
  const bottom = messages.filter((_, index) => index % 2 === 1)

  return (
    <>
      {/*
       * Out of the column and across the whole window.
       *
       * The section lays its children out in a measure built for prose — 56rem,
       * centred. A wall of voices read inside that is a wall with its ends cut
       * off a third of the way in from each side of the screen. Nothing else in
       * this room wants the full width; this does, so it takes it here rather
       * than the room giving it up.
       *
       * left-1/2 moves it half the column, -translate-x-1/2 pulls it back half
       * its own width, and its own width is the window. The section clips, so
       * 100vw never becomes a horizontal scrollbar.
       */}
      <div className="marquee-hold relative left-1/2 mt-12 grid w-screen -translate-x-1/2 gap-4">
        <Row messages={top} onOpen={read} />
        <Row messages={bottom} back onOpen={read} />
      </div>
      {sheet}
    </>
  )
}
