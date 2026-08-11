import { Markdown } from '../../components/ui/Markdown'
import { SectionShell } from '../../components/ui/SectionShell'
import type { OurStoryContent } from '../../lib/content'

interface OurStoryProps {
  content: OurStoryContent
}

/** An open letter passage: no frame, drop-cap opening, book measure. */
export function OurStory({ content }: OurStoryProps) {
  return (
    <SectionShell slug="our_story" title={content.title} variant="open">
      {content.body ? (
        <Markdown
          text={content.body}
          dropCap
          className="mx-auto max-w-prose font-body text-lg leading-relaxed"
        />
      ) : null}
    </SectionShell>
  )
}
