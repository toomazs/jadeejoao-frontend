const SAO_PAULO_TZ = 'America/Sao_Paulo'

/** Long PT-BR date ("7 de agosto de 2027") from an ISO datetime, pinned to the event timezone (AD-11). */
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
