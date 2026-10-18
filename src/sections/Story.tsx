import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { ASSETS } from '@/content/product'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { useSectionTheme } from '@/lib/useNavTheme'
import { SplitText } from '@/components/ui/SplitText'
import { Reveal } from '@/components/ui/Reveal'

/* Hikaye: editoryal yayılım — solda "Her sabah ışıltılı bir ritüel" karesi (parallax),
   sağda üç kısa cümle + imza. */

export function Story() {
  const { t } = useI18n()
  const reduce = useReducedMotion()
  const mobile = useMediaQuery('(max-width: 767px)')
  const ref = useRef<HTMLElement>(null)
  useSectionTheme(ref, 'light')
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-3%', '3%'])

  return (
    <section id="hikaye" ref={ref} className="relative overflow-hidden bg-[#f6e1e6]">
      <div className="grid md:min-h-[100svh] md:grid-cols-[1.02fr_0.98fr]">
        {/* mobil: görselin kendi oranında, kırpmasız; masaüstü: sütun boyu, hafif parallax */}
        <div className="relative aspect-[1200/1470] w-full overflow-hidden md:aspect-auto md:h-auto">
          <motion.img
            src={ASSETS.ritual}
            alt={t.story.alt}
            loading="lazy"
            width={1200}
            height={1470}
            style={reduce || mobile ? undefined : { y, scale: 1.07 }}
            className="absolute inset-0 size-full object-cover object-[50%_45%]"
          />
        </div>
        <div className="flex flex-col justify-center px-[clamp(20px,5vw,72px)] py-[clamp(64px,10vh,120px)] md:pt-[120px]">
          <Reveal as="p" variant="fade" className="eyebrow">{t.story.eyebrow}</Reveal>
          <div className="mt-8 space-y-6">
            {t.story.lines.map((line, i) => (
              <SplitText key={line} as="p" text={line} delay={i * 0.18} className="statement-sm max-w-[22ch] text-plum" />
            ))}
          </div>
          <Reveal as="p" delay={0.5} className="mt-10 max-w-[30ch] font-display text-[clamp(24px,2.4vw,36px)] italic leading-[1.2] text-gold-deep">
            {t.story.signature}
          </Reveal>
        </div>
      </div>

    </section>
  )
}
