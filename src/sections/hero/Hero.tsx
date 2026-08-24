import { siriguela } from '../../assets'
import { Reveal } from '../../components/ui/Reveal'
import type { HeroContent } from '../../lib/content'
import { formatEventDate } from '../../lib/format'

interface HeroProps {
  content: HeroContent
}

/** The couple's names huge at the photo's foot, the script "e" joining them. */
function StackedNames({ names }: { names: string }) {
  const parts = names.split(/\s*&\s*/)
  const sizing = 'mt-4 font-display text-[clamp(3.8rem,11vw,8.5rem)] leading-[0.95] text-cream'
  if (parts.length !== 2) {
    return (
      <h1 id="hero-heading" className={sizing}>
        {names}
      </h1>
    )
  }
  return (
    <h1 id="hero-heading" aria-label={names} className={sizing}>
      <span aria-hidden="true">{parts[0]}</span>
      <span aria-hidden="true" className="block">
        <span className="font-accent text-[0.55em] text-gold-sand">e</span> {parts[1]}
      </span>
    </h1>
  )
}

/**
 * The gate: the couple's photograph filling the whole first viewport, the
 * fixed nav floating over it, the names spilled across the foot of the photo
 * and the date standing at their side — then the welcome sentence on paper.
 */
export function Hero({ content }: HeroProps) {
  const photo = content.hero_image_url || content.milestones.find((m) => m.image_url)?.image_url

  return (
    <>
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-deep-olive"
      >
        <div aria-hidden="true" className="absolute inset-0">
          {photo ? (
            <img
              src={photo}
              alt=""
              className="kenburns h-full w-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
          ) : (
            <img
              src={siriguela}
              alt=""
              className="sway absolute top-1/2 left-1/2 h-2/5 w-auto -translate-x-1/2 -translate-y-1/2 opacity-25 select-none"
            />
          )}
          {/* Legibility veil: darker at the head (nav) and the foot (names). */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/10 to-ink/80" />
        </div>

        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-9 px-5 pt-28 pb-12 sm:px-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:pb-16">
          <div className="hero-enter">
            <StackedNames names={content.couple_names} />
          </div>

          <div className="hero-enter shrink-0 lg:pb-4 lg:text-right">
            <p className="font-accent text-4xl text-cream sm:text-5xl">
              {formatEventDate(content.event_datetime)}
            </p>
            <p className="mt-3 font-body text-xs tracking-[0.35em] text-cream/75 uppercase sm:text-sm">
              {content.city_label}
            </p>
          </div>
        </div>
      </section>

      {content.body ? (
        <div className="bg-cream px-5 py-12 sm:py-16">
          <Reveal>
            <p className="mx-auto max-w-2xl text-center font-body text-xl leading-relaxed text-ink sm:text-2xl">
              {content.body}
            </p>
          </Reveal>
        </div>
      ) : null}
    </>
  )
}
