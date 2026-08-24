import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { logo } from '../../assets'
import type { SectionSlug } from '../../lib/content'
import { navItems, uiStrings } from '../../lib/ui-strings'

interface NavProps {
  /** Slugs actually present in the content response — items without a target are hidden. */
  presentSlugs: ReadonlySet<SectionSlug>
}

const COLLAPSED_WIDTH = 52

/**
 * The floating frosted pill, in the Liftio choreography: nothing at all over
 * the hero — once the page scrolls past it, the pill drops in collapsed (just
 * the monogram), breathes, then widens to reveal the links in a stagger.
 * Below lg the expanded pill holds the monogram and a kebab popover instead.
 */
export function Nav({ presentSlugs }: NavProps) {
  const items = navItems.filter((item) => presentSlugs.has(item.anchor))
  // The monogram itself is the way home — the pill links skip the hero.
  const pillItems = items.filter((item) => item.anchor !== 'hero')
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [compact, setCompact] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const kebabRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentWidth, setContentWidth] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      // The whole opening — hero, the couple's film, the album, the invitation
      // — runs uninterrupted. The pill only joins from the big day onwards.
      const bigDay = document.getElementById('big_day')
      if (bigDay) {
        setVisible(bigDay.getBoundingClientRect().top <= 80)
        return
      }
      setVisible(window.scrollY > window.innerHeight * 1.5)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!visible) {
      setExpanded(false)
      setMenuOpen(false)
      return
    }
    const t = setTimeout(() => setExpanded(true), 320)
    return () => clearTimeout(t)
  }, [visible])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const handler = () => setCompact(mq.matches)
    handler()
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useLayoutEffect(() => {
    const el = contentRef.current
    if (!el) return
    const measure = () => {
      const kids = Array.from(el.children).filter(
        (kid) => getComputedStyle(kid).display !== 'none',
      )
      if (kids.length === 0) return
      const first = kids[0].getBoundingClientRect()
      const last = kids[kids.length - 1].getBoundingClientRect()
      setContentWidth(Math.ceil(last.right - first.left))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [compact, items.length])

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

  const padding = compact ? 24 : 42
  const expandedWidth = contentWidth > 0 ? contentWidth + padding : compact ? 180 : 620

  return (
    <header
      className={`pointer-events-none fixed inset-x-0 top-3 z-30 flex flex-col items-center px-3 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:top-5 ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
      }`}
    >
      <div
        className={`relative flex h-12 overflow-hidden rounded-full border border-olive-line/80 bg-cream/80 shadow-[0_10px_32px_-14px_rgba(26,24,24,0.35),0_2px_6px_-2px_rgba(26,24,24,0.12)] backdrop-blur-xl transition-[width] duration-[640ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          visible ? 'pointer-events-auto' : ''
        }`}
        style={{
          width: expanded ? `min(${expandedWidth}px, calc(100vw - 24px))` : `${COLLAPSED_WIDTH}px`,
        }}
      >
        {/* Collapsed state: the monogram alone, centered. */}
        <a
          href="#hero"
          aria-label={uiStrings.backToTop}
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            expanded ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
          style={{ transitionDelay: expanded ? '0ms' : '180ms' }}
        >
          <img src={logo} alt="" className="h-7 w-auto select-none" />
        </a>

        {/* Expanded state: monogram left, links (or the kebab) to the right. */}
        <div
          ref={contentRef}
          className={`absolute inset-y-0 right-0 left-0 flex items-center pr-2 pl-4 transition-opacity duration-300 lg:pr-5 lg:pl-5 ${
            expanded ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          style={{ transitionDelay: expanded ? '280ms' : '0ms' }}
        >
          <a
            href="#hero"
            aria-label={uiStrings.backToTop}
            className="flex shrink-0 items-center"
          >
            <img src={logo} alt="" className="h-7 w-auto select-none" />
          </a>

          <span
            aria-hidden="true"
            className={`ml-4 hidden h-4 w-px shrink-0 bg-olive-line transition-[opacity,transform] duration-300 lg:inline-block ${
              expanded ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
            }`}
            style={{ transitionDelay: expanded ? '360ms' : '0ms' }}
          />

          <nav
            aria-label={uiStrings.navLabel}
            className="hidden shrink-0 items-center gap-5 lg:ml-4 lg:mr-1 lg:flex"
          >
            {pillItems.map((item, index) => (
              <a
                key={item.anchor}
                href={`#${item.anchor}`}
                className={`shrink-0 font-body text-xs tracking-[0.1em] text-ink uppercase transition-[opacity,transform,color] duration-300 hover:text-terracotta ${
                  expanded ? 'translate-x-0 opacity-100' : 'translate-x-1.5 opacity-0'
                }`}
                style={{ transitionDelay: expanded ? `${420 + index * 60}ms` : '0ms' }}
              >
                {item.short}
              </a>
            ))}
          </nav>

          <button
            ref={kebabRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            className={`ml-auto flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-olive transition-[opacity,transform,background-color] duration-300 hover:bg-olive/10 active:bg-olive/15 lg:hidden ${
              expanded ? 'translate-x-0 opacity-100' : 'translate-x-1.5 opacity-0'
            }`}
            style={{ transitionDelay: expanded ? '420ms' : '0ms' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <circle cx="8" cy="3" r="1.5" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="8" cy="13" r="1.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile popover under the pill — full labels here. */}
      <div
        ref={popoverRef}
        className={`mt-2 overflow-hidden rounded-3xl border border-olive-line/80 bg-cream/90 shadow-[0_18px_40px_-16px_rgba(26,24,24,0.4)] backdrop-blur-xl transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
          menuOpen && expanded
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
        style={{ width: 'min(280px, calc(100vw - 32px))' }}
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
    </header>
  )
}
