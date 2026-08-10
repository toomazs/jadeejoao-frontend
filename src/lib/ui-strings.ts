import type { SectionSlug } from './content'

/**
 * The ONLY home for local guest-visible strings (PT-BR functional microcopy).
 * Editorial content always comes from the API — never add copy here.
 */
export const uiStrings = {
  loading: 'Carregando o convite…',
  errorTitle: 'Não conseguimos carregar o convite.',
  errorBody: 'Verifique sua conexão e tente novamente em instantes.',
  retry: 'Tentar novamente',
  navLabel: 'Navegação principal',
  shuttleServed: 'Atendido pelo translado',
} as const

export interface NavItem {
  anchor: SectionSlug
  label: string
}

/** Anchor nav labels (per the approved PPTX), in display order. */
export const navItems: readonly NavItem[] = [
  { anchor: 'hero', label: 'Início' },
  { anchor: 'rsvp', label: 'Confirmação de presença' },
  { anchor: 'gifts_intro', label: 'Presenteie os noivos' },
  { anchor: 'stay', label: 'Estadia' },
  { anchor: 'dress_code', label: 'Vestimenta' },
  { anchor: 'good_practices', label: 'Boas Práticas' },
]
