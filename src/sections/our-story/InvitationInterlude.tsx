import { useRef } from 'react'
import type { CSSProperties } from 'react'

import { seg, useChapterProgress, usePrefersReducedMotion } from '../../lib/scrollytelling'

interface InvitationInterludeProps {
  /** The invitation sentence (our_story.body), revealed word by word. */
  text: string
}

/** The central seriguela branch stem, drawn bottom-up. */
const STEM = 'M62 204 C58 168 64 130 60 92 C57 62 62 34 61 8'

/** Leaflet outlines along the central stem, drawn after it (bottom pairs first). */
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
 * The central branch as line art — every path carries pathLength=1, so the
 * dash trick draws it stroke by stroke as `draw` walks from 0 to 1. It also
 * grows slightly while being drawn, taking the stage.
 */
function SeriguelaDrawing({ draw, className = '' }: { draw: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 120 210"
      fill="none"
      className={className}
      style={{ transform: `scale(${0.9 + draw * 0.1})` }}
      aria-hidden="true"
    >
      <path
        d={STEM}
        className="text-cream"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        pathLength={1}
        style={{ strokeDasharray: 1, strokeDashoffset: 1 - seg(draw, 0, 0.42) }}
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
            strokeDashoffset: 1 - seg(draw, 0.3 + index * 0.062, 0.5 + index * 0.062),
          }}
        />
      ))}
    </svg>
  )
}

/**
 * The side ornament — deliberately a different plant from the central branch:
 * one long arc with sparse leaflets and a crown of seriguela berries.
 */
function SeriguelaFrond({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 150 260" fill="none" className={className} style={style} aria-hidden="true">
      <path
        d="M20 252 C48 204 76 156 100 96 C110 70 116 46 118 16"
        className="text-cream"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M52 196 C40 190 33 180 34 167 C46 171 52 182 52 196"
        className="text-gold-sand"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M78 152 C90 146 96 136 95 123 C84 128 78 138 78 152"
        className="text-gold-sand"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M97 106 C86 100 81 90 83 78 C93 84 98 94 97 106"
        className="text-gold-sand"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="112" cy="52" r="6" className="text-cream" stroke="currentColor" strokeWidth="2" />
      <circle cx="124" cy="38" r="4.5" className="text-gold-sand" stroke="currentColor" strokeWidth="2" />
      <circle cx="106" cy="32" r="4.5" className="text-gold-sand" stroke="currentColor" strokeWidth="2" />
      <circle cx="118" cy="20" r="3.5" className="text-cream" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

/**
 * The invitation, film-cut between the chapters and the big day: a terracotta
 * room where the seriguela takes the stage drawing itself, and only then the
 * couple's sentence arrives — word by word, out of nothing, while the page
 * scrolls. No navbar here either (data-nav-hide).
 */
export function InvitationInterlude({ text }: InvitationInterludeProps) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const progress = useChapterProgress(ref, !reduced)
  const words = text.split(/\s+/)
  const draw = reduced ? 1 : seg(progress, 0.04, 0.58)

  const sentence = (
    <p className="mt-12 max-w-4xl font-display text-[clamp(2.6rem,6.5vw,5.2rem)] leading-[1.08] text-cream">
      {words.map((word, index) => {
        const from = 0.5 + (index / words.length) * 0.4
        const arrive = reduced ? 1 : seg(progress, from, from + 0.06)
        return (
          <span
            key={`${word}-${index}`}
            className="inline-block"
            style={
              reduced
                ? undefined
                : { opacity: arrive, transform: `translateY(${(1 - arrive) * 26}px)` }
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
          <SeriguelaDrawing draw={1} className="h-52 w-auto sm:h-72" />
          {sentence}
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} data-nav-hide="" className="relative bg-terracotta" style={{ height: '260vh' }}>
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden px-5">
        {/* Berry fronds turning with the scroll, one each way — kin, not clones. */}
        <SeriguelaFrond
          className="pointer-events-none absolute top-1/2 -left-24 h-[30rem] w-auto opacity-10 sm:-left-10"
          style={{ transform: `translateY(-50%) rotate(${progress * 46 - 23}deg)` }}
        />
        <SeriguelaFrond
          className="pointer-events-none absolute top-1/2 -right-20 h-[22rem] w-auto opacity-10 sm:-right-8"
          style={{ transform: `translateY(-50%) scaleX(-1) rotate(${-progress * 40 + 20}deg)` }}
        />

        <div className="relative flex flex-col items-center text-center">
          <SeriguelaDrawing draw={draw} className="h-52 w-auto sm:h-72" />
          {sentence}
        </div>
      </div>
    </section>
  )
}
