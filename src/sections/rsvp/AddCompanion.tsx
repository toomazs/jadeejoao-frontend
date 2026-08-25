import { useState } from 'react'

import { Plus } from 'lucide-react'

import { $api } from '../../api/client'
import type { components } from '../../api/schema'
import { MIN_QUERY, NameCombobox } from '../../components/ui/NameCombobox'
import { uiStrings } from '../../lib/ui-strings'

type GroupView = components['schemas']['GroupView']

/**
 * Mirrors MaxCompanionsPerGroup in the API. Duplicated on purpose: the number
 * only decides whether the invitation still offers the button, and the API is
 * the one that actually refuses. If the two ever drift, the guest sees the
 * server's PT-BR message instead of a silent failure.
 */
const MAX_COMPANIONS = 10

interface AddCompanionProps {
  group: GroupView
  /** Called with the whole group the API returns, so the list re-renders. */
  onAdded: (group: GroupView) => void
}

/**
 * Gathering someone else into your own invitation.
 *
 * The field searches the couple's guest list rather than accepting a typed
 * name: the list is their budget — a plate, a chair, a place at a table — and
 * a free text box would let any guest spend it without being asked. Whoever
 * is missing from it has to be added by the couple.
 *
 * Nothing else is asked here. The person already exists with the category and
 * side the couple recorded, and their yes/no is answered in the list above
 * with the same buttons as everyone else on the invitation.
 */
export function AddCompanion({ group, onAdded }: AddCompanionProps) {
  const [open, setOpen] = useState(false)
  const [typed, setTyped] = useState('')
  const [query, setQuery] = useState('')
  const add = $api.useMutation('post', '/api/v1/guests/{group_id}/companions')

  const search = $api.useQuery(
    'get',
    '/api/v1/guests/{group_id}/companions/available',
    { params: { path: { group_id: group.group_id }, query: { q: query } } },
    { enabled: open && query.length >= MIN_QUERY, staleTime: 15_000 },
  )

  const used = (group.members ?? []).filter((m) => m.added_by_guest).length
  if (MAX_COMPANIONS - used <= 0) {
    return (
      <p className="mt-6 text-center font-body text-sm text-dark-gray italic">
        {uiStrings.rsvp.companions.full}
      </p>
    )
  }

  const close = () => {
    setOpen(false)
    setTyped('')
    setQuery('')
    add.reset()
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lift mt-5 flex min-h-11 w-full cursor-pointer items-center justify-center gap-2.5 border border-dashed border-olive-line px-4 py-3 font-body text-base text-dark-gray transition-colors hover:border-olive hover:text-olive"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        {uiStrings.rsvp.companions.open}
      </button>
    )
  }

  return (
    <div className="card-in mt-5 border border-olive-line bg-veil px-4 py-5 sm:px-5">
      <NameCombobox
        label={uiStrings.rsvp.companions.searchLabel}
        value={typed}
        onChange={setTyped}
        onQueryChange={setQuery}
        options={(search.data?.options ?? []).map((o) => ({
          key: o.guest_id,
          label: o.full_name,
        }))}
        onPick={(option) => {
          setTyped(option.label)
          add.mutate(
            {
              params: { path: { group_id: group.group_id } },
              body: { guest_id: option.key },
            },
            {
              onSuccess: (data) => {
                onAdded(data)
                close()
              },
            },
          )
        }}
        placeholder={uiStrings.rsvp.companions.searchPlaceholder}
        autoFocus
        emptyHint={uiStrings.rsvp.companions.notFound}
      />

      <p className="mt-3 font-body text-sm text-dark-gray">
        {uiStrings.rsvp.companions.hint}
      </p>

      {add.isError ? (
        <p role="alert" className="mt-3 font-body text-base text-terracotta">
          {add.error &&
          typeof add.error === 'object' &&
          'detail' in add.error &&
          typeof add.error.detail === 'string'
            ? add.error.detail
            : uiStrings.genericActionError}
        </p>
      ) : null}

      <div className="mt-4 flex items-center justify-end">
        <button
          type="button"
          onClick={close}
          disabled={add.isPending}
          className="min-h-11 cursor-pointer px-2 font-body text-base text-dark-gray underline decoration-1 underline-offset-4 transition-colors hover:text-olive disabled:opacity-45"
        >
          {add.isPending ? uiStrings.rsvp.companions.adding : uiStrings.rsvp.companions.cancel}
        </button>
      </div>
    </div>
  )
}
