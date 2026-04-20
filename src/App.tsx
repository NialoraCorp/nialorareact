import { useState, useEffect, useRef } from 'react'
import './App.css'

const phrases = [
  { tagline: 'ÇOK YAKINDA SİZLERLEYİZ', subtitle: 'Diş sağlığında yeni bir çağ başlıyor.' },
  { tagline: 'COMING SOON',              subtitle: 'A new era in dental care is beginning.' },
  { tagline: 'TRÈS BIENTÔT',             subtitle: 'Une nouvelle ère pour la santé dentaire.' },
  { tagline: 'MUY PRONTO',               subtitle: 'Una nueva era en el cuidado dental.' },
  { tagline: 'PROSSIMAMENTE',            subtitle: 'Una nuova era per la salute dentale.' },
  { tagline: 'BALD VERFÜGBAR',           subtitle: 'Eine neue Ära in der Zahnpflege beginnt.' },
  { tagline: 'EM BREVE',                 subtitle: 'Uma nova era nos cuidados dentários.' },
  { tagline: 'СКОРО',                    subtitle: 'Новая эра в уходе за зубами.' },
]

function App() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const blurRef  = useRef<HTMLVideoElement>(null)
  const mainRef  = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const tryPlay = (v: HTMLVideoElement | null) => {
      if (!v) return
      v.muted = true
      v.setAttribute('muted', '')
      v.setAttribute('playsinline', '')
      v.setAttribute('webkit-playsinline', '')
      v.load()
      v.play().catch(() => {})
    }
    tryPlay(blurRef.current)
    tryPlay(mainRef.current)

    const onVisible = () => {
      if (!document.hidden) {
        tryPlay(blurRef.current)
        tryPlay(mainRef.current)
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    document.addEventListener('touchstart', () => {
      tryPlay(blurRef.current)
      tryPlay(mainRef.current)
    }, { once: true })

    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex(i => (i + 1) % phrases.length)
        setVisible(true)
      }, 500)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="page">
      {/* Yanlar için bulanık arka plan */}
      <video ref={blurRef}  className="bg-blur" src="/bg-new.mp4" autoPlay loop muted playsInline />
      {/* Ortalanmış ana video */}
      <video ref={mainRef}  className="bg-main" src="/bg-new.mp4" autoPlay loop muted playsInline />

      <div className="content">
        <h1 className={`tagline ${visible ? 'visible' : 'hidden'}`}>
          {phrases[index].tagline}
        </h1>
        <p className={`subtitle ${visible ? 'visible' : 'hidden'}`}>
          {phrases[index].subtitle}
        </p>
      </div>
    </div>
  )
}

export default App
