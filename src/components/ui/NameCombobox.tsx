import { useEffect, useId, useRef, useState } from 'react'

import { uiStrings } from '../../lib/ui-strings'

/** The API only answers from three letters on — asking earlier is noise. */
export const MIN_QUERY = 3

export interface ComboOption {
  /** Stable identity for the row; may be the name itself. */
  key: string
  label: string
}

interface NameComboboxProps {
  label: string
  /** `dark` dresses the field for the olive and terracotta rooms. */
  tone?: 'light' | 'dark'
  value: string
  onChange: (value: string) => void
  /**
   * The debounced query, once it is long enough to be worth asking about.
   * The owner runs whichever search fits its screen — the guest list, or the
   * narrower list of people an invitation may still gather in.
   */
  onQueryChange: (query: string) => void
  options: ComboOption[]
  onPick: (option: ComboOption) => void
  placeholder?: string
  autoFocus?: boolean
  /** Suggestions stay quiet while this is false (e.g. an invitation is open). */
  enabled?: boolean
  /** Shown when a long-enough query matched nobody. */
  emptyHint?: string
  className?: string
}

/**
 * A name field that reads from a list: as the visitor types, matching names
 * are offered (accent-insensitive, server-side).
 *
 * Whether typing something absent from the list is allowed is the owner's
 * call, not this component's — a recado may be signed however someone likes,
 * while gathering someone into an invitation may not invent a guest.
 */
export function NameCombobox({
  label,
  tone = 'light',
  value,
  onChange,
  onQueryChange,
  options,
  onPick,
  placeholder,
  autoFocus,
  enabled = true,
  emptyHint,
  className = '',
}: NameComboboxProps) {
  const inputId = useId()
  const listId = useId()
  const [debounced, setDebounced] = useState('')
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value.trim()), 250)
    return () => clearTimeout(handle)
  }, [value])

  useEffect(() => {
    onQueryChange(debounced)
  }, [debounced, onQueryChange])

  // A click anywhere else puts the list away.
  useEffect(() => {
    if (!open) return
    const onDocClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const asked = enabled && debounced.length >= MIN_QUERY
  const showList = open && asked && options.length > 0 && value.trim() !== options[0].label
  const showEmpty = Boolean(emptyHint) && asked && options.length === 0

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <label
        htmlFor={inputId}
        className={`font-body text-sm ${tone === 'dark' ? 'text-gold-sand' : 'text-dark-gray'}`}
      >
        {label}
      </label>
      <input
        id={inputId}
        type="text"
        value={value}
        autoFocus={autoFocus}
        autoComplete="off"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        placeholder={placeholder}
        onChange={(event) => {
          onChange(event.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setOpen(false)
        }}
        className={`mt-1.5 w-full border px-3 py-2.5 font-body text-lg ${
          tone === 'dark'
            ? 'border-gold-sand/45 bg-cream/10 text-cream placeholder:text-cream/45 focus:border-gold-sand'
            : 'border-olive-line bg-cream'
        }`}
      />

      {showEmpty ? (
        <p
          className={`mt-2 font-body text-sm italic ${
            tone === 'dark' ? 'text-cream-soft/80' : 'text-dark-gray'
          }`}
        >
          {emptyHint}
        </p>
      ) : null}

      {showList ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={uiStrings.guestField.suggestions}
          className="absolute inset-x-0 z-10 mt-1 max-h-56 overflow-y-auto border border-olive-line bg-cream shadow-[0_18px_40px_-24px_rgba(26,24,24,0.6)]"
        >
          {options.map((option) => (
            <li key={option.key}>
              <button
                type="button"
                onClick={() => {
                  onPick(option)
                  setOpen(false)
                }}
                className="w-full cursor-pointer px-3 py-2.5 text-left font-body text-base text-ink transition-colors hover:bg-veil"
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
