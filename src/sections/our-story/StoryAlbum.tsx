import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import type { components } from '../../api/schema'
import { Reveal } from '../../components/ui/Reveal'
import { clamp01, usePrefersReducedMotion } from '../../lib/scrollytelling'
import { uiStrings } from '../../lib/ui-strings'

type StoryMoment = components['schemas']['StoryMoment']

interface StoryAlbumProps {
  title: string
  moments: StoryMoment[]
  letterFromGroom?: string
  letterFromBride?: string
}

/** Frames tilt a little, like photos laid along a table — deterministic per index. */
const TILTS = [-2.2, 1.9, -1.4, 2.4, -2.6, 1.3]

/**
 * One instax frame, big enough to hold the room: wide white border, deep
 * bottom lip for the caption, the photo inset with a soft film sheen.
 */
function InstaxFrame({ moment, index }: { moment: StoryMoment; index: number }) {
  const tilt = TILTS[index % TILTS.length]
  const onLeft = index % 2 === 0
  return (
    <Reveal
      as="li"
      className={`relative z-10 flex justify-center py-10 sm:py-14 ${
        onLeft ? 'lg:justify-start lg:pl-6' : 'lg:justify-end lg:pr-6'
      }`}
    >
      <figure
        className="group relative w-full max-w-[20rem] bg-cream p-4 pb-24 shadow-[0_22px_50px_-26px_rgba(26,24,24,0.8)] sm:max-w-[24rem]"
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
        <figcaption className="absolute inset-x-4 bottom-0 flex h-24 flex-col items-center justify-center text-center">
          <span className="block font-accent text-2xl leading-tight text-ink">{moment.label}</span>
          {moment.date ? (
            <span className="mt-1 block font-body text-[0.7rem] tracking-[0.2em] text-dark-gray uppercase">
              {moment.date}
            </span>
          ) : null}
        </figcaption>
      </figure>
    </Reveal>
  )
}

interface Geometry {
  width: number
  height: number
  /** Centre of every frame, in track pixels. */
  points: [number, number][]
}

/**
 * Measures where the frames actually landed. The thread is drawn in real
 * pixels — no viewBox stretching — so the curve keeps its shape at any width.
 */
function useTrackGeometry(ref: React.RefObject<HTMLDivElement | null>, count: number): Geometry {
  const [geometry, setGeometry] = useState<Geometry>({ width: 0, height: 0, points: [] })

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const list = el.querySelector('ol')
      if (!list) return
      const base = el.getBoundingClientRect()
      const points = Array.from(list.children).map((item) => {
        const frame = item.querySelector('figure') ?? item
        const rect = frame.getBoundingClientRect()
        return [
          rect.left - base.left + rect.width / 2,
          rect.top - base.top + rect.height / 2,
        ] as [number, number]
      })
      setGeometry({ width: base.width, height: base.height, points })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [ref, count])

  return geometry
}

/**
 * How far the thread has been drawn: 0 while the album's first frame is still
 * below the reading line, 1 once its last frame has passed it. The line grows
 * exactly where the eye is, so it feels drawn by the scroll itself.
 */
function useThreadProgress(ref: React.RefObject<HTMLDivElement | null>, enabled: boolean): number {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    if (!el) return
    const measure = () => {
      const rect = el.getBoundingClientRect()
      if (rect.height <= 0) return
      const readingLine = window.innerHeight * 0.62
      setProgress(clamp01((readingLine - rect.top) / rect.height))
    }
    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [ref, enabled])
  return progress
}

/** One continuous curve through the centre of every frame, top to bottom. */
function threadPath({ width, height, points }: Geometry): string {
  if (points.length === 0 || width === 0) return ''
  const stops: [number, number][] = [[width / 2, 0], ...points, [width / 2, height]]
  let d = `M ${stops[0][0].toFixed(1)} ${stops[0][1].toFixed(1)}`
  for (let i = 1; i < stops.length; i += 1) {
    const [px, py] = stops[i - 1]
    const [x, y] = stops[i]
    const mid = (py + y) / 2
    d += ` C ${px.toFixed(1)} ${mid.toFixed(1)}, ${x.toFixed(1)} ${mid.toFixed(1)}, ${x.toFixed(1)} ${y.toFixed(1)}`
  }
  return d
}

/** The thread itself, drawn behind the frames as the timeline scrolls by. */
function StoryThread({ geometry, draw }: { geometry: Geometry; draw: number }) {
  const d = threadPath(geometry)
  if (!d) return null
  return (
    <svg
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      width={geometry.width}
      height={geometry.height}
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    >
      <path
        d={d}
        className="text-olive"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - draw}
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
 * The album as a walk: big instax frames alternating sides down the page, one
 * arriving at a time, all threaded by a single crooked line that draws itself
 * behind them — and the letters they wrote each other closing the story.
 */
export function StoryAlbum({ title, moments, letterFromGroom, letterFromBride }: StoryAlbumProps) {
  const reduced = usePrefersReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const geometry = useTrackGeometry(trackRef, moments.length)
  const progress = useThreadProgress(trackRef, !reduced)

  if (moments.length === 0) return null

  return (
    <section
      id="story_album"
      aria-labelledby="story-album-title"
      className="bg-veil px-4 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto w-full max-w-5xl">
        <Reveal className="text-center">
          <h2
            id="story-album-title"
            className="mx-auto max-w-3xl font-display text-[clamp(2.1rem,5vw,3.6rem)] leading-tight text-olive"
          >
            {title}
          </h2>
        </Reveal>

        <div ref={trackRef} className="relative mt-12">
          <StoryThread geometry={geometry} draw={reduced ? 1 : progress} />
          <ol className="relative">
            {moments.map((moment, index) => (
              <InstaxFrame key={moment.image_url} moment={moment} index={index} />
            ))}
          </ol>
        </div>

        {letterFromGroom || letterFromBride ? (
          <div className="mt-20 flex flex-col gap-14 border-t border-olive-line pt-16">
            {letterFromGroom ? (
              <Letter from={uiStrings.letters.fromGroom} text={letterFromGroom} align="left" />
            ) : null}
            {letterFromBride ? (
              <Letter from={uiStrings.letters.fromBride} text={letterFromBride} align="right" />
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}
