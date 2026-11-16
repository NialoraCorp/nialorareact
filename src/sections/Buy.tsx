import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { ASSETS, PRODUCT } from '@/content/product'
import { useSectionTheme } from '@/lib/useNavTheme'
import { VIEWPORT } from '@/motion/tokens'
import { materialize } from '@/motion/variants'
import { SplitText } from '@/components/ui/SplitText'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'

/** Satış: ön yüz tüp metnin sağında (mobilde de), tek CTA (Trendyol), eczane bilgisi metin. */
export function Buy() {
  const { t } = useI18n()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  useSectionTheme(ref, 'light')

  const cta = (
    <>
      <Button href={PRODUCT.trendyolUrl} external variant="primary">{t.buy.trendyol}</Button>
      <p className="mt-6 max-w-[40ch] text-[13px] leading-[1.7] text-mauve">
        {t.buy.pharmacy}{' '}
        <a href="#bayilik" className="whitespace-nowrap border-b border-gold/60 text-gold-deep transition-colors hover:border-gold-deep">
          {t.buy.dealerLink} ↗
        </a>
      </p>
    </>
  )

  return (
    <section
      id="satin-al"
      ref={ref}
      className="relative overflow-hidden bg-ivory px-[clamp(20px,5vw,72px)] pb-[clamp(56px,10vh,140px)] pt-[96px] md:pt-[clamp(128px,18vh,200px)]"
    >
      <div className="mx-auto grid max-w-[1280px] grid-cols-[1.2fr_0.8fr] items-center gap-x-4 gap-y-10 md:grid-cols-[0.92fr_1.08fr] md:gap-6">
        <div className="min-w-0">
          <Reveal as="p" variant="fade" className="eyebrow">{t.buy.product}</Reveal>
          <SplitText as="h2" text={t.buy.line} className="statement mt-5 max-w-[12ch] text-[clamp(22px,6.2vw,88px)] text-plum md:mt-6" />
          <Reveal as="p" delay={0.15} className="mt-5 max-w-[34ch] font-display text-[clamp(18px,2.2vw,30px)] italic leading-[1.3] text-plum/75 md:mt-7">
            {t.buy.sub}
          </Reveal>
          <Reveal delay={0.25} className="mt-10 hidden md:block">{cta}</Reveal>
        </div>

        <motion.figure
          variants={materialize}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="relative -mr-[clamp(20px,5vw,72px)] w-[calc(100%+clamp(20px,5vw,72px))] justify-self-end md:mx-auto md:mr-0 md:w-auto"
        >
          <motion.img
            src={ASSETS.tubeCut}
            alt={t.buy.alt}
            loading="lazy"
            width={1066}
            height={1600}
            className="mx-auto h-auto max-h-[46svh] w-full object-contain object-bottom md:h-[min(84svh,920px)] md:max-h-none md:w-auto"
            animate={reduce ? undefined : { y: [0, -12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span aria-hidden className="absolute inset-x-[22%] bottom-[-1.5%] h-8 rounded-[50%] bg-plum/25 blur-xl" />
        </motion.figure>

        {/* mobil: CTA ve eczane notu tam genişlikte, metin + tüp satırının altında */}
        <Reveal delay={0.2} className="col-span-2 md:hidden">{cta}</Reveal>
      </div>
    </section>
  )
}
