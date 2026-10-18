import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { ASSETS } from '@/content/product'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { useSectionTheme } from '@/lib/useNavTheme'
import { SplitText } from '@/components/ui/SplitText'

/** "Bakım rafınıza yakışan ilk diş macunu": markanın üçlü ürün karesi (koni, ön yüz, arka yüz) pembe podyumda. */
export function Lineup() {
  const { t } = useI18n()
  const reduce = useReducedMotion()
  const mobile = useMediaQuery('(max-width: 767px)')
  const ref = useRef<HTMLElement>(null)
  useSectionTheme(ref, 'light')
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-2%', '2%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1.03, 1])

  return (
    <section ref={ref} className="relative overflow-hidden bg-[linear-gradient(180deg,#f7e3e8_0%,#f1d2d9_100%)]">
      <div className="flex flex-col md:min-h-[100svh] md:flex-row md:items-stretch">
        <div className="order-2 flex flex-1 flex-col justify-end px-[clamp(20px,5vw,72px)] pb-[clamp(64px,10vh,120px)] pt-10 md:order-1 md:pt-[120px]">
          <SplitText as="h2" text={t.lineup.line} className="statement max-w-[14ch] text-plum" />
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.32em] text-plum/55">{t.lineup.caption}</p>
        </div>
        {/* mobil: üstten uzatılmış kare, ekranın tepesine yapışık, kendi oranında (1200/1660), kırpmasız.
            masaüstü: sütun genişliği ekran yüksekliğine bağlı (en fazla 88svh) → cover kırpması küçük kalır */}
        <div className="relative order-1 w-full overflow-hidden md:order-2 md:w-[min(54vw,88svh)] md:shrink-0 md:pt-[64px]">
          <div className="relative aspect-[1200/1660] w-full md:aspect-auto md:h-[calc(100svh-64px)]">
            <motion.img
              src={mobile ? ASSETS.lineupMobile : ASSETS.lineup}
              alt={t.lineup.alt}
              loading="lazy"
              width={1200}
              height={mobile ? 1660 : 1400}
              style={reduce || mobile ? undefined : { y, scale }}
              className="absolute inset-0 size-full object-cover object-[50%_25%] md:[mask-image:linear-gradient(90deg,transparent,black_16%)]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
