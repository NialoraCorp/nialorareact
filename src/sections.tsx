import { useState } from 'react'
import Reveal from './components/Reveal'
import ProductFigure from './components/ProductFigure'
import CountUp from './components/CountUp'
import { useI18n } from './lib/i18n'

/* ───────────────────────── Felsefe / Manifesto ───────────────────────── */
export function Manifesto() {
  const { t } = useI18n()
  const { h } = t.manifesto
  return (
    <section id="felsefe" className="sec sec--cream">
      <div className="wrap manifesto">
        <Reveal as="span" className="eyebrow eyebrow--dark" from="fade">
          {t.manifesto.eyebrow}
        </Reveal>
        <Reveal as="h2" className="display manifesto-h" delay={90}>
          {h.pre}<em>{h.em}</em>{h.post}
        </Reveal>
        <Reveal as="p" className="lead lead--dark" delay={170}>
          {t.manifesto.lead}
        </Reveal>
        <Reveal className="hairline hairline--dark" delay={240}>
          <span />
        </Reveal>
      </div>
    </section>
  )
}

/* ───────────────────────── İmza Formül / Showcase ───────────────────────── */
export function Showcase() {
  const { t } = useI18n()
  return (
    <section id="formul" className="sec sec--ink">
      <div className="wrap showcase">
        <div className="showcase-media">
          <ProductFigure src="/product-hero.jpg" alt={t.showcase.alt} glow="rgba(236,196,200,0.34)" />
        </div>
        <div className="showcase-body">
          <Reveal as="span" className="eyebrow" from="left">{t.showcase.eyebrow}</Reveal>
          <Reveal as="h2" className="display" delay={80}>{t.showcase.title}</Reveal>
          <Reveal as="p" className="lead" delay={150}>{t.showcase.lead}</Reveal>
          <ul className="pillars">
            {t.showcase.pillars.map((p, i) => (
              <Reveal as="li" key={p.k} delay={120 + i * 110} from="up">
                <span className="pillar-k">{p.k}</span>
                <div>
                  <h3>{p.t}</h3>
                  <p>{p.d}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── İçerik / Science ───────────────────────── */
export function Science() {
  const { t } = useI18n()
  const { h } = t.science
  return (
    <section id="icerik" className="sec sec--deep">
      <Sparkles />
      <div className="wrap science">
        <div className="science-body">
          <Reveal as="span" className="eyebrow" from="left">{t.science.eyebrow}</Reveal>
          <Reveal as="h2" className="display" delay={80}>
            {h.pre}<em>{h.em}</em>{h.post}
          </Reveal>
          <Reveal as="p" className="lead" delay={150}>{t.science.lead}</Reveal>
          <Reveal className="stats" delay={120}>
            {t.science.stats.map((s) => (
              <div className="stat" key={s.label}>
                <span className="stat-n">
                  {s.pre}<CountUp to={s.n} />{s.suf}
                </span>
                <span className="stat-l">{s.label}</span>
              </div>
            ))}
          </Reveal>
          <Reveal as="p" className="footnote" delay={160}>{t.science.footnote}</Reveal>
        </div>
        <div className="science-media">
          <ProductFigure
            src="/product-sparkle.jpg"
            alt={t.science.alt}
            glow="rgba(120,200,210,0.32)"
            strength={60}
          />
        </div>
      </div>
    </section>
  )
}

function Sparkles() {
  // dağınık, yavaşça parlayıp sönen yıldızcıklar
  const dots = [
    { l: '12%', t: '22%', d: 0 }, { l: '83%', t: '18%', d: 1.1 },
    { l: '68%', t: '40%', d: 2.0 }, { l: '26%', t: '62%', d: 0.6 },
    { l: '90%', t: '70%', d: 1.6 }, { l: '46%', t: '80%', d: 2.4 },
    { l: '8%', t: '78%', d: 1.3 }, { l: '58%', t: '12%', d: 0.3 },
  ]
  return (
    <div className="sparkles" aria-hidden>
      {dots.map((d, i) => (
        <i key={i} style={{ left: d.l, top: d.t, animationDelay: `${d.d}s` }} />
      ))}
    </div>
  )
}

/* ───────────────────────── Ritüel ───────────────────────── */
export function Ritual() {
  const { t } = useI18n()
  const { h } = t.ritual
  return (
    <section id="rituel" className="sec sec--blush">
      <div className="wrap">
        <Reveal as="span" className="eyebrow eyebrow--dark" from="fade">{t.ritual.eyebrow}</Reveal>
        <Reveal as="h2" className="display manifesto-h" delay={80}>
          {h.pre}<em>{h.em}</em>{h.post}
        </Reveal>
        <div className="steps">
          {t.ritual.steps.map((s, i) => (
            <Reveal as="div" className="step" key={s.k} delay={120 + i * 130} from="up">
              <span className="step-k">{s.k}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Marquee ───────────────────────── */
export function Marquee() {
  const { t } = useI18n()
  const row = [...t.marquee, ...t.marquee]
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee-track">
        {row.map((w, i) => (
          <span key={i}>{w}<i>✦</i></span>
        ))}
      </div>
    </div>
  )
}

/* ───────────────────────── Kayıt ───────────────────────── */
export function ComingSoon() {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <section id="kayit" className="sec sec--ink coming">
      <div className="wrap coming-inner">
        <Reveal as="span" className="eyebrow" from="fade">{t.coming.eyebrow}</Reveal>
        <Reveal as="h2" className="display coming-h" delay={60}>{t.coming.h}</Reveal>
        <Reveal as="p" className="lead" delay={130}>{t.coming.lead}</Reveal>

        {sent ? (
          <Reveal className="signup-done" from="fade">
            <span>✦</span> {t.coming.done}
          </Reveal>
        ) : (
          <form
            className="signup"
            onSubmit={(e) => { e.preventDefault(); if (email.trim()) setSent(true) }}
          >
            <input
              type="email"
              required
              placeholder={t.coming.placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label={t.coming.placeholder}
            />
            <button type="submit">{t.coming.button}</button>
          </form>
        )}
      </div>
    </section>
  )
}

/* ───────────────────────── Footer ───────────────────────── */
export function Footer() {
  const { t } = useI18n()
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <span className="footer-mark">NIALORA</span>
          <span className="footer-tag">{t.footer.tag}</span>
        </div>
        <nav className="footer-links">
          {t.footer.links.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>
        <div className="footer-social">
          <a href="#" aria-label="Instagram">Instagram</a>
          <a href="#" aria-label="TikTok">TikTok</a>
        </div>
      </div>
      <div className="wrap footer-base">
        <span>{t.footer.rights}</span>
        <span>{t.footer.note}</span>
      </div>
    </footer>
  )
}
