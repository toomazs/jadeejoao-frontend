import type { CSSProperties } from 'react'

interface SkeletonProps {
  className?: string
  style?: CSSProperties
}

/** Neutral loading block in the engraved world (square corners); pulses only when the user allows motion. */
export function Skeleton({ className = '', style }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`bg-sand-line/60 motion-safe:animate-pulse ${className}`}
      style={style}
    />
  )
}
