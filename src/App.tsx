import { Fragment, useEffect, useState } from 'react'

import { $api } from './api/client'
import { Button } from './components/ui/Button'
import { Footer } from './components/ui/Footer'
import { LeafDivider } from './components/ui/LeafDivider'
import { Nav } from './components/ui/Nav'
import { Splash } from './components/ui/Splash'
import { normalizeContent } from './lib/content'
import type { NormalizedSection, SectionSlug } from './lib/content'
import { uiStrings } from './lib/ui-strings'
import { BigDay } from './sections/big-day/BigDay'
import { DressCode } from './sections/dress-code/DressCode'
import { GettingThere } from './sections/getting-there/GettingThere'
import { Gifts } from './sections/gifts/Gifts'
import { GoodPractices } from './sections/good-practices/GoodPractices'
import { Hero } from './sections/hero/Hero'
import { Messages } from './sections/messages/Messages'
import { OurStory } from './sections/our-story/OurStory'
import { Rsvp } from './sections/rsvp/Rsvp'
import { Stay } from './sections/stay/Stay'

/** Editorial content barely changes mid-visit — keep it fresh for the whole session. */
const CONTENT_STALE_TIME_MS = 10 * 60 * 1000

/** The monogram holds the screen this long before the invitation opens. */
const SPLASH_HOLD_MS = 2000
/** How long the curtain takes to fade once it starts lifting. */
const SPLASH_FADE_MS = 700

/**
 * Position on the walk, engraved as the room's plaque ("02"…"10").
 * Derived from render order — the hero is the unnumbered gate.
 */
function renderSection(
  section: NormalizedSection,
  index: number,
  hero: Extract<NormalizedSection, { slug: 'hero' }>['payload'] | undefined,
) {
  const ordinal = String(index + 1).padStart(2, '0')
  switch (section.slug) {
    case 'hero':
      return <Hero key={section.slug} content={section.payload} />
    case 'our_story':
      return <OurStory key={section.slug} content={section.payload} />
    case 'big_day':
      return (
        <BigDay
          key={section.slug}
          content={section.payload}
          ordinal={ordinal}
          eventDatetime={hero?.event_datetime}
        />
      )
    case 'rsvp':
      return <Rsvp key={section.slug} content={section.payload} ordinal={ordinal} />
    case 'getting_there':
      return <GettingThere key={section.slug} content={section.payload} ordinal={ordinal} />
    case 'stay':
      return <Stay key={section.slug} content={section.payload} ordinal={ordinal} />
    case 'gifts_intro':
      return <Gifts key={section.slug} content={section.payload} ordinal={ordinal} />
    case 'dress_code':
      return <DressCode key={section.slug} content={section.payload} />
    case 'good_practices':
      return <GoodPractices key={section.slug} content={section.payload} ordinal={ordinal} />
    case 'messages_intro':
      return <Messages key={section.slug} content={section.payload} ordinal={ordinal} />
  }
}

export function App() {
  const contentQuery = $api.useQuery(
    'get',
    '/api/v1/content',
    {},
    { staleTime: CONTENT_STALE_TIME_MS },
  )

  // The opening: the monogram alone, then the curtain lifts and the hero
  // plays its entrance. The site only mounts once the curtain starts moving,
  // so its animations are seen from the first frame.
  const [curtainLifting, setCurtainLifting] = useState(false)
  const [curtainGone, setCurtainGone] = useState(false)

  useEffect(() => {
    const lift = setTimeout(() => setCurtainLifting(true), SPLASH_HOLD_MS)
    const gone = setTimeout(() => setCurtainGone(true), SPLASH_HOLD_MS + SPLASH_FADE_MS)
    return () => {
      clearTimeout(lift)
      clearTimeout(gone)
    }
  }, [])

  const ready = curtainLifting && !contentQuery.isPending

  if (!ready) {
    return <Splash leaving={false} />
  }

  if (contentQuery.isError || !contentQuery.data) {
    return (
      <main className="grid min-h-svh place-items-center px-4">
        <div role="alert" className="relative w-full max-w-md border border-olive-line px-6 py-12 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-1.5 border border-sand-line"
          />
          <h1 className="font-display text-2xl text-olive">{uiStrings.errorTitle}</h1>
          <LeafDivider className="mt-5" />
          <p className="mt-5 text-lg">{uiStrings.errorBody}</p>
          <Button
            className="mt-8"
            onClick={() => {
              void contentQuery.refetch()
            }}
          >
            {uiStrings.retry}
          </Button>
        </div>
      </main>
    )
  }

  const sections = normalizeContent(contentQuery.data)
  const presentSlugs: ReadonlySet<SectionSlug> = new Set(sections.map((section) => section.slug))
  const hero = sections.find((section) => section.slug === 'hero')

  return (
    <>
      {curtainGone ? null : <Splash leaving />}
      <Nav presentSlugs={presentSlugs} />
      <main className="site-enter">
        {/* Color rooms stack edge to edge — the palette separates them. */}
        {sections.map((section, index) => (
          <Fragment key={section.slug}>{renderSection(section, index, hero?.payload)}</Fragment>
        ))}
      </main>
      <Footer
        coupleNames={hero?.payload.couple_names}
        eventDatetime={hero?.payload.event_datetime}
      />
    </>
  )
}
