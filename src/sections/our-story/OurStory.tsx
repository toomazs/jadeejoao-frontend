import type { OurStoryContent } from '../../lib/content'
import { uiStrings } from '../../lib/ui-strings'
import { Announcement } from './Announcement'
import { InvitationInterlude } from './InvitationInterlude'
import { PersonChapter } from './PersonChapter'
import { StoryAlbum } from './StoryAlbum'

interface OurStoryProps {
  content: OurStoryContent
}

/**
 * The couple's block, cut like a film: her chapter, his chapter, the instax
 * album of their years together, the invitation, and Catarina's announcement
 * — the last scene of the film, which cuts straight to the day itself.
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
      {content.announcement ? <Announcement announcement={content.announcement} /> : null}
    </>
  )
}
