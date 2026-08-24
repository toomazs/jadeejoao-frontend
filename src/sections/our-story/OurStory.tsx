import type { OurStoryContent } from '../../lib/content'
import { uiStrings } from '../../lib/ui-strings'
import { InvitationInterlude } from './InvitationInterlude'
import { PersonChapter } from './PersonChapter'

interface OurStoryProps {
  content: OurStoryContent
}

/**
 * The couple's block, cut like a film: her chapter, his chapter, then the
 * invitation interlude — the sentence that hands the story to the big day.
 * (The oval-portraits room was retired by the couple's direction.)
 */
export function OurStory({ content }: OurStoryProps) {
  return (
    <>
      {content.bride ? (
        <PersonChapter
          id="our_story"
          person={content.bride}
          personKey="bride"
          roleLabel={uiStrings.couple.bride}
          align="left"
          tone="gray"
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
      {content.body ? <InvitationInterlude text={content.body} /> : null}
    </>
  )
}
