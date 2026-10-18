import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { INTRO_DURATION, introPending, markIntroDone } from '@/lib/intro'
import { maskUp, stagger } from '@/motion/variants'
import { EASE, EASE_IN_OUT, STAGGER } from '@/motion/tokens'

const LETTERS = 'NIALORA'.split('')

/** Oturumda bir kez: harf harf beliren wordmark, altın çizgi, perde yukarı kalkar. */
export function Loader() {
  const { t } = useI18n()
  const [show, setShow] = useState(introPending)

  useEffect(() => {
    if (!show) return
    const id = window.setTimeout(() => {
      setShow(false)
      markIntroDone()
    }, INTRO_DURATION * 1000)
    return () => window.clearTimeout(id)
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[90] grid place-items-center bg-ivory"
          exit={{ y: '-100%', transition: { duration: 1.1, ease: EASE_IN_OUT } }}
          aria-hidden
        >
          <div className="text-center">
            <motion.div
              className="flex justify-center overflow-hidden pb-2 pl-[0.42em] font-display text-[clamp(40px,7vw,88px)] tracking-[0.42em] text-plum"
              variants={stagger(0.25, STAGGER.letters)}
              initial="hidden"
              animate="show"
            >
              {LETTERS.map((l, i) => (
                <motion.span key={i} variants={maskUp} className="inline-block">
                  {l}
                </motion.span>
              ))}
            </motion.div>
            <motion.span
              className="mx-auto mt-5 block h-px w-32"
              style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.9, duration: 1, ease: EASE }}
            />
            <motion.p
              className="eyebrow mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.15, duration: 0.8 }}
            >
              {t.loader.eyebrow}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
