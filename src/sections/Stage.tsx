import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { ASSETS } from '@/content/product'
import { INTRO_DURATION, introPending } from '@/lib/intro'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { useSectionTheme } from '@/lib/useNavTheme'
import { materialize } from '@/motion/variants'
import { SplitText } from '@/components/ui/SplitText'
import { Rich } from '@/components/ui/Rich'

/* Dört bölüm, tek sabit sahne (420vh). Scroll ilerledikçe:
   zemin ivory → turkuaz → pembe → altın (opacity çaprazı),
   cümleler yer değiştirir, ön yüz tüp döner / kayar / büyür.
   Yalnızca transform + opacity → compositor üzerinde akıcı. */

/* Tüp her bölümde yazı görünürken SABİT durur, yalnızca geçişlerde hareket eder:
   ch1 0–0.18 · geçiş · ch2 0.30–0.48 · geçiş · ch3 0.56–0.74 · geçiş · ch4 0.84–1
   (metin pencereleri: ch2 0.32–0.45, ch3 0.59–0.70, ch4 0.86+) */
const K = [0, 0.18, 0.3, 0.48, 0.56, 0.74, 0.84, 1]

/* Jeldeki minik yıldızlar: üç derinlik katmanı, scroll ile farklı hızlarda kayar,
   yalnızca ilk bölümde görünür (opacity = c1O). Deterministik dağılım. */
function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
/* Katman başına renk; zemine göre değişir: ivory → turkuaz → pembe → altın */
const STAR_TINTS: [string, string, string][] = [
  ['rgba(201,162,77,0.45)', 'rgba(127,209,214,0.55)', 'rgba(232,168,184,0.6)'],   // ivory
  ['rgba(255,255,255,0.78)', 'rgba(31,95,102,0.32)', 'rgba(243,191,203,0.85)'],   // turkuaz
  ['rgba(255,255,255,0.82)', 'rgba(212,138,158,0.6)', 'rgba(127,209,214,0.75)'],  // pembe
  ['rgba(255,255,255,0.72)', 'rgba(143,109,34,0.35)', 'rgba(43,31,42,0.2)'],      // altın
]
const TINT_KEYS = [0.2, 0.3, 0.45, 0.55, 0.7, 0.8]
const STAR_PATH = 'M12 1 L14.7 8.28 L22.46 8.6 L16.37 13.42 L18.47 20.9 L12 16.6 L5.53 20.9 L7.63 13.42 L1.54 8.6 L9.3 8.28 Z'
const STAR_LAYERS = [0, 1, 2].map((layer) => {
  const r = mulberry32(31 + layer * 7)
  return Array.from({ length: layer === 2 ? 8 : 10 }, () => ({
    x: r() * 100,
    y: r() * 100,
    s: [5, 8, 12][layer] + r() * [4, 5, 8][layer],
    rot: r() * 60 - 30,
  }))
})

function StarField({ progress }: { progress: MotionValue<number> }) {
  // sahne boyunca farklı hızlarda kayar (parallax derinliği)
  const y0 = useTransform(progress, [0, 1], [0, -220])
  const y1 = useTransform(progress, [0, 1], [0, -460])
  const y2 = useTransform(progress, [0, 1], [0, -760])
  const tint = (i: number) => [STAR_TINTS[0][i], STAR_TINTS[1][i], STAR_TINTS[1][i], STAR_TINTS[2][i], STAR_TINTS[2][i], STAR_TINTS[3][i]]
  const c0 = useTransform(progress, TINT_KEYS, tint(0))
  const c1 = useTransform(progress, TINT_KEYS, tint(1))
  const c2 = useTransform(progress, TINT_KEYS, tint(2))
  const ys = [y0, y1, y2]
  const cs = [c0, c1, c2]
  return (
    <div aria-hidden className="pointer-events-none absolute inset-[-40%_0_0_0]">
      {STAR_LAYERS.map((stars, li) => (
        <motion.div key={li} className="absolute inset-0" style={{ y: ys[li], color: cs[li] }}>
          {stars.map((st, i) => (
            <svg
              key={i}
              viewBox="0 0 24 24"
              className="absolute fill-current"
              style={{ left: `${st.x}%`, top: `${st.y}%`, width: st.s, height: st.s, transform: `rotate(${st.rot}deg)` }}
            >
              <path d={STAR_PATH} />
            </svg>
          ))}
        </motion.div>
      ))}
    </div>
  )
}
const DESKTOP = {
  // ch1 sağ (yazı solda) · ch2 sol yarı (yazı sağda) · ch3 sağ yarı (yazı solda) · ch4 yatay, ortada
  x: ['27vw', '27vw', '-25vw', '-25vw', '24vw', '24vw', '2vw', '-4vw'],
  y: ['8vh', '8vh', '-28vh', '-28vh', '32vh', '32vh', '18vh', '20vh'],
  r: [-8, -8, 12, 12, -16, -16, -74, -80],
  s: [1, 1, 1.42, 1.42, 1.44, 1.44, 1.42, 1.46],
}
const MOBILE = {
  x: ['0vw', '0vw', '-6vw', '-6vw', '8vw', '8vw', '0vw', '0vw'],
  y: ['22vh', '22vh', '-22vh', '-22vh', '30vh', '30vh', '8vh', '10vh'],
  r: [-6, -6, 10, 10, -12, -12, -70, -76],
  s: [1, 1, 1.22, 1.22, 1.26, 1.26, 1.3, 1.34],
}

