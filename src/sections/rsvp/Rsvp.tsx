import { SectionShell } from '../../components/ui/SectionShell'
import type { RsvpContent } from '../../lib/content'

interface RsvpProps {
  content: RsvpContent
}

export function Rsvp({ content }: RsvpProps) {
  return (
    <SectionShell slug="rsvp" title={content.title}>
      {content.body ? <p className="mt-4 whitespace-pre-line">{content.body}</p> : null}
      {/* RSVP flow (typeahead → lookup → group submit) lands in a later task. */}
      <div data-placeholder="rsvp-flow" className="mt-6" />
    </SectionShell>
  )
}
