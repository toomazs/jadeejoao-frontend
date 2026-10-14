import type { ReactNode } from 'react'
import { Fragment } from 'react'

interface MarkdownProps {
  /** Markdown source from a content payload (`body` fields). */
  text: string
  className?: string
  /** Letter-style opening: oversized engraved initial on the first paragraph. */
  dropCap?: boolean
}

const LINK = /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/

/**
 * The next unpaired `mark` at or after `from`, or -1.
 *
 * Unpaired is the whole difficulty. Inside `*a **b** c*` the closing asterisk
 * of the italic is the last one — the doubled ones in the middle belong to the
 * bold and have to be stepped over, not mistaken for the end.
 */
function closingMark(text: string, from: number, mark: string): number {
  for (let at = from; at < text.length; at += 1) {
    if (text[at] !== mark) continue
    if (text[at + 1] === mark) {
      at += 1 // a doubled mark: skip the pair whole
      continue
    }
    return at
  }
  return -1
}

/**
 * Bold, italic and links — the subset the couple writes, nested.
 *
 * This replaced a single alternating regex, which could only ever see one
 * level. The letters are stored with each paragraph wrapped in asterisks, so
 * every bold word the couple adds lands *inside* an italic: the old pattern
 * met `*… **visão?** …*`, closed the italic at the first asterisk of the bold,
 * and produced three italic runs and no bold at all. Emphasis contains
 * emphasis, so the thing that reads it has to call itself.
 */
function renderInline(text: string, depth = 0): ReactNode[] {
  const nodes: ReactNode[] = []
  let plain = ''
  let at = 0
  let key = 0

  const flush = () => {
    if (plain) {
      nodes.push(plain)
      plain = ''
    }
  }
  const wrap = (node: ReactNode) => {
    flush()
    nodes.push(node)
    key += 1
  }

  while (at < text.length) {
    const char = text[at]

    if (char === '[') {
      const link = LINK.exec(text.slice(at))
      if (link) {
        wrap(
          <a
            key={`${depth}-${key}`}
            href={link[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-olive underline decoration-1 underline-offset-4 transition-colors hover:text-terracotta"
          >
            {link[1]}
          </a>,
        )
        at += link[0].length
        continue
      }
    }

    if (char === '*' && text[at + 1] === '*') {
      const close = text.indexOf('**', at + 2)
      if (close > at + 2) {
        wrap(<strong key={`${depth}-${key}`}>{renderInline(text.slice(at + 2, close), depth + 1)}</strong>)
        at = close + 2
        continue
      }
    }

    if (char === '*' || char === '_') {
      const close = closingMark(text, at + 1, char)
      if (close > at + 1) {
        wrap(<em key={`${depth}-${key}`}>{renderInline(text.slice(at + 1, close), depth + 1)}</em>)
        at = close + 1
        continue
      }
    }

    // A mark with nothing closing it is just a character the couple typed.
    plain += char
    at += 1
  }

  flush()
  return nodes
}

/**
 * The inline subset on its own, for text whose paragraphs are already laid out
 * by the caller.
 *
 * The chapters and the letters animate one paragraph at a time, so they build
 * their own `<p>` elements and cannot hand the whole string to `Markdown` —
 * but the couple writes the same asterisks there as everywhere else, and the
 * panel shows them the result. Without this they were the two places on the
 * site where a bold word came out as literal `**`.
 */
export function Inline({ text }: { text: string }) {
  return <>{renderInline(text)}</>
}

/**
 * Tiny local renderer for payload `body` markdown (paragraphs, bold, italic,
 * links, soft line breaks). Deliberately no runtime dependency and no raw HTML
 * pass-through — the couple's admin writes this narrow subset.
 */
export function Markdown({ text, className = '', dropCap = false }: MarkdownProps) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  if (paragraphs.length === 0) {
    return null
  }

  return (
    <div className={className}>
      {paragraphs.map((paragraph, paragraphIndex) => {
        const lines = paragraph.split('\n')
        const capClasses =
          dropCap && paragraphIndex === 0
            ? 'first-letter:float-left first-letter:mr-2.5 first-letter:font-display first-letter:text-[3.4em] first-letter:leading-[0.75] first-letter:text-olive'
            : ''
        return (
          <p
            key={paragraphIndex}
            className={`${paragraphIndex > 0 ? 'mt-5' : ''} ${capClasses}`.trim() || undefined}
          >
            {lines.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {lineIndex > 0 ? <br /> : null}
                {renderInline(line)}
              </Fragment>
            ))}
          </p>
        )
      })}
    </div>
  )
}
