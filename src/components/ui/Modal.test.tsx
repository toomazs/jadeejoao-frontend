import { fireEvent, render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Modal } from './Modal'

beforeEach(() => {
  // jsdom ships <dialog> without the two methods that open and shut it.
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true
  }
  HTMLDialogElement.prototype.close = function () {
    this.open = false
  }
})

function open(onClose: () => void) {
  const { container } = render(
    <Modal open onClose={onClose} title="Presente">
      <p>00020126500014br.gov.bcb.pix</p>
    </Modal>,
  )
  const sheet = container.querySelector('dialog') as HTMLDialogElement
  return { sheet, inside: container.querySelector('p') as HTMLElement }
}

describe('Modal', () => {
  it('fecha quando o clique começa e termina no fundo', () => {
    const onClose = vi.fn()
    const { sheet } = open(onClose)
    fireEvent.pointerDown(sheet, { target: sheet })
    fireEvent.click(sheet, { target: sheet })
    expect(onClose).toHaveBeenCalled()
  })

  it('não fecha quando o arrasto começa dentro e sai pela borda', () => {
    // Selecting the copia-e-cola and releasing past the edge of the sheet fires
    // a click on the dialog itself — the click lands on the nearest ancestor of
    // where the button went down and where it came up. Indistinguishable from a
    // click on the backdrop, and it closed the sheet in the middle of copying
    // the PIX code.
    const onClose = vi.fn()
    const { sheet, inside } = open(onClose)
    fireEvent.pointerDown(inside)
    fireEvent.click(sheet, { target: sheet })
    expect(onClose).not.toHaveBeenCalled()
  })

  it('não fecha com um clique dentro', () => {
    const onClose = vi.fn()
    const { inside } = open(onClose)
    fireEvent.pointerDown(inside)
    fireEvent.click(inside)
    expect(onClose).not.toHaveBeenCalled()
  })
})