export function Stage() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  // kırılım değişince keyframe'ler için yeniden kur
  return <StageInner key={isMobile ? 'm' : 'd'} mobile={isMobile} />
}

function StageInner({ mobile }: { mobile: boolean }) {
  const { t } = useI18n()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const base = introPending() ? INTRO_DURATION - 0.55 : 0.15

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 26, mass: 0.5 })

  const turqO = useTransform(p, [0.2, 0.3], [0, 1])
  const pinkO = useTransform(p, [0.45, 0.55], [0, 1])
  const goldO = useTransform(p, [0.7, 0.8], [0, 1])

  const c1O = useTransform(p, [0, 0.16, 0.25], [1, 1, 0])
  const c1Y = useTransform(p, [0, 0.25], [0, -70])
  const c2O = useTransform(p, [0.25, 0.32, 0.45, 0.52], [0, 1, 1, 0])
  const c2Y = useTransform(p, [0.25, 0.32, 0.45, 0.52], [50, 0, 0, -50])
  const c3O = useTransform(p, [0.52, 0.59, 0.7, 0.77], [0, 1, 1, 0])
  const c3Y = useTransform(p, [0.52, 0.59, 0.7, 0.77], [50, 0, 0, -50])
  const c4O = useTransform(p, [0.78, 0.86], [0, 1])
  const c4Y = useTransform(p, [0.78, 0.86], [50, 0])

  const kf = mobile ? MOBILE : DESKTOP
  const x = useTransform(p, K, kf.x)
  const y = useTransform(p, K, kf.y)
  const rotate = useTransform(p, K, kf.r)
  const scale = useTransform(p, K, kf.s)

  useSectionTheme(ref, 'light')

  if (reduce) return <StaticStage />

  return (
    <section id="sahne" ref={ref} className="relative h-[420vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-ivory">
        {/* zemin katmanları */}
        <motion.div aria-hidden className="absolute inset-0 bg-ch-turq" style={{ opacity: turqO }} />
        <motion.div aria-hidden className="absolute inset-0 bg-ch-pink" style={{ opacity: pinkO }} />
        <motion.div aria-hidden className="absolute inset-0 bg-ch-gold-deep" style={{ opacity: goldO }} />
        <StarField progress={p} />

        {/* tüp */}
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{ x, y, rotate, scale }}
        >
          <motion.img
            src={ASSETS.tubeCut}
            alt={t.stage.alt}
            width={1066}
            height={1600}
            fetchPriority="high"
            decoding="async"
            variants={materialize}
            custom={base + 0.25}
            initial="hidden"
            animate="show"
            className="h-[62svh] w-auto object-contain md:h-[84svh]"
          />
        </motion.div>

        {/* bölüm 1 — hero */}
        <motion.div
          style={{ opacity: c1O, y: c1Y }}
          className="absolute left-[clamp(20px,5vw,72px)] right-[clamp(20px,5vw,72px)] top-[18%] md:right-auto md:top-1/2 md:w-[54vw] md:max-w-[860px] md:-translate-y-1/2"
        >
          <h1 className="statement text-plum">
            <SplitText as="span" text={t.stage.ch1.line} immediate delay={base + 0.1} />
            <span className="sr-only"> {t.stage.seo}</span>
          </h1>
          <motion.p
            className="mt-6 font-display text-[clamp(20px,2vw,28px)] italic text-plum/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: base + 1.2, duration: 1 }}
          >
            {t.stage.ch1.sub}
          </motion.p>
        </motion.div>

        {/* bölüm 2 — turkuaz */}
        <motion.div
          style={{ opacity: c2O, y: c2Y }}
          className="on-turq absolute bottom-[9%] left-[clamp(20px,5vw,72px)] right-[clamp(20px,5vw,72px)] md:bottom-auto md:left-auto md:top-1/2 md:w-[44vw] md:-translate-y-1/2 md:text-right"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-teal">{t.stage.ch2.tag}</p>
          <h2 className="statement mt-5 text-plum"><Rich text={t.stage.ch2.line} /></h2>
        </motion.div>

        {/* bölüm 3 — pembe */}
        <motion.div
          style={{ opacity: c3O, y: c3Y }}
          className="on-pink absolute left-[clamp(20px,5vw,72px)] right-[clamp(20px,5vw,72px)] top-[16%] md:right-auto md:top-1/2 md:w-[44vw] md:-translate-y-1/2"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-rose-deep">{t.stage.ch3.tag}</p>
          <h2 className="statement mt-5 text-plum"><Rich text={t.stage.ch3.line} /></h2>
        </motion.div>

        {/* bölüm 4 — plum */}
        <motion.div
          style={{ opacity: c4O, y: c4Y }}
          className="on-gold absolute inset-x-[clamp(20px,5vw,72px)] top-[16%] text-center md:top-[12%]"
        >
          <h2 className="statement mx-auto max-w-[22ch] text-plum">{t.stage.ch4.line}</h2>
          <p className="mx-auto mt-6 max-w-[40ch] font-display text-[clamp(22px,2.4vw,34px)] italic text-plum/75">
            <Rich text={t.stage.ch4.sub} />
          </p>
        </motion.div>

        {/* kaydırma ipucu */}
        <motion.div
          style={{ opacity: c1O }}
          className="absolute bottom-7 left-[clamp(20px,5vw,72px)] hidden items-center gap-4 md:flex"
        >
          <motion.span
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: base + 1.6, duration: 1 }}
          >
            <span className="eyebrow text-[10px]">{t.stage.cue}</span>
            <span className="relative h-px w-16 overflow-hidden bg-plum/15">
              <motion.span
                className="absolute inset-y-0 left-0 w-1/2 bg-gold"
                animate={{ x: ['-100%', '220%'] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </span>
          </motion.span>
        </motion.div>
      </div>
    </section>
  )
}

