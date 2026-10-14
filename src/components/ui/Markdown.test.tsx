import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Inline, Markdown } from './Markdown'

/**
 * The letters are stored with every paragraph wrapped in asterisks, so any bold
 * the couple adds lands inside an italic. That nesting is the case the old
 * single regex could not see, and it is the one that matters most here.
 */
describe('Inline', () => {
  it('lê um negrito dentro de um itálico', () => {
    const { container } = render(
      <Inline text="*Dia comum, com essa **visão?** Meu maior*" />,
    )
    const em = container.querySelector('em')
    const strong = container.querySelector('strong')
    expect(em).not.toBeNull()
    expect(strong?.textContent).toBe('visão?')
    // And the bold is inside the italic, not a sibling of it.
    expect(em?.contains(strong!)).toBe(true)
    expect(container.textContent).toBe('Dia comum, com essa visão? Meu maior')
  })

  it('não deixa escapar asterisco nenhum para a página', () => {
    const { container } = render(
      <Inline text="*A Jade é **forte** e _dedicada_, e eu a **amo**.*" />,
    )
    expect(container.textContent).not.toMatch(/[*_]/)
    expect(container.querySelectorAll('strong')).toHaveLength(2)
  })

  it('lê um itálico dentro de um negrito', () => {
    const { container } = render(<Inline text="**bem *muito* bem**" />)
    expect(container.querySelector('strong em')?.textContent).toBe('muito')
  })

  it('mantém o que já funcionava', () => {
    const { container } = render(<Inline text="um **negrito** e um *itálico*" />)
    expect(container.querySelector('strong')?.textContent).toBe('negrito')
    expect(container.querySelector('em')?.textContent).toBe('itálico')
  })

  it('deixa um asterisco solto ser um asterisco', () => {
    const { container } = render(<Inline text="3 * 4 e um ** solto" />)
    expect(container.textContent).toBe('3 * 4 e um ** solto')
    expect(container.querySelector('em')).toBeNull()
    expect(container.querySelector('strong')).toBeNull()
  })

  it('leva o link junto, mesmo dentro de ênfase', () => {
    const { container } = render(<Inline text="*veja [o mapa](https://exemplo.com.br) aqui*" />)
    const link = container.querySelector('a')
    expect(link?.getAttribute('href')).toBe('https://exemplo.com.br')
    expect(link?.textContent).toBe('o mapa')
    expect(link?.closest('em')).not.toBeNull()
  })
})

describe('Markdown', () => {
  it('separa parágrafos e lê ênfase aninhada dentro deles', () => {
    const { container } = render(
      <Markdown text={'*um **forte** aqui*\n\n*e outro parágrafo*'} />,
    )
    expect(container.querySelectorAll('p')).toHaveLength(2)
    expect(container.querySelector('strong')?.textContent).toBe('forte')
    expect(container.textContent).not.toMatch(/\*/)
  })
})
