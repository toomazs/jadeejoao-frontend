import { useEffect, useId, useState } from 'react'

import { $api } from '../../api/client'
import { Button } from '../../components/ui/Button'
import { GuestNameField } from '../../components/ui/GuestNameField'
import { LeafGlyph } from '../../components/ui/LeafGlyph'
import { Markdown } from '../../components/ui/Markdown'
import { RichTextField } from '../../components/ui/RichTextField'
import { SeriguelaSprig } from '../../components/ui/Botanicals'
import { SectionShell } from '../../components/ui/SectionShell'
import { MessageWall } from './MessageWall'
import type { WallMessage } from './MessageWall'
import type { MessagesIntroContent } from '../../lib/content'
import { usePrefersReducedMotion } from '../../lib/scrollytelling'
import { uiStrings } from '../../lib/ui-strings'

interface MessagesProps {
  content: MessagesIntroContent
}

/** How long the invitation takes to bow out, matched to the .card-out keyframe. */
const LEAVE_MS = 320

/** What the API accepts in `body`, so the field says so before the server does. */
const BODY_MAX = 2000

/**
 * The seriguela of the invitation, blown up and running off both edges of the
 * window.
 *
 * The default pair of plants is set small and faint in two corners, which is
 * right for a room of text. This is the room where people leave their names,
 * and the branch the whole invitation is built around earns being what frames
 * it — big enough that it leaves the screen rather than sitting inside it, so
 * the page feels like a crop of something larger.
 *
 * The right one is the left one mirrored, not the left one rotated. Turned
 * instead of flipped it reads as the same drawing knocked over — the leaves end
 * up climbing the wrong way against the stem, which the eye catches even when
 * it cannot say why.
 *
 * They arrive whole. Drawing themselves in was tried and was worse: a branch
 * assembling itself behind a form pulls the eye to the background, which is the
 * one thing a background must not do.
 *
 * Diagonal by `transform`, swaying by the `rotate` and `translate` the keyframe
 * animates — separate properties in CSS, so they compose instead of
 * overwriting, and the branch keeps its lean while it breathes.
 */
function SeriguelaBorder() {
  /**
   * Smaller and fainter on a phone.
   *
   * A branch that frames a desk-width room fills a phone instead: at 44rem on a
   * screen 420px across, the two of them met in the middle and the form was
   * being read through foliage. Here they keep to the edges — about a fifth of
   * the width each — and leave the middle alone.
   */
  const sprig =
    'absolute -top-24 h-[24rem] w-auto text-gold-sand opacity-20 sm:-top-40 sm:h-[64rem] sm:opacity-30'

  return (
    <>
      <SeriguelaSprig
        className={`${sprig} sprig-sway -left-36 sm:-left-52`}
        style={{ transform: 'rotate(-24deg)' }}
      />
      <SeriguelaSprig
        className={`${sprig} sprig-sway-late -right-36 sm:-right-52`}
        style={{ transform: 'scaleX(-1) rotate(-24deg)' }}
      />
    </>
  )
}

function problemDetail(error: unknown): string {
  if (error && typeof error === 'object' && 'detail' in error && typeof error.detail === 'string') {
    return error.detail
  }
  return uiStrings.genericActionError
}

/**
 * The guestbook: you write, and what you write goes up on the wall below for
 * everyone who comes after you (AD-14).
 *
 * The wall is most of the reason anybody writes in one. Seeing other people's
 * words is what turns "leave a message" from a form into something you want to
 * add your name to.
 */
export function Messages({ content }: MessagesProps) {
  const bodyId = useId()
  const reduced = usePrefersReducedMotion()
  const [author, setAuthor] = useState('')
  const [body, setBody] = useState('')
  const [invitationGone, setInvitationGone] = useState(false)
  const wall = $api.useQuery('get', '/api/v1/messages', {}, { staleTime: 30_000 })

  /**
   * Their own recado, held here until the server's copy comes back.
   *
   * Sending and then waiting for a refetch means a second or two where the wall
   * does not have what they just wrote — long enough to wonder whether it
   * worked, on the one screen where that doubt matters. So it goes up at once,
   * and the refetch quietly replaces it with the real row.
   */
  const [justSent, setJustSent] = useState<WallMessage | null>(null)
  const send = $api.useMutation('post', '/api/v1/messages', {
    onSuccess: (created) => {
      setJustSent({
        message_id: created.message_id,
        author_name: author.trim(),
        body: body.trim(),
      })
      void wall.refetch()
    },
  })

  const fromServer = wall.data?.messages ?? []
  const shown =
    justSent && !fromServer.some((m) => m.message_id === justSent.message_id)
      ? [justSent, ...fromServer]
      : fromServer

  const canSend =
    author.trim().length > 0 &&
    body.trim().length > 0 &&
    body.length <= BODY_MAX &&
    !send.isPending

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
    <SectionShell
      slug="messages_intro"
      title={content.title}
      tone="olive"
      decor={<SeriguelaBorder />}
    >
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
              <div className="mt-1.5">
                <RichTextField
                  id={bodyId}
                  value={body}
                  onChange={setBody}
                  placeholder={uiStrings.messagesForm.bodyPlaceholder}
                  maxLength={BODY_MAX}
                />
              </div>
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

      <MessageWall messages={shown} />
    </SectionShell>
  )
}
