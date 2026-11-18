import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { GettingThere } from './GettingThere'
import type { GettingThereContent, StayContent } from '../../lib/content'

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

const content: GettingThereContent = {
  title: 'Como Chegar',
  body: '',
  images: [],
  address: 'Rua Piraju, 306 – Jardim Paulista, Atibaia – SP',
}

const stay = (shuttleServed: boolean): StayContent => ({
  title: 'Onde Ficar',
  body: '',
  images: [],
  airbnb_areas: [],
  lodgings: [
    {
      name: 'Faro Hotel Atibaia',
      area: 'Centro',
      notes: 'No centro, com piscinas, academia e café da manhã incluso.',
      shuttle_served: shuttleServed,
    },
  ],
})

describe('o traslado na ficha de hospedagem', () => {
  beforeEach(stubViewport)

  it('anuncia a van quando ela atende o hotel', () => {
    const { container } = render(<GettingThere content={content} stay={stay(true)} />)
    expect(container.textContent).toContain('Atendido pelo traslado')
  })

  // A card used to stamp SEM TRASLADO on every hotel the van skips: an answer
  // to a question nobody asked, in capitals, under the one hotel it was meant
  // to make look worse. Silence is the whole feature.
  it('não diz nada quando não há van para o hotel', () => {
    const { container } = render(<GettingThere content={content} stay={stay(false)} />)
    expect(container.textContent).toContain('Faro Hotel Atibaia')
    expect(container.textContent?.toLowerCase()).not.toContain('traslado')
  })
})
