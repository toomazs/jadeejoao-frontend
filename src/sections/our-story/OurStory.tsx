import { siriguela } from '../../assets'
import { Reveal } from '../../components/ui/Reveal'
import type { OurStoryContent } from '../../lib/content'
import { uiStrings } from '../../lib/ui-strings'
import { PersonChapter } from './PersonChapter'

interface OurStoryProps {
  content: OurStoryContent
  /** Composition from the hero payload: names and the oval portraits. */
  coupleNames?: string
  portraits?: string[]
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
        <span className="font-body text-sm tracking-[0.3em] text-terracotta uppercase">{role}</span>
      </figcaption>
    </figure>
  )
}

/**
 * The couple's presence, cut like a film: first the two oval portraits joined
 * by the script "e" — no words around them — then one pinned full-screen
 * chapter per person (portrait, name, bio, their Instagram), the page going
 * dark between cuts.
 */
export function OurStory({ content, coupleNames, portraits = [] }: OurStoryProps) {
  const names = coupleNames?.split(/\s*&\s*/) ?? []

  return (
    <>
      {names.length === 2 ? (
        <section id="our_story" aria-label={content.title} className="bg-cream px-4 py-20 sm:py-28">
          <Reveal className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
            <Portrait photo={portraits[0]} name={names[0]} role={uiStrings.couple.bride} />
            <span
              aria-hidden="true"
              className="font-accent text-7xl text-terracotta select-none sm:text-8xl"
            >
              e
            </span>
            <Portrait photo={portraits[1]} name={names[1]} role={uiStrings.couple.groom} />
          </Reveal>
        </section>
      ) : null}

      {content.bride ? (
        <PersonChapter
          person={content.bride}
          personKey="bride"
          roleLabel={uiStrings.couple.bride}
          align="left"
          tone="ink"
        />
      ) : null}
      {content.groom ? (
        <PersonChapter
          person={content.groom}
          personKey="groom"
          roleLabel={uiStrings.couple.groom}
          align="right"
          tone="olive"
        />
      ) : null}
    </>
  )
}
