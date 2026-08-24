import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

/** Kept in step with the .modal-out animation in global.css. */
const EXIT_MS = 220

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
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
      // The page must not scroll behind the sheet.
      document.body.style.overflow = 'hidden'
      return
    }

    if (!open && dialog.open) {
      // The page scrolls again the moment the sheet starts leaving.
      document.body.style.overflow = ''
      // Let it fade out before the browser tears it down.
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        dialog.close()
        return
      }
      setClosing(true)
      const timer = setTimeout(() => {
        setClosing(false)
        dialog.close()
      }, EXIT_MS)
      return () => clearTimeout(timer)
    }
  }, [open])

  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      // Clicking the backdrop (the dialog itself, outside its content) closes.
      onClick={(event) => {
        if (event.target === ref.current) onClose()
      }}
      className={`m-auto w-[min(30rem,calc(100vw-2rem))] border border-olive-line bg-cream p-0 text-ink backdrop:bg-ink/60 backdrop:backdrop-blur-sm ${
        closing ? 'modal-out' : 'modal-in'
      }`}
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
