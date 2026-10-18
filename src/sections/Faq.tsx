import { useRef } from 'react'
import { useI18n } from '@/lib/i18n'
import { PRODUCT } from '@/content/product'
import { useSectionTheme } from '@/lib/useNavTheme'
import { SplitText } from '@/components/ui/SplitText'
import { Reveal } from '@/components/ui/Reveal'
import { Accordion } from '@/components/ui/Accordion'

/** Sıkça sorulanlar: kullanım, uyarılar, saklama, INCI, satış kanalı, üretici. */
export function Faq() {
  const { t } = useI18n()
  const ref = useRef<HTMLElement>(null)
  useSectionTheme(ref, 'light')
  const items = t.faq.items.map((it) => ({
    q: it.q,
    a: it.inci ? (
      <p>{PRODUCT.inci.join(', ')}.</p>
    ) : it.list ? (
      <ul className="list-disc space-y-2 pl-5">
        {it.list.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    ) : (
      <p>{it.a}</p>
    ),
  }))
  return (
    <section id="sss" ref={ref} className="bg-pearl px-[clamp(20px,5vw,72px)] py-[clamp(96px,14vh,180px)]">
      <div className="mx-auto grid max-w-[1200px] gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <SplitText as="h2" text={t.faq.title} className="statement-sm text-plum" />
        <Reveal delay={0.1}>
          <Accordion items={items} defaultOpen={null} />
        </Reveal>
      </div>
    </section>
  )
}
