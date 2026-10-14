import { describe, expect, it } from 'vitest'

import { toHtml, toMarkdown } from './RichTextField'

function asDom(html: string): HTMLElement {
  const host = document.createElement('div')
  host.innerHTML = html
  return host
}

/** Markdown → what the guest sees → markdown. What survives the trip is what gets stored. */
const roundTrip = (markdown: string) => toMarkdown(asDom(toHtml(markdown)))

describe('o campo rico', () => {
  it('leva negrito e itálico ida e volta', () => {
    expect(roundTrip('Vai ser **lindo** e *inesquecível*.')).toBe(
      'Vai ser **lindo** e *inesquecível*.',
    )
  })

  it('leva dois parágrafos ida e volta', () => {
    expect(roundTrip('Primeiro parágrafo.\n\nSegundo parágrafo.')).toBe(
      'Primeiro parágrafo.\n\nSegundo parágrafo.',
    )
  })

  it('leva um negrito dentro de um itálico', () => {
    // The order toHtml substitutes in is what makes this survive.
    const out = roundTrip('*dia comum, com essa **visão?***')
    expect(out).toContain('**visão?**')
    expect(toMarkdown(asDom(toHtml(out)))).toBe(out)
  })

  it('não deixa o que foi digitado virar marcação', () => {
    const html = toHtml('<b>oi</b> & <script>alert(1)</script>')
    expect(html).not.toContain('<b>')
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;b&gt;')
    // And it comes back out as the characters they typed.
    expect(roundTrip('<b>oi</b>')).toBe('<b>oi</b>')
  })

  it('devolve negrito vazio como nada, não como asteriscos soltos', () => {
    expect(toMarkdown(asDom('<p><strong> </strong>oi</p>'))).toBe('oi')
  })

  it('não guarda os parágrafos em branco do fim', () => {
    expect(toMarkdown(asDom('<p>oi</p><p><br></p><p><br></p>'))).toBe('oi')
  })
})
