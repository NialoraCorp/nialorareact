import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { useSectionTheme } from '@/lib/useNavTheme'
import { VIEWPORT } from '@/motion/tokens'
import { fadeUp, stagger } from '@/motion/variants'
import { SplitText } from '@/components/ui/SplitText'
import { Marquee } from '@/components/ui/Marquee'

/** Altın bölüm: tek cümle, dört kısa not, altta akan içerik şeridi. */
export function Niacinamide() {
  const { t } = useI18n()
  const ref = useRef<HTMLElement>(null)
  useSectionTheme(ref, 'light')
  return (
    <section id="niasinamid" ref={ref} className="relative flex min-h-[100svh] flex-col bg-ch-gold text-plum">
      <div className="flex flex-1 flex-col justify-center px-[clamp(20px,5vw,72px)] pb-16 pt-[120px]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-plum/60">{t.niacinamide.tag}</p>
        <SplitText as="h2" text={t.niacinamide.line} className="statement mt-5 max-w-[18ch]" />
        <motion.ul
          variants={stagger(0.2, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-16 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {t.niacinamide.why.map((it, i) => (
            <motion.li key={it.t} variants={fadeUp} className="border-t border-plum/25 pt-4">
              <span className="font-display text-[14px] tracking-[0.2em] text-plum/60">0{i + 1}</span>
              <h3 className="mt-2 text-[15px] font-bold uppercase tracking-[0.06em]">{it.t}</h3>
              <p className="mt-1 text-[14px] leading-[1.6] text-plum/70">{it.d}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
      <div className="border-t border-plum/25 py-5">
        <Marquee
          duration={44}
          items={t.niacinamide.ticker.map((m) => (
            <span className="text-[13px] font-semibold uppercase tracking-[0.22em]">{m}</span>
          ))}
        />
      </div>
    </section>
  )
}
