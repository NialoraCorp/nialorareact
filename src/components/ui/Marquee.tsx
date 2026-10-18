import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Star } from './Star'

interface Props {
  items: ReactNode[]
  /** bir tam tur süresi (sn) */
  duration?: number
  className?: string
}

/** Kesintisiz akan şerit. İçerik iki kez çizilir, -50% kayınca döngü görünmez. */
export function Marquee({ items, duration = 48, className }: Props) {
  const reduce = useReducedMotion()
  const row = [...items, ...items]
  return (
    <div className={cn('mask-fade-x overflow-hidden', className)} aria-hidden>
      <motion.div
        className="flex w-max items-center whitespace-nowrap"
        animate={reduce ? undefined : { x: ['0%', '-50%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      >
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-10 pr-10">
            <span>{item}</span>
            <Star className="size-2.5 text-gold" />
          </span>
        ))}
      </motion.div>
    </div>
  )
}
