import { useId, useState } from 'react'
import type { ReactNode } from 'react'

import { $api } from '../../api/client'
import type { components } from '../../api/schema'
import { Button, ButtonLink } from '../../components/ui/Button'
import { GuestNameField } from '../../components/ui/GuestNameField'
import { LeafDivider } from '../../components/ui/LeafDivider'
import { Inline, Markdown } from '../../components/ui/Markdown'
import { Modal } from '../../components/ui/Modal'
import { Reveal } from '../../components/ui/Reveal'
import { SectionShell } from '../../components/ui/SectionShell'
import { Skeleton } from '../../components/ui/Skeleton'
import type { GiftsIntroContent } from '../../lib/content'
import { formatCentavos } from '../../lib/format'
import { uiStrings } from '../../lib/ui-strings'

interface GiftsProps {
  content: GiftsIntroContent
}

type GiftView = components['schemas']['GiftView']

function problemDetail(error: unknown): string {
  if (error && typeof error === 'object' && 'detail' in error && typeof error.detail === 'string') {
    return error.detail
  }
  return uiStrings.genericActionError
}

/** Computed progress bar: declared + confirmed over the goal (optimistic, AD-6). */
function Progress({ gift }: { gift: GiftView }) {
  if (!gift.goal_centavos) return null
  const raised = gift.declared_centavos + gift.confirmed_centavos
  const percent = Math.min(100, Math.round((raised / gift.goal_centavos) * 100))
  return (
    <div className="mt-4">
      <div className="h-2 w-full bg-sand-line">
        <div className="h-full bg-terracotta" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 flex justify-between font-body text-base">
        <span className="text-terracotta">{formatCentavos(raised)}</span>
        <span className="text-dark-gray">{formatCentavos(gift.goal_centavos)}</span>
      </p>
    </div>
  )
}

/** One side of the quota stepper: a quiet square, sized for a finger. */
function StepButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="h-10 w-10 cursor-pointer font-body text-lg leading-none text-olive transition-colors hover:bg-veil disabled:cursor-not-allowed disabled:text-sand-line"
    >
      {children}
    </button>
  )
}

/** Small clipboard glyph — copying is an icon, not a wall of text. */
function CopyGlyph({ copied }: { copied: boolean }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {copied ? (
        <path d="M20 6 9 17l-5-5" />
      ) : (
        <>
          <rect width="13" height="13" x="9" y="9" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </>
      )}
    </svg>
  )
}

/**
 * The PIX flow, on a sheet over the page and split into three beats so no
 * step shouts over the next: choose the amount, pay (QR or copia-e-cola),
 * then sign it. The card itself only carries the invitation.
 */
