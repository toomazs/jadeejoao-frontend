import { createElement, useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

interface RevealProps {
  /** Rendered element — keep it semantic (li inside lists, figure for figures…). */
  as?: 'div' | 'span' | 'li' | 'figure' | 'section' | 'p'
  /** Stagger offset in milliseconds. */
  delay?: number
  className?: string
  children?: ReactNode
}

/**
 * Enters once when ~18% visible: opacity/translate handled by the `.reveal`
 * classes in global.css. Under reduced motion the element is simply visible.
 */
export function Reveal({ as = 'div', delay = 0, className = '', children }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const style: CSSProperties | undefined = delay
    ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties)
    : undefined

  return createElement(
    as,
    { ref, style, className: `reveal ${shown ? 'is-revealed' : ''} ${className}` },
    children,
  )
}
