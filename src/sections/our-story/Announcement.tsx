import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, RefObject } from 'react'

import type { components } from '../../api/schema'
import { clamp01, seg, useChapterProgress, usePrefersReducedMotion } from '../../lib/scrollytelling'

type AnnouncementPayload = components['schemas']['AnnouncementPayload']

interface AnnouncementProps {
  announcement: AnnouncementPayload
}

/** Where the wink sits on the photo, as a fallback if the payload omits it. */
const DEFAULT_EYE = { x: 60.6, y: 16.9 }

/**
 * The sparkles that leave the closed eye. Each one is deterministic — a fixed
 * angle, distance and delay — so the burst looks authored rather than random,
 * and renders identically on every visit.
 */
const SPARKS = Array.from({ length: 16 }, (_, index) => {
  const angle = -148 + index * 15
  const radians = (angle * Math.PI) / 180
  const reach = 6 + (index % 5) * 3
  return {
    dx: Math.cos(radians) * reach,
    dy: Math.sin(radians) * reach,
    // Four-pointed sparkles, in three sizes — the big ones lead the burst.
    size: index % 4 === 0 ? 26 : index % 4 === 2 ? 17 : 11,
    spin: -30 + index * 11,
    warm: index % 3 === 0,
    from: (index % 8) * 0.06,
  }
})

/** A four-pointed glint — the shape a light actually makes, not a dot. */
function Glint({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
      <path
        d="M12 0c.9 6.6 4.5 10.2 12 12-7.5 1.8-11.1 5.4-12 12-.9-6.6-4.5-10.2-12-12C7.5 10.2 11.1 6.6 12 0z"
        fill="currentColor"
      />
    </svg>
  )
}

/**
 * How much the frame must grow to swallow the viewport whole. Measured from
 * the frame's own unscaled box, so it covers on a phone and on a 27" screen
 * alike — the scene has to end with nothing but Catarina on screen.
 */
function useCoverScale(ref: RefObject<HTMLElement | null>): number {
  const [scale, setScale] = useState(6)

  useLayoutEffect(() => {
    const measure = () => {
      const el = ref.current
      if (!el || el.offsetWidth === 0) return
      // offsetWidth/Height ignore the transform, so this stays stable while
      // the frame is mid-zoom.
      const needed = Math.max(
        window.innerWidth / el.offsetWidth,
        window.innerHeight / el.offsetHeight,
      )
      setScale(needed * 1.25)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [ref])

  return scale
}

/**
 * Catarina's announcement, the last scene of the film: the instax rises from
 * the foot of the screen, sparkles escape the eye she keeps closed, and the
 * frame zooms until she owns the whole viewport — then the light washes over
 * her and the page is already on the big day.
 */
export function Announcement({ announcement }: AnnouncementProps) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLElement>(null)
  const progress = useChapterProgress(ref, !reduced)
  const coverScale = useCoverScale(frameRef)

  const eyeX = announcement.eye_x || DEFAULT_EYE.x
  const eyeY = announcement.eye_y || DEFAULT_EYE.y

  // Three quick beats over a short scroll: arrive, wink, swallow the screen.
  const rise = seg(progress, 0, 0.3)
  const zoom = seg(progress, 0.34, 0.86)
  const burst = seg(progress, 0.55, 0.9)
  const wash = seg(progress, 0.72, 0.97)

  const scale = reduced ? 1 : 0.5 + rise * 0.5 + zoom * (coverScale - 1)
  const lift = reduced ? 0 : (1 - rise) * 40
  const tilt = reduced ? 0 : (1 - rise) * -4
  // The white border would read as a seam once she fills the screen.
  const border = reduced ? 1 : 1 - seg(progress, 0.5, 0.72)

  return (
    <section
      ref={ref}
      aria-label={announcement.label}
      data-nav-hide=""
      className="relative bg-terracotta"
      style={reduced ? undefined : { height: '190vh' }}
    >
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        <figure
          ref={frameRef as RefObject<HTMLElement>}
          className="relative w-[min(74vw,19rem)] bg-cream shadow-[0_30px_70px_-30px_rgba(26,24,24,0.85)]"
          style={
            reduced
              ? { padding: '0.75rem', paddingBottom: '4rem' }
              : {
                  padding: `${0.75 * border}rem`,
                  paddingBottom: `${4 * border}rem`,
                  transform: `translateY(${lift}vh) rotate(${tilt}deg) scale(${scale})`,
                  transformOrigin: 'center center',
                }
          }
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-dark-gray">
            <img
              src={announcement.image_url}
              alt={announcement.label}
              className="h-full w-full object-cover"
              loading="eager"
            />

            {/* The burst, anchored to the winking eye. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute"
              style={{ left: `${eyeX}%`, top: `${eyeY}%` }}
            >
              {SPARKS.map((spark, index) => {
                const life = reduced ? 1 : clamp01((burst - spark.from) / 0.42)
                // Quick to light, slow to fade — and never fully out while
                // the scene still holds the screen.
                const glow = Math.min(1, life * 3.5) * (1 - life * 0.2)
                const travel = life * life
                return (
                  <Glint
                    key={index}
                    className={`absolute ${spark.warm ? 'text-gold-sand' : 'text-cream'}`}
                    style={{
                      width: spark.size,
                      height: spark.size,
                      marginLeft: -spark.size / 2,
                      marginTop: -spark.size / 2,
                      opacity: life === 0 ? 0 : glow,
                      transform: `translate(${spark.dx * travel}vh, ${spark.dy * travel}vh) rotate(${spark.spin + life * 90}deg) scale(${0.35 + life * 0.9})`,
                      filter: 'drop-shadow(0 0 6px rgba(239,232,216,0.55))',
                    }}
                  />
                )
              })}
            </span>
          </div>

          <figcaption
            className="absolute inset-x-3 bottom-0 flex h-16 items-center justify-center overflow-hidden text-center"
            style={reduced ? undefined : { opacity: 1 - seg(progress, 0.42, 0.6) }}
          >
            <span className="font-accent text-[clamp(1.1rem,1.6vw,1.6rem)] leading-tight text-ink">
              {announcement.label.split(/\*\*/).map((piece, index) =>
                index % 2 === 1 ? (
                  <strong key={index} className="font-bold text-terracotta">
                    {piece}
                  </strong>
                ) : (
                  piece
                ),
              )}
            </span>
          </figcaption>
        </figure>

        {/* The light that washes her away — and lands us on the big day. */}
        {reduced ? null : (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-cream"
            style={{ opacity: wash }}
          />
        )}
      </div>
    </section>
  )
}
