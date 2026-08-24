import { useEffect, useId, useRef, useState } from 'react'

import { $api } from '../../api/client'
import { uiStrings } from '../../lib/ui-strings'

interface GuestNameFieldProps {
  label: string
  /** `dark` dresses the field for the olive and terracotta rooms. */
  tone?: 'light' | 'dark'
  value: string
  onChange: (value: string) => void
  /** Called when a name is picked from the list (defaults to onChange). */
  onPick?: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
  /** Suggestions stay quiet while this is false (e.g. an invitation is open). */
  enabled?: boolean
  className?: string
}

/** The API only answers from three letters on — asking earlier is noise. */
const MIN_QUERY = 3

/**
 * A name field that knows the guest list: as the visitor types, it offers the
 * matching names (accent-insensitive, server-side) so a recado, a gift or an
 * RSVP is filed under the same spelling the couple used in their spreadsheet.
 * Free text is always allowed — someone may sign as they please.
 */
export function GuestNameField({
  label,
  tone = 'light',
  value,
  onChange,
  onPick,
  placeholder,
  autoFocus,
  enabled = true,
  className = '',
}: GuestNameFieldProps) {
  const inputId = useId()
  const listId = useId()
  const [debounced, setDebounced] = useState('')
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value.trim()), 250)
    return () => clearTimeout(handle)
  }, [value])

  const suggestions = $api.useQuery(
    'get',
    '/api/v1/guests/suggest',
    { params: { query: { q: debounced } } },
    { enabled: enabled && debounced.length >= MIN_QUERY, staleTime: 30_000 },
  )
  const names = suggestions.data?.suggestions ?? []

  // A click anywhere else puts the list away.
  useEffect(() => {
    if (!open) return
    const onDocClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const pick = (name: string) => {
    onChange(name)
    onPick?.(name)
    setOpen(false)
  }

  const showList = open && enabled && names.length > 0 && value.trim() !== names[0]

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

      {showList ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={uiStrings.guestField.suggestions}
          className="absolute inset-x-0 z-10 mt-1 max-h-56 overflow-y-auto border border-olive-line bg-cream shadow-[0_18px_40px_-24px_rgba(26,24,24,0.6)]"
        >
          {names.map((name) => (
            <li key={name}>
              <button
                type="button"
                onClick={() => pick(name)}
                className="w-full cursor-pointer px-3 py-2.5 text-left font-body text-base text-ink transition-colors hover:bg-veil"
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
