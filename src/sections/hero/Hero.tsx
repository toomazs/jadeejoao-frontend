import { logoVertical, siriguela } from '../../assets'
import { Inline } from '../../components/ui/Markdown'
import type { HeroContent } from '../../lib/content'
import { formatEventDate } from '../../lib/format'
import { COUPLE_NAMES } from '../../lib/ui-strings'

interface HeroProps {
  content: HeroContent
}

/**
 * The gate: the couple's photograph filling the whole first viewport, the
 * fixed nav floating over it, the names spilled across the foot of the photo
 * and the date standing at their side.
 */
export function Hero({ content }: HeroProps) {
  const photo = content.hero_image_url

  return (
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
          <h1 id="hero-heading" className="sr-only">
            {COUPLE_NAMES}
          </h1>
          {/* The real wordmark, inverted to read cream over the photograph. */}
          <img
            src={logoVertical}
            alt=""
            aria-hidden="true"
            className="w-[min(78vw,34rem)] brightness-0 invert select-none lg:w-[38rem]"
          />
        </div>

        <div className="hero-enter shrink-0 lg:pb-4 lg:text-right">
          <p className="font-accent text-4xl text-cream sm:text-5xl">
            {formatEventDate(content.event_date)}
          </p>
          <p className="mt-3 font-body text-xs tracking-[0.35em] text-cream/75 uppercase sm:text-sm">
            <Inline text={content.city_label} />
          </p>
        </div>
      </div>
    </section>
  )
}
