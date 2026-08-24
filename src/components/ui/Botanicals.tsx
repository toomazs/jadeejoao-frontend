import type { CSSProperties } from 'react'

interface SprigProps {
  className?: string
  style?: CSSProperties
}

/**
 * Line-art plants drawn for this wedding, in the same hand as the seriguela of
 * the invitation. They live in the background of the rooms — faint, slowly
 * turning — so the paper feels like a garden without ever competing with the
 * words on it.
 */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

/** The seriguela branch: paired leaflets climbing a slim stem. */
export function SeriguelaSprig({ className = '', style }: SprigProps) {
  return (
    <svg viewBox="0 0 120 210" className={className} style={style} aria-hidden="true" {...stroke}>
      <path d="M62 204C58 168 64 130 60 92 57 62 62 34 61 8" />
      <path d="M60 176c-14-2-24-10-26-24 14 2 24 10 26 24M61 168c14-4 23-14 23-28-13 4-22 14-23 28" />
      <path d="M60 142c-13-3-22-12-23-25 13 3 22 11 23 25M61 132c13-4 21-14 20-27-12 4-20 14-20 27" />
      <path d="M60 106c-12-3-19-11-20-23 12 3 19 10 20 23M61 96c12-4 19-13 18-25-11 4-18 13-18 25" />
      <path d="M60 72c-10-3-16-10-17-20 10 3 16 9 17 20M61 62c10-4 16-12 15-22-10 4-15 12-15 22" />
      <path d="M61 34c-6-8-6-18 0-28 6 10 6 20 0 28" />
    </svg>
  )
}

/** A eucalyptus stem: round leaves alternating along a curve. */
export function EucalyptusSprig({ className = '', style }: SprigProps) {
  return (
    <svg viewBox="0 0 140 220" className={className} style={style} aria-hidden="true" {...stroke}>
      <path d="M30 214C46 176 60 140 74 104 84 76 92 46 96 12" />
      <ellipse cx="52" cy="176" rx="15" ry="11" transform="rotate(-32 52 176)" />
      <ellipse cx="88" cy="162" rx="14" ry="10" transform="rotate(24 88 162)" />
      <ellipse cx="62" cy="134" rx="14" ry="10" transform="rotate(-28 62 134)" />
      <ellipse cx="96" cy="120" rx="13" ry="10" transform="rotate(22 96 120)" />
      <ellipse cx="74" cy="92" rx="13" ry="9" transform="rotate(-26 74 92)" />
      <ellipse cx="104" cy="76" rx="12" ry="9" transform="rotate(20 104 76)" />
      <ellipse cx="88" cy="48" rx="11" ry="8" transform="rotate(-22 88 48)" />
      <ellipse cx="99" cy="24" rx="9" ry="7" transform="rotate(14 99 24)" />
    </svg>
  )
}

/** A fern frond: a spine with feathered blades, tapering to a curl. */
export function FernFrond({ className = '', style }: SprigProps) {
  return (
    <svg viewBox="0 0 130 230" className={className} style={style} aria-hidden="true" {...stroke}>
      <path d="M24 226C44 186 60 148 74 108 84 76 90 44 88 14" />
      <path d="M44 190c-11-6-18-16-19-29 12 5 19 15 19 29M46 186c13-3 22-12 25-25-13 2-23 11-25 25" />
      <path d="M56 160c-10-6-16-15-16-27 11 5 17 14 16 27M58 156c12-3 20-12 22-24-12 2-21 11-22 24" />
      <path d="M68 128c-9-5-14-14-14-24 10 5 15 13 14 24M70 124c11-3 18-11 19-22-11 2-18 10-19 22" />
      <path d="M78 96c-8-5-12-12-12-21 9 4 13 12 12 21M80 92c10-3 16-10 17-20-10 2-16 9-17 20" />
      <path d="M86 62c-6-4-10-10-10-17 8 3 11 10 10 17M88 58c8-2 13-8 14-16-8 1-13 8-14 16" />
      <path d="M88 30c-5 6-4 14 3 17 5 2 9-2 8-7-1-4-6-6-9-3" />
    </svg>
  )
}

/** A single broad leaf with its veins — the quiet one of the set. */
export function BroadLeaf({ className = '', style }: SprigProps) {
  return (
    <svg viewBox="0 0 120 200" className={className} style={style} aria-hidden="true" {...stroke}>
      <path d="M60 196V96" />
      <path d="M60 96c-34-14-44-52-30-88 34 12 46 50 30 88M60 96c34-14 44-52 30-88-34 12-46 50-30 88" />
      <path d="M60 78c-14-6-20-22-16-40M60 78c14-6 20-22 16-40M60 52c-9-4-13-14-11-26M60 52c9-4 13-14 11-26" />
    </svg>
  )
}

/** The set, in the order the rooms cycle through it. */
export const BOTANICALS = [SeriguelaSprig, EucalyptusSprig, FernFrond, BroadLeaf] as const
