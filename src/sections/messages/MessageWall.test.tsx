import { fireEvent, render } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { MessageWall } from './MessageWall'
import type { WallMessage } from './MessageWall'

/** jsdom has no matchMedia; the wall asks it whether to move at all. */
function setReducedMotion(reduced: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: reduced && query.includes('reduce'),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}

/**
 * The cards, told apart from the sheet's own close button — the modal is always
 * in the DOM, just not open, so "every button" is one too many.
 */
const cardsIn = (root: HTMLElement) =>
  [...root.querySelectorAll('button[aria-label^="Ler o recado"]')]

/**
 * jsdom measures everything as zero, so the row can never work out how many
 * runs it needs. This gives it a window of `across` and a run of `once`.
 */
function setWidths(across: number, once: number) {
  Element.prototype.getBoundingClientRect = function () {
    const el = this as HTMLElement
    const width = el.className.includes('overflow-hidden') ? across : once
    return { width, height: 0, top: 0, left: 0, right: width, bottom: 0, x: 0, y: 0, toJSON: () => ({}) } as DOMRect
  }
}

const recados = (n: number): WallMessage[] =>
  Array.from({ length: n }, (_, i) => ({
    message_id: `id-${i}`,
    author_name: `Pessoa ${i}`,
    body: `recado ${i}`,
  }))

const realRect = Element.prototype.getBoundingClientRect

beforeEach(() => {
  setReducedMotion(false)
  Element.prototype.getBoundingClientRect = realRect
  // jsdom ships <dialog> without the two methods that open and shut it.
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true
  }
  HTMLDialogElement.prototype.close = function () {
    this.open = false
  }
})

describe('MessageWall', () => {
  it('não desenha nada quando ninguém escreveu', () => {
    const { container } = render(<MessageWall messages={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('repete os recados até a faixa ter com que atravessar a tela', () => {
    // Two recados per row do not reach across a 1200px window, and a half
    // shorter than the window means a hole travels round behind them.
    setWidths(1200, 300)
    const { container } = render(<MessageWall messages={recados(4)} />)
    const track = container.querySelector('.marquee-track')!
    // ceil(1200 / 300) + 1 = 5 runs per half, 10 in all.
    expect(track.children).toHaveLength(10)
    const half = track.children.length / 2
    // Each half is at least as wide as the window it has to cross.
    expect(half * 300).toBeGreaterThanOrEqual(1200)
  })

  it('não repete além do necessário numa janela estreita', () => {
    setWidths(320, 300)
    const { container } = render(<MessageWall messages={recados(4)} />)
    // ceil(320 / 300) + 1 = 3 per half.
    expect(container.querySelector('.marquee-track')!.children).toHaveLength(6)
  })

  it('as duas metades da faixa são idênticas', () => {
    const { container } = render(<MessageWall messages={recados(6)} />)
    const track = container.querySelector('.marquee-track')!
    const halves = track.children.length
    expect(halves % 2).toBe(0)
    const first = track.children[0].textContent
    const second = track.children[halves / 2].textContent
    expect(second).toBe(first)
  })

  it('reparte alternando, para as duas faixas encherem juntas', () => {
    const { container } = render(<MessageWall messages={recados(6)} />)
    const top = container.querySelector('.marquee-track')!
    const bottom = container.querySelector('.marquee-track-back')!
    expect(top.textContent).toContain('Pessoa 0')
    expect(bottom.textContent).toContain('Pessoa 1')
  })

  it('atravessa a janela, em vez de ficar na coluna de texto', () => {
    const { container } = render(<MessageWall messages={recados(6)} />)
    const wall = container.querySelector('.marquee-hold')
    expect(wall?.className).toContain('w-screen')
    expect(wall?.className).toContain('-translate-x-1/2')
  })

  it('manda as faixas em sentidos opostos', () => {
    const { container } = render(<MessageWall messages={recados(6)} />)
    expect(container.querySelector('.marquee-track')).not.toBeNull()
    expect(container.querySelector('.marquee-track-back')).not.toBeNull()
  })

  it('mantém o passo: mais recados, volta mais longa', () => {
    const slow = render(<MessageWall messages={recados(20)} />).container
    const fast = render(<MessageWall messages={recados(6)} />).container
    const read = (el: Element | null) =>
      Number.parseFloat((el as HTMLElement).style.animationDuration)
    expect(read(slow.querySelector('.marquee-track'))).toBeGreaterThan(
      read(fast.querySelector('.marquee-track')),
    )
  })

  it('a cópia que fecha a volta não é lida nem tabulável duas vezes', () => {
    const { container } = render(<MessageWall messages={recados(6)} />)
    const cards = cardsIn(container)
    const echoes = cards.filter((card) => card.getAttribute('aria-hidden') === 'true')
    // Only the first run of each row is the real one.
    expect(echoes.length).toBeGreaterThan(0)
    expect(echoes.every((card) => card.getAttribute('tabindex') === '-1')).toBe(true)
  })

  it('não move nada, nem repete, com prefers-reduced-motion', () => {
    setReducedMotion(true)
    const { container } = render(<MessageWall messages={recados(6)} />)
    expect(container.querySelector('.marquee-track')).toBeNull()
    expect(container.querySelector('.marquee-track-back')).toBeNull()
    expect(cardsIn(container)).toHaveLength(6)
  })

  it('fica parado quando há pouca coisa para rolar', () => {
    const { container } = render(<MessageWall messages={recados(2)} />)
    expect(container.querySelector('.marquee-track')).toBeNull()
    expect(cardsIn(container)).toHaveLength(2)
  })

  it('abre o recado inteiro ao clicar no card', () => {
    const longo = {
      message_id: 'longo',
      author_name: 'Vó Lurdes',
      body: `Primeiro parágrafo bem comprido.

E o segundo, que o card corta.`,
    }
    const { container } = render(<MessageWall messages={[longo]} />)
    fireEvent.click(cardsIn(container)[0]!)

    const sheet = container.querySelector('dialog')
    expect(sheet?.textContent).toContain('E o segundo, que o card corta.')
    expect(sheet?.querySelectorAll('p').length).toBeGreaterThanOrEqual(2)
  })

  it('a folha leva as palavras consigo ao sair', () => {
    // Clearing the content on dismiss emptied the sheet while it was still
    // fading: a blank cream box with a close button, for a few frames.
    const { container } = render(
      <MessageWall messages={[{ message_id: 'a', author_name: 'Tia Taninha', body: 'que festa!' }]} />,
    )
    fireEvent.click(cardsIn(container)[0]!)
    const sheet = container.querySelector('dialog')!
    expect(sheet.textContent).toContain('que festa!')

    // Dismissed, and still holding what it was showing.
    fireEvent.click(sheet)
    expect(sheet.textContent).toContain('que festa!')
    expect(sheet.textContent).toContain('Tia Taninha')
  })

  it('lê o markdown do recado', () => {
    const { container } = render(
      <MessageWall messages={[{ message_id: 'a', author_name: 'Tia', body: 'que **festa**!' }]} />,
    )
    expect(container.querySelector('strong')?.textContent).toBe('festa')
    expect(container.textContent).not.toContain('*')
  })
})
