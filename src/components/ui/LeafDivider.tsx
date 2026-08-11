import { siriguela } from '../../assets'

interface LeafDividerProps {
  className?: string
  /** Sprig height; `sm` marks a heading inside a room, `md` breathes between passages. */
  size?: 'sm' | 'md'
}

/**
 * The recurring motif thread: the photographed seriguela sprig from the
 * ceremony tree, laid between two engraved hairlines. Purely decorative.
 */
export function LeafDivider({ className = '', size = 'sm' }: LeafDividerProps) {
  const sprigHeight = size === 'sm' ? 'h-9' : 'h-14'
  return (
    <div aria-hidden="true" className={`flex items-center justify-center gap-4 ${className}`}>
      <span className="h-px w-14 bg-sand-line" />
      <img
        src={siriguela}
        alt=""
        loading="lazy"
        className={`${sprigHeight} w-auto rotate-12 select-none`}
      />
      <span className="h-px w-14 bg-sand-line" />
    </div>
  )
}
