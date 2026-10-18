import { useEffect } from 'react'
import Lenis from 'lenis'

const NAV_OFFSET = -76

/**
 * Lenis smooth scroll. Framer Motion'ın useScroll'u native scroll'u okuduğu
 * için ek bir köprüye gerek yok. Reduced-motion tercihinde devreye girmez.
 * Hash linklerini (#bolum) yumuşak kaydırmaya çevirir.
 */
export function useLenis() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
      smoothWheel: true,
    })

    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')!.slice(1)
      if (!id) return
      const el = document.getElementById(id)
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el, { offset: NAV_OFFSET, duration: 1.4 })
      history.replaceState(null, '', `#${id}`)
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('click', onClick)
      lenis.destroy()
    }
  }, [])
}
