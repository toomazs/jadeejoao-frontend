interface LeafDividerProps {
  className?: string
  /** Rule width; `sm` marks a heading inside a room, `md` breathes between passages. */
  size?: 'sm' | 'md'
}

/**
 * A single engraved hairline, the quiet pause between passages. The botanical
 * motif now lives in the page's background layer, not in the punctuation.
 */
export function LeafDivider({ className = '', size = 'sm' }: LeafDividerProps) {
  const width = size === 'sm' ? 'w-24' : 'w-40'
  return (
    <div aria-hidden="true" className={`flex justify-center ${className}`}>
      <span className={`h-px ${width} bg-sand-line`} />
    </div>
  )
}
