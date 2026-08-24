import { useEffect, useId, useState } from 'react'

import { $api } from '../../api/client'
import { Button } from '../../components/ui/Button'
import { GuestNameField } from '../../components/ui/GuestNameField'
import { LeafGlyph } from '../../components/ui/LeafGlyph'
import { Markdown } from '../../components/ui/Markdown'
import { SectionShell } from '../../components/ui/SectionShell'
import type { MessagesIntroContent } from '../../lib/content'
import { usePrefersReducedMotion } from '../../lib/scrollytelling'
import { uiStrings } from '../../lib/ui-strings'

interface MessagesProps {
  content: MessagesIntroContent
}

/** How long the invitation takes to bow out, matched to the .card-out keyframe. */
const LEAVE_MS = 320

function problemDetail(error: unknown): string {
  if (error && typeof error === 'object' && 'detail' in error && typeof error.detail === 'string') {
    return error.detail
  }
  return uiStrings.genericActionError
}

/** The guestbook: write-only — the couple reads every recado in their panel (AD-14). */
export function Messages({ content }: MessagesProps) {
  const bodyId = useId()
  const reduced = usePrefersReducedMotion()
  const [author, setAuthor] = useState('')
  const [body, setBody] = useState('')
  const [invitationGone, setInvitationGone] = useState(false)
  const send = $api.useMutation('post', '/api/v1/messages')

  const canSend = author.trim().length > 0 && body.trim().length > 0 && !send.isPending

  /**
   * The invitation to write leaves before the thank-you arrives. Keeping the
   * intro ("deixe aqui seu carinho") next to the confirmation asked the guest
   * for a recado they had just sent; handing the space over says it landed.
   */
  useEffect(() => {
    if (!send.isSuccess) return
    if (reduced) {
      setInvitationGone(true)
      return
    }
    const timer = setTimeout(() => setInvitationGone(true), LEAVE_MS)
    return () => clearTimeout(timer)
  }, [send.isSuccess, reduced])

  return (
    <SectionShell slug="messages_intro" title={content.title} tone="olive">
      {invitationGone ? (
        <div
          role="status"
          className="card-in mx-auto mt-8 flex max-w-md flex-col items-center gap-3 border border-gold-sand bg-cream/10 px-6 py-9 text-center"
        >
          <LeafGlyph className="h-5 w-5 text-gold-sand" />
          <p className="font-body text-lg leading-relaxed text-cream">
            {uiStrings.messagesForm.sent}
          </p>
        </div>
      ) : (
        <div className={send.isSuccess ? 'card-out' : undefined}>
          {content.body ? (
            <Markdown
              text={content.body}
              className="mx-auto max-w-prose text-center font-body text-lg leading-relaxed text-cream-soft"
            />
          ) : null}

          <form
            className="mx-auto mt-8 flex max-w-xl flex-col gap-5"
            onSubmit={(event) => {
              event.preventDefault()
              if (!canSend) return
              send.mutate({ body: { author_name: author.trim(), body: body.trim() } })
            }}
          >
            <GuestNameField
              tone="dark"
              label={uiStrings.messagesForm.nameLabel}
              value={author}
              onChange={setAuthor}
              placeholder={uiStrings.messagesForm.namePlaceholder}
            />
            <div>
              <label htmlFor={bodyId} className="font-body text-sm text-gold-sand">
                {uiStrings.messagesForm.bodyLabel}
              </label>
              <textarea
                id={bodyId}
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder={uiStrings.messagesForm.bodyPlaceholder}
                rows={5}
                maxLength={2000}
                className="mt-1.5 w-full resize-y border border-gold-sand/45 bg-cream/10 px-4 py-3 font-body text-lg text-cream placeholder:text-cream/45 focus:border-gold-sand"
              />
            </div>
            {send.isError ? (
              <p role="alert" className="font-body text-base text-terracotta">
                {problemDetail(send.error)}
              </p>
            ) : null}
            <Button type="submit" disabled={!canSend} className="self-center">
              {send.isPending ? uiStrings.messagesForm.sending : uiStrings.messagesForm.send}
            </Button>
          </form>
        </div>
      )}
    </SectionShell>
  )
}
