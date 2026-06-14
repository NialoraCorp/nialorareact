import { useEffect, useState } from 'react'
import { useI18n } from '../lib/i18n'

export default function Nav() {
  const { t, lang, setLang } = useI18n()
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 64)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${solid ? 'nav--solid' : ''}`}>
      <div className="nav-inner">
        <a className="nav-mark" href="#hero" aria-label="Nialora">NIALORA</a>
        <nav className="nav-links">
          {t.nav.links.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>
        <div className="nav-right">
          <div className="lang-toggle" role="group" aria-label="Dil / Language">
            <button
              className={lang === 'tr' ? 'is-active' : ''}
              onClick={() => setLang('tr')}
              aria-pressed={lang === 'tr'}
            >TR</button>
            <span aria-hidden>/</span>
            <button
              className={lang === 'en' ? 'is-active' : ''}
              onClick={() => setLang('en')}
              aria-pressed={lang === 'en'}
            >EN</button>
          </div>
          <a className="nav-cta" href="#kayit">{t.nav.cta}</a>
        </div>
      </div>
    </header>
  )
}
