import { Markdown } from '../../components/ui/Markdown'
import { SectionShell } from '../../components/ui/SectionShell'
import type { GiftsIntroContent } from '../../lib/content'

interface GiftsProps {
  content: GiftsIntroContent
  ordinal?: string
}

/** Shell only for now — gift cards (link + pix kinds) land in a later task. */
export function Gifts({ content, ordinal }: GiftsProps) {
  return (
    <SectionShell slug="gifts_intro" title={content.title} ordinal={ordinal}>
      {content.body ? (
        <Markdown
          text={content.body}
          className="mx-auto max-w-prose text-center font-body text-lg leading-relaxed"
        />
      ) : null}
      {/* Gift cards (link + pix kinds) land in a later task. */}
      <div data-placeholder="gifts-flow" className="mt-6" />
    </SectionShell>
  )
}
