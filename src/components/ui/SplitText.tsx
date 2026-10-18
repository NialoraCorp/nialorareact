import { Fragment, createElement, type ElementType } from 'react'
import { motion } from 'framer-motion'
import { maskUp, stagger } from '@/motion/variants'
import { STAGGER, VIEWPORT } from '@/motion/tokens'

interface Props {
  /** "*kelime*" biçimindeki parçalar italik vurgu olarak çizilir. */
  text: string
  as?: ElementType
  className?: string
  emClassName?: string
  delay?: number
  each?: number
  /** true: görünüme girince değil, mount olunca animasyon. */
  immediate?: boolean
  id?: string
}

interface Word { w: string; em: boolean; suffix?: string }

/** Kelimelere böler; "*vurgu*" parçası tek birim kalır, ardındaki noktalama ona yapışır. */
function parse(text: string): Word[] {
  const words: Word[] = []
  const re = /\*([^*]+)\*/g
  let last = 0
  let m: RegExpExecArray | null
  const push = (chunk: string, em: boolean) => {
    if (em) { words.push({ w: chunk.trim(), em: true }); return }
    // boşlukla başlamayan noktalama (örn. ", şimdi") bir önceki kelimeye eklenir
    const lead = /^([^\s\p{L}\p{N}]+)/u.exec(chunk)
    if (lead && words.length) {
      words[words.length - 1].suffix = (words[words.length - 1].suffix ?? '') + lead[1]
      chunk = chunk.slice(lead[1].length)
    }
    chunk.split(/\s+/).filter(Boolean).forEach((w) => words.push({ w, em: false }))
  }
  while ((m = re.exec(text))) {
    if (m.index > last) push(text.slice(last, m.index), false)
    push(m[1], true)
    last = m.index + m[0].length
  }
  if (last < text.length) push(text.slice(last), false)
  return words
}

/**
 * Kelime kelime maske içinden yükselen başlık.
 * Ekran okuyucular düz metni okur; animasyonlu kopya aria-hidden'dır.
 */
export function SplitText({
  text,
  as = 'span',
  className,
  emClassName = 'em-word',
  delay = 0,
  each = STAGGER.words,
  immediate = false,
  id,
}: Props) {
  const words = parse(text)
  const plain = text.replace(/\*/g, '')

  const inner = (
    <motion.span
      className="inline"
      aria-hidden
      variants={stagger(delay, each)}
      initial="hidden"
      {...(immediate ? { animate: 'show' } : { whileInView: 'show', viewport: VIEWPORT })}
    >
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="-mb-[0.16em] -mt-[0.12em] inline-block overflow-hidden pb-[0.16em] pt-[0.12em] align-bottom">
            <motion.span variants={maskUp} className="inline-block">
              {word.em ? <em className={emClassName}>{word.w}</em> : word.w}
              {word.suffix}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </motion.span>
  )

  return createElement(as, { className, 'aria-label': plain, id }, inner)
}
