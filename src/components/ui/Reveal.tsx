import type { ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'
import { fade, fadeLeft, fadeRight, fadeUp } from '@/motion/variants'
import { VIEWPORT } from '@/motion/tokens'

const tags = {
  div: motion.div,
  p: motion.p,
  span: motion.span,
  li: motion.li,
  ul: motion.ul,
  figure: motion.figure,
  h2: motion.h2,
  h3: motion.h3,
  section: motion.section,
  blockquote: motion.blockquote,
} as const

const variantMap: Record<'up' | 'fade' | 'left' | 'right', Variants> = {
  up: fadeUp,
  fade,
  left: fadeLeft,
  right: fadeRight,
}

interface Props {
  children: ReactNode
  as?: keyof typeof tags
  variant?: keyof typeof variantMap
  delay?: number
  className?: string
  once?: boolean
  style?: React.CSSProperties
}

/** Görünüme girince bir kez tetiklenen reveal sarmalayıcı. */
export function Reveal({ children, as = 'div', variant = 'up', delay = 0, className, once = true, style }: Props) {
  const Tag = tags[as]
  return (
    <Tag
      className={className}
      style={style}
      custom={delay}
      variants={variantMap[variant]}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: VIEWPORT.margin }}
    >
      {children}
    </Tag>
  )
}
