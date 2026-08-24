import { Markdown } from '../../components/ui/Markdown'
import { Reveal } from '../../components/ui/Reveal'
import type { DressCodeContent } from '../../lib/content'

interface DressCodeProps {
  content: DressCodeContent
}

/**
 * A full-bleed statement band: the attire formula spoken huge in gold-sand on
 * deep olive — the page's one dark room, breaking the cream rhythm.
 */
export function DressCode({ content }: DressCodeProps) {
  return (
    <section
      id="dress_code"
      aria-labelledby="dress_code-heading"
      className="bg-deep-olive px-4 py-16 sm:px-8 sm:py-20"
    >
      <div className="mx-auto w-full max-w-5xl text-center">
        <Reveal>
          <h2
            id="dress_code-heading"
            className="font-body text-sm tracking-[0.32em] text-gold-sand uppercase"
          >
            {content.title}
          </h2>
        </Reveal>
        {content.attire ? (
          <Reveal delay={120}>
            <p className="mx-auto mt-7 max-w-4xl font-display text-[clamp(1.9rem,4.5vw,3.5rem)] leading-snug text-balance text-cream">
              {content.attire}
            </p>
          </Reveal>
        ) : null}
        {content.body ? (
          <Reveal delay={220}>
            <Markdown
              text={content.body}
              className="mx-auto mt-8 max-w-prose font-body text-lg leading-relaxed text-cream-soft"
            />
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}
