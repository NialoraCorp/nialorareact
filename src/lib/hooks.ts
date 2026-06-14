import { useEffect, useRef, useState } from 'react'

/**
 * Görünüme girince bir kez tetiklenen reveal gözlemcisi.
 * Dönen ref'i bir elemana ver; göründüğünde `inView` true olur.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.18,
) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true)
            obs.disconnect()
          }
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, inView }
}

/**
 * Eleman ekranda kaydıkça -1..1 arası bir ilerleme döndürür
 * (eleman merkezi viewport merkezindeyken 0). Parallax için.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const [p, setP] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const center = r.top + r.height / 2
      const ratio = (center - vh / 2) / (vh / 2 + r.height / 2)
      setP(Math.max(-1, Math.min(1, ratio)))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return { ref, p }
}
