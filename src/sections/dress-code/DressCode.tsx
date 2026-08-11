import { Markdown } from '../../components/ui/Markdown'
import { SectionShell } from '../../components/ui/SectionShell'
import type { DressCodeContent } from '../../lib/content'

interface DressCodeProps {
  content: DressCodeContent
}

/** An open passage: the attire formula is the centerpiece, spoken in warm terracotta. */
export function DressCode({ content }: DressCodeProps) {
  return (
    <SectionShell slug="dress_code" title={content.title} variant="open">
      {content.attire ? (
        <p className="mx-auto max-w-xl text-center font-body text-2xl leading-snug text-balance text-terracotta italic sm:text-3xl">
          {content.attire}
        </p>
      ) : null}
      {content.body ? (
        <Markdown
          text={content.body}
          className="mx-auto mt-8 max-w-prose font-body text-lg leading-relaxed"
        />
      ) : null}
    </SectionShell>
  )
}
