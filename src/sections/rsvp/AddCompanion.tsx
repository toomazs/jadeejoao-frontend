import { useId, useState } from 'react'

import { Plus } from 'lucide-react'

import { $api } from '../../api/client'
import type { components } from '../../api/schema'
import { uiStrings } from '../../lib/ui-strings'

type GroupView = components['schemas']['GroupView']
type Answer = 'yes' | 'no'

/**
 * Mirrors MaxCompanionsPerGroup in the API. Duplicated on purpose: the number
 * only decides whether the invitation still offers the button, and the API is
 * the one that actually refuses. If the two ever drift, the guest sees the
 * server's PT-BR message instead of a silent failure.
 */
const MAX_COMPANIONS = 5

interface AddCompanionProps {
  group: GroupView
  /** Called with the whole group the API returns, so the list re-renders. */
  onAdded: (group: GroupView) => void
}

/**
 * The guest putting someone else on their own invitation — a partner, a child,
 * whoever the couple left them room for.
 *
 * The answer is asked together with the name because whoever is bringing
 * someone already knows whether that person is coming; making them add first
 * and answer after would be two steps for one decision.
 */
export function AddCompanion({ group, onAdded }: AddCompanionProps) {
  const nameId = useId()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [attending, setAttending] = useState<Answer | null>(null)
  const add = $api.useMutation('post', '/api/v1/guests/{group_id}/companions')

  const used = (group.members ?? []).filter((m) => m.added_by_guest).length
  const left = MAX_COMPANIONS - used
  const canAdd = name.trim().length > 1 && attending !== null && !add.isPending

  if (left <= 0) {
    return (
      <p className="mt-6 text-center font-body text-sm text-dark-gray italic">
        {uiStrings.rsvp.companions.full}
      </p>
    )
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
      <label htmlFor={nameId} className="font-body text-sm text-dark-gray">
        {uiStrings.rsvp.companions.nameLabel}
      </label>
      <input
        id={nameId}
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder={uiStrings.rsvp.companions.namePlaceholder}
        maxLength={120}
        autoComplete="off"
        className="mt-1.5 min-h-11 w-full border border-olive-line bg-cream px-4 py-2.5 font-body text-lg text-ink placeholder:text-dark-gray/50 focus:border-olive"
      />

      <p className="mt-4 font-body text-sm text-dark-gray">
        {uiStrings.rsvp.companions.goingLabel}
      </p>
      <div
        className="mt-2 flex gap-2"
        role="group"
        aria-label={uiStrings.rsvp.companions.goingLabel}
      >
        {(['yes', 'no'] as const).map((option) => {
          const active = attending === option
          return (
            <button
              key={`${option}-${active}`}
              type="button"
              aria-pressed={active}
              onClick={() => setAttending(option)}
              className={`min-h-11 flex-1 cursor-pointer border px-4 font-body text-base tracking-[0.06em] uppercase transition-colors ${
                active ? 'answer-kick ' : ''
              }${
                active
                  ? option === 'yes'
                    ? 'border-olive bg-olive text-cream'
                    : 'border-terracotta bg-terracotta text-cream'
                  : 'border-olive-line text-dark-gray hover:border-olive hover:text-olive'
              }`}
            >
              {option === 'yes' ? uiStrings.rsvp.attendingYes : uiStrings.rsvp.attendingNo}
            </button>
          )
        })}
      </div>

      {add.isError ? (
        <p role="alert" className="mt-4 font-body text-base text-terracotta">
          {add.error &&
          typeof add.error === 'object' &&
          'detail' in add.error &&
          typeof add.error.detail === 'string'
            ? add.error.detail
            : uiStrings.genericActionError}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            setOpen(false)
            setName('')
            setAttending(null)
            add.reset()
          }}
          className="min-h-11 cursor-pointer px-2 font-body text-base text-dark-gray underline decoration-1 underline-offset-4 transition-colors hover:text-olive"
        >
          {uiStrings.rsvp.companions.cancel}
        </button>
        <button
          type="button"
          disabled={!canAdd}
          onClick={() => {
            if (!canAdd || attending === null) return
            add.mutate(
              {
                params: { path: { group_id: group.group_id } },
                body: { full_name: name.trim(), attending },
              },
              {
                onSuccess: (data) => {
                  onAdded(data)
                  setOpen(false)
                  setName('')
                  setAttending(null)
                },
              },
            )
          }}
          className="lift min-h-11 cursor-pointer border border-olive bg-olive px-6 font-body text-base tracking-[0.06em] text-cream uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-45"
        >
          {add.isPending ? uiStrings.rsvp.companions.adding : uiStrings.rsvp.companions.add}
        </button>
      </div>
    </div>
  )
}
