import { useState, useEffect } from 'react'
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
      {/* Desktop */}
      <video className="bg-video" src="/bg.mp4" autoPlay loop muted playsInline />
      {/* Mobile — H.264 baseline + faststart for iOS Safari autoplay */}
      <video className="bg-mobile" src="/bg-mobile.mp4" autoPlay loop muted playsInline />

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
