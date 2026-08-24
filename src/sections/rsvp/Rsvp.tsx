import { useEffect, useId, useState } from 'react'

import { $api } from '../../api/client'
import type { components } from '../../api/schema'
import { Button } from '../../components/ui/Button'
import { Markdown } from '../../components/ui/Markdown'
import { SectionShell } from '../../components/ui/SectionShell'
import type { RsvpContent } from '../../lib/content'
import { formatPlainDate } from '../../lib/format'
import { uiStrings } from '../../lib/ui-strings'

interface RsvpProps {
  content: RsvpContent
}

type GroupView = components['schemas']['GroupView']
type Answer = 'yes' | 'no'

/** Extracts the PT-BR problem detail the API sends, with a quiet fallback. */
function problemDetail(error: unknown): string {
  if (error && typeof error === 'object' && 'detail' in error && typeof error.detail === 'string') {
    return error.detail
  }
  return uiStrings.genericActionError
}

/**
 * The confirmation flow the whole site exists for: type your name (accent-
 * insensitive typeahead over the guest list), open your invitation, answer
 * for every person in it — the primary confirms for the whole family — and
 * send. The API enforces the deadline; we only display it.
 */
export function Rsvp({ content }: RsvpProps) {
  const inputId = useId()
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [group, setGroup] = useState<GroupView | null>(null)
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(query.trim()), 250)
    return () => clearTimeout(handle)
  }, [query])

  const suggestQuery = $api.useQuery(
    'get',
    '/api/v1/guests/suggest',
    { params: { query: { q: debounced } } },
    { enabled: group === null && debounced.length >= 3, staleTime: 30_000 },
  )

  const lookup = $api.useMutation('post', '/api/v1/guests/lookup')
  const submit = $api.useMutation('post', '/api/v1/guests/{group_id}/rsvp')

  const openInvitation = (fullName: string) => {
    setQuery(fullName)
    lookup.mutate(
      { body: { full_name: fullName } },
      {
        onSuccess: (data) => {
          setGroup(data)
          setSubmitted(false)
          const known: Record<string, Answer> = {}
          for (const member of data.members ?? []) {
            if (member.attending === 'yes' || member.attending === 'no') {
              known[member.guest_id] = member.attending
            }
          }
          setAnswers(known)
        },
      },
    )
  }

  const reset = () => {
    setGroup(null)
    setAnswers({})
    setQuery('')
    setDebounced('')
    setSubmitted(false)
    lookup.reset()
    submit.reset()
  }

  const members = group?.members ?? []
  const allAnswered = members.length > 0 && members.every((m) => answers[m.guest_id])

  const send = () => {
    if (!group || !allAnswered) return
    submit.mutate(
      {
        params: { path: { group_id: group.group_id } },
        body: {
          responses: members.map((m) => ({
            guest_id: m.guest_id,
            attending: answers[m.guest_id],
          })),
        },
      },
      {
        onSuccess: (data) => {
          setGroup(data)
          setSubmitted(true)
        },
      },
    )
  }

  const suggestions = suggestQuery.data?.suggestions ?? []

  return (
    <SectionShell slug="rsvp" title={content.title} width="wide">
      {content.body ? (
        <Markdown
          text={content.body}
          className="mx-auto max-w-prose text-center font-body text-lg leading-relaxed"
        />
      ) : null}
      {content.deadline ? (
        <p className="mt-3 text-center font-body text-base text-dark-gray italic">
          {uiStrings.rsvp.deadlinePrefix} {formatPlainDate(content.deadline)}.
        </p>
      ) : null}

      {group === null ? (
        <div className="mx-auto mt-10 max-w-xl">
          <label
            htmlFor={inputId}
            className="font-body text-sm tracking-[0.18em] text-dark-gray uppercase"
          >
            {uiStrings.rsvp.searchLabel}
          </label>
          <input
            id={inputId}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={uiStrings.rsvp.searchPlaceholder}
            autoComplete="off"
            className="mt-2 w-full border border-olive-line bg-cream px-4 py-3.5 font-body text-lg text-ink placeholder:text-dark-gray/60 focus:border-olive"
          />

          {suggestQuery.isFetching ? (
            <p className="mt-3 font-body text-base text-dark-gray italic">
              {uiStrings.rsvp.searching}
            </p>
          ) : null}

          {suggestions.length > 0 ? (
            <ul className="mt-3 divide-y divide-sand-line border border-olive-line bg-cream">
              {suggestions.map((name, index) => (
                <li key={name} className="name-in" style={{ animationDelay: `${index * 45}ms` }}>
                  <button
                    type="button"
                    onClick={() => openInvitation(name)}
                    className="w-full cursor-pointer px-4 py-3 text-left font-body text-lg text-olive transition-colors hover:bg-veil"
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          {lookup.isError ? (
            <p role="alert" className="mt-4 font-body text-base text-terracotta">
              {problemDetail(lookup.error)}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="mx-auto mt-10 max-w-2xl">
          <div key={group.group_id} className="card-in border border-olive-line bg-cream px-5 py-8 sm:px-8">
            <p className="text-center font-display text-2xl text-olive sm:text-3xl">
              {group.label}
            </p>
            <p className="mt-2 text-center font-body text-base text-dark-gray">
              {uiStrings.rsvp.confirmIntro}
            </p>

            <ul className="mt-7 divide-y divide-sand-line border-y border-sand-line">
              {members.map((member, index) => (
                <li
                  key={member.guest_id}
                  className="name-in flex flex-wrap items-center justify-between gap-3 py-4"
                  style={{ animationDelay: `${140 + index * 70}ms` }}
                >
                  <span className="font-body text-lg text-ink">{member.full_name}</span>
                  <div className="flex gap-2" role="group" aria-label={member.full_name}>
                    {(['yes', 'no'] as const).map((option) => {
                      const active = answers[member.guest_id] === option
                      const label =
                        option === 'yes' ? uiStrings.rsvp.attendingYes : uiStrings.rsvp.attendingNo
                      return (
                        <button
                          key={`${option}-${active}`}
                          type="button"
                          aria-pressed={active}
                          onClick={() =>
                            setAnswers((prev) => ({ ...prev, [member.guest_id]: option }))
                          }
                          className={`min-h-11 cursor-pointer border px-5 font-body text-base tracking-[0.06em] uppercase transition-colors ${
                            active ? 'answer-kick ' : ''
                          }${
                            active
                              ? option === 'yes'
                                ? 'border-olive bg-olive text-cream'
                                : 'border-terracotta bg-terracotta text-cream'
                              : 'border-olive-line text-dark-gray hover:border-olive hover:text-olive'
                          }`}
                        >
                          {label}
                        </button>
                      )
                    })}
                  </div>
                </li>
              ))}
            </ul>

            {submitted ? (
              <p
                role="status"
                className="mt-6 border border-olive bg-veil px-4 py-3 text-center font-body text-lg text-deep-olive"
              >
                {uiStrings.rsvp.success}
              </p>
            ) : null}

            {submit.isError ? (
              <p role="alert" className="mt-6 text-center font-body text-base text-terracotta">
                {problemDetail(submit.error)}
              </p>
            ) : null}

            {!allAnswered && !submitted ? (
              <p className="mt-6 text-center font-body text-sm text-dark-gray italic">
                {uiStrings.rsvp.answerAll}
              </p>
            ) : null}

            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <Button onClick={send} disabled={!allAnswered || submit.isPending}>
                {submit.isPending ? uiStrings.rsvp.sending : uiStrings.rsvp.submit}
              </Button>
              <Button variant="outline" onClick={reset}>
                {uiStrings.rsvp.searchAgain}
              </Button>
            </div>
          </div>
        </div>
      )}
    </SectionShell>
  )
}
