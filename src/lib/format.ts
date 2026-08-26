const SAO_PAULO_TZ = 'America/Sao_Paulo'

/** Long PT-BR date ("7 de agosto de 2027") from an ISO datetime, pinned to the event timezone (AD-11). */
/**
 * The ceremony hour, in the venue's timezone.
 *
 * Fixed here rather than kept in the payload: it is printed nowhere, it is not
 * changing, and as an editable field its only possible effect was to move the
 * countdown by fifteen hours by accident.
 */
export const CEREMONY_HOUR = 'T15:00:00-03:00'

/** The wedding day plus the ceremony hour — the moment the countdown lands on. */
export function ceremonyMoment(eventDate: string): string {
  return eventDate ? `${eventDate}${CEREMONY_HOUR}` : ''
}

export function formatEventDate(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: SAO_PAULO_TZ }).format(
    new Date(iso),
  )
}

/** Wall-clock time ("15:00") from an ISO datetime, pinned to the event timezone (AD-11). */
export function formatEventTime(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: SAO_PAULO_TZ,
  }).format(new Date(iso))
}

/** Capitalized PT-BR weekday ("Sábado") pinned to the event timezone. */
export function formatEventWeekday(iso: string): string {
  const weekday = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    timeZone: SAO_PAULO_TZ,
  }).format(new Date(iso))
  return weekday.charAt(0).toUpperCase() + weekday.slice(1)
}

/** Long PT-BR date from a bare YYYY-MM-DD (e.g. the RSVP deadline). */
export function formatPlainDate(date: string): string {
  return formatEventDate(`${date}T12:00:00-03:00`)
}

/** Centavos as BRL currency ("R$ 150,00"). */
export function formatCentavos(centavos: number): string {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

/** Editorial short date ("24 JUN 2017") from a YYYY-MM-DD date, for the hero milestones. */
export function formatMilestoneDate(date: string): string {
  const parts = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: SAO_PAULO_TZ,
  }).formatToParts(new Date(`${date}T12:00:00-03:00`))
  const day = parts.find((part) => part.type === 'day')?.value ?? ''
  const month = (parts.find((part) => part.type === 'month')?.value ?? '').replace('.', '')
  const year = parts.find((part) => part.type === 'year')?.value ?? ''
  return `${day} ${month} ${year}`.toUpperCase()
}

/** Compact Brazilian wall-clock ("15h", "15h30") for invitation-style display. */
export function formatEventTimeShort(iso: string): string {
  const parts = new Intl.DateTimeFormat('pt-BR', {
    hour: 'numeric',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: SAO_PAULO_TZ,
  }).formatToParts(new Date(iso))
  const hour = parts.find((part) => part.type === 'hour')?.value ?? ''
  const minute = parts.find((part) => part.type === 'minute')?.value ?? ''
  return minute === '00' ? `${hour}h` : `${hour}h${minute}`
}
