import { useRef } from 'react'

import { $api } from '../../api/client'
import { Inline } from '../../components/ui/Markdown'
import { Skeleton } from '../../components/ui/Skeleton'
import type { components } from '../../api/schema'
import { siriguela } from '../../assets'
import { seg, useChapterProgress, usePrefersReducedMotion } from '../../lib/scrollytelling'
import { uiStrings } from '../../lib/ui-strings'

type Person = components['schemas']['PersonPayload']
type PersonKey = 'bride' | 'groom'

interface PersonChapterProps {
  person: Person
  personKey: PersonKey
  roleLabel: string
  /** Which side the portrait takes on large screens. */
  align: 'left' | 'right'
  /** Chapter ground — palette darks only: brand gray for her, deep olive for him. */
  tone: 'gray' | 'olive'
  /** Anchor id, carried by the first chapter of the story block. */
  id?: string
  /** A second anchor, so the panel can jump to this chapter specifically. */
  anchorId?: string
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

/**
 * One film chapter, pinned for ~3 viewports of scroll: the screen cuts to a
 * dark ground, the portrait and name arrive, hold, then hand the frame to the
 * person's Instagram feed. Without a configured feed the second scene shows
 * the profile link; under reduced motion everything renders statically.
 */
export function PersonChapter({
  person,
  personKey,
  roleLabel,
  align,
  tone,
  id,
  anchorId,
}: PersonChapterProps) {
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
  // Only claim there is nothing to show once the request has actually
  // settled — a pending or failed fetch must never masquerade as an empty
  // feed, which is what made the grid look like it had vanished.
  const feedSettled = !feed.isPending && !feed.isFetching
  const handleUrl = person.instagram ? `https://www.instagram.com/${person.instagram}/` : undefined
  const hasFeedScene = posts.length > 0 || Boolean(person.instagram)

  const ground = tone === 'gray' ? 'bg-dark-gray' : 'bg-deep-olive'

  const hasBioScene = Boolean(person.bio)
  const bioParagraphs = (person.bio ?? '').split(/\n+/)
  // The paragraphs arrive one after another, and the scene starts leaving at
  // 0.62 — so a fixed step per paragraph means a long enough bio has its last
  // ones still fading in as the whole thing fades out. Hers has four, and the
  // fourth landed exactly on 0.62: written, published, never once readable.
  // Spreading them across a fixed window instead keeps the stagger and lets
  // any length finish by 0.58. At three paragraphs this is the old 0.04.
  const bioStep = bioParagraphs.length > 1 ? 0.08 / (bioParagraphs.length - 1) : 0

  // Three beats, in order: the portrait, her own words, then her feed. Each
  // fades out as the next arrives, so only one holds the screen at a time.
  const introIn = reduced ? 1 : seg(progress, 0.02, 0.13)
  const introOut = reduced ? 1 : 1 - seg(progress, hasBioScene ? 0.26 : 0.5, hasBioScene ? 0.34 : 0.6)
  const introOpacity = Math.min(introIn, introOut)

  const bioIn = reduced ? 1 : seg(progress, 0.36, 0.45)
  const bioOut = reduced ? 1 : 1 - seg(progress, 0.62, 0.7)
  const bioOpacity = hasBioScene ? Math.min(bioIn, bioOut) : 0

  const postsIn = reduced ? 1 : seg(progress, hasBioScene ? 0.72 : 0.58, hasBioScene ? 0.82 : 0.7)

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

  const bioContent = (
    <div
      className="mx-auto w-full max-w-2xl"
      style={
        reduced
          ? undefined
          : {
              opacity: bioOpacity,
              transform: `translateY(${(1 - bioIn) * 40}px)`,
              pointerEvents: bioOpacity > 0.5 ? 'auto' : 'none',
            }
      }
    >
      <p className="font-body text-xs tracking-[0.45em] text-gold-sand uppercase">{person.name}</p>
      <div className="mt-6 space-y-5">
        {bioParagraphs.map((paragraph, index) => {
          const arrive = reduced ? 1 : seg(progress, 0.4 + index * bioStep, 0.5 + index * bioStep)
          return (
            <p
              key={paragraph.slice(0, 24)}
              className="font-body text-[0.98rem] leading-relaxed text-cream/85 sm:text-lg"
              style={reduced ? undefined : { opacity: arrive }}
            >
              <Inline text={paragraph} />
            </p>
          )
        })}
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
        <div className={align === 'right' ? 'text-right' : ''}>
          <a
            href={handleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 font-body text-sm tracking-[0.2em] text-gold-sand uppercase"
          >
            <InstagramGlyph />
            @{person.instagram}
          </a>
        </div>
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
                {/* The caption names the link. An empty alt inside an
                    anchor with nothing else in it leaves a link a screen
                    reader can only announce as a URL. */}
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  aria-label={post.caption || uiStrings.instagramPostLabel}
                >
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
      ) : !feedSettled ? (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="aspect-[4/5] w-full" />
          ))}
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
        id={id}
        aria-label={person.name}
        data-nav-hide=""
        className={`${ground} px-5 py-20 sm:px-10`}
      >
        {anchorId ? <span id={anchorId} aria-hidden="true" /> : null}
        {introContent}
        {hasBioScene ? <div className="mt-14">{bioContent}</div> : null}
        {hasFeedScene ? <div className="mt-16">{postsContent}</div> : null}
      </section>
    )
  }

  const totalVh = 100 + (hasBioScene ? 160 : 0) + (hasFeedScene ? 220 : 100)
  // Progress runs across the section minus one viewport, so an anchor placed
  // this far down lands the scroll on that progress value.
  const sceneTop = (at: number) => `${at * (totalVh - 100)}vh`

  return (
    <section
      ref={ref}
      id={id}
      aria-label={person.name}
      data-nav-hide=""
      className={`relative ${ground}`}
      style={{ height: `${totalVh}vh` }}
    >
      {/* Anchors for the panel's preview, separate from `id`, which is the
          nav's. They cannot sit at the top of the section: the chapter is
          pinned for several viewports and each scene fades in on scroll, so
          the top is the one place where the ground is still empty. Each of
          these sits where its scene has fully arrived and has not begun to
          leave. */}
      {anchorId ? (
        <>
          <span id={anchorId} aria-hidden="true" className="absolute" style={{ top: sceneTop(0.2) }} />
          {hasBioScene ? (
            <span
              id={`${anchorId}-bio`}
              aria-hidden="true"
              className="absolute"
              style={{ top: sceneTop(0.58) }}
            />
          ) : null}
        </>
      ) : null}
      <div className="sticky top-0 h-svh overflow-hidden">
        <div
          className="absolute inset-0 flex items-center px-5 sm:px-10"
          style={{ pointerEvents: introOpacity > 0.6 ? 'auto' : 'none' }}
        >
          {introContent}
        </div>
        {hasBioScene ? (
          <div className="absolute inset-0 flex items-center px-5 sm:px-10" style={{ pointerEvents: 'none' }}>
            {bioContent}
          </div>
        ) : null}
        {hasFeedScene ? (
          <div className="absolute inset-0 flex items-center px-5 sm:px-10" style={{ pointerEvents: 'none' }}>
            {postsContent}
          </div>
        ) : null}
      </div>
    </section>
  )
}
