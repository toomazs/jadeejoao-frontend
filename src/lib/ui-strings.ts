import type { SectionSlug } from './content'

/**
 * The ONLY home for local guest-visible strings (PT-BR functional microcopy).
 * Editorial content always comes from the API — never add copy here.
 */
/**
 * The couple, as the site says their names.
 *
 * Not a content field: at the top of the page the names ARE the wordmark
 * image, so a text field for them only ever reached the footer — and looked
 * broken to anyone who edited it expecting the hero to change.
 */
export const COUPLE_NAMES = 'Jade & João'

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
  instagramPostLabel: 'Abrir a publicação no Instagram',
  madeBy: 'feito por',
  guestField: {
    suggestions: 'Nomes encontrados na lista de convidados',
  },
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
    changeAnswer: 'Alterar resposta',
    changeHint: 'Mudou algum plano? Você pode alterar até a data limite.',
    deadlinePrefix: 'Confirme até',
    answerAll: 'Responda por todas as pessoas do grupo para enviar.',
    companions: {
      open: 'Convidar alguém com você',
      searchLabel: 'Quem vem com você?',
      searchPlaceholder: 'Digite o nome como está no convite…',
      hint: 'A pessoa já precisa estar na lista dos noivos.',
      notFound: 'Não encontramos esse nome na lista. Fale com os noivos.',
      adding: 'Adicionando…',
      cancel: 'Cancelar',
      remove: 'Tirar do meu convite',
      full: 'Você já usou os acompanhantes deste convite. Para levar mais alguém, fale com os noivos.',
    },
  },
  gifts: {
    pixCta: 'Presentear via PIX',
    linkCta: 'Abrir a lista',
    generateCode: 'Gerar código PIX',
    generating: 'Gerando…',
    copyCode: 'Copiar código',
    scanQr: 'Ou aponte a câmera do banco',
    stepAmount: 'Passo 1 de 3 · Valor',
    stepPay: 'Passo 2 de 3 · Pagamento',
    stepSign: 'Passo 3 de 3 · Quem presenteou',
    changeAmount: 'Trocar o valor',
    backToCode: 'Voltar ao código',
    confirmGift: 'Confirmar',
    declareNamePlaceholder: 'Como está no convite…',
    soldOut: 'Todas as cotas reservadas',
    listsTitle: 'Ou escolha nas nossas listas',
    listsBody: 'Também montamos listas nas lojas — é só abrir, escolher e enviar para a nossa casa.',
    oneMore: 'Uma cota a mais',
    oneLess: 'Uma cota a menos',
    copied: 'Copiado!',
    declareName: 'Seu nome',
    declareCta: 'Já fiz o PIX',
    declaring: 'Registrando…',
    declared: 'Anotado, muito obrigado!',
    declaredHint: 'Assim que o PIX cair, os noivos confirmam por aqui. Até lá seu presente fica marcado como pendente.',
    pendingNote: 'Você avisa que fez o PIX e os noivos confirmam quando o dinheiro chega.',
    quotaSingular: 'cota de',
    unitsLeftSuffix: 'cotas restantes',
    amountLabel: 'Valor (R$)',
    quotasLabel: 'Quantidade de cotas',
    close: 'Fechar',
  },
  messagesForm: {
    nameLabel: 'Seu nome',
    namePlaceholder: 'Como está no convite…',
    bodyLabel: 'Seu recado',
    bodyPlaceholder: 'Escreva com o coração…',
    send: 'Enviar recado',
    sending: 'Enviando…',
    sent: 'Recado enviado! Os noivos vão ler com carinho.',
  },
  genericActionError: 'Não deu certo agora. Tente novamente em instantes.',
  shuttleServed: 'Atendido pelo traslado',
  shuttleNotServed: 'Sem traslado',
  airbnbAreas: 'Bairros para buscar no Airbnb',
  openMap: 'Ver no mapa',
  openInApp: 'Abrir rota',
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
]
