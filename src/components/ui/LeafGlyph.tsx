/**
 * Authored seriguela leaflet — a single lens-shaped leaf with a short stem,
 * drawn in one stroke weight, inheriting `currentColor`. The vector sibling of
 * the photographed sprig (`LeafDivider`): used where the motif must sit on
 * dark ground, act as a list bullet, or mark a badge.
 */
export function LeafGlyph({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.5 2.5C11.2 3.1 5.9 5.9 4.1 10.9c-1 2.8-.6 5.3.4 6.6 5-.3 8.9-2.6 10.9-6.6 1.5-3 1.9-6 2.1-8.4Z" />
      <path d="M4.5 17.5C3.3 18.3 2.5 19 2.5 19" />
      <path d="M16 4.5c-3.6 2.3-7.4 6.1-9.8 11.6" />
    </svg>
  )
}
