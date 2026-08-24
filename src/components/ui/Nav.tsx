import { useEffect, useState } from 'react'

import type { SectionSlug } from '../../lib/content'
import { navItems, uiStrings } from '../../lib/ui-strings'
import { ButtonLink } from './Button'

interface NavProps {
  /** Slugs actually present in the content response — items without a target are hidden. */
  presentSlugs: ReadonlySet<SectionSlug>
}

/**
 * Fixed overlay navigation: transparent over the hero photograph (cream text,
 * monogram, the RSVP plaque), gaining the cream veil once the page moves.
 */
export function Nav({ presentSlugs }: NavProps) {
  const items = navItems.filter((item) => presentSlugs.has(item.anchor))
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (items.length === 0) {
    return null
  }

  return (
    <nav
      aria-label={uiStrings.navLabel}
      className={`fixed inset-x-0 top-0 z-30 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled
          ? 'border-olive-line bg-cream/90 shadow-[0_14px_34px_-26px_var(--ink)] backdrop-blur'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-8">
        <a
          href="#hero"
          aria-label={uiStrings.backToTop}
          className={`shrink-0 py-3 font-display text-2xl leading-none transition-colors ${
            scrolled ? 'text-olive' : 'text-cream'
          }`}
        >
          J
          <span
            aria-hidden="true"
            className={`font-accent text-[0.75em] ${scrolled ? 'text-terracotta' : 'text-gold-sand'}`}
          >
            {' '}
            e{' '}
          </span>
          J
        </a>
        <ul className="edge-fade-x no-scrollbar flex flex-1 items-center gap-6 overflow-x-auto pr-6 pl-4 whitespace-nowrap">
          {items.map((item) => (
            <li key={item.anchor}>
              <a
                href={`#${item.anchor}`}
                className={`inline-flex min-h-12 items-center font-body text-sm tracking-[0.14em] uppercase underline-offset-8 transition-colors hover:underline ${
                  scrolled ? 'text-ink hover:text-terracotta' : 'text-cream/90 hover:text-cream'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        {presentSlugs.has('rsvp') ? (
          <ButtonLink
            href="#rsvp"
            variant={scrolled ? 'primary' : 'light'}
            className="hidden min-h-11 shrink-0 px-6 text-sm md:inline-flex"
          >
            {uiStrings.confirmCta}
          </ButtonLink>
        ) : null}
      </div>
    </nav>
  )
}
