import { Camera } from 'lucide-react'

import { siriguela } from '../../assets'
import { Markdown } from '../../components/ui/Markdown'
import { Reveal } from '../../components/ui/Reveal'
import { SectionShell } from '../../components/ui/SectionShell'
import type { HeroContent, OurStoryContent } from '../../lib/content'
import { formatMilestoneDate } from '../../lib/format'
import { uiStrings } from '../../lib/ui-strings'

interface OurStoryProps {
  content: OurStoryContent
  /** Composition from the hero payload: names, portraits and milestones. */
  coupleNames?: string
  portraits?: string[]
  milestones?: HeroContent['milestones']
}

/** One oval portrait with the sprig behind it, name and role beneath. */
function Portrait({ photo, name, role }: { photo?: string; name: string; role: string }) {
  return (
    <figure className="flex flex-col items-center">
    <div className="relative">
      <img
        src={siriguela}
        alt=""
        aria-hidden="true"
        className="sway absolute -top-6 -right-4 h-20 w-auto rotate-[160deg] opacity-40 select-none"
      />
      <div className="aspect-[3/4] w-44 overflow-hidden rounded-t-full rounded-b-full border-2 border-olive bg-veil sm:w-52">
        {photo ? (
          <img src={photo} alt={name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <img
            src={siriguela}
            alt=""
            aria-hidden="true"
            className="mx-auto mt-[30%] h-1/2 w-auto opacity-30 select-none"
          />
        )}
      </div>
    </div>
      <figcaption className="mt-5 flex flex-col items-center gap-1">
        <span className="font-display text-2xl text-olive">{name}</span>
        <span className="font-body text-sm tracking-[0.3em] text-terracotta uppercase">
          {role}
        </span>
      </figcaption>
    </figure>
  )
}

/** One chapter of the love-story timeline, zigzagging photo and words. */
function StoryMilestone({
  milestone,
  index,
}: {
  milestone: NonNullable<OurStoryProps['milestones']>[number]
  index: number
}) {
  const flipped = index % 2 === 1
  return (
    <Reveal
      as="li"
      delay={index * 120}
      className={`grid items-center gap-6 sm:grid-cols-2 ${flipped ? '' : ''}`}
    >
      <div
        className={`aspect-[16/10] overflow-hidden border-2 border-olive-line bg-veil ${flipped ? 'sm:order-2' : ''}`}
      >
        {milestone.image_url ? (
          <img
            src={milestone.image_url}
            alt={milestone.label}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <img
            src={siriguela}
            alt=""
            aria-hidden="true"
            className="mx-auto mt-6 h-2/3 w-auto opacity-25 select-none"
          />
        )}
      </div>
      <div className={`bg-veil px-7 py-8 ${flipped ? 'sm:order-1' : ''}`}>
        {milestone.date ? (
          <p className="font-body text-sm tracking-[0.28em] text-terracotta">
            {formatMilestoneDate(milestone.date)}
          </p>
        ) : null}
        <p className="mt-2 font-display text-2xl text-olive">{milestone.label}</p>
      </div>
    </Reveal>
  )
}

/**
 * The couple's room: the two portraits joined by the script "e", the letter,
 * the zigzag story timeline — and the dark moments band waiting for photos.
 */
export function OurStory({ content, coupleNames, portraits = [], milestones = [] }: OurStoryProps) {
  const names = coupleNames?.split(/\s*&\s*/) ?? []
  const gallery = content.images

  return (
    <>
      <SectionShell slug="our_story" title={content.title} tone="cream">
        {names.length === 2 ? (
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
            <Portrait photo={portraits[0]} name={names[0]} role={uiStrings.couple.bride} />
            <span
              aria-hidden="true"
              className="font-accent text-7xl text-terracotta select-none sm:text-8xl"
            >
              e
            </span>
            <Portrait photo={portraits[1]} name={names[1]} role={uiStrings.couple.groom} />
          </div>
        ) : null}

        {content.body ? (
          <Markdown
            text={content.body}
            className="mx-auto mt-12 max-w-prose text-center font-body text-xl leading-relaxed"
          />
        ) : null}

        {milestones.length > 0 ? (
          <ol className="mx-auto mt-14 flex max-w-4xl flex-col gap-10">
            {milestones.map((milestone, index) => (
              <StoryMilestone key={milestone.label} milestone={milestone} index={index} />
            ))}
          </ol>
        ) : null}
      </SectionShell>

      {/* The moments band: deep olive, the couple's photos (sprig tiles until they upload). */}
      <div aria-label={uiStrings.momentsLabel} className="bg-deep-olive px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal className="flex flex-col items-center text-center">
            <Camera aria-hidden="true" size={30} strokeWidth={1.6} className="text-gold-sand" />
            <p className="mt-3 font-display text-3xl text-cream sm:text-4xl">
              {uiStrings.momentsLabel}
            </p>
          </Reveal>
          <Reveal delay={130} className="mt-10">
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {(gallery.length > 0 ? gallery : Array.from({ length: 6 }, () => null)).map(
                (photo, index) => (
                  <li
                    key={photo ?? index}
                    className={`overflow-hidden border border-olive bg-olive/40 ${
                      index % 3 === 1 ? 'aspect-[3/4]' : 'aspect-square'
                    }`}
                  >
                    {photo ? (
                      <img
                        src={photo}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <img
                        src={siriguela}
                        alt=""
                        aria-hidden="true"
                        className="mx-auto mt-[22%] h-1/2 w-auto opacity-20 select-none"
                      />
                    )}
                  </li>
                ),
              )}
            </ul>
          </Reveal>
        </div>
      </div>
    </>
  )
}
