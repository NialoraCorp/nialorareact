import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Props {
  children: ReactNode
  strength?: number
  className?: string
}

/** İmleç yaklaşınca içeriği hafifçe çeken "manyetik" sarmalayıcı. */
export function Magnetic({ children, strength = 0.28, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 160, damping: 16, mass: 0.25 })
  const sy = useSpring(y, { stiffness: 160, damping: 16, mass: 0.25 })

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div
      ref={ref}
      className={cn('inline-block', className)}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  )
}
