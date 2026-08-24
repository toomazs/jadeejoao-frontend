import { useEffect, useRef, useState } from 'react'

import type { SectionSlug } from '../../lib/content'
import { navItems, uiStrings } from '../../lib/ui-strings'
import { ButtonLink } from './Button'

interface NavProps {
  /** Slugs actually present in the content response — items without a target are hidden. */
  presentSlugs: ReadonlySet<SectionSlug>
}

/** The monogram: the couple's initials joined by the script "e". */
function Monogram({ tone }: { tone: 'cream' | 'olive' }) {
  return (
    <>
      J
      <span
        aria-hidden="true"
        className={`font-accent text-[0.75em] ${tone === 'cream' ? 'text-gold-sand' : 'text-terracotta'}`}
      >
        {' '}
        e{' '}
      </span>
      J
    </>
  )
}

/**
 * Two navigations, one at a time: a transparent row living over the hero
 * photograph, and — once the page leaves the hero — a floating frosted-glass
 * pill that fades in from above, links staggering after it.
 */
export function Nav({ presentSlugs }: NavProps) {
  const items = navItems.filter((item) => presentSlugs.has(item.anchor))
  const [pill, setPill] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const kebabRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setPill(window.scrollY > window.innerHeight * 0.55)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!pill) setMenuOpen(false)
  }, [pill])

  useEffect(() => {
    if (!menuOpen) return
    const onDocClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (popoverRef.current?.contains(target)) return
      if (kebabRef.current?.contains(target)) return
      setMenuOpen(false)
    }
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [menuOpen])

  if (items.length === 0) {
    return null
  }

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30">
      {/* Transparent row over the hero photograph. */}
      <div
        aria-hidden={pill}
        className={`transition-[opacity,transform] duration-500 ${
          pill ? 'pointer-events-none -translate-y-3 opacity-0' : 'pointer-events-auto opacity-100'
        }`}
      >
        <nav
          aria-label={uiStrings.navLabel}
          className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-8"
        >
          <a
            href="#hero"
            aria-label={uiStrings.backToTop}
            className="shrink-0 py-3 font-display text-2xl leading-none text-cream"
          >
            <Monogram tone="cream" />
          </a>
          <ul className="edge-fade-x no-scrollbar flex flex-1 items-center gap-6 overflow-x-auto pr-6 pl-4 whitespace-nowrap">
            {items.map((item) => (
              <li key={item.anchor}>
                <a
                  href={`#${item.anchor}`}
                  className="inline-flex min-h-12 items-center font-body text-sm tracking-[0.14em] text-cream/90 uppercase underline-offset-8 transition-colors hover:text-cream hover:underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          {presentSlugs.has('rsvp') ? (
            <ButtonLink
              href="#rsvp"
              variant="light"
              className="hidden min-h-11 shrink-0 px-6 text-sm md:inline-flex"
            >
              {uiStrings.confirmCta}
            </ButtonLink>
          ) : null}
        </nav>
      </div>

      {/* Floating frosted pill once the hero is behind us. */}
      <div
        aria-hidden={!pill}
        className={`absolute inset-x-0 top-3 flex flex-col items-center px-3 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:top-5 ${
          pill ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'
        }`}
      >
        <nav
          aria-label={uiStrings.navLabel}
          className={`flex h-12 items-center gap-5 rounded-full border border-olive-line/80 bg-cream/80 px-5 shadow-[0_10px_32px_-14px_rgba(26,24,24,0.35),0_2px_6px_-2px_rgba(26,24,24,0.12)] backdrop-blur-xl ${
            pill ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          <a
            href="#hero"
            aria-label={uiStrings.backToTop}
            className="shrink-0 font-display text-xl leading-none text-olive"
          >
            <Monogram tone="olive" />
          </a>
          <span aria-hidden="true" className="hidden h-4 w-px shrink-0 bg-olive-line lg:block" />
          <ul className="hidden items-center gap-5 lg:flex">
            {items.map((item, index) => (
              <li key={item.anchor}>
                <a
                  href={`#${item.anchor}`}
                  className={`font-body text-xs tracking-[0.1em] text-ink uppercase transition-[opacity,transform,color] duration-300 hover:text-terracotta ${
                    pill ? 'translate-x-0 opacity-100' : 'translate-x-1.5 opacity-0'
                  }`}
                  style={{ transitionDelay: pill ? `${180 + index * 50}ms` : '0ms' }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            ref={kebabRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-olive transition-colors hover:bg-olive/10 lg:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <circle cx="8" cy="3" r="1.5" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="8" cy="13" r="1.5" />
            </svg>
          </button>
        </nav>

        {/* Mobile popover under the pill. */}
        <div
          ref={popoverRef}
          className={`mt-2 overflow-hidden rounded-3xl border border-olive-line/80 bg-cream/90 shadow-[0_18px_40px_-16px_rgba(26,24,24,0.4)] backdrop-blur-xl transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
            menuOpen && pill
              ? 'pointer-events-auto translate-y-0 opacity-100'
              : 'pointer-events-none -translate-y-2 opacity-0'
          }`}
          style={{ width: 'min(260px, calc(100vw - 32px))' }}
        >
          <nav aria-label={uiStrings.navLabel} className="flex flex-col py-2">
            {items.map((item) => (
              <a
                key={item.anchor}
                href={`#${item.anchor}`}
                onClick={() => setMenuOpen(false)}
                className="px-5 py-2.5 font-body text-sm tracking-[0.1em] text-ink uppercase transition-colors hover:bg-olive/10"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
