import type { Variants } from 'framer-motion'
import { DUR, EASE, STAGGER } from './tokens'

/** Alt elemanları sırayla tetikleyen kapsayıcı. */
export const stagger = (delay = 0, each: number = STAGGER.items): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: each, delayChildren: delay } },
})

/* `custom` = gecikme (sn). Reveal bileşeni custom={delay} geçer. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (d: number = 0) => ({ opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE, delay: d } }),
}

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: (d: number = 0) => ({ opacity: 1, transition: { duration: DUR.slow, ease: EASE, delay: d } }),
}

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  show: (d: number = 0) => ({ opacity: 1, x: 0, transition: { duration: DUR.base, ease: EASE, delay: d } }),
}

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  show: (d: number = 0) => ({ opacity: 1, x: 0, transition: { duration: DUR.base, ease: EASE, delay: d } }),
}

/** Maske içinden yukarı kayan kelime/satır (SplitText). */
export const maskUp: Variants = {
  hidden: { y: '112%' },
  show: { y: '0%', transition: { duration: 1.05, ease: EASE } },
}

/** Ürün görseli: hafif ölçek + blur çözülmesi. */
export const materialize: Variants = {
  hidden: { opacity: 0, scale: 0.94, filter: 'blur(14px)' },
  show: (d: number = 0) => ({
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: DUR.cinematic, ease: EASE, delay: d },
  }),
}

/** Soldan sağa çizilen altın çizgi. */
export const drawLine: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: DUR.slow, ease: EASE } },
}
