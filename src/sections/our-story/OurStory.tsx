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
          // Two ids on purpose: `our_story` is the section anchor the nav and
          // the panel's section list use; `chapter-bride` is the finer target
          // the panel jumps to when her accordion opens.
          id="our_story"
          anchorId="chapter-bride"
          person={content.bride}
          personKey="bride"
          roleLabel={uiStrings.couple.bride}
          align="left"
          tone="gray"
        />
      ) : null}
      {content.groom ? (
        <PersonChapter
          anchorId="chapter-groom"
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
      {content.body ? <InvitationInterlude id="invitation" text={content.body} /> : null}
      {content.announcement ? <Announcement announcement={content.announcement} /> : null}
    </>
  )
}
