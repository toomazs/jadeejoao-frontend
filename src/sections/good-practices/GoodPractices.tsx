import { Markdown } from '../../components/ui/Markdown'
import { Reveal } from '../../components/ui/Reveal'
import { SectionShell } from '../../components/ui/SectionShell'
import type { GoodPracticesContent } from '../../lib/content'

interface GoodPracticesProps {
  content: GoodPracticesContent
  ordinal?: string
}

/** House rules as numbered cards — the etiquette of being received at home. */
export function GoodPractices({ content, ordinal }: GoodPracticesProps) {
  return (
    <SectionShell slug="good_practices" title={content.title} ordinal={ordinal} width="wide">
      {content.body ? (
        <Markdown
          text={content.body}
          className="mx-auto max-w-prose text-center font-body text-lg leading-relaxed"
        />
      ) : null}
      {content.rules.length > 0 ? (
        <ul className="mt-9 grid gap-5 sm:grid-cols-2">
          {content.rules.map((rule, index) => {
            const numeralColors = ['text-terracotta', 'text-olive', 'text-gold-sand', 'text-deep-olive']
            return (
              <Reveal
                as="li"
                key={rule}
                delay={index * 90}
                className="lift flex items-start gap-5 border border-olive-line bg-cream px-6 py-6"
              >
                <span
                  aria-hidden="true"
                  className={`font-display text-5xl leading-none ${numeralColors[index % numeralColors.length]}`}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-body text-lg leading-relaxed">{rule}</span>
              </Reveal>
            )
          })}
        </ul>
      ) : null}
    </SectionShell>
  )
}
