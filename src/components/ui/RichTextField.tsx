import { Bold, Italic } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

/**
 * Markdown in — the HTML the guest actually sees while writing.
 *
 * Escaped first: whatever they type is their own text, and must stay text.
 * Bold is substituted before italic so a bold inside an italic survives, which
 * is the same order the wall's reader resolves them in.
 */
export function toHtml(markdown: string): string {
  const escaped = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  const inline = escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*(?!\s)([^*]+?)(?<!\s)\*(?!\*)/g, '<em>$1</em>')

  return inline
    .split(/\n{2,}/)
    .map((block) => `<p>${block.replace(/\n/g, '<br>') || '<br>'}</p>`)
    .join('')
}

/** And back out: the DOM they built — markdown for the payload. */
export function toMarkdown(root: HTMLElement): string {
  const walk = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? ''
    if (node.nodeType !== Node.ELEMENT_NODE) return ''

    const el = node as HTMLElement
    const inner = [...el.childNodes].map(walk).join('')
    switch (el.tagName) {
      case 'STRONG':
      case 'B':
        return inner.trim() ? `**${inner}**` : inner
      case 'EM':
      case 'I':
        return inner.trim() ? `*${inner}*` : inner
      case 'BR':
        return '\n'
      case 'P':
      case 'DIV':
        return `${inner}\n\n`
      default:
        return inner
    }
  }

  return [...root.childNodes]
    .map(walk)
    .join('')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * Writing a recado, with the words looking like what they will look like.
 *
 * A textarea would have shown the guest their own asterisks, which is a storage
 * detail and reads as a mistake to anybody who has not met markdown. Here bold
 * is bold while they type, and what leaves is still the markdown the API
 * stores and the wall reads back.
 *
 * Deliberately only bold and italic. A link button on a wall anyone can post to
 * is an invitation to spam, and a bare address typed into a recado stays plain
 * text — only the `[label](url)` form ever becomes a link, and nothing here
 * writes that form.
 */
export function RichTextField({
  id,
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  id?: string
  value: string
  onChange: (next: string) => void
  placeholder?: string
  maxLength?: number
}) {
  const box = useRef<HTMLDivElement>(null)
  /** What we last wrote out, so an echo of our own value never moves the caret. */
  const mine = useRef(value)
  const [empty, setEmpty] = useState(value === '')

  useEffect(() => {
    const el = box.current
    if (!el) return
    // Rewriting while somebody is typing drops the caret to the start, so this
    // only runs when the value came from somewhere else — a reset, say.
    if (value === mine.current && el.innerHTML !== '') return
    el.innerHTML = value ? toHtml(value) : ''
    mine.current = value
    setEmpty(value === '')
  }, [value])

  const emit = () => {
    const el = box.current
    if (!el) return
    const markdown = toMarkdown(el)
    mine.current = markdown
    setEmpty(markdown === '')
    onChange(markdown)
  }

  const run = (command: string) => {
    box.current?.focus()
    document.execCommand(command)
    emit()
  }

  const tools = [
    { icon: Bold, label: 'Negrito', run: () => run('bold') },
    { icon: Italic, label: 'Itálico', run: () => run('italic') },
  ]

  const over = maxLength !== undefined && value.length > maxLength

  return (
    <div>
      <div className="flex items-center gap-1 border border-b-0 border-gold-sand/45 bg-cream/5 px-1.5 py-1">
        {tools.map(({ icon: Icon, label, run: onRun }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            title={label}
            // Mouse down steals focus from the text, and with it the selection
            // the command is about to act on.
            onMouseDown={(event) => event.preventDefault()}
            onClick={onRun}
            className="cursor-pointer p-1.5 text-cream/70 transition-colors hover:text-gold-sand"
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="relative">
        {empty && placeholder ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-3 left-4 font-body text-lg text-cream/45"
          >
            {placeholder}
          </span>
        ) : null}
        <div
          id={id}
          ref={box}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          onInput={emit}
          onBlur={emit}
          // Pasted rich text would arrive as whatever markup the source used —
          // fonts, colours, spans — none of which survives the trip to markdown
          // and all of which looks wrong on the way there.
          onPaste={(event) => {
            event.preventDefault()
            document.execCommand('insertText', false, event.clipboardData.getData('text/plain'))
            emit()
          }}
          className={`min-h-36 w-full border bg-cream/10 px-4 py-3 font-body text-lg leading-relaxed text-cream focus:outline-none ${
            over ? 'border-terracotta' : 'border-gold-sand/45 focus:border-gold-sand'
          }`}
        />
      </div>

      {/* Only near the end. A counter from the first letter makes a recado feel
          like a form to fill rather than something to say. */}
      {maxLength !== undefined && value.length > maxLength * 0.9 ? (
        <p className={`mt-1 text-right font-body text-sm ${over ? 'text-terracotta' : 'text-cream/60'}`}>
          {value.length} / {maxLength}
        </p>
      ) : null}
    </div>
  )
}
