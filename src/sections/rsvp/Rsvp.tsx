import { Button } from '../../components/ui/Button'
import { Markdown } from '../../components/ui/Markdown'
import { SectionShell } from '../../components/ui/SectionShell'
import type { RsvpContent } from '../../lib/content'
import { uiStrings } from '../../lib/ui-strings'

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
      {/* Marked placeholder — the RSVP flow (typeahead → lookup → group submit) lands in a later task. */}
      <p data-placeholder="rsvp-flow" className="mt-8 text-center">
        <Button variant="outline" disabled>
          {uiStrings.rsvpSoon}
        </Button>
      </p>
    </SectionShell>
  )
}
