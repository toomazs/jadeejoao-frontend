import { useEffect, useRef, useState } from 'react'

import type { components } from '../../api/schema'
import { Reveal } from '../../components/ui/Reveal'
import { uiStrings } from '../../lib/ui-strings'

type StoryMoment = components['schemas']['StoryMoment']

interface StoryAlbumProps {
  title: string
  moments: StoryMoment[]
  letterFromGroom?: string
  letterFromBride?: string
}

/** Frames tilt a little, like photos dropped on a table — deterministic per index. */
const TILTS = [-2.4, 1.8, -1.2, 2.6, -1.9, 1.3, -2.8, 2.1]

/**
 * One instax frame: pure CSS/SVG — wide white border, deep bottom lip for the
 * caption, the photo inset with a soft film sheen.
 */
function InstaxFrame({ moment, index }: { moment: StoryMoment; index: number }) {
  const tilt = TILTS[index % TILTS.length]
  return (
    <Reveal
      as="li"
      delay={(index % 4) * 90}
      className="group flex justify-center"
    >
      <figure
        className="relative w-full max-w-[15rem] bg-cream p-3 pb-14 shadow-[0_16px_36px_-22px_rgba(26,24,24,0.75)]"
        style={{ rotate: `${tilt}deg` }}
      >
        <div className="relative aspect-square overflow-hidden bg-dark-gray">
          <img
            src={moment.image_url}
            alt={moment.label}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          {/* Film sheen, the diagonal gleam of a real instax print. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-cream/12 to-transparent"
          />
        </div>
        <figcaption className="absolute right-3 bottom-3 left-3 text-center">
          <span className="block font-accent text-xl leading-tight text-ink">{moment.label}</span>
          {moment.date ? (
            <span className="mt-0.5 block font-body text-[0.68rem] tracking-[0.18em] text-dark-gray uppercase">
              {moment.date}
            </span>
          ) : null}
        </figcaption>
      </figure>
    </Reveal>
  )
}

/**
 * The crooked thread running behind the frames: one hand-drawn SVG path per
 * row gap, stitched left-to-right and drawn as the row enters the viewport.
 */
function CrookedThread({ flip = false }: { flip?: boolean }) {
  const ref = useRef<SVGSVGElement>(null)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDrawn(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <svg
      ref={ref}
      viewBox="0 0 1000 80"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`pointer-events-none h-16 w-full ${flip ? '-scale-x-100' : ''}`}
    >
      <path
        d="M20 14 C160 74 300 -10 440 44 C560 90 640 4 760 34 C860 58 930 26 980 66"
        className="text-olive"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="1"
        pathLength={1}
        style={{
          strokeDashoffset: drawn ? 0 : 1,
          transition: 'stroke-dashoffset 1.6s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />
      <circle
        cx="980"
        cy="66"
        r="4"
        className="text-terracotta"
        fill="currentColor"
        style={{ opacity: drawn ? 1 : 0, transition: 'opacity 0.5s ease 1.4s' }}
      />
    </svg>
  )
}

/** One letter, opened like a page torn from their Instagram. */
function Letter({ from, text, align }: { from: string; text: string; align: 'left' | 'right' }) {
  return (
    <Reveal className={`max-w-2xl ${align === 'right' ? 'ml-auto text-right' : ''}`}>
      <p className="font-body text-xs tracking-[0.32em] text-terracotta uppercase">{from}</p>
      <div className="mt-4 space-y-4">
        {text.split(/\n+/).map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="font-body text-lg leading-relaxed text-ink italic">
            {paragraph}
          </p>
        ))}
      </div>
    </Reveal>
  )
}

/**
 * The album: the couple's photo timeline as instax frames, four to a row,
 * stitched together by a crooked thread that draws itself row by row — with
 * the letters they wrote each other opening in the middle of the story.
 */
export function StoryAlbum({ title, moments, letterFromGroom, letterFromBride }: StoryAlbumProps) {
  if (moments.length === 0) return null

  // The letters land midway through the timeline, where the family begins.
  const half = Math.ceil(moments.length / 2)
  const rows = (list: StoryMoment[], offset: number) => {
    const chunks: StoryMoment[][] = []
    for (let i = 0; i < list.length; i += 4) chunks.push(list.slice(i, i + 4))
    return chunks.map((chunk, rowIndex) => (
      <div key={`${offset}-${rowIndex}`}>
        <ul className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          {chunk.map((moment, index) => (
            <InstaxFrame key={moment.image_url} moment={moment} index={offset + rowIndex * 4 + index} />
          ))}
        </ul>
        <CrookedThread flip={(offset + rowIndex) % 2 === 1} />
      </div>
    ))
  }

  return (
    <section id="story_album" aria-labelledby="story-album-title" className="bg-veil px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="text-center">
          <h2
            id="story-album-title"
            className="mx-auto max-w-3xl font-display text-[clamp(2.1rem,5vw,3.6rem)] leading-tight text-olive"
          >
            {title}
          </h2>
        </Reveal>

        <div className="mt-14 flex flex-col">{rows(moments.slice(0, half), 0)}</div>

        {letterFromGroom || letterFromBride ? (
          <div className="my-6 flex flex-col gap-14 border-y border-olive-line py-16">
            {letterFromGroom ? (
              <Letter from={uiStrings.letters.fromGroom} text={letterFromGroom} align="left" />
            ) : null}
            {letterFromBride ? (
              <Letter from={uiStrings.letters.fromBride} text={letterFromBride} align="right" />
            ) : null}
          </div>
        ) : null}

        <div className="mt-10 flex flex-col">{rows(moments.slice(half), half)}</div>
      </div>
    </section>
  )
}
