import { describe, expect, it } from 'vitest'

import { toneAtLine } from './Nav'
import type { Room } from './Nav'

const LINE = 42

describe('toneAtLine', () => {
  it('lê o quarto que a linha atravessa', () => {
    const rooms: Room[] = [
      { top: -800, bottom: 0, tone: 'light' },
      { top: 0, bottom: 900, tone: 'dark' },
    ]
    expect(toneAtLine(rooms, LINE)).toBe('dark')
  })

  it('na emenda, fica com o quarto de baixo', () => {
    // Rooms touch exactly: one ends on the pixel the next begins. Taking the
    // first match would leave the pill wearing the colour of the room it has
    // just left for the whole height of the seam.
    const rooms: Room[] = [
      { top: -500, bottom: 42, tone: 'light' },
      { top: 42, bottom: 900, tone: 'dark' },
    ]
    expect(toneAtLine(rooms, LINE)).toBe('dark')
  })

  it('trata qualquer coisa que não seja dark como claro', () => {
    expect(toneAtLine([{ top: 0, bottom: 100, tone: 'veil' }], LINE)).toBe('light')
    expect(toneAtLine([{ top: 0, bottom: 100, tone: null }], LINE)).toBe('light')
  })

  it('devolve nada quando a linha está no vazio', () => {
    // Which the caller reads as "keep what you had", instead of flashing to a
    // default between two rooms.
    expect(toneAtLine([{ top: 200, bottom: 900, tone: 'dark' }], LINE)).toBeNull()
    expect(toneAtLine([], LINE)).toBeNull()
  })

  it('ignora o que já passou', () => {
    const rooms: Room[] = [
      { top: -900, bottom: -10, tone: 'dark' },
      { top: -10, bottom: 800, tone: 'light' },
    ]
    expect(toneAtLine(rooms, LINE)).toBe('light')
  })
})
