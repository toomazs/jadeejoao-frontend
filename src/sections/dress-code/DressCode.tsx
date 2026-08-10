import { SectionShell } from '../../components/ui/SectionShell'
import type { DressCodeContent } from '../../lib/content'

interface DressCodeProps {
  content: DressCodeContent
}

export function DressCode({ content }: DressCodeProps) {
  return (
    <SectionShell slug="dress_code" title={content.title}>
      {content.attire ? <p className="mt-4 font-bold">{content.attire}</p> : null}
      {content.body ? <p className="mt-4 whitespace-pre-line">{content.body}</p> : null}
    </SectionShell>
  )
}
