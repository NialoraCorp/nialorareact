import { useI18n } from '../lib/i18n'

interface Props {
  progress: number // 0..1
  done: boolean
}

export default function Loader({ progress, done }: Props) {
  const { t } = useI18n()
  const pct = Math.round(progress * 100)
  return (
    <div className={`loader ${done ? 'loader--gone' : ''}`} aria-hidden={done}>
      <div className="loader-inner">
        <span className="loader-eyebrow">{t.loader.eyebrow}</span>
        <h1 className="loader-mark">NIALORA</h1>
        <div className="loader-bar">
          <i style={{ transform: `scaleX(${progress})` }} />
        </div>
        <span className="loader-pct">{pct}%</span>
      </div>
    </div>
  )
}
