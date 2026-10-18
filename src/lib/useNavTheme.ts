import { useEffect, useState, type RefObject } from 'react'
import { getNavTheme, setNavTheme, subscribeNavTheme, type NavTheme } from './navTheme'

/** Nav temasını okuyan hook (Nav, ScrollStar). */
export function useNavTheme(): NavTheme {
  const [theme, setTheme] = useState<NavTheme>(getNavTheme)
  useEffect(() => subscribeNavTheme(setTheme), [])
  return theme
}

/**
 * Bölüm, üst barın altındaki şeride girince temayı bildirir.
 * `theme` sabit bir değer ya da anlık hesaplayan bir fonksiyon olabilir.
 */
export function useSectionTheme(ref: RefObject<HTMLElement | null>, theme: NavTheme | (() => NavTheme)) {
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setNavTheme(typeof theme === 'function' ? theme() : theme)
        }
      },
      // viewport'un üstten %6–9 arası ince bir şerit: nav'ın tam altı
      { rootMargin: '-6% 0px -91% 0px', threshold: 0 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, theme])
}
