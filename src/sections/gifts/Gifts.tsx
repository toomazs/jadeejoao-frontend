import { useId, useState } from 'react'

import { $api } from '../../api/client'
import type { components } from '../../api/schema'
import { Button, ButtonLink } from '../../components/ui/Button'
import { Markdown } from '../../components/ui/Markdown'
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

/** The PIX flow inside a card: pick the amount, generate the copia-e-cola, declare. */
function PixFlow({ gift }: { gift: GiftView }) {
  const nameId = useId()
  const amountId = useId()
  const [open, setOpen] = useState(false)
  const [units, setUnits] = useState(1)
  const [reais, setReais] = useState('')
  const [code, setCode] = useState<string | null>(null)
  const [qrSvg, setQrSvg] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [contributor, setContributor] = useState('')

  const preview = $api.useMutation('get', '/api/v1/gifts/{gift_id}/pix')
  const declare = $api.useMutation('post', '/api/v1/gifts/{gift_id}/contributions')

  const quota = gift.quota_centavos ?? null
  const amountCentavos = quota ? units * quota : Math.round(Number(reais.replace(',', '.')) * 100)
  const amountValid = amountCentavos > 0

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

  const copy = async () => {
    if (!code) return
    await navigator.clipboard.writeText(code)
    setCopied(true)
  }

  if (!open) {
    return (
      <Button variant="outline" className="mt-5 w-full" onClick={() => setOpen(true)}>
        {uiStrings.gifts.pixCta}
      </Button>
    )
  }

  return (
    <div className="mt-5 border-t border-sand-line pt-5">
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
            <Button variant="outline" className="min-h-9 px-3" onClick={() => setUnits((u) => u + 1)}>
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
      <p className="mt-2 text-right font-body text-base text-olive">
        {amountValid ? formatCentavos(amountCentavos) : '—'}
      </p>

      <Button className="mt-4 w-full" onClick={generate} disabled={!amountValid || preview.isPending}>
        {preview.isPending ? uiStrings.gifts.generating : uiStrings.gifts.generateCode}
      </Button>
      {preview.isError ? (
        <p role="alert" className="mt-3 font-body text-sm text-terracotta">
          {problemDetail(preview.error)}
        </p>
      ) : null}

      {code ? (
        <div className="mt-5">
          {qrSvg ? (
            /*
             * The symbol is drawn by our own API from the BR Code's module
             * matrix — no guest input reaches it — so inlining the SVG is
             * safe, and it lets the QR take the couple's olive ink.
             */
            <figure className="mb-4 flex flex-col items-center">
              <div
                aria-hidden="true"
                className="w-40 border border-sand-line bg-cream p-2 text-olive [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
              <figcaption className="mt-2 font-body text-xs tracking-[0.14em] text-dark-gray uppercase">
                {uiStrings.gifts.scanQr}
              </figcaption>
            </figure>
          ) : null}
          <p className="max-h-24 overflow-y-auto border border-sand-line bg-veil p-3 font-body text-xs break-all text-dark-gray">
            {code}
          </p>
          <Button variant="outline" className="mt-3 w-full" onClick={() => void copy()}>
            {copied ? uiStrings.gifts.copied : uiStrings.gifts.copyCode}
          </Button>

          <div className="mt-5 border-t border-sand-line pt-4">
            <label htmlFor={nameId} className="font-body text-sm text-dark-gray">
              {uiStrings.gifts.declareName}
            </label>
            <input
              id={nameId}
              type="text"
              value={contributor}
              onChange={(event) => setContributor(event.target.value)}
              className="mt-1.5 w-full border border-olive-line bg-cream px-3 py-2.5 font-body text-lg"
            />
            <Button
              className="mt-3 w-full"
              disabled={contributor.trim().length === 0 || declare.isPending || declare.isSuccess}
              onClick={() =>
                declare.mutate({
                  params: { path: { gift_id: gift.gift_id } },
                  body: { contributor_name: contributor.trim(), amount_centavos: amountCentavos },
                })
              }
            >
              {declare.isPending ? uiStrings.gifts.declaring : uiStrings.gifts.declareCta}
            </Button>
            {declare.isSuccess ? (
              <p role="status" className="mt-3 font-body text-base text-deep-olive">
                {uiStrings.gifts.declared}
              </p>
            ) : null}
            {declare.isError ? (
              <p role="alert" className="mt-3 font-body text-sm text-terracotta">
                {problemDetail(declare.error)}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
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
