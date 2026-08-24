import { useId, useState } from 'react'

import { $api } from '../../api/client'
import { Button } from '../../components/ui/Button'
import { GuestNameField } from '../../components/ui/GuestNameField'
import { Markdown } from '../../components/ui/Markdown'
import { SectionShell } from '../../components/ui/SectionShell'
import type { MessagesIntroContent } from '../../lib/content'
import { uiStrings } from '../../lib/ui-strings'

interface MessagesProps {
  content: MessagesIntroContent
  ordinal?: string
}

function problemDetail(error: unknown): string {
  if (error && typeof error === 'object' && 'detail' in error && typeof error.detail === 'string') {
    return error.detail
  }
  return uiStrings.genericActionError
}

/** The guestbook: write-only — the couple reads every recado in their panel (AD-14). */
export function Messages({ content, ordinal }: MessagesProps) {
  const bodyId = useId()
  const [author, setAuthor] = useState('')
  const [body, setBody] = useState('')
  const send = $api.useMutation('post', '/api/v1/messages')

  const canSend = author.trim().length > 0 && body.trim().length > 0 && !send.isPending

  return (
    <SectionShell slug="messages_intro" title={content.title} ordinal={ordinal}>
      {content.body ? (
        <Markdown
          text={content.body}
          className="mx-auto max-w-prose text-center font-body text-lg leading-relaxed"
        />
      ) : null}

      {send.isSuccess ? (
        <p
          role="status"
          className="mx-auto mt-8 max-w-md border border-olive bg-veil px-4 py-3 text-center font-body text-lg text-deep-olive"
        >
          {uiStrings.messagesForm.sent}
        </p>
      ) : (
        <form
          className="mx-auto mt-8 flex max-w-xl flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            if (!canSend) return
            send.mutate({ body: { author_name: author.trim(), body: body.trim() } })
          }}
        >
          <GuestNameField
            label={uiStrings.messagesForm.nameLabel}
            value={author}
            onChange={setAuthor}
            placeholder={uiStrings.messagesForm.namePlaceholder}
          />
          <div>
            <label
              htmlFor={bodyId}
              className="font-body text-sm tracking-[0.18em] text-dark-gray uppercase"
            >
              {uiStrings.messagesForm.bodyLabel}
            </label>
            <textarea
              id={bodyId}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder={uiStrings.messagesForm.bodyPlaceholder}
              rows={5}
              maxLength={2000}
              className="mt-1.5 w-full resize-y border border-olive-line bg-cream px-4 py-3 font-body text-lg"
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
      )}
    </SectionShell>
  )
}
