import { SectionShell } from '../../components/ui/SectionShell'
import type { MessagesIntroContent } from '../../lib/content'

interface MessagesProps {
  content: MessagesIntroContent
}

export function Messages({ content }: MessagesProps) {
  return (
    <SectionShell slug="messages_intro" title={content.title}>
      {content.body ? <p className="mt-4 whitespace-pre-line">{content.body}</p> : null}
      {/* Message form (write-only recados) lands in a later task. */}
      <div data-placeholder="messages-flow" className="mt-6" />
    </SectionShell>
  )
}
