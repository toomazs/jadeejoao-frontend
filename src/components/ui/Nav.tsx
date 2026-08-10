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
      className="sticky top-0 z-10 border-b border-gold-sand bg-cream"
    >
      <ul className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-5 gap-y-1 px-4 py-3">
        {items.map((item) => (
          <li key={item.anchor}>
            <a
              href={`#${item.anchor}`}
              className="inline-flex min-h-11 items-center text-ink underline-offset-4 hover:underline"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
