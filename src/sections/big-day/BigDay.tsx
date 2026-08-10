import { SectionShell } from '../../components/ui/SectionShell'
import type { BigDayContent } from '../../lib/content'

interface BigDayProps {
  content: BigDayContent
}

export function BigDay({ content }: BigDayProps) {
  return (
    <SectionShell slug="big_day" title={content.title}>
      {content.body ? <p className="mt-4 whitespace-pre-line">{content.body}</p> : null}
      {content.venue_notes ? <p className="mt-4">{content.venue_notes}</p> : null}
      {content.programme.length > 0 ? (
        <ol className="mt-4 space-y-1">
          {content.programme.map((item) => (
            <li key={`${item.time}-${item.label}`}>
              <time>{item.time}</time> — {item.label}
            </li>
          ))}
        </ol>
      ) : null}
    </SectionShell>
  )
}
