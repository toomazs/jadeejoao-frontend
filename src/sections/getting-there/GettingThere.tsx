import { ButtonLink } from '../../components/ui/Button'
import { Markdown } from '../../components/ui/Markdown'
import { SectionShell } from '../../components/ui/SectionShell'
import type { GettingThereContent } from '../../lib/content'
import { uiStrings } from '../../lib/ui-strings'

interface GettingThereProps {
  content: GettingThereContent
  ordinal?: string
}

/** The address as the room's centerpiece plaque, with the map as the one warm action. */
export function GettingThere({ content, ordinal }: GettingThereProps) {
  return (
    <SectionShell slug="getting_there" title={content.title} ordinal={ordinal}>
      <p className="mx-auto max-w-md text-center font-body text-xl leading-relaxed text-olive sm:text-2xl">
        {content.address}
      </p>

      {content.map_embed_url ? (
        <p className="mt-7 text-center">
          <ButtonLink href={content.map_embed_url} target="_blank" rel="noopener noreferrer">
            {uiStrings.openMap}
          </ButtonLink>
        </p>
      ) : null}

      {content.body ? (
        <Markdown
          text={content.body}
          className="mx-auto mt-9 max-w-prose font-body text-lg leading-relaxed"
        />
      ) : null}

      {content.parking_notes ? (
        <p className="mx-auto mt-8 max-w-prose border-t border-sand-line pt-6 font-body text-base text-dark-gray italic">
          {content.parking_notes}
        </p>
      ) : null}
    </SectionShell>
  )
}
