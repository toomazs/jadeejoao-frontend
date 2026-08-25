import { useState } from 'react'

import { $api } from '../../api/client'
import { MIN_QUERY, NameCombobox } from './NameCombobox'

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
  const [query, setQuery] = useState('')

  const suggestions = $api.useQuery(
    'get',
    '/api/v1/guests/suggest',
    { params: { query: { q: query } } },
    { enabled: enabled && query.length >= MIN_QUERY, staleTime: 30_000 },
  )
  const names = suggestions.data?.suggestions ?? []

  return (
    <NameCombobox
      label={label}
      tone={tone}
      value={value}
      onChange={onChange}
      onQueryChange={setQuery}
      options={names.map((name) => ({ key: name, label: name }))}
      onPick={(option) => {
        onChange(option.label)
        onPick?.(option.label)
      }}
      placeholder={placeholder}
      autoFocus={autoFocus}
      enabled={enabled}
      className={className}
    />
  )
}
