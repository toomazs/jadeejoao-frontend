import { logoVertical } from '../../assets'
import type { SectionSlug } from '../../lib/content'
import { navItems, uiStrings } from '../../lib/ui-strings'

interface NavProps {
  /** Slugs actually present in the content response — items without a target are hidden. */
  presentSlugs: ReadonlySet<SectionSlug>
}

/** Sticky anchor navigation. Smooth scrolling is CSS-only and respects reduced motion (global.css). */
export function Nav({ presentSlugs }: NavProps) {
  const items = navItems.filter((item) => presentSlugs.has(item.anchor))

  if (items.length === 0) {
    return null
  }

  return (
    <nav
      aria-label={uiStrings.navLabel}
      className="sticky top-0 z-20 border-b border-sand-line bg-cream"
    >
      <div className="mx-auto flex max-w-5xl items-center gap-5 px-4">
        <a href="#hero" className="shrink-0 py-3" aria-label={uiStrings.backToTop}>
          <img src={logoVertical} alt="" className="h-5 w-auto sm:h-6" />
        </a>
        <ul className="edge-fade-x no-scrollbar flex items-center gap-6 overflow-x-auto pr-6 pl-4 whitespace-nowrap">
          {items.map((item) => (
            <li key={item.anchor}>
              <a
                href={`#${item.anchor}`}
                className="inline-flex min-h-12 items-center font-body text-sm tracking-[0.14em] text-ink uppercase underline-offset-8 transition-colors hover:text-terracotta hover:underline"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
