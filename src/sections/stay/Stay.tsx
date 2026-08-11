import { LeafGlyph } from '../../components/ui/LeafGlyph'
import { Markdown } from '../../components/ui/Markdown'
import { SectionShell } from '../../components/ui/SectionShell'
import type { StayContent } from '../../lib/content'
import { uiStrings } from '../../lib/ui-strings'

interface StayProps {
  content: StayContent
  ordinal?: string
}

/** Guest rooms: lodging entries as ruled ledger rows, shuttle marked by the leaf badge. */
export function Stay({ content, ordinal }: StayProps) {
  return (
    <SectionShell slug="stay" title={content.title} ordinal={ordinal} variant="veil">
      {content.body ? (
        <Markdown
          text={content.body}
          className="mx-auto max-w-prose text-center font-body text-lg leading-relaxed"
        />
      ) : null}

      {content.lodgings.length > 0 ? (
        <ul className="mt-9 divide-y divide-sand-line border-y border-sand-line">
          {content.lodgings.map((lodging) => (
            <li key={lodging.name} className="py-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                {lodging.link ? (
                  <a
                    href={lodging.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-xl text-olive underline decoration-1 underline-offset-4 transition-colors hover:text-terracotta"
                  >
                    {lodging.name}
                  </a>
                ) : (
                  <span className="font-body text-xl text-olive">{lodging.name}</span>
                )}
                {lodging.area ? (
                  <span className="font-body text-base text-dark-gray italic">{lodging.area}</span>
                ) : null}
              </div>
              {lodging.notes ? (
                <p className="mt-1.5 font-body text-lg leading-relaxed">{lodging.notes}</p>
              ) : null}
              {lodging.shuttle_served ? (
                <p className="mt-2.5 flex items-center gap-2 text-deep-olive">
                  <LeafGlyph className="h-4 w-4 shrink-0" />
                  <span className="font-body text-sm tracking-[0.14em] uppercase">
                    {uiStrings.shuttleServed}
                  </span>
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {content.airbnb_areas.length > 0 ? (
        <div className="mt-8 text-center">
          <p className="font-body text-base text-dark-gray italic">{uiStrings.airbnbAreas}</p>
          <ul className="mt-3 flex flex-wrap justify-center gap-2">
            {content.airbnb_areas.map((area) => (
              <li
                key={area}
                className="border border-sand-line bg-cream px-4 py-1.5 font-body text-base text-olive"
              >
                {area}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </SectionShell>
  )
}