/** Reduced-motion: dört bölüm düz şekilde alt alta. */
function StaticStage() {
  const { t } = useI18n()
  const block = 'flex min-h-[70svh] flex-col justify-center px-[clamp(20px,5vw,72px)] py-24'
  return (
    <section id="sahne">
      <div className={`${block} bg-ivory`}>
        <h1 className="statement max-w-[14ch] text-plum"><Rich text={t.stage.ch1.line} /><span className="sr-only"> {t.stage.seo}</span></h1>
        <img src={ASSETS.tubeCut} alt={t.stage.alt} className="mt-10 h-[50svh] w-auto object-contain" />
      </div>
      <div className={`${block} on-turq bg-ch-turq`}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-teal">{t.stage.ch2.tag}</p>
        <h2 className="statement mt-5 text-plum"><Rich text={t.stage.ch2.line} /></h2>
      </div>
      <div className={`${block} on-pink bg-ch-pink`}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-rose-deep">{t.stage.ch3.tag}</p>
        <h2 className="statement mt-5 text-plum"><Rich text={t.stage.ch3.line} /></h2>
      </div>
      <div className={`${block} on-gold bg-ch-gold-deep text-plum`}>
        <h2 className="statement max-w-[22ch]">{t.stage.ch4.line}</h2>
        <p className="mt-6 font-display text-[28px] italic text-plum/75"><Rich text={t.stage.ch4.sub} /></p>
      </div>
    </section>
  )
}
