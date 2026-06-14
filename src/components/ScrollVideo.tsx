import { useCallback, useEffect, useRef, useState } from 'react'
import { useI18n } from '../lib/i18n'

interface Props {
  images: React.MutableRefObject<HTMLImageElement[]>
  /** Yeniden çizimi tetiklemek için yüklenen kare sayısı. */
  ready: number
  /** Pin yüksekliği (vh). Ne kadar uzun, o kadar yavaş scrub. */
  pinVh?: number
}

// başlıkların scroll ilerlemesindeki konumları (dilden bağımsız)
const AT = [0.12, 0.5, 0.88]

const bell = (p: number, at: number, w = 0.22) =>
  Math.max(0, Math.min(1, 1 - Math.abs(p - at) / w))

export default function ScrollVideo({ images, ready, pinVh = 440 }: Props) {
  const { t } = useI18n()
  const wrapRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLCanvasElement>(null)
  const bgRef = useRef<HTMLCanvasElement>(null)
  const progRef = useRef(0)               // çizim için en güncel ilerleme (0..1)
  const rafRef = useRef(0)
  const drawRef = useRef<() => boolean>(() => false) // güncel çizim fn'i
  const [p, setP] = useState(0)           // overlay için (React state)
  const [pin, setPin] = useState(pinVh)

  // tek bir rAF'te çizim planla
  const requestDraw = useCallback(() => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0
      drawRef.current()
    })
  }, [])

  // mobilde scrub mesafesini kısalt
  useEffect(() => {
    const calc = () => setPin(window.innerWidth < 760 ? Math.round(pinVh * 0.78) : pinVh)
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [pinVh])

  // --- Canvas çizim kurulumu ---
  useEffect(() => {
    const main = mainRef.current
    const bg = bgRef.current
    if (!main || !bg) return
    const mctx = main.getContext('2d')
    const bctx = bg.getContext('2d')
    if (!mctx || !bctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const size = () => {
      for (const c of [main, bg]) {
        c.width = Math.round(c.clientWidth * dpr)
        c.height = Math.round(c.clientHeight * dpr)
      }
    }

    const ok = (im?: HTMLImageElement) => !!im && im.complete && im.naturalWidth > 0

    const pick = (idx: number): HTMLImageElement | null => {
      const imgs = images.current
      if (!imgs || !imgs.length) return null
      if (ok(imgs[idx])) return imgs[idx]
      for (let d = 1; d < imgs.length; d++) {
        if (ok(imgs[idx - d])) return imgs[idx - d]
        if (ok(imgs[idx + d])) return imgs[idx + d]
      }
      return null
    }

    const paint = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, mode: 'cover' | 'contain') => {
      const cw = ctx.canvas.width, ch = ctx.canvas.height
      const iw = img.naturalWidth, ih = img.naturalHeight
      const scale = mode === 'cover' ? Math.max(cw / iw, ch / ih) : Math.min(cw / iw, ch / ih)
      const dw = iw * scale, dh = ih * scale
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
    }

    // gerçekten çizdiyse true döner
    const render = (): boolean => {
      const imgs = images.current
      const n = imgs?.length ?? 0
      if (!n) return false
      const idx = Math.max(0, Math.min(n - 1, Math.round(progRef.current * (n - 1))))
      const img = pick(idx)
      if (!img) return false
      paint(mctx, img, 'contain')
      paint(bctx, img, 'cover')
      return true
    }

    drawRef.current = render
    size()

    const onResize = () => { size(); requestDraw() }
    window.addEventListener('resize', onResize)

    // Isınma döngüsü: ilk kare başarıyla çizilene dek dene
    // (önyükleme asenkron olduğu için effect sırasından bağımsız çalışır)
    let warm = 0
    let warmId = 0
    const warmLoop = () => {
      const drew = render()
      warm += 1
      if (!drew && warm < 300) warmId = requestAnimationFrame(warmLoop)
    }
    warmId = requestAnimationFrame(warmLoop)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(warmId)
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0 }
    }
  }, [images, requestDraw])

  // yeni kareler yüklendikçe tazele
  useEffect(() => { requestDraw() }, [ready, requestDraw])

  // --- Scroll → ilerleme ---
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    let raf = 0
    const compute = () => {
      raf = 0
      const vh = window.innerHeight
      const total = wrap.offsetHeight - vh
      const top = wrap.getBoundingClientRect().top
      const next = total > 0 ? Math.max(0, Math.min(1, -top / total)) : 0
      progRef.current = next
      requestDraw()
      setP((prev) => (Math.abs(prev - next) > 0.002 ? next : prev))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(compute) }
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [requestDraw])

  const cueOpacity = Math.max(0, 1 - p / 0.03)
  // en üstte yalnızca "KAYDIRIN" görünsün; scroll başlayınca başlıklar devralsın
  const intro = Math.min(1, Math.max(0, (p - 0.035) / 0.06))

  return (
    <div className="sv-wrap" ref={wrapRef} style={{ height: `${pin}vh` }} id="hero">
      <div className="sv-stage">
        <canvas ref={bgRef} className="sv-bg" aria-hidden />
        <canvas ref={mainRef} className="sv-main" role="img" aria-label={t.hero.alt} />
        <div className="sv-vignette" aria-hidden />

        {/* Evrilen başlıklar */}
        <div className="sv-copy" aria-hidden>
          {t.hero.phrases.map((ph, i) => {
            const o = bell(p, AT[i]) * intro
            return (
              <div className="sv-phrase" key={i} style={{ opacity: o, transform: `translateY(${(1 - o) * 12}px)` }}>
                <span className="sv-eyebrow">{ph.eyebrow}</span>
                <span className="sv-line">{ph.t}</span>
              </div>
            )
          })}
        </div>

        {/* Scroll ipucu */}
        <div className="sv-cue" style={{ opacity: cueOpacity }} aria-hidden>
          <span>{t.hero.cue}</span>
          <i className="sv-cue-line" />
        </div>

        {/* İlerleme göstergesi */}
        <div className="sv-progress" aria-hidden>
          <i style={{ height: `${p * 100}%` }} />
        </div>
      </div>
    </div>
  )
}
