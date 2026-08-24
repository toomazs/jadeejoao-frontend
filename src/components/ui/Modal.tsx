import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  /** Announced as the dialog's name, and engraved as its heading. */
  title: string
  children: ReactNode
}

/**
 * A framed sheet of paper over the page, in the site's engraved grammar.
 * Built on <dialog>, so the browser handles the focus trap, the inert
 * background and Escape for us — no focus library, no scroll bugs.
 */
export function Modal({ open, onClose, title, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      // The page must not scroll behind the sheet.
      document.body.style.overflow = 'hidden'
    }
    if (!open && dialog.open) {
      dialog.close()
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      // Clicking the backdrop (the dialog itself, outside its content) closes.
      onClick={(event) => {
        if (event.target === ref.current) onClose()
      }}
      className="m-auto w-[min(30rem,calc(100vw-2rem))] border border-olive-line bg-cream p-0 text-ink backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
    >
      <div className="relative max-h-[85svh] overflow-y-auto px-6 py-7 sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl leading-tight text-olive">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="-mt-1 -mr-1 shrink-0 cursor-pointer p-2 text-2xl leading-none text-dark-gray transition-colors hover:text-terracotta"
          >
            ×
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </dialog>
  )
}
