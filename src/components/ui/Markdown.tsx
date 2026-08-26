import type { ReactNode } from 'react'
import { Fragment } from 'react'

interface MarkdownProps {
  /** Markdown source from a content payload (`body` fields). */
  text: string
  className?: string
  /** Letter-style opening: oversized engraved initial on the first paragraph. */
  dropCap?: boolean
}

const INLINE_PATTERN = /\*\*(.+?)\*\*|\*(.+?)\*|_(.+?)_|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g

/** Renders the inline subset the couple actually writes: bold, italic, links. */
function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0
  INLINE_PATTERN.lastIndex = 0
  while ((match = INLINE_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }
    const [, bold, star, underscore, linkLabel, linkHref] = match
    if (bold !== undefined) {
      nodes.push(<strong key={key}>{bold}</strong>)
    } else if (star !== undefined) {
      nodes.push(<em key={key}>{star}</em>)
    } else if (underscore !== undefined) {
      nodes.push(<em key={key}>{underscore}</em>)
    } else if (linkLabel !== undefined && linkHref !== undefined) {
      nodes.push(
        <a
          key={key}
          href={linkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-olive underline decoration-1 underline-offset-4 transition-colors hover:text-terracotta"
        >
          {linkLabel}
        </a>,
      )
    }
    lastIndex = INLINE_PATTERN.lastIndex
    key += 1
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }
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
