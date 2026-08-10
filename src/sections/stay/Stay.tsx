import { SectionShell } from '../../components/ui/SectionShell'
import type { StayContent } from '../../lib/content'
import { uiStrings } from '../../lib/ui-strings'

interface StayProps {
  content: StayContent
}

export function Stay({ content }: StayProps) {
  return (
    <SectionShell slug="stay" title={content.title}>
      {content.body ? <p className="mt-4 whitespace-pre-line">{content.body}</p> : null}
      {content.lodgings.length > 0 ? (
        <ul className="mt-4 space-y-4">
          {content.lodgings.map((lodging) => (
            <li key={lodging.name}>
              <p className="font-bold">
                {lodging.link ? (
                  <a
                    href={lodging.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4"
                  >
                    {lodging.name}
                  </a>
                ) : (
                  lodging.name
                )}
              </p>
              {lodging.area ? <p className="text-dark-gray">{lodging.area}</p> : null}
              {lodging.notes ? <p>{lodging.notes}</p> : null}
              {lodging.shuttle_served ? (
                <p className="text-deep-olive">{uiStrings.shuttleServed}</p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
      {content.airbnb_areas.length > 0 ? (
        <ul className="mt-4 list-disc space-y-1 pl-5">
          {content.airbnb_areas.map((area) => (
            <li key={area}>{area}</li>
          ))}
        </ul>
      ) : null}
    </SectionShell>
  )
}
