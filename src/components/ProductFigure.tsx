import { useParallax } from '../lib/hooks'

interface Props {
  src: string
  alt: string
  /** parallax şiddeti (px) */
  strength?: number
  className?: string
  glow?: string
}

/**
 * Studio karesini koyu zemine "süzülürmüş" gibi yerleştirir:
 * dış katman scroll-parallax, iç katman yavaş float animasyonu,
 * kenarlar radial mask ile zemine karışır.
 */
export default function ProductFigure({
  src,
  alt,
  strength = 46,
  className = '',
  glow = 'rgba(200,162,92,0.30)',
}: Props) {
  const { ref, p } = useParallax<HTMLDivElement>()
  return (
    <div className={`figure ${className}`} ref={ref}>
      <div className="figure-glow" style={{ background: `radial-gradient(closest-side, ${glow}, transparent 72%)` }} />
      <div className="figure-parallax" style={{ transform: `translate3d(0, ${p * -strength}px, 0)` }}>
        <div className="figure-float">
          <img src={src} alt={alt} loading="lazy" />
        </div>
      </div>
    </div>
  )
}
