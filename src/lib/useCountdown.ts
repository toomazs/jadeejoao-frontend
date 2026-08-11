import { useEffect, useState } from 'react'

export interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function remainingTo(targetMs: number): Countdown | null {
  const diffMs = targetMs - Date.now()
  if (diffMs <= 0) {
    return null
  }
  const totalSeconds = Math.floor(diffMs / 1000)
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor(totalSeconds / 3_600) % 24,
    minutes: Math.floor(totalSeconds / 60) % 60,
    seconds: totalSeconds % 60,
  }
}

/**
 * Live countdown to an ISO datetime, ticking once per second.
 * Returns `null` when the moment has passed (or the input is invalid),
 * so callers simply hide the countdown.
 */
export function useCountdown(targetIso: string): Countdown | null {
  const targetMs = new Date(targetIso).getTime()

  const [remaining, setRemaining] = useState<Countdown | null>(() =>
    Number.isNaN(targetMs) ? null : remainingTo(targetMs),
  )

  useEffect(() => {
    if (Number.isNaN(targetMs)) {
      setRemaining(null)
      return
    }
    setRemaining(remainingTo(targetMs))
    const intervalId = setInterval(() => {
      const next = remainingTo(targetMs)
      setRemaining(next)
      if (next === null) {
        clearInterval(intervalId)
      }
    }, 1000)
    return () => {
      clearInterval(intervalId)
    }
  }, [targetMs])

  return remaining
}
