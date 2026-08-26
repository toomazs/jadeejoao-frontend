import { Navigation } from 'lucide-react'

import { LeafGlyph } from '../../components/ui/LeafGlyph'
import { Inline, Markdown } from '../../components/ui/Markdown'
import { Reveal } from '../../components/ui/Reveal'
import { SectionShell } from '../../components/ui/SectionShell'
import type { GettingThereContent, StayContent } from '../../lib/content'
import { uiStrings } from '../../lib/ui-strings'

/** One navigation app, as a card: its own mark, its own name, one tap away. */
function NavCard({
  href,
  logo,
  name,
  hint,
}: {
  href: string
  logo?: string
  name: string
  hint: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="lift flex items-center gap-4 border border-olive-line bg-cream px-4 py-3.5"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center">
        {logo ? (
          <img src={logo} alt="" className="max-h-9 w-auto object-contain" loading="lazy" />
        ) : (
          <Navigation aria-hidden="true" size={22} strokeWidth={1.8} className="text-olive" />
        )}
      </span>
      <span className="flex flex-col">
        <span className="font-display text-lg leading-tight text-olive">{name}</span>
        <span className="font-body text-xs tracking-[0.14em] text-dark-gray uppercase">{hint}</span>
      </span>
    </a>
  )
}

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
  // Two kinds of answer: places the couple vouches for, and the platforms
  // where a guest can look for themselves.
  // Carrying the payload position through the split. The page shows these as
  // two separate rows, so a card's place here is not its place in the list the
  // panel edits — and the panel addresses them by that.
  const numbered = stay?.lodgings.map((lodging, at) => ({ ...lodging, at })) ?? []
  const hotels = numbered.filter((lodging) => !lodging.platform)
  const platforms = numbered.filter((lodging) => lodging.platform)
  const hasLodging = stay && (hotels.length > 0 || platforms.length > 0 || Boolean(stay.body))

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
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {content.maps_url ? (
                <NavCard
                  href={content.maps_url}
                  logo={content.maps_logo_url}
                  name="Google Maps"
                  hint={uiStrings.openInApp}
                />
              ) : null}
              {content.waze_url ? (
                <NavCard
                  href={content.waze_url}
                  logo={content.waze_logo_url}
                  name="Waze"
                  hint={uiStrings.openInApp}
                />
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
        // "Onde ficar" is its own payload but not its own section — the hotels
        // read as part of getting there, so they live here. The panel still
        // lists it separately, and pointed at a `#stay` that this page has
        // never had: opening it simply did nothing.
        <div id="stay" className="mt-12 border-t border-sand-line pt-10">
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

          {hotels.length > 0 ? (
            <ul className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {hotels.map((lodging, index) => (
                <Reveal
                  as="li"
                  key={lodging.name}
                  id={`lodging-${lodging.at}`}
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
                    <p className="mt-2.5 font-body text-base leading-relaxed">
                      <Inline text={lodging.notes} />
                    </p>
                  ) : null}
                  {/* Both answers are spoken. Drawing only the positive one
                      left a card with no line at all, which reads as missing
                      information rather than as "the van does not come here". */}
                  <p
                    className={`mt-auto flex items-center gap-2 pt-4 ${
                      lodging.shuttle_served ? 'text-deep-olive' : 'text-dark-gray/55'
                    }`}
                  >
                    {lodging.shuttle_served ? (
                      <LeafGlyph className="h-4 w-4 shrink-0" />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex h-4 w-4 shrink-0 items-center justify-center"
                      >
                        <span className="h-px w-2.5 bg-current" />
                      </span>
                    )}
                    <span className="font-body text-sm tracking-[0.14em] uppercase">
                      {lodging.shuttle_served
                        ? uiStrings.shuttleServed
                        : uiStrings.shuttleNotServed}
                    </span>
                  </p>
                </Reveal>
              ))}
            </ul>
          ) : null}

          {platforms.length > 0 ? (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {platforms.map((platform, index) => (
                <Reveal
                  as="li"
                  key={platform.name}
                  id={`lodging-${platform.at}`}
                  delay={index * 110}
                  className="lift border border-olive-line bg-cream"
                >
                  <a
                    href={platform.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 px-4 py-3.5"
                  >
                    <span className="flex h-9 w-24 shrink-0 items-center justify-start">
                      {platform.logo_url ? (
                        <img
                          src={platform.logo_url}
                          alt={platform.name}
                          className="max-h-7 w-auto max-w-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <span className="font-display text-lg text-olive">{platform.name}</span>
                      )}
                    </span>
                    {platform.notes ? (
                      <span className="font-body text-sm leading-snug text-dark-gray">
                        {platform.notes}
                      </span>
                    ) : null}
                  </a>
                </Reveal>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </SectionShell>
  )
}
