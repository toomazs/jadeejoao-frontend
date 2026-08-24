import type { components } from '../../api/schema'
import { BroadLeaf } from '../../components/ui/Botanicals'
import { Markdown } from '../../components/ui/Markdown'
import { Reveal } from '../../components/ui/Reveal'
import type { DressCodeContent } from '../../lib/content'

type DressCodeLook = components['schemas']['DressCodeLook']

interface DressCodeProps {
  content: DressCodeContent
}

/**
 * One reference look: the words on one side, the photograph on the other,
 * the sides swapping down the section so the eye keeps moving.
 */
function Look({ look, index }: { look: DressCodeLook; index: number }) {
  const photoRight = index % 2 === 0
  return (
    <Reveal
      className={`grid items-center gap-10 lg:gap-16 ${
        photoRight ? 'lg:grid-cols-[1fr_auto]' : 'lg:grid-cols-[auto_1fr]'
      }`}
    >
      <div className={`text-center lg:text-left ${photoRight ? '' : 'lg:order-2'}`}>
        <h3 className="font-body text-sm tracking-[0.32em] text-gold-sand uppercase">
          {look.title}
        </h3>
        {look.body ? (
          <Markdown
            text={look.body}
            className="mt-5 max-w-prose font-body text-lg leading-relaxed text-cream-soft"
          />
        ) : null}
      </div>

      <div className={`mx-auto w-[min(74vw,20rem)] lg:mx-0 ${photoRight ? '' : 'lg:order-1'}`}>
        {/* The reference photograph, framed like the album's prints. */}
        <div className="border border-gold-sand/40 bg-cream/5 p-2.5">
          <div className="relative aspect-[3/4] overflow-hidden">
            {look.image_url ? (
              <img
                src={look.image_url}
                alt={look.title}
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
      </div>
    </Reveal>
  )
}

/**
 * The page's one dark room: the attire formula spoken huge in cream on deep
 * olive, then a reference look for her and one for him — what "esporte fino"
 * means to them, shown rather than described.
 */
export function DressCode({ content }: DressCodeProps) {
  const looks = content.looks ?? []

  return (
    <section
      id="dress_code"
      aria-labelledby="dress_code-heading"
      className="relative overflow-hidden bg-deep-olive px-4 py-20 sm:px-8 sm:py-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="text-center">
          <h2
            id="dress_code-heading"
            className="font-body text-sm tracking-[0.32em] text-gold-sand uppercase"
          >
            {content.title}
          </h2>
          {content.attire ? (
            <p className="mx-auto mt-7 max-w-4xl font-display text-[clamp(1.9rem,4.5vw,3.4rem)] leading-snug text-balance text-cream">
              {content.attire}
            </p>
          ) : null}
        </Reveal>

        {looks.length > 0 ? (
          <div className="mt-16 flex flex-col gap-16 sm:gap-20">
            {looks.map((look, index) => (
              <Look key={look.title} look={look} index={index} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
