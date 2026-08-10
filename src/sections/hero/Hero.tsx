import { logo } from '../../assets'
import { SectionShell } from '../../components/ui/SectionShell'
import type { HeroContent } from '../../lib/content'
import { formatEventDate, formatEventTime } from '../../lib/format'

interface HeroProps {
  content: HeroContent
}

export function Hero({ content }: HeroProps) {
  return (
    <SectionShell slug="hero" title={content.title} headingLevel="h1">
      <img src={logo} alt="" className="mt-6 h-24 w-auto" />
      <p className="mt-4 font-display text-4xl text-olive">{content.couple_names}</p>
      <p className="mt-2 text-dark-gray">
        {formatEventDate(content.event_datetime)} · {formatEventTime(content.event_datetime)} ·{' '}
        {content.city_label}
      </p>
      {content.body ? <p className="mt-4 whitespace-pre-line">{content.body}</p> : null}
    </SectionShell>
  )
}
