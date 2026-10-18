import { useRef } from 'react'
import { useI18n } from '@/lib/i18n'
import { PRODUCT } from '@/content/product'
import { useSectionTheme } from '@/lib/useNavTheme'
import { SplitText } from '@/components/ui/SplitText'
import { LangToggle } from '@/components/LangToggle'

export function Footer() {
  const { t } = useI18n()
  const ref = useRef<HTMLElement>(null)
  useSectionTheme(ref, 'dark')
  return (
    <footer ref={ref} className="on-dark relative overflow-hidden bg-plum text-ivory">
      <div className="px-[clamp(20px,5vw,72px)] pb-10 pt-[clamp(110px,16vh,200px)]">
        <SplitText as="p" text={t.footer.line} className="statement max-w-[12ch]" />

        <div className="mt-20 grid gap-10 border-t border-ivory/15 pt-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <a href="#sahne" className="pl-[0.38em] font-display text-[26px] tracking-[0.38em]" aria-label={t.a11y.scrollTop}>
              NIALORA
            </a>
            <p className="mt-3 text-[13px] text-ivory/60">{t.footer.tag}</p>
          </div>
          <nav className="flex flex-col gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory/70" aria-label="Footer">
            {t.nav.links.map((l) => (
              <a key={l.href} href={l.href} className="w-fit transition-colors duration-300 hover:text-gold-light">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory/70">
            <a href={PRODUCT.trendyolUrl} target="_blank" rel="noopener noreferrer" className="w-fit text-gold-light transition-colors hover:text-ivory">
              {t.nav.trendyol} ↗
            </a>
            {t.footer.social.filter((s) => s.href !== '#').map((s) => (
              <a key={s.label} href={s.href} className="w-fit transition-colors duration-300 hover:text-gold-light">
                {s.label}
              </a>
            ))}
            <LangToggle className="mt-2" />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 text-[11px] tracking-[0.05em] text-ivory/45 md:flex-row md:justify-between">
          <span>{t.footer.legal}</span>
          <span>{t.footer.made} {t.footer.note}</span>
        </div>
      </div>
    </footer>
  )
}
