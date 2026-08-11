import { Markdown } from '../../components/ui/Markdown'
import { SectionShell } from '../../components/ui/SectionShell'
import type { MessagesIntroContent } from '../../lib/content'

interface MessagesProps {
  content: MessagesIntroContent
  ordinal?: string
}

/** Shell only for now — the write-only message form lands in a later task. */
export function Messages({ content, ordinal }: MessagesProps) {
  return (
    <SectionShell slug="messages_intro" title={content.title} ordinal={ordinal}>
      {content.body ? (
        <Markdown
          text={content.body}
          className="mx-auto max-w-prose text-center font-body text-lg leading-relaxed"
        />
      ) : null}
      {/* Message form (write-only recados) lands in a later task. */}
      <div data-placeholder="messages-flow" className="mt-6" />
    </SectionShell>
  )
}
