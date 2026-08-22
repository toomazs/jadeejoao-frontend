import { Markdown } from '../../components/ui/Markdown'
import { SectionShell } from '../../components/ui/SectionShell'
import type { BigDayContent } from '../../lib/content'

interface BigDayProps {
  content: BigDayContent
  ordinal?: string
}

/**
 * The day's walk: a stemmed programme — engraved times on the left, moments on
 * the right, diamond nodes on a vertical hairline (the path through the day).
 */
export function BigDay({ content, ordinal }: BigDayProps) {
  return (
    <SectionShell slug="big_day" title={content.title} ordinal={ordinal} variant="veil" width="wide">
      <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:items-start">
        <div>
          {content.body ? (
            <Markdown text={content.body} className="max-w-prose font-body text-lg leading-relaxed" />
          ) : null}
          {content.venue_notes ? (
            <p className="mt-7 max-w-prose border-t border-sand-line pt-5 font-body text-base text-dark-gray italic">
              {content.venue_notes}
            </p>
          ) : null}
        </div>

        {content.programme.length > 0 ? (
          <ol className="relative">
            {/* the stem */}
            <span aria-hidden="true" className="absolute inset-y-1 left-[5.5rem] w-px bg-sand-line" />
            {content.programme.map((item) => (
              <li
                key={`${item.time}-${item.label}`}
                className="relative grid grid-cols-[4rem_1fr] gap-x-12 pb-6 last:pb-0"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-2 left-[5.5rem] h-1.5 w-1.5 -translate-x-1/2 rotate-45 bg-olive"
                />
                <time className="text-right font-display text-xl leading-6 text-olive">
                  {item.time}
                </time>
                <span className="font-body text-lg leading-6">{item.label}</span>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </SectionShell>
  )
}
