import { useRef } from 'react'

import { seg, useChapterProgress, usePrefersReducedMotion } from '../../lib/scrollytelling'

interface InvitationInterludeProps {
  /** The invitation sentence (our_story.body), revealed word by word. */
  text: string
}

/** The seriguela branch stem, drawn bottom-up. */
const STEM = 'M62 204 C58 168 64 130 60 92 C57 62 62 34 61 8'

/** Leaflet outlines along the stem, drawn after it (bottom pairs first). */
const LEAVES = [
  'M60 176 C46 174 36 166 34 152 C48 154 58 162 60 176',
  'M61 168 C75 164 84 154 84 140 C71 144 62 154 61 168',
  'M60 142 C47 139 38 130 37 117 C50 120 59 128 60 142',
  'M61 132 C74 128 82 118 81 105 C69 109 61 119 61 132',
  'M60 106 C48 103 41 95 40 83 C52 86 59 93 60 106',
  'M61 96 C73 92 80 83 79 71 C68 75 61 84 61 96',
  'M60 72 C50 69 44 62 43 52 C53 55 59 61 60 72',
  'M61 62 C71 58 77 50 76 40 C66 44 61 52 61 62',
  'M61 34 C55 26 55 16 61 6 C67 16 67 26 61 34',
]

/**
 * One seriguela branch as line art — every path carries pathLength=1, so the
 * dash trick draws it stroke by stroke as `draw` walks from 0 to 1.
 */
function SeriguelaDrawing({ draw, className = '' }: { draw: number; className?: string }) {
  return (
    <svg viewBox="0 0 120 210" fill="none" className={className} aria-hidden="true">
      <path
        d={STEM}
        className="text-cream"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        pathLength={1}
        style={{ strokeDasharray: 1, strokeDashoffset: 1 - seg(draw, 0, 0.4) }}
      />
      {LEAVES.map((leaf, index) => (
        <path
          key={leaf}
          d={leaf}
          className="text-gold-sand"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: 1 - seg(draw, 0.32 + index * 0.06, 0.52 + index * 0.06),
          }}
        />
      ))}
    </svg>
  )
}

/**
 * The invitation, film-cut between the chapters and the big day: a terracotta
 * room where the seriguela draws itself and the couple's sentence lights up
 * word by word while the page scrolls. No navbar here either (data-nav-hide).
 */
export function InvitationInterlude({ text }: InvitationInterludeProps) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const progress = useChapterProgress(ref, !reduced)
  const words = text.split(/\s+/)
  const draw = reduced ? 1 : seg(progress, 0.04, 0.55)

  const sentence = (
    <p className="mt-10 max-w-3xl font-display text-[clamp(2.1rem,5.5vw,4rem)] leading-[1.15] text-cream">
      {words.map((word, index) => {
        const from = 0.3 + (index / words.length) * 0.5
        const arrive = reduced ? 1 : seg(progress, from, from + 0.07)
        return (
          <span
            key={`${word}-${index}`}
            className="inline-block"
            style={
              reduced
                ? undefined
                : { opacity: 0.16 + arrive * 0.84, transform: `translateY(${(1 - arrive) * 14}px)` }
            }
          >
            {word}
            {index < words.length - 1 ? ' ' : ''}
          </span>
        )
      })}
    </p>
  )

  if (reduced) {
    return (
      <section ref={ref} data-nav-hide="" className="bg-terracotta px-5 py-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <SeriguelaDrawing draw={1} className="h-36 w-auto sm:h-44" />
          {sentence}
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} data-nav-hide="" className="relative bg-terracotta" style={{ height: '240vh' }}>
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden px-5">
        {/* Faint branches turning with the scroll, one each way. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 -left-20 h-[30rem] opacity-10 sm:-left-10"
          style={{ transform: `translateY(-50%) rotate(${progress * 46 - 23}deg)` }}
        >
          <SeriguelaDrawing draw={1} className="h-full w-auto" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 -right-16 h-[22rem] opacity-10 sm:-right-6"
          style={{ transform: `translateY(-50%) rotate(${-progress * 40 + 20}deg)` }}
        >
          <SeriguelaDrawing draw={1} className="h-full w-auto" />
        </div>

        <div className="relative flex max-w-4xl flex-col items-center text-center">
          <SeriguelaDrawing draw={draw} className="h-36 w-auto sm:h-44" />
          {sentence}
        </div>
      </div>
    </section>
  )
}
