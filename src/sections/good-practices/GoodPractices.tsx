import { LeafGlyph } from '../../components/ui/LeafGlyph'
import { Markdown } from '../../components/ui/Markdown'
import { SectionShell } from '../../components/ui/SectionShell'
import type { GoodPracticesContent } from '../../lib/content'

interface GoodPracticesProps {
  content: GoodPracticesContent
  ordinal?: string
}

/** House rules, each marked by the seriguela leaflet — the etiquette of being received at home. */
export function GoodPractices({ content, ordinal }: GoodPracticesProps) {
  return (
    <SectionShell slug="good_practices" title={content.title} ordinal={ordinal}>
      {content.body ? (
        <Markdown
          text={content.body}
          className="mx-auto max-w-prose text-center font-body text-lg leading-relaxed"
        />
      ) : null}
      {content.rules.length > 0 ? (
        <ul className="mx-auto mt-9 max-w-prose space-y-5">
          {content.rules.map((rule) => (
            <li key={rule} className="flex items-start gap-3.5">
              <LeafGlyph className="mt-1.5 h-4 w-4 shrink-0 text-olive" />
              <span className="font-body text-lg leading-relaxed">{rule}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </SectionShell>
  )
}
