import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { GiftCard } from './Gifts'
import type { components } from '../../api/schema'

type GiftView = components['schemas']['GiftView']

/** Reveal asks jsdom two things it does not have. */
function stubViewport() {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
    root = null
    rootMargin = ''
    thresholds: number[] = []
  } as unknown as typeof window.IntersectionObserver
}

const regador: GiftView = {
  gift_id: '7a4f1c4e-0000-4000-8000-0000000000c0',
  declared_centavos: 0,
  kind: 'pix',
  title: 'Regador grande de plantas para o João',
  description: 'Pra ele não precisar mais usar o copo do liquidificador.',
  goal_centavos: 10000,
  quota_centavos: 2000,
  confirmed_centavos: 0,
  sort: 1,
}

function renderCard(gift: GiftView) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <ul>
        <GiftCard gift={gift} index={0} />
      </ul>
    </QueryClientProvider>,
  )
}

describe('o que o cartão de presente diz sobre dinheiro', () => {
  beforeEach(stubViewport)

  // The price of one cota is the single number the guest needs in order to
  // decide. It is printed even though the gift also carries a goal.
  it('mostra o valor da cota', () => {
    const { container } = renderCard(regador)
    expect(container.textContent).toContain('Cota de')
    expect(container.textContent).toContain('R$ 20,00')
  })

  // The card used to carry a progress bar with the amount raised under one end
  // and the goal under the other. That is a fundraiser's scoreboard: it keeps a
  // public tally of how little has arrived, and names a finish line that tells
  // a guest when to stop. Neither belongs on a wedding list.
  it('não mostra a meta nem quanto já entrou', () => {
    const { container } = renderCard(regador)
    expect(container.textContent).not.toContain('R$ 100,00')
    expect(container.textContent).not.toContain('R$ 0,00')
  })

  it('não mostra régua de progresso', () => {
    const { container } = renderCard(regador)
    // The bar was a 2px track with a filled child; the CTA below is also
    // terracotta, so the track is what we look for.
    expect(container.querySelector('div.h-2.w-full')).toBeNull()
    expect(container.querySelector('div.h-full.bg-terracotta')).toBeNull()
  })

  // No ceiling on a gift without max_units: the stepper keeps going up.
  it('mantém o convidado livre para levar quantas cotas quiser', () => {
    const { container } = renderCard(regador)
    expect(container.textContent).not.toContain('cotas restantes')
    expect(container.textContent).not.toContain('Esgotado')
  })
})
