import { Markdown } from '../../components/ui/Markdown'
import { SectionShell } from '../../components/ui/SectionShell'
import type { RsvpContent } from '../../lib/content'

interface RsvpProps {
  content: RsvpContent
  ordinal?: string
}

/** The garden's heart — shell only for now; the confirmation flow lands in a later task. */
export function Rsvp({ content, ordinal }: RsvpProps) {
  return (
    <SectionShell slug="rsvp" title={content.title} ordinal={ordinal}>
      {content.body ? (
        <Markdown
          text={content.body}
          className="mx-auto max-w-prose text-center font-body text-lg leading-relaxed"
        />
      ) : null}
      {/* RSVP flow (typeahead → lookup → group submit) lands in a later task. */}
      <div data-placeholder="rsvp-flow" className="mt-6" />
    </SectionShell>
  )
}
