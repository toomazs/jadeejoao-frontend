import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

import { $api } from '../../api/client'
import type { components } from '../../api/schema'
import { siriguela } from '../../assets'
import { uiStrings } from '../../lib/ui-strings'

type Person = components['schemas']['PersonPayload']
type PersonKey = 'bride' | 'groom'

interface PersonChapterProps {
  person: Person
  personKey: PersonKey
  roleLabel: string
  /** Which side the portrait takes on large screens. */
  align: 'left' | 'right'
  /** Chapter ground: near-black for her, deep olive for him. */
  tone: 'ink' | 'olive'
}

/** Instagram outline glyph (lucide dropped brand icons — drawn inline). */
function InstagramGlyph({
  size = 18,
  strokeWidth = 1.8,
  className = '',
}: {
  size?: number
  strokeWidth?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
/** Progress of p through the [from, to] segment, clamped to 0..1. */
const seg = (p: number, from: number, to: number) => clamp01((p - from) / (to - from))

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduced
}

/**
 * 0..1 scroll progress through the tall chapter container. Measured straight
 * in the scroll handler — browsers already fire scroll at most once per frame,
 * and rAF-deferred measurement stalls in non-composited (hidden) pages.
 */
function useChapterProgress(ref: RefObject<HTMLElement | null>, enabled: boolean): number {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    if (!el) return
    const measure = () => {
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      setProgress(total > 0 ? clamp01(-rect.top / total) : 0)
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

/**
 * One film chapter, pinned for ~3 viewports of scroll: the screen cuts to a
 * dark ground, the portrait and name arrive, hold, then hand the frame to the
 * person's Instagram feed. Without a configured feed the second scene shows
 * the profile link; under reduced motion everything renders statically.
 */
export function PersonChapter({ person, personKey, roleLabel, align, tone }: PersonChapterProps) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const progress = useChapterProgress(ref, !reduced)
  const feed = $api.useQuery(
    'get',
    '/api/v1/instagram/{person}',
    { params: { path: { person: personKey } } },
    { staleTime: 10 * 60 * 1000 },
  )
  const posts = feed.data?.posts ?? []
  const handleUrl = person.instagram ? `https://www.instagram.com/${person.instagram}/` : undefined
  const hasFeedScene = posts.length > 0 || Boolean(person.instagram)

  const ground = tone === 'ink' ? 'bg-ink' : 'bg-deep-olive'

  const introIn = reduced ? 1 : seg(progress, 0.02, 0.16)
  const introOut = reduced ? 1 : 1 - seg(progress, 0.5, 0.6)
  const introOpacity = Math.min(introIn, introOut)
  const postsIn = reduced ? 1 : seg(progress, 0.58, 0.7)

  const introContent = (
    <div
      className={`mx-auto flex w-full max-w-5xl flex-col items-center gap-9 lg:gap-16 ${
        align === 'left' ? 'lg:flex-row' : 'lg:flex-row-reverse'
      }`}
      style={
        reduced
          ? undefined
          : {
              opacity: introOpacity,
              transform: `translateX(${(1 - introOut) * (align === 'left' ? -48 : 48)}px)`,
            }
      }
    >
      <div
        className="w-[min(70vw,20rem)] shrink-0 sm:w-[22rem]"
        style={
          reduced
            ? undefined
            : {
                transform: `translateY(${(1 - introIn) * 36}px) scale(${1.05 - 0.05 * introIn})`,
              }
        }
      >
        <div className="border border-cream/25 bg-cream/5 p-2.5">
          <div className="aspect-[4/5] overflow-hidden">
            {person.photo_url ? (
              <img
                src={person.photo_url}
                alt={person.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <img
                src={siriguela}
                alt=""
                aria-hidden="true"
                className="mx-auto mt-[35%] h-2/5 w-auto opacity-25 select-none"
              />
            )}
          </div>
        </div>
      </div>

      <div
        className={`text-center ${align === 'left' ? 'lg:text-left' : 'lg:text-right'}`}
        style={reduced ? undefined : { transform: `translateY(${(1 - introIn) * 48}px)` }}
      >
        <p className="font-body text-xs tracking-[0.45em] text-gold-sand uppercase">{roleLabel}</p>
        <h3 className="mt-4 font-display text-[clamp(3.4rem,9vw,7rem)] leading-none text-cream">
          {person.name}
        </h3>
        {person.bio ? (
          <p className="mx-auto mt-6 max-w-md font-body text-lg leading-relaxed text-cream/85 lg:mx-0">
            {person.bio}
          </p>
        ) : null}
        {handleUrl ? (
          <a
            href={handleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2.5 font-body text-sm tracking-[0.18em] text-cream/80 uppercase transition-colors hover:text-gold-sand"
          >
            <InstagramGlyph />
            @{person.instagram}
          </a>
        ) : null}
      </div>
    </div>
  )

  const postsContent = (
    <div
      className="mx-auto w-full max-w-5xl"
      style={
        reduced
          ? undefined
          : {
              opacity: postsIn,
              transform: `translateY(${(1 - postsIn) * 56}px)`,
              pointerEvents: postsIn > 0.5 ? 'auto' : 'none',
            }
      }
    >
      {handleUrl ? (
        <a
          href={handleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 font-body text-sm tracking-[0.2em] text-gold-sand uppercase"
        >
          <InstagramGlyph />
          @{person.instagram}
        </a>
      ) : null}

      {posts.length > 0 ? (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {posts.slice(0, 9).map((post, index) => {
            const arrive = reduced ? 1 : seg(progress, 0.6 + index * 0.02, 0.7 + index * 0.02)
            return (
              <li
                key={post.id}
                style={
                  reduced
                    ? undefined
                    : { opacity: arrive, transform: `translateY(${(1 - arrive) * 26}px)` }
                }
              >
                <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="block">
                  <img
                    src={post.media_type === 'VIDEO' ? (post.thumbnail_url ?? post.media_url) : post.media_url}
                    alt=""
                    className="aspect-[4/5] w-full border border-cream/20 object-cover"
                    loading="lazy"
                  />
                </a>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="mt-8 flex flex-col items-center gap-5 border border-cream/20 px-6 py-14 text-center">
          <InstagramGlyph size={38} strokeWidth={1.4} className="text-gold-sand" />
          <p className="font-display text-3xl text-cream sm:text-4xl">@{person.instagram}</p>
          {handleUrl ? (
            <a
              href={handleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm tracking-[0.2em] text-cream/80 uppercase underline underline-offset-8 transition-colors hover:text-gold-sand"
            >
              {uiStrings.instagramCta}
            </a>
          ) : null}
        </div>
      )}
    </div>
  )

  if (reduced) {
    return (
      <section
        ref={ref}
        aria-label={person.name}
        data-nav-hide=""
        className={`${ground} px-5 py-20 sm:px-10`}
      >
        {introContent}
        {hasFeedScene ? <div className="mt-16">{postsContent}</div> : null}
      </section>
    )
  }

  return (
    <section
      ref={ref}
      aria-label={person.name}
      data-nav-hide=""
      className={`relative ${ground}`}
      style={{ height: hasFeedScene ? '320vh' : '200vh' }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <div
          className="absolute inset-0 flex items-center px-5 sm:px-10"
          style={{ pointerEvents: introOpacity > 0.6 ? 'auto' : 'none' }}
        >
          {introContent}
        </div>
        {hasFeedScene ? (
          <div className="absolute inset-0 flex items-center px-5 sm:px-10" style={{ pointerEvents: 'none' }}>
            {postsContent}
          </div>
        ) : null}
      </div>
    </section>
  )
}