function PixFlow({ gift }: { gift: GiftView }) {
  const amountId = useId()
  const [open, setOpen] = useState(false)
  const [units, setUnits] = useState(1)
  const [reais, setReais] = useState('')
  const [code, setCode] = useState<string | null>(null)
  const [qrSvg, setQrSvg] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [contributor, setContributor] = useState('')
  const [signing, setSigning] = useState(false)

  const preview = $api.useMutation('get', '/api/v1/gifts/{gift_id}/pix')
  const declare = $api.useMutation('post', '/api/v1/gifts/{gift_id}/contributions')

  const quota = gift.quota_centavos ?? null
  const maxUnits = typeof gift.units_left === 'number' ? gift.units_left : null
  const amountCentavos = quota ? units * quota : Math.round(Number(reais.replace(',', '.')) * 100)
  const amountValid = amountCentavos > 0

  // Every quota already reserved: the card says so instead of walking the
  // guest through three steps only to fail at the end.
  const soldOut = maxUnits === 0

  // One beat at a time: amount → payment → signature.
  const step: 'amount' | 'pay' | 'sign' = code === null ? 'amount' : signing ? 'sign' : 'pay'

  const generate = () => {
    if (!amountValid) return
    setCopied(false)
    preview.mutate(
      { params: { path: { gift_id: gift.gift_id }, query: { amount_centavos: amountCentavos } } },
      {
        onSuccess: (data) => {
          setCode(data.pix_code)
          setQrSvg(data.qr_svg ?? null)
        },
      },
    )
  }

  const backToAmount = () => {
    setCode(null)
    setQrSvg(null)
    setCopied(false)
    preview.reset()
  }

  const copy = async () => {
    if (!code) return
    await navigator.clipboard.writeText(code)
    setCopied(true)
  }

  const close = () => {
    setOpen(false)
    // The next opening starts clean: a stale code for another amount would
    // be the worst kind of bug in a payment screen.
    backToAmount()
    setSigning(false)
    declare.reset()
  }

  const stepLabel =
    step === 'amount'
      ? uiStrings.gifts.stepAmount
      : step === 'pay'
        ? uiStrings.gifts.stepPay
        : uiStrings.gifts.stepSign

  return (
    <>
      {soldOut ? (
        <p className="mt-5 border border-sand-line bg-veil py-3 text-center font-body text-sm tracking-[0.16em] text-dark-gray uppercase">
          {uiStrings.gifts.soldOut}
        </p>
      ) : (
        <Button className="mt-5 w-full" onClick={() => setOpen(true)}>
          {uiStrings.gifts.pixCta}
        </Button>
      )}

      <Modal open={open} onClose={close} title={gift.title}>
        <p className="font-body text-xs tracking-[0.24em] text-terracotta uppercase">{stepLabel}</p>

        {step === 'amount' ? (
          <div className="mt-5">
            {quota ? (
              <div className="flex items-center justify-between gap-3">
                <label htmlFor={amountId} className="font-body text-sm text-dark-gray">
                  {uiStrings.gifts.quotasLabel} ({formatCentavos(quota)})
                </label>
                <div className="flex items-center border border-olive-line">
                  <StepButton
                    label={uiStrings.gifts.oneLess}
                    onClick={() => setUnits((u) => Math.max(1, u - 1))}
                    disabled={units <= 1}
                  >
                    −
                  </StepButton>
                  <input
                    id={amountId}
                    type="text"
                    inputMode="numeric"
                    readOnly
                    value={units}
                    className="w-10 border-x border-olive-line bg-cream py-1.5 text-center font-body text-base"
                  />
                  <StepButton
                    label={uiStrings.gifts.oneMore}
                    // The ceiling lives in the updater, not only in `disabled`:
                    // rapid clicks batch, and the guest could otherwise ask for
                    // more quotas than the gift still has.
                    onClick={() =>
                      setUnits((u) => (maxUnits === null ? u + 1 : Math.min(maxUnits, u + 1)))
                    }
                    disabled={maxUnits !== null && units >= maxUnits}
                  >
                    +
                  </StepButton>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <label htmlFor={amountId} className="font-body text-sm text-dark-gray">
                  {uiStrings.gifts.amountLabel}
                </label>
                <input
                  id={amountId}
                  type="text"
                  inputMode="decimal"
                  value={reais}
                  onChange={(event) => setReais(event.target.value)}
                  placeholder="100,00"
                  className="w-28 border border-olive-line bg-cream px-3 py-2 text-right font-body text-lg"
                />
              </div>
            )}

            <p className="mt-4 border-t border-sand-line pt-4 text-right font-display text-2xl text-olive">
              {amountValid ? formatCentavos(amountCentavos) : '—'}
            </p>

            <Button
              className="mt-4 w-full"
              onClick={generate}
              disabled={!amountValid || preview.isPending}
            >
              {preview.isPending ? uiStrings.gifts.generating : uiStrings.gifts.generateCode}
            </Button>
            {preview.isError ? (
              <p role="alert" className="mt-3 font-body text-sm text-terracotta">
                {problemDetail(preview.error)}
              </p>
            ) : null}
          </div>
        ) : null}

        {step === 'pay' && code ? (
          <div className="mt-5">
            <p className="text-center font-display text-3xl text-olive">
              {formatCentavos(amountCentavos)}
            </p>

            {qrSvg ? (
              /*
               * The symbol is drawn by our own API from the BR Code's module
               * matrix — no guest input reaches it — so inlining the SVG is
               * safe, and it lets the QR take the couple's olive ink.
               */
              <figure className="mt-5 flex flex-col items-center">
                <div
                  aria-hidden="true"
                  className="w-44 border border-sand-line bg-cream p-2.5 text-olive [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
                <figcaption className="mt-2.5 font-body text-xs tracking-[0.14em] text-dark-gray uppercase">
                  {uiStrings.gifts.scanQr}
                </figcaption>
              </figure>
            ) : null}

            <div className="mt-5 flex items-start gap-2">
              <p className="max-h-20 flex-1 overflow-y-auto border border-sand-line bg-veil p-3 font-body text-xs break-all text-dark-gray">
                {code}
              </p>
              <button
                type="button"
                onClick={() => void copy()}
                aria-label={copied ? uiStrings.gifts.copied : uiStrings.gifts.copyCode}
                title={copied ? uiStrings.gifts.copied : uiStrings.gifts.copyCode}
                className={`flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center border transition-colors ${
                  copied
                    ? 'border-olive bg-olive text-cream'
                    : 'border-olive-line text-olive hover:bg-veil'
                }`}
              >
                <CopyGlyph copied={copied} />
              </button>
            </div>

            <Button className="mt-5 w-full" onClick={() => setSigning(true)}>
              {uiStrings.gifts.declareCta}
            </Button>
            <button
              type="button"
              onClick={backToAmount}
              className="mt-3 w-full cursor-pointer font-body text-sm text-dark-gray underline underline-offset-4 transition-colors hover:text-terracotta"
            >
              {uiStrings.gifts.changeAmount}
            </button>
          </div>
        ) : null}

        {step === 'sign' ? (
          <div className="mt-5">
            {declare.isSuccess ? (
              <div role="status" className="border border-olive bg-veil px-4 py-5 text-center">
                <p className="font-display text-2xl text-deep-olive">{uiStrings.gifts.declared}</p>
                <p className="mt-2 font-body text-sm leading-relaxed text-dark-gray">
                  {uiStrings.gifts.declaredHint}
                </p>
              </div>
            ) : (
              <>
                <GuestNameField
                  label={uiStrings.gifts.declareName}
                  value={contributor}
                  onChange={setContributor}
                  placeholder={uiStrings.gifts.declareNamePlaceholder}
                  autoFocus
                />
                <p className="mt-3 font-body text-xs leading-relaxed text-dark-gray italic">
                  {uiStrings.gifts.pendingNote}
                </p>
                <Button
                  className="mt-4 w-full"
                  disabled={contributor.trim().length === 0 || declare.isPending}
                  onClick={() =>
                    declare.mutate({
                      params: { path: { gift_id: gift.gift_id } },
                      body: {
                        contributor_name: contributor.trim(),
                        amount_centavos: amountCentavos,
                      },
                    })
                  }
                >
                  {declare.isPending ? uiStrings.gifts.declaring : uiStrings.gifts.confirmGift}
                </Button>
                <button
                  type="button"
                  onClick={() => setSigning(false)}
                  className="mt-3 w-full cursor-pointer font-body text-sm text-dark-gray underline underline-offset-4 transition-colors hover:text-terracotta"
                >
                  {uiStrings.gifts.backToCode}
                </button>
              </>
            )}
            {declare.isError ? (
              <p role="alert" className="mt-3 font-body text-sm text-terracotta">
                {problemDetail(declare.error)}
              </p>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </>
  )
}

/**
 * The shared shell every gift wears: the same frame, the same rhythm of
 * title and words, the same plaque at the foot — so a PIX meta and a store
 * list read as two entries of one list, not two designs.
 */
function GiftShell({
  index,
  media,
  title,
  description,
  children,
}: {
  index: number
  media?: ReactNode
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <Reveal
      as="li"
      delay={index * 110}
      className="lift flex flex-col border border-olive-line bg-cream px-5 py-6"
    >
      {media}
      <h3 className="font-display text-2xl text-olive">{title}</h3>
      {description ? (
        <p className="mt-2 font-body text-base leading-relaxed text-dark-gray">
          <Inline text={description} />
        </p>
      ) : null}
      <div className="mt-auto">{children}</div>
    </Reveal>
  )
}

/** One PIX gift: a meta or cota the guest funds with the copia-e-cola. */
function GiftCard({ gift, index }: { gift: GiftView; index: number }) {
  return (
    <GiftShell
      index={index}
      title={gift.title}
      description={gift.description}
      media={
        gift.image_url ? (
          <img
            src={gift.image_url}
            alt=""
            className="mb-4 aspect-[16/10] w-full border border-sand-line object-cover"
            loading="lazy"
          />
        ) : undefined
      }
    >
      <Progress gift={gift} />
      {typeof gift.units_left === 'number' ? (
        <p className="mt-2 font-body text-sm text-dark-gray">
          {gift.units_left} {uiStrings.gifts.unitsLeftSuffix}
        </p>
      ) : null}
      <PixFlow gift={gift} />
    </GiftShell>
  )
}

/**
 * One store list: the shop's own logo on the brand veil — a shelf label —
 * over the couple's note about what they picked there.
 */
function RegistryCard({ gift, index }: { gift: GiftView; index: number }) {
  if (!gift.external_url) return null
  return (
    <GiftShell
      index={index}
      title={gift.title}
      description={gift.description}
      media={
        gift.image_url ? (
          <div className="mb-5 flex h-24 items-center justify-center border border-sand-line bg-veil px-6">
            <img
              src={gift.image_url}
              alt={gift.platform ?? gift.title}
              className="max-h-14 w-auto max-w-full object-contain"
              loading="lazy"
            />
          </div>
        ) : undefined
      }
    >
      <ButtonLink
        href={gift.external_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 w-full"
      >
        {uiStrings.gifts.linkCta}
      </ButtonLink>
    </GiftShell>
  )
}

/** The registry room: intro from content, live gift cards from the API. */
export function Gifts({ content }: GiftsProps) {
  const giftsQuery = $api.useQuery('get', '/api/v1/gifts', {}, { staleTime: 60_000 })
  const gifts = giftsQuery.data?.gifts ?? []
  // Two families, two rooms: what the couple funds by PIX, and where they
  // keep a list at a store.
  const pixGifts = gifts.filter((gift) => gift.kind !== 'link')
  const registries = gifts.filter((gift) => gift.kind === 'link')

  return (
    <SectionShell slug="gifts_intro" title={content.title} width="wide">
      {content.body ? (
        <Markdown
          text={content.body}
          className="mx-auto max-w-prose text-center font-body text-lg leading-relaxed"
        />
      ) : null}

      {giftsQuery.isPending ? (
        <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      ) : null}

      {pixGifts.length > 0 ? (
        <ul className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pixGifts.map((gift, index) => (
            <GiftCard key={gift.gift_id} gift={gift} index={index} />
          ))}
        </ul>
      ) : null}

      {registries.length > 0 ? (
        <>
          <Reveal className="mt-16 flex flex-col items-center text-center">
            <LeafDivider />
            <h3 className="mt-6 font-display text-3xl text-olive">{uiStrings.gifts.listsTitle}</h3>
            <p className="mt-3 max-w-prose font-body text-base text-dark-gray">
              {uiStrings.gifts.listsBody}
            </p>
          </Reveal>
          <ul className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {registries.map((gift, index) => (
              <RegistryCard key={gift.gift_id} gift={gift} index={index} />
            ))}
          </ul>
        </>
      ) : null}
    </SectionShell>
  )
}
