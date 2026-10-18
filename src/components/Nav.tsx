import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'
import { PRODUCT } from '@/content/product'
import { INTRO_DURATION, introPending } from '@/lib/intro'
import { useNavTheme } from '@/lib/useNavTheme'
import { EASE, EASE_IN_OUT, STAGGER } from '@/motion/tokens'
import { maskUp, stagger } from '@/motion/variants'
import { LangToggle } from './LangToggle'

/**
 * Marvis tarzı minimal üst bar: wordmark, TR/EN, küçük "Satın al", yuvarlak MENÜ.
 * Zemin yok; rengi altındaki bölümün temasına göre (light/dark) değişir.
 */
export function Nav() {
  const { t } = useI18n()
  const theme = useNavTheme()
  const [open, setOpen] = useState(false)
  const delay = introPending() ? INTRO_DURATION - 0.3 : 0.2

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <motion.header
        className={cn('fixed inset-x-0 top-0 z-[70] transition-colors duration-500', theme === 'dark' ? 'text-ivory' : 'text-plum')}
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay, duration: 1, ease: EASE }}
      >
        <div className="flex h-[84px] items-center justify-between px-[clamp(20px,5vw,72px)]">
          <a href="#sahne" className="pl-[0.38em] font-display text-[22px] tracking-[0.38em]" aria-label="NIALORA">
            NIALORA
          </a>
          <div className="flex items-center gap-6">
            <LangToggle className="hidden sm:flex" />
            <a href="#satin-al" className="hidden text-[11px] font-semibold uppercase tracking-[0.22em] opacity-80 transition-opacity hover:opacity-100 sm:block">
              {t.nav.buy}
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t.a11y.menu}
              aria-expanded={open}
              className="grid size-[58px] place-items-center rounded-full border border-current text-[10px] font-semibold uppercase tracking-[0.18em] transition-[background-color,color] duration-300 hover:bg-plum hover:text-ivory"
            >
              {t.nav.menu}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            className="fixed inset-0 z-[80] flex flex-col bg-plum text-ivory"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.8, ease: EASE_IN_OUT }}
            data-lenis-prevent
          >
            <div className="flex h-[84px] items-center justify-between px-[clamp(20px,5vw,72px)]">
              <span className="pl-[0.38em] font-display text-[22px] tracking-[0.38em]">NIALORA</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.a11y.close}
                className="grid size-[58px] place-items-center rounded-full border border-ivory/60 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-ivory hover:text-plum"
              >
                {t.nav.close}
              </button>
            </div>

            <motion.nav
              className="flex flex-1 flex-col justify-center gap-1 px-[clamp(20px,5vw,72px)]"
              variants={stagger(0.35, STAGGER.letters)}
              initial="hidden"
              animate="show"
              aria-label="Site"
            >
              {t.nav.links.map((l, i) => (
                <span key={l.href} className="block overflow-hidden">
                  <motion.a
                    variants={maskUp}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-baseline gap-5 font-sans text-[clamp(34px,6.4vw,84px)] font-bold uppercase leading-[1.1] tracking-[-0.015em] transition-colors duration-300 hover:text-gold-light"
                  >
                    <span className="font-display text-[0.32em] font-normal tracking-[0.2em] text-gold-light/70">0{i + 1}</span>
                    <span className="transition-transform duration-500 ease-lux group-hover:translate-x-2">{l.label}</span>
                  </motion.a>
                </span>
              ))}
            </motion.nav>

            <motion.div
              className="flex flex-col gap-4 border-t border-ivory/15 px-[clamp(20px,5vw,72px)] py-6 text-[11px] font-semibold uppercase tracking-[0.22em] sm:flex-row sm:items-center sm:justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <a href={PRODUCT.trendyolUrl} target="_blank" rel="noopener noreferrer" className="text-gold-light hover:text-ivory">
                {t.nav.trendyol} ↗
              </a>
              <div className="flex items-center gap-6">
                <LangToggle />
                <span className="opacity-50">{t.footer.tag}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
