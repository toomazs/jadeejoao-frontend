import { $api } from './api/client'
import { Button } from './components/ui/Button'
import { Nav } from './components/ui/Nav'
import { Skeleton } from './components/ui/Skeleton'
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

function renderSection(section: NormalizedSection) {
  switch (section.slug) {
    case 'hero':
      return <Hero key={section.slug} content={section.payload} />
    case 'our_story':
      return <OurStory key={section.slug} content={section.payload} />
    case 'big_day':
      return <BigDay key={section.slug} content={section.payload} />
    case 'rsvp':
      return <Rsvp key={section.slug} content={section.payload} />
    case 'getting_there':
      return <GettingThere key={section.slug} content={section.payload} />
    case 'stay':
      return <Stay key={section.slug} content={section.payload} />
    case 'gifts_intro':
      return <Gifts key={section.slug} content={section.payload} />
    case 'dress_code':
      return <DressCode key={section.slug} content={section.payload} />
    case 'good_practices':
      return <GoodPractices key={section.slug} content={section.payload} />
    case 'messages_intro':
      return <Messages key={section.slug} content={section.payload} />
  }
}

export function App() {
  const contentQuery = $api.useQuery(
    'get',
    '/api/v1/content',
    {},
    { staleTime: CONTENT_STALE_TIME_MS },
  )

  if (contentQuery.isPending) {
    return (
      <main aria-busy="true" className="mx-auto w-full max-w-3xl px-4 py-12">
        <p role="status" className="sr-only">
          {uiStrings.loading}
        </p>
        <div className="space-y-6">
          <Skeleton className="h-44" />
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-28" />
          <Skeleton className="h-7 w-1/2" />
          <Skeleton className="h-28" />
        </div>
      </main>
    )
  }

  if (contentQuery.isError || !contentQuery.data) {
    return (
      <main className="grid min-h-svh place-items-center px-4">
        <div role="alert" className="max-w-md text-center">
          <h1 className="font-display text-2xl text-olive">{uiStrings.errorTitle}</h1>
          <p className="mt-3">{uiStrings.errorBody}</p>
          <Button
            className="mt-6"
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

  return (
    <>
      <Nav presentSlugs={presentSlugs} />
      <main>{sections.map(renderSection)}</main>
    </>
  )
}
