import type { ElementType, ReactNode } from 'react'
import { useReveal } from '../lib/hooks'

interface Props {
  children: ReactNode
  as?: ElementType
  delay?: number       // ms
  className?: string
  /** reveal yönü */
  from?: 'up' | 'left' | 'right' | 'fade'
}

export default function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  className = '',
  from = 'up',
}: Props) {
  const { ref, inView } = useReveal()
  return (
    <Tag
      ref={ref as never}
      className={`reveal reveal--${from} ${inView ? 'in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}
