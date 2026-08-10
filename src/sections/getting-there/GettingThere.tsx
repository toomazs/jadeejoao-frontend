import { SectionShell } from '../../components/ui/SectionShell'
import type { GettingThereContent } from '../../lib/content'

interface GettingThereProps {
  content: GettingThereContent
}

export function GettingThere({ content }: GettingThereProps) {
  return (
    <SectionShell slug="getting_there" title={content.title}>
      <p className="mt-4">
        {content.map_embed_url ? (
          <a
            href={content.map_embed_url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            {content.address}
          </a>
        ) : (
          content.address
        )}
      </p>
      {content.body ? <p className="mt-4 whitespace-pre-line">{content.body}</p> : null}
      {content.parking_notes ? <p className="mt-4">{content.parking_notes}</p> : null}
    </SectionShell>
  )
}
