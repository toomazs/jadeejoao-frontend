import { SectionShell } from '../../components/ui/SectionShell'
import type { GiftsIntroContent } from '../../lib/content'

interface GiftsProps {
  content: GiftsIntroContent
}

export function Gifts({ content }: GiftsProps) {
  return (
    <SectionShell slug="gifts_intro" title={content.title}>
      {content.body ? <p className="mt-4 whitespace-pre-line">{content.body}</p> : null}
      {/* Gift cards (link + pix kinds) land in a later task. */}
      <div data-placeholder="gifts-flow" className="mt-6" />
    </SectionShell>
  )
}
