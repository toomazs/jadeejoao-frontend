import { useRef } from 'react'

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
const SPARKS = Array.from({ length: 14 }, (_, index) => {
  const angle = -140 + index * 17
  const radians = (angle * Math.PI) / 180
  const reach = 9 + (index % 5) * 4.5
  return {
    dx: Math.cos(radians) * reach,
    dy: Math.sin(radians) * reach,
    size: index % 3 === 0 ? 7 : index % 3 === 1 ? 5 : 3.5,
    from: 0.04 + (index % 7) * 0.055,
  }
})

/**
 * Catarina's announcement: the instax frame rises from the foot of the screen,
 * grows until it owns the whole viewport, and — as it lands — sparkles escape
 * the eye she keeps closed. The page then cuts straight to the big day, the
 * way a film cuts between scenes.
 */
export function Announcement({ announcement }: AnnouncementProps) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const progress = useChapterProgress(ref, !reduced)

  const eyeX = announcement.eye_x || DEFAULT_EYE.x
  const eyeY = announcement.eye_y || DEFAULT_EYE.y

  // The frame travels: small and low, then centred and full-bleed.
  const rise = seg(progress, 0.05, 0.55)
  const zoom = seg(progress, 0.3, 0.78)
  const scale = reduced ? 1 : 0.42 + rise * 0.58 + zoom * 0.85
  const lift = reduced ? 0 : (1 - rise) * 46
  const tilt = reduced ? 0 : (1 - rise) * -4

  // The wink fires once the frame has arrived.
  const burst = reduced ? 1 : seg(progress, 0.5, 0.92)
  const captionIn = reduced ? 1 : seg(progress, 0.12, 0.3)

  return (
    <section
      ref={ref}
      aria-label={announcement.label}
      data-nav-hide=""
      className="relative bg-terracotta"
      style={reduced ? undefined : { height: '300vh' }}
    >
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden px-4">
        <figure
          className="relative w-[min(78vw,20rem)] bg-cream p-3 pb-16 shadow-[0_30px_70px_-30px_rgba(26,24,24,0.85)]"
          style={
            reduced
              ? undefined
              : {
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
              loading="lazy"
            />

            {/* The burst, anchored to the winking eye. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute"
              style={{ left: `${eyeX}%`, top: `${eyeY}%` }}
            >
              {SPARKS.map((spark, index) => {
                const life = reduced ? 1 : clamp01((burst - spark.from) / 0.4)
                // Quick to light, slow to fade — and never fully out while
                // the scene still holds the screen.
                const glow = Math.min(1, life * 3.5) * (1 - life * 0.3)
                const travel = life * life
                return (
                  <span
                    key={index}
                    className="absolute rounded-full bg-gold-sand"
                    style={{
                      width: spark.size,
                      height: spark.size,
                      opacity: life === 0 ? 0 : glow,
                      transform: `translate(${spark.dx * travel}vh, ${spark.dy * travel}vh) scale(${0.5 + life})`,
                      boxShadow: '0 0 10px rgba(210,190,129,0.75)',
                    }}
                  />
                )
              })}
            </span>
          </div>

          <figcaption
            className="absolute inset-x-3 bottom-0 flex h-16 items-center justify-center text-center"
            style={reduced ? undefined : { opacity: captionIn }}
          >
            <span className="font-accent text-[clamp(1.1rem,1.6vw,1.6rem)] leading-tight text-ink">
              {announcement.label}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
