import { SectionShell } from '../../components/ui/SectionShell'
import type { OurStoryContent } from '../../lib/content'

interface OurStoryProps {
  content: OurStoryContent
}

export function OurStory({ content }: OurStoryProps) {
  return (
    <SectionShell slug="our_story" title={content.title}>
      {content.body ? <p className="mt-4 whitespace-pre-line">{content.body}</p> : null}
    </SectionShell>
  )
}
