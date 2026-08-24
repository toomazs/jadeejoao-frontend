import { BroadLeaf } from '../../components/ui/Botanicals'
import { Markdown } from '../../components/ui/Markdown'
import { Reveal } from '../../components/ui/Reveal'
import type { DressCodeContent } from '../../lib/content'

interface DressCodeProps {
  content: DressCodeContent
}

/**
 * The page's one dark room: the attire formula spoken huge in cream on deep
 * olive, with the couple's reference photograph beside it — what "esporte
 * fino" means to them, shown rather than described. Until they upload one,
 * the frame keeps a drawn leaf so the layout never looks broken.
 */
export function DressCode({ content }: DressCodeProps) {
  const photo = content.images[0]

  return (
    <section
      id="dress_code"
      aria-labelledby="dress_code-heading"
      className="relative overflow-hidden bg-deep-olive px-4 py-20 sm:px-8 sm:py-24"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
        <div className="text-center lg:text-left">
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
              <p className="mt-7 font-display text-[clamp(1.9rem,4.5vw,3.4rem)] leading-snug text-balance text-cream">
                {content.attire}
              </p>
            </Reveal>
          ) : null}
          {content.body ? (
            <Reveal delay={220}>
              <Markdown
                text={content.body}
                className="mt-8 max-w-prose font-body text-lg leading-relaxed text-cream-soft lg:mx-0"
              />
            </Reveal>
          ) : null}
        </div>

        <Reveal delay={160} className="mx-auto w-[min(78vw,22rem)] lg:mx-0">
          {/* The reference photograph, framed like the album's prints. */}
          <div className="border border-gold-sand/40 bg-cream/5 p-2.5">
            <div className="relative aspect-[3/4] overflow-hidden">
              {photo ? (
                <img
                  src={photo}
                  alt={content.attire || content.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-gold-sand/30">
                  <BroadLeaf className="turn-slow h-3/5 w-auto" />
                </span>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
