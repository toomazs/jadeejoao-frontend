import { ButtonLink } from '../../components/ui/Button'
import { Markdown } from '../../components/ui/Markdown'
import { SectionShell } from '../../components/ui/SectionShell'
import type { GettingThereContent } from '../../lib/content'
import { uiStrings } from '../../lib/ui-strings'

interface GettingThereProps {
  content: GettingThereContent
  ordinal?: string
}

/** Address and guidance beside the living map — the desktop finally uses its width. */
export function GettingThere({ content, ordinal }: GettingThereProps) {
  return (
    <SectionShell slug="getting_there" title={content.title} ordinal={ordinal} width="wide">
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

          {content.map_embed_url ? (
            <p className="mt-7">
              <ButtonLink href={content.map_embed_url} target="_blank" rel="noopener noreferrer">
                {uiStrings.openMap}
              </ButtonLink>
            </p>
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
    </SectionShell>
  )
}
