/**
 * Nialora motion tokens — tek kaynak.
 * Tüm bölümler ve UI bileşenleri bu easing/duration değerlerini kullanır.
 */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
export const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1]

export const DUR = {
  fast: 0.45,
  base: 0.9,
  slow: 1.3,
  cinematic: 1.8,
} as const

export const STAGGER = {
  words: 0.045,
  items: 0.11,
  letters: 0.06,
} as const

export const SPRING = {
  soft: { type: 'spring', stiffness: 60, damping: 18, mass: 1 },
  gentle: { type: 'spring', stiffness: 90, damping: 22, mass: 0.8 },
  snappy: { type: 'spring', stiffness: 220, damping: 24, mass: 0.6 },
} as const

/** Scroll-linked değerler için spring ayarı (useSpring). */
export const SCROLL_SPRING = { stiffness: 80, damping: 24, mass: 0.4 } as const

/** whileInView için ortak viewport ayarı. */
export const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const
