import type { OurStoryContent } from '../../lib/content'
import { uiStrings } from '../../lib/ui-strings'
import { InvitationInterlude } from './InvitationInterlude'
import { PersonChapter } from './PersonChapter'
import { StoryAlbum } from './StoryAlbum'

interface OurStoryProps {
  content: OurStoryContent
}

/**
 * The couple's block, cut like a film: her chapter, his chapter, the instax
 * album of their years together, then the invitation interlude — the sentence
 * that hands the story to the big day.
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
      <StoryAlbum
        title={content.title}
        moments={content.moments}
        letterFromGroom={content.letter_from_groom}
        letterFromBride={content.letter_from_bride}
      />
      {content.body ? <InvitationInterlude text={content.body} /> : null}
    </>
  )
}
