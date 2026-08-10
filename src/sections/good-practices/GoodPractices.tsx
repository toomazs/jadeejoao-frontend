import { SectionShell } from '../../components/ui/SectionShell'
import type { GoodPracticesContent } from '../../lib/content'

interface GoodPracticesProps {
  content: GoodPracticesContent
}

export function GoodPractices({ content }: GoodPracticesProps) {
  return (
    <SectionShell slug="good_practices" title={content.title}>
      {content.body ? <p className="mt-4 whitespace-pre-line">{content.body}</p> : null}
      {content.rules.length > 0 ? (
        <ul className="mt-4 list-disc space-y-1 pl-5">
          {content.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      ) : null}
    </SectionShell>
  )
}
