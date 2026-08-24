import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/** Progress of p through the [from, to] segment, clamped to 0..1. */
export const seg = (p: number, from: number, to: number) => clamp01((p - from) / (to - from))

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduced
}

/**
 * 0..1 scroll progress through a tall pinned container. Measured straight in
 * the scroll handler — browsers already fire scroll at most once per frame,
 * and rAF-deferred measurement stalls in non-composited (hidden) pages.
 */
export function useChapterProgress(ref: RefObject<HTMLElement | null>, enabled: boolean): number {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    if (!el) return
    const measure = () => {
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      setProgress(total > 0 ? clamp01(-rect.top / total) : 0)
    }
    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [ref, enabled])
  return progress
}
