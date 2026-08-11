interface SkeletonProps {
  className?: string
}

/** Neutral loading block in the engraved world (square corners); pulses only when the user allows motion. */
export function Skeleton({ className = '' }: SkeletonProps) {
  return <div aria-hidden="true" className={`bg-sand-line/60 motion-safe:animate-pulse ${className}`} />
}
