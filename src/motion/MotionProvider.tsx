import type { ReactNode } from 'react'
import { MotionConfig } from 'framer-motion'
import { DUR, EASE } from './tokens'
import { useLenis } from './useLenis'

/**
 * Uygulama geneli motion ayarları:
 * - reducedMotion="user": sistem tercihi "azalt" ise transform animasyonları kapanır
 * - varsayılan transition: lüks easing, orta süre
 * - Lenis smooth scroll
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  useLenis()
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: DUR.base, ease: EASE }}>
      {children}
    </MotionConfig>
  )
}
