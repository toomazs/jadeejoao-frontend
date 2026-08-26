/**
 * Preview mode: the real site, rendering unsaved edits.
 *
 * The admin panel embeds this site in an iframe and posts the draft it is
 * editing. Here the API transport is swapped so `/content` and `/gifts` answer
 * from that draft instead of the network — every other call (Instagram, the
 * guest typeahead) still goes to the real API, because the panel is not
 * editing those and pretending otherwise would make the preview a lie.
 *
 * Doing it at the transport, rather than threading a prop through the tree,
 * is what keeps the preview honest: not one section component knows it is in
 * preview, so what the couple sees is the same code guests get.
 */

/** Only this origin may feed the preview. */
const ADMIN_ORIGIN = 'https://admin.jadeejoao.com.br'

/**
 * In development the panel runs on whatever port Vite hands it, so pinning a
 * list would just be a guessing game. Local origins are trusted there and
 * nowhere else: `import.meta.env.DEV` is statically false in the build, so
 * this branch is not even in the bundle guests download.
 */
function isLocalOrigin(origin: string): boolean {
  try {
    const { hostname } = new URL(origin)
    return hostname === 'localhost' || hostname === '127.0.0.1'
  } catch {
    return false
  }
}

type Draft = {
  /** The public `/content` shape: sections already filtered by `enabled`. */
  content?: unknown
  /** The public `/gifts` shape. */
  gifts?: unknown
}

type PreviewMessage =
  | { type: 'preview-draft'; draft: Draft }
  | { type: 'preview-scroll'; slug: string }
  /** Ask the guest-facing page to report where somebody clicks on a photo. */
  | { type: 'preview-pick'; target: string }
  | { type: 'preview-pick-cancel' }

let draft: Draft = {}
let resolveFirst: (() => void) | undefined
/** Resolves once the panel has sent something, so the first render is a draft. */
const firstDraft = new Promise<void>((resolve) => {
  resolveFirst = resolve
})

/**
 * Preview needs both marks: the query says the panel meant it, and being
 * framed says it really is the panel. Either alone would let a stray link
 * put the site into a mode where it renders whatever it is told.
 */
export function isPreview(): boolean {
  try {
    return (
      new URLSearchParams(window.location.search).get('preview') === '1' &&
      window.parent !== window
    )
  } catch {
    return false
  }
}

function allowedOrigin(origin: string): boolean {
  return origin === ADMIN_ORIGIN || (import.meta.env.DEV && isLocalOrigin(origin))
}

/**
 * Starts listening for drafts. `onDraft` runs on every update — the caller
 * uses it to invalidate the queries so React re-renders with the new content.
 */
export function installPreviewBridge(onDraft: () => void): void {
  const onMessage = (event: MessageEvent) => {
    if (!allowedOrigin(event.origin)) return
    const message = event.data as PreviewMessage | undefined
    if (!message || typeof message !== 'object') return

    if (message.type === 'preview-draft') {
      draft = message.draft ?? {}
      resolveFirst?.()
      resolveFirst = undefined
      onDraft()
      return
    }
    if (message.type === 'preview-scroll' && typeof message.slug === 'string') {
      scrollPreviewTo(message.slug)
      return
    }
    if (message.type === 'preview-pick' && typeof message.target === 'string') {
      startPicking(message.target)
      return
    }
    if (message.type === 'preview-pick-cancel') {
      stopPicking()
    }
  }

  window.addEventListener('message', onMessage)
  // The panel cannot know when this bundle finished booting, so the site says
  // so. Without it the first draft can be posted into a page not yet listening.
  window.parent.postMessage({ type: 'preview-ready' }, '*')
}

/**
 * Scrolls the preview and nothing else.
 *
 * `scrollIntoView` inside a frame walks up and scrolls the ancestors too, so
 * asking the site to jump to a section dragged the whole admin page along with
 * it. Moving this window directly cannot reach past the frame.
 */
function scrollPreviewTo(id: string): void {
  const target = document.getElementById(id)
  if (!target) return
  const top = target.getBoundingClientRect().top + window.scrollY
  window.scrollTo({ top, behavior: 'smooth' })
}

/* ------------------------------------------------------------- picking */

let picking: { target: string; cleanup: () => void } | null = null

/**
 * Lets the panel point at a spot on a photo instead of typing percentages.
 *
 * The Catarina scene needs the position of one closed eye, as a percentage of
 * the photograph. Two numbers in a form is a guessing game played one save at
 * a time; clicking the eye is the same answer, arrived at once.
 */
function startPicking(target: string): void {
  stopPicking()
  const image = document.querySelector<HTMLImageElement>(`[data-pick="${target}"]`)
  if (!image) return

  const previous = image.style.cursor
  image.style.cursor = 'crosshair'

  const onClick = (event: MouseEvent) => {
    const box = image.getBoundingClientRect()
    const x = ((event.clientX - box.left) / box.width) * 100
    const y = ((event.clientY - box.top) / box.height) * 100
    window.parent.postMessage(
      { type: 'preview-picked', target, x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) },
      '*',
    )
    stopPicking()
  }

  image.addEventListener('click', onClick)
  picking = {
    target,
    cleanup: () => {
      image.style.cursor = previous
      image.removeEventListener('click', onClick)
    },
  }
  // Bring the photo into view, or the couple is clicking at something they
  // cannot see.
  const section = image.closest('section')
  if (section?.id) scrollPreviewTo(section.id)
  else image.scrollIntoView({ block: 'center' })
}

function stopPicking(): void {
  picking?.cleanup()
  picking = null
}

function json(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * The preview transport. Waits for the first draft before answering the
 * endpoints it owns, so the site never flashes the saved content the couple
 * is in the middle of changing.
 */
export async function previewFetch(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url)
  const mine = pathname === '/api/v1/content' || pathname === '/api/v1/gifts'
  if (request.method !== 'GET' || !mine) {
    return fetch(request)
  }

  await firstDraft
  if (pathname === '/api/v1/content' && draft.content !== undefined) {
    return json(draft.content)
  }
  if (pathname === '/api/v1/gifts' && draft.gifts !== undefined) {
    return json(draft.gifts)
  }
  // The panel is not editing this one — show what guests would see.
  return fetch(request)
}
