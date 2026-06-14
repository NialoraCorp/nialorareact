import { useEffect, useState } from 'react'
import { useReveal } from '../lib/hooks'

interface Props {
  to: number
  duration?: number // ms
  className?: string
}

/** Görünüme girince 0'dan hedefe sayan rakam. */
export default function CountUp({ to, duration = 1300, className = '' }: Props) {
  const { ref, inView } = useReveal<HTMLSpanElement>(0.4)
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (to === 0) { setVal(0); return }
    let raf = 0
    let start = 0
    const tick = (t: number) => {
      if (!start) start = t
      const k = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - k, 3)
      setVal(Math.round(eased * to))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration])

  return <span ref={ref} className={className}>{val}</span>
}
