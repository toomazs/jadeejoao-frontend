import { useId, useState } from 'react'

import { $api } from '../../api/client'
import type { components } from '../../api/schema'
import { Button, ButtonLink } from '../../components/ui/Button'
import { GuestNameField } from '../../components/ui/GuestNameField'
import { Markdown } from '../../components/ui/Markdown'
import { Modal } from '../../components/ui/Modal'
import { Reveal } from '../../components/ui/Reveal'
import { SectionShell } from '../../components/ui/SectionShell'
import { Skeleton } from '../../components/ui/Skeleton'
import type { GiftsIntroContent } from '../../lib/content'
import { formatCentavos } from '../../lib/format'
import { uiStrings } from '../../lib/ui-strings'

interface GiftsProps {
  content: GiftsIntroContent
  ordinal?: string
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
  const amountCentavos = quota ? units * quota : Math.round(Number(reais.replace(',', '.')) * 100)
  const amountValid = amountCentavos > 0

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
      <Button variant="outline" className="mt-5 w-full" onClick={() => setOpen(true)}>
        {uiStrings.gifts.pixCta}
      </Button>

      <Modal open={open} onClose={close} title={gift.title}>
        <p className="font-body text-xs tracking-[0.24em] text-terracotta uppercase">{stepLabel}</p>

        {step === 'amount' ? (
          <div className="mt-5">
            {quota ? (
              <div className="flex items-center justify-between gap-3">
                <label htmlFor={amountId} className="font-body text-sm text-dark-gray">
                  {uiStrings.gifts.quotasLabel} ({formatCentavos(quota)})
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="min-h-9 px-3"
                    onClick={() => setUnits((u) => Math.max(1, u - 1))}
                  >
                    −
                  </Button>
                  <input
                    id={amountId}
                    type="text"
                    inputMode="numeric"
                    readOnly
                    value={units}
                    className="w-10 border border-olive-line bg-cream py-1 text-center font-body text-lg"
                  />
                  <Button
                    variant="outline"
                    className="min-h-9 px-3"
                    onClick={() => setUnits((u) => u + 1)}
                  >
                    +
                  </Button>
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
              <p role="status" className="font-body text-lg text-deep-olive">
                {uiStrings.gifts.declared}
              </p>
            ) : (
              <>
                <GuestNameField
                  label={uiStrings.gifts.declareName}
                  value={contributor}
                  onChange={setContributor}
                  placeholder={uiStrings.gifts.declareNamePlaceholder}
                  autoFocus
                />
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

/** One gift card — PIX meta/cota with the flow, or an outbound registry card. */
function GiftCard({ gift, index }: { gift: GiftView; index: number }) {
  return (
    <Reveal
      as="li"
      delay={index * 110}
      className="lift flex flex-col border border-olive-line bg-cream px-5 py-6"
    >
      {gift.image_url ? (
        <img
          src={gift.image_url}
          alt=""
          className="mb-4 aspect-[16/10] w-full border border-sand-line object-cover"
          loading="lazy"
        />
      ) : null}
      <h3 className="font-display text-2xl text-olive">{gift.title}</h3>
      {gift.description ? (
        <p className="mt-2 font-body text-base leading-relaxed text-dark-gray">
          {gift.description}
        </p>
      ) : null}

      <div className="mt-auto">
        {gift.kind === 'link' && gift.external_url ? (
          <div className="mt-5 flex flex-col gap-2">
            {gift.platform ? (
              <span className="font-body text-xs tracking-[0.24em] text-dark-gray uppercase">
                {gift.platform}
              </span>
            ) : null}
            <ButtonLink
              href={gift.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              {uiStrings.gifts.linkCta}
            </ButtonLink>
          </div>
        ) : (
          <>
            <Progress gift={gift} />
            {typeof gift.units_left === 'number' ? (
              <p className="mt-2 font-body text-sm text-dark-gray">
                {gift.units_left} {uiStrings.gifts.unitsLeftSuffix}
              </p>
            ) : null}
            <PixFlow gift={gift} />
          </>
        )}
      </div>
    </Reveal>
  )
}

/** The registry room: intro from content, live gift cards from the API. */
export function Gifts({ content, ordinal }: GiftsProps) {
  const giftsQuery = $api.useQuery('get', '/api/v1/gifts', {}, { staleTime: 60_000 })
  const gifts = giftsQuery.data?.gifts ?? []

  return (
    <SectionShell slug="gifts_intro" title={content.title} ordinal={ordinal} width="wide">
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

      {gifts.length > 0 ? (
        <ul className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gifts.map((gift, index) => (
            <GiftCard key={gift.gift_id} gift={gift} index={index} />
          ))}
        </ul>
      ) : null}
    </SectionShell>
  )
}
