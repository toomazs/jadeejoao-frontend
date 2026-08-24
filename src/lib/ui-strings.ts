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
  backToTop: 'Voltar ao início',
  confirmCta: 'Confirmar presença',
  couple: {
    bride: 'A noiva',
    groom: 'O noivo',
  },
  instagramCta: 'Ver no Instagram',
  letters: {
    fromGroom: 'João para Jade',
    fromBride: 'Jade para João',
  },
  rsvp: {
    searchLabel: 'Seu nome completo',
    searchPlaceholder: 'Digite seu nome como está no convite…',
    searching: 'Procurando…',
    confirmIntro: 'Confirme por cada pessoa do seu convite:',
    attendingYes: 'Vai',
    attendingNo: 'Não vai',
    submit: 'Enviar confirmação',
    sending: 'Enviando…',
    success: 'Presença registrada! Obrigado por confirmar.',
    searchAgain: 'Procurar outro nome',
    deadlinePrefix: 'Confirme até',
    answerAll: 'Responda por todas as pessoas do grupo para enviar.',
  },
  gifts: {
    pixCta: 'Presentear via PIX',
    linkCta: 'Abrir a lista',
    generateCode: 'Gerar código PIX',
    generating: 'Gerando…',
    copyCode: 'Copiar código',
    scanQr: 'Ou aponte a câmera do banco',
    copied: 'Copiado!',
    declareName: 'Seu nome',
    declareCta: 'Já fiz o PIX',
    declaring: 'Registrando…',
    declared: 'Contribuição registrada — muito obrigado!',
    quotaSingular: 'cota de',
    unitsLeftSuffix: 'cotas restantes',
    amountLabel: 'Valor (R$)',
    quotasLabel: 'Quantidade de cotas',
    close: 'Fechar',
  },
  messagesForm: {
    nameLabel: 'Seu nome',
    bodyLabel: 'Seu recado',
    bodyPlaceholder: 'Escreva com o coração…',
    send: 'Enviar recado',
    sending: 'Enviando…',
    sent: 'Recado enviado! Os noivos vão ler com carinho.',
  },
  genericActionError: 'Não deu certo agora. Tente novamente em instantes.',
  shuttleServed: 'Atendido pelo traslado',
  airbnbAreas: 'Bairros para buscar no Airbnb',
  openMap: 'Ver no mapa',
  countdownLabel: 'Contagem regressiva para o grande dia',
  countdown: {
    days: 'dias',
    hours: 'horas',
    minutes: 'min',
    seconds: 'seg',
  },
} as const

export interface NavItem {
  anchor: SectionSlug
  label: string
  /** Compact form for the floating pill, where full labels don't fit. */
  short: string
}

/** Anchor nav labels (per the approved PPTX), in display order. */
export const navItems: readonly NavItem[] = [
  { anchor: 'hero', label: 'Início', short: 'Início' },
  { anchor: 'rsvp', label: 'Confirmação de presença', short: 'Presença' },
  { anchor: 'gifts_intro', label: 'Presenteie os noivos', short: 'Presentes' },
  { anchor: 'stay', label: 'Estadia', short: 'Estadia' },
  { anchor: 'dress_code', label: 'Vestimenta', short: 'Vestimenta' },
  { anchor: 'good_practices', label: 'Boas Práticas', short: 'Boas práticas' },
]
