import { MapPin, Navigation } from 'lucide-react'

import { ButtonLink } from '../../components/ui/Button'
import { LeafGlyph } from '../../components/ui/LeafGlyph'
import { Markdown } from '../../components/ui/Markdown'
import { Reveal } from '../../components/ui/Reveal'
import { SectionShell } from '../../components/ui/SectionShell'
import type { GettingThereContent, StayContent } from '../../lib/content'
import { uiStrings } from '../../lib/ui-strings'

interface GettingThereProps {
  content: GettingThereContent
  /** Composed in: lodging lives in its own section server-side (AD-7). */
  stay?: StayContent
}

/**
 * One room for the whole logistics of the day: where it happens, on the map,
 * and — under the same roof — where to sleep. Two sections in the contract,
 * a single answer for the guest asking "how do I get there and where do I
 * stay?".
 */
export function GettingThere({ content, stay }: GettingThereProps) {
  const hasLodging =
    stay && (stay.lodgings.length > 0 || stay.airbnb_areas.length > 0 || Boolean(stay.body))

  return (
    <SectionShell slug="getting_there" title={content.title} tone="veil" width="wide">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col">
          <p className="font-body text-xl leading-relaxed text-olive sm:text-2xl">
            {content.address}
          </p>

          {content.body ? (
            <Markdown
              text={content.body}
              className="mt-6 max-w-prose font-body text-lg leading-relaxed"
            />
          ) : null}

          {content.parking_notes ? (
            <p className="mt-6 max-w-prose border-t border-sand-line pt-5 font-body text-base text-dark-gray italic">
              {content.parking_notes}
            </p>
          ) : null}

          {content.maps_url || content.waze_url ? (
            <div className="mt-7 flex flex-wrap gap-3">
              {content.maps_url ? (
                <ButtonLink href={content.maps_url} target="_blank" rel="noopener noreferrer">
                  <MapPin aria-hidden="true" size={18} strokeWidth={2} />
                  {uiStrings.openInMaps}
                </ButtonLink>
              ) : null}
              {content.waze_url ? (
                <ButtonLink
                  href={content.waze_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                >
                  <Navigation aria-hidden="true" size={18} strokeWidth={2} />
                  {uiStrings.openInWaze}
                </ButtonLink>
              ) : null}
            </div>
          ) : null}
        </div>

        {content.map_embed_url ? (
          <div className="overflow-hidden border border-olive-line">
            <iframe
              src={content.map_embed_url}
              title={content.address}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/3] w-full border-0"
            />
          </div>
        ) : null}
      </div>

      {hasLodging ? (
        <div className="mt-12 border-t border-sand-line pt-10">
          <Reveal className="text-center">
            <h3 className="font-display text-[clamp(1.6rem,3.4vw,2.2rem)] text-olive">
              {stay.title}
            </h3>
            {stay.body ? (
              <Markdown
                text={stay.body}
                className="mx-auto mt-4 max-w-prose text-center font-body text-lg leading-relaxed"
              />
            ) : null}
          </Reveal>

          {stay.lodgings.length > 0 ? (
            <ul className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {stay.lodgings.map((lodging, index) => (
                <Reveal
                  as="li"
                  key={lodging.name}
                  delay={index * 110}
                  className="lift flex flex-col border border-olive-line bg-cream px-5 py-6"
                >
                  {lodging.link ? (
                    <a
                      href={lodging.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-display text-xl text-olive underline decoration-1 underline-offset-4 transition-colors hover:text-terracotta"
                    >
                      {lodging.name}
                    </a>
                  ) : (
                    <span className="font-display text-xl text-olive">{lodging.name}</span>
                  )}
                  {lodging.area ? (
                    <span className="mt-1 font-body text-base text-dark-gray italic">
                      {lodging.area}
                    </span>
                  ) : null}
                  {lodging.notes ? (
                    <p className="mt-2.5 font-body text-base leading-relaxed">{lodging.notes}</p>
                  ) : null}
                  {lodging.shuttle_served ? (
                    <p className="mt-auto flex items-center gap-2 pt-4 text-deep-olive">
                      <LeafGlyph className="h-4 w-4 shrink-0" />
                      <span className="font-body text-sm tracking-[0.14em] uppercase">
                        {uiStrings.shuttleServed}
                      </span>
                    </p>
                  ) : null}
                </Reveal>
              ))}
            </ul>
          ) : null}

          {stay.airbnb_areas.length > 0 ? (
            <div className="mt-8 text-center">
              <p className="font-body text-base text-dark-gray italic">{uiStrings.airbnbAreas}</p>
              <ul className="mt-3 flex flex-wrap justify-center gap-2">
                {stay.airbnb_areas.map((area) => (
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
        </div>
      ) : null}
    </SectionShell>
  )
}
