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
 * Where the pill sits, in pixels from the top — roughly its middle, given
 * top-3/top-5 plus half of h-12. Everything is read off the page at this one
 * height: the room behind it, and whether that room wants it out of the way.
 */
const NAV_LINE = 42

/** Long enough for the hero to have made its own entrance first. */
const ARRIVES_AFTER_MS = 900

/** A room as the pill sees it: where it starts, where it ends, what it is. */
export interface Room {
  top: number
  bottom: number
  tone: string | null
}

/**
 * Which room the pill's line is crossing.
 *
 * The *last* one that contains it, not the first. Rooms touch exactly — one
 * ends on the pixel the next begins — so at a seam two of them answer, and the
 * one declared later in the document is the one actually under the line.
 * Taking the first would leave the pill wearing the colour of the room it has
 * just left, for the whole height of a border.
 *
 * Null when nothing is there, which the caller reads as "keep what you had"
 * rather than flashing to a default.
 */
export function toneAtLine(rooms: readonly Room[], line: number): 'light' | 'dark' | null {
  let found: 'light' | 'dark' | null = null
  for (const room of rooms) {
    if (room.top <= line && room.bottom > line) {
      found = room.tone === 'dark' ? 'dark' : 'light'
    }
  }
  return found
}

/**
 * The floating pill: it drops in collapsed (just the monogram), breathes, then
 * widens to reveal the links in a stagger. Below lg the expanded pill holds the
 * monogram and a kebab popover instead.
 *
 * It arrives over the hero, a beat after the page, and stays for the rest of
 * the visit — stepping aside only for the scenes that ask for the screen to
 * themselves. It has no colour of its own: it reads the room behind it and
 * takes that one.
 */
export function Nav({ presentSlugs }: NavProps) {
  const items = navItems.filter((item) => presentSlugs.has(item.anchor))
  // The monogram itself is the way home — the pill links skip the hero.
  const pillItems = items.filter((item) => item.anchor !== 'hero')
  /** Whether the pill has arrived. It arrives once, on load, and stays. */
  const [arrived, setArrived] = useState(false)
  /** Whether a scene is asking for the screen to itself right now. */
  const [overScene, setOverScene] = useState(false)
  const [tone, setTone] = useState<'light' | 'dark'>('light')
  const visible = arrived && !overScene
  const [expanded, setExpanded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [compact, setCompact] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const kebabRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentWidth, setContentWidth] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      // The line the pill floats on. Everything below is read at this height:
      // which room is behind it, and whether that room wants it gone.
      const line = NAV_LINE

      // The film still gets the screen to itself. These scenes already asked
      // for it in the markup — the attribute was there and nothing read it.
      let hidden = false
      for (const scene of document.querySelectorAll('[data-nav-hide]')) {
        const box = scene.getBoundingClientRect()
        if (box.top <= line && box.bottom > line) {
          hidden = true
          break
        }
      }
      setOverScene(hidden)

      // And the colour. The pill has none of its own now, so it borrows from
      // whichever room its line is crossing — the last one that still contains
      // it, because rooms touch and the one that starts later is the one on top.
      const rooms = [...document.querySelectorAll('[data-tone]')].map((room) => {
        const box = room.getBoundingClientRect()
        return { top: box.top, bottom: box.bottom, tone: room.getAttribute('data-tone') }
      })
      const found = toneAtLine(rooms, line)
      if (found) setTone(found)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    // It belongs over the hero, from the start — the way out of the page should
    // be there before anyone wonders where it is. This used to wait for the big
    // day, which meant the entire opening had no way out but the scrollbar.
    //
    // A beat after the page, not with it: the hero's own entrance staggers in
    // over about a second, and the pill dropping in on top of that is two
    // arrivals at once.
    const timer = setTimeout(() => setArrived(true), ARRIVES_AFTER_MS)
    return () => clearTimeout(timer)
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

  const dark = tone === 'dark'
  /**
   * The pill has no colour of its own any more, so everything in it takes the
   * room's. The transition is on colour alone and runs long, because the change
   * happens at a hard edge between two rooms and a snap there reads as a
   * flicker.
   */
  const ink = dark ? 'text-cream' : 'text-ink'
  const rule = dark ? 'bg-cream/35' : 'bg-olive-line'
  // The monogram is a dark mark on nothing, which disappears on deep olive.
  // Flattened to black and inverted it comes back as white — not the cream of
  // the palette, but at this size and against these two backgrounds the eye
  // reads it as the same mark either way.
  const mark = dark ? 'brightness-0 invert' : ''
  /**
   * The glass itself, which also belongs to the room.
   *
   * Not a colour so much as a thickness: a little of the room's own light held
   * in front of it, a hairline where it catches, and the page behind blurred
   * and brightened the way thick glass does. The fill has to flip with the
   * tone — a pale sheet reads as frost on dark and as a grey smear on cream,
   * and the hairline has the same problem in reverse.
   */
  const glass = dark
    ? 'border-cream/25 bg-cream/10'
    : 'border-ink/10 bg-cream/45'

  const padding = compact ? 24 : 42
  const expandedWidth = contentWidth > 0 ? contentWidth + padding : compact ? 180 : 620

  return (
    <header
      className={`pointer-events-none fixed inset-x-0 top-3 z-30 flex flex-col items-center px-3 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:top-5 ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
      }`}
    >
      <div
        // Square-cornered glass: everything on this page is square, and a
        // rounded pill would be the one borrowed shape on it. The blur and the
        // saturate are what make it read as thickness rather than as a tint —
        // the room behind goes soft and a touch richer through it.
        className={`relative flex h-12 overflow-hidden border ${glass} shadow-[0_8px_30px_-12px_rgba(26,24,24,0.45)] backdrop-blur-xl backdrop-saturate-150 transition-[width,background-color,border-color] duration-[640ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
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
          <img
            src={logo}
            alt=""
            className={`h-7 w-auto select-none transition-[filter] duration-500 ${mark}`}
          />
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
            <img
              src={logo}
              alt=""
              className={`h-7 w-auto select-none transition-[filter] duration-500 ${mark}`}
            />
          </a>

          <span
            aria-hidden="true"
            className={`ml-4 hidden h-4 w-px shrink-0 ${rule} transition-[opacity,transform,background-color] duration-500 lg:inline-block ${
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
                className={`shrink-0 font-body text-xs tracking-[0.1em] ${ink} uppercase transition-[opacity,transform,color] duration-500 hover:text-terracotta ${
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
            className={`ml-auto flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center ${ink} transition-[opacity,transform,background-color,color] duration-500 hover:bg-olive/10 active:bg-olive/15 lg:hidden ${
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
        className={`mt-2 overflow-hidden border border-olive-line/80 bg-cream/90 shadow-[0_18px_40px_-16px_rgba(26,24,24,0.4)] backdrop-blur-xl transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
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
