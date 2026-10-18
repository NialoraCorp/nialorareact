import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { Volume2, VolumeX, Pause, Play } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { useI18n } from '@/lib/i18n'
import { ASSETS } from '@/content/product'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { useSectionTheme } from '@/lib/useNavTheme'
import { SplitText } from '@/components/ui/SplitText'

const glassBtn =
  'grid size-12 place-items-center rounded-full border border-ivory/40 bg-ivory/10 text-ivory backdrop-blur-sm transition-colors duration-300 hover:bg-ivory/25'

/** Tam ekran film (görünümdeyken sessiz oynar) + altında dikey kısa filmler şeridi.
    Mobilde dikey "kurgu" videosu (sessiz), masaüstünde yatay film (sesli, ses düğmesiyle). */
export function Film() {
  const { t } = useI18n()
  const mobile = useMediaQuery('(max-width: 767px)')
  const ref = useRef<HTMLElement>(null)
  const vid = useRef<HTMLVideoElement>(null)
  const inView = useInView(ref, { amount: 0.35 })
  const [muted, setMuted] = useState(true)
  const [paused, setPaused] = useState(false)
  useSectionTheme(ref, 'dark')

  useEffect(() => {
    const v = vid.current
    if (!v) return
    if (inView && !paused) v.play().catch(() => undefined)
    else v.pause()
  }, [inView, paused])

  const toggleMute = () => {
    const v = vid.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  return (
    <section id="film" ref={ref} className="on-dark relative bg-plum text-ivory">
      <div className="relative h-[100svh] overflow-hidden bg-black">
      <video
        key={mobile ? 'm' : 'd'}
        ref={vid}
        src={mobile ? ASSETS.filmMobile : ASSETS.film}
        poster={mobile ? ASSETS.filmMobilePoster : ASSETS.filmPoster}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 size-full object-cover"
        aria-hidden
      />
      <span aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(43,31,42,0.35),rgba(43,31,42,0.05)_40%,rgba(43,31,42,0.55))]" />
      <div className="absolute inset-x-[clamp(20px,5vw,72px)] bottom-[12%]">
        <SplitText as="h2" text={t.film.line} className="statement max-w-[14ch]" />
      </div>
      <div className="absolute bottom-7 right-[clamp(20px,5vw,72px)] flex gap-2">
        <button type="button" onClick={() => setPaused((v) => !v)} aria-label={paused ? t.film.play : t.film.pause} className={glassBtn}>
          {paused ? <Play className="size-4 fill-current" strokeWidth={1} /> : <Pause className="size-4" strokeWidth={1.5} />}
        </button>
        {!mobile && (
          <button type="button" onClick={toggleMute} aria-label={muted ? t.film.unmute : t.film.mute} className={glassBtn}>
            {muted ? <VolumeX className="size-4" strokeWidth={1.5} /> : <Volume2 className="size-4" strokeWidth={1.5} />}
          </button>
        )}
      </div>
      </div>

      <div className="px-[clamp(20px,5vw,72px)] py-[clamp(56px,8vh,96px)]">
        <div className="flex items-end justify-between gap-6 border-t border-ivory/15 pt-6">
          <p className="eyebrow text-gold-light">{t.film.reels}</p>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ivory/45">{t.film.reelsHint}</p>
        </div>
        <div className="no-scrollbar -mx-[clamp(20px,5vw,72px)] mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[clamp(20px,5vw,72px)] pb-4 [justify-content:safe_center]">
          {(mobile ? ASSETS.reels.slice(0, 3) : ASSETS.reels).map((r, i) => (
            <Reel key={r.src} src={r.src} poster={r.poster} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

/** Dikey kısa film: fare üzerine gelince oynar (masaüstü), dokunmatikte görünümdeyken. */
function Reel({ src, poster, index }: { src: string; poster: string; index: number }) {
  const ref = useRef<HTMLVideoElement>(null)
  const inView = useInView(ref, { amount: 0.6 })
  const [hover, setHover] = useState(false)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    const shouldPlay = canHover() ? hover && inView : inView
    if (shouldPlay) v.play().catch(() => undefined)
    else v.pause()
  }, [inView, hover])
  return (
    <Reveal delay={index * 0.08} className="w-[min(70vw,280px)] shrink-0 snap-start">
      <div
        className="group relative aspect-[9/16] overflow-hidden rounded-[1.4rem] border border-ivory/10 bg-plum-soft"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <video ref={ref} src={src} poster={poster} muted playsInline loop preload="none" className="size-full object-cover" aria-hidden />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 grid place-items-center bg-plum/15 opacity-100 transition-opacity duration-500 group-hover:opacity-0 max-md:opacity-0"
        >
          <span className="grid size-12 place-items-center rounded-full border border-ivory/50 bg-ivory/10 text-ivory backdrop-blur-sm">
            <Play className="size-4 fill-current" strokeWidth={1} />
          </span>
        </span>
      </div>
    </Reveal>
  )
}
