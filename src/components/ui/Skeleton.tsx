interface SkeletonProps {
  className?: string
}

/** Neutral loading block; pulses only when the user allows motion. */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-md bg-gold-sand/40 motion-safe:animate-pulse ${className}`}
    />
  )
}
