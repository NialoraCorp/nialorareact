import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

export type Lang = 'tr' | 'en'

const STORAGE_KEY = 'nialora-lang'

/** Cihaz dili Türkçe ise 'tr', değilse 'en'. Kayıtlı tercih varsa o önceliklidir. */
export function detectLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'tr' || stored === 'en') return stored
  } catch { /* localStorage erişilemezse yoksay */ }
  if (typeof navigator === 'undefined') return 'en'
  const primary = (navigator.languages && navigator.languages[0]) || navigator.language || 'en'
  return primary.toLowerCase().startsWith('tr') ? 'tr' : 'en'
}

/* ───────────────────────── Sözlük (TR) ───────────────────────── */
const tr = {
  meta: {
    title: "Nialora - Niacinamide'li Beyazlatıcı Premium Diş Macunu",
    description: 'Nialora, niacinamide ile güçlendirilmiş premium beyazlatıcı diş macunu. Mineyi korur, dişleri nazikçe beyazlatır ve uzun süren tazelik sunar. SLS ve paraben içermez.',
  },
  loader: { eyebrow: 'PREMİUM DİŞ BAKIMI' },
  nav: {
    links: [
      { href: '#felsefe', label: 'Felsefe' },
      { href: '#formul', label: 'Formül' },
      { href: '#icerik', label: 'İçerik' },
      { href: '#rituel', label: 'Ritüel' },
    ],
    cta: 'Davet İste',
  },
  hero: {
    phrases: [
      { eyebrow: 'İMZA FORMÜL', t: 'Pırıltı, artık bakımın bir parçası.' },
      { eyebrow: 'YILDIZ İÇERİK', t: 'Niacinamide ile güçlendirildi.' },
      { eyebrow: 'SONUÇ', t: 'Beyazlatır · Korur · Parlatır.' },
    ],
    cue: 'KAYDIRIN',
    alt: 'Nialora beyazlatıcı premium diş macunu, niacinamide ile',
    h1: 'Nialora Beyazlatıcı Premium Diş Macunu, Niacinamide ile Güçlendirilmiş',
  },
  manifesto: {
    eyebrow: 'Felsefe',
    h: { pre: 'Bakım bir ayrıcalıktır. ', em: 'Her sabah, her gece', post: ' tekrarlanan sessiz bir tören.' },
    lead: 'Nialora, gündelik diş bakımını zamansız bir lüks ritüele dönüştürür. İnce işçilik, saf içerik ve ölçülü zarafet, pırıltısı yalnızca tüpünde değil gülümsemenizde de saklı.',
  },
  showcase: {
    eyebrow: 'İmza Formül',
    title: 'İmza Formül',
    lead: 'Üç vaat, tek bir tüpte buluşuyor. Gösterişten değil, içerikten gelen bir lüks.',
    alt: 'Nialora tüpü, spot ışığı altında',
    pillars: [
      { k: '01', t: 'Niacinamide Bakımı', d: 'Diş etini yatıştıran, mineye besleyici bir dokunuş bırakan yıldız içerik.' },
      { k: '02', t: 'Nazik Beyazlatma', d: 'Aşındırmadan, gün gün aydınlanan doğal ve zarif bir parlaklık.' },
      { k: '03', t: 'Mine & Tazelik', d: 'Pürüzsüz, güçlü bir yüzey ve saatler boyu süren ferah bir nefes.' },
    ],
  },
  science: {
    eyebrow: 'Ana İçerik',
    h: { pre: 'Yıldız içerik: ', em: 'Niacinamide', post: '' },
    lead: 'Cilt bakımının sevilen B3 vitamini, şimdi ağız bakımında. Niacinamide diş etini yatıştırır, mineyi destekler ve gülümsemenize sağlıklı bir aydınlık katar, saf su mavisi ve gül tonlarıyla harmanlanmış imza dokumuzun içinde.',
    alt: 'Nialora tüpü, içinde parıldayan takımyıldız dokusu',
    stats: [
      { n: 14, pre: '', suf: ' GÜN', label: 'gözle görülür parlaklık*' },
      { n: 0, pre: '%', suf: '', label: 'SLS · Paraben · Mikroplastik' },
      { n: 24, pre: '', suf: ' SAAT', label: 'uzun süren tazelik' },
    ],
    footnote: '*Düzenli kullanımda marka değerlendirmesidir; tıbbi bir iddia içermez.',
  },
  ritual: {
    eyebrow: 'Ritüel',
    h: { pre: 'Üç anlık bir ', em: 'tören', post: '.' },
    steps: [
      { k: '01', t: 'Sabah', d: 'Güne pırıltıyla başlayın. Mineyi uyandıran nazik bir aydınlık.' },
      { k: '02', t: 'Gün', d: 'Kısa bir tazeleme. Çantanızda taşıyabileceğiniz zarif bir mola.' },
      { k: '03', t: 'Gece', d: 'Günü kapatan besleyici ritüel; niacinamide gece boyu çalışsın.' },
    ],
  },
  marquee: ['NIACINAMIDE', 'NAZİK BEYAZLATMA', 'MİNE KORUMA', 'SLS YOK', 'İMZA FORMÜL'],
  coming: {
    eyebrow: 'Özel Ön Kayıt',
    h: 'Çok Yakında.',
    lead: 'Lansmana özel davet listesine katılın. İlk koleksiyon sınırlı sayıda üretiliyor.',
    placeholder: 'E-posta adresiniz',
    button: 'Davet İste',
    done: 'Teşekkürler, listedesiniz. Lansman haberini ilk siz alacaksınız.',
  },
  footer: {
    tag: 'Premium diş bakımı.',
    links: [
      { href: '#felsefe', label: 'Felsefe' },
      { href: '#formul', label: 'Formül' },
      { href: '#icerik', label: 'İçerik' },
      { href: '#rituel', label: 'Ritüel' },
      { href: '#kayit', label: 'Kayıt' },
    ],
    rights: '© 2026 Nialora. Tüm hakları saklıdır.',
    note: 'Özenle tasarlandı.',
  },
}

export type Dict = typeof tr

/* ───────────────────────── Dictionary (EN) ───────────────────────── */
const en: Dict = {
  meta: {
    title: 'Nialora - Niacinamide Whitening Premium Toothpaste',
    description: 'Nialora is a premium whitening toothpaste powered by niacinamide. It protects enamel, gently whitens teeth and delivers long-lasting freshness. SLS and paraben free.',
  },
  loader: { eyebrow: 'PREMIUM DENTAL CARE' },
  nav: {
    links: [
      { href: '#felsefe', label: 'Philosophy' },
      { href: '#formul', label: 'Formula' },
      { href: '#icerik', label: 'Ingredient' },
      { href: '#rituel', label: 'Ritual' },
    ],
    cta: 'Request Invite',
  },
  hero: {
    phrases: [
      { eyebrow: 'SIGNATURE FORMULA', t: 'Shine is now part of your care.' },
      { eyebrow: 'STAR INGREDIENT', t: 'Powered by niacinamide.' },
      { eyebrow: 'THE RESULT', t: 'Whitens · Protects · Brightens.' },
    ],
    cue: 'SCROLL',
    alt: 'Nialora whitening premium toothpaste, with niacinamide',
    h1: 'Nialora Whitening Premium Toothpaste, Powered by Niacinamide',
  },
  manifesto: {
    eyebrow: 'Philosophy',
    h: { pre: 'Care is a privilege. A silent ritual repeated ', em: 'every morning, every night', post: '.' },
    lead: 'Nialora turns everyday dental care into a timeless luxury ritual. Fine craftsmanship, pure ingredients and measured elegance, its shine lives not only in the tube but in your smile.',
  },
  showcase: {
    eyebrow: 'Signature Formula',
    title: 'The Signature Formula',
    lead: 'Three promises, in a single tube. A luxury born of substance, not show.',
    alt: 'Nialora tube under a spotlight',
    pillars: [
      { k: '01', t: 'Niacinamide Care', d: 'The star ingredient that soothes the gums and leaves a nourishing touch on enamel.' },
      { k: '02', t: 'Gentle Whitening', d: 'A natural, refined brightness that grows day by day, without abrasion.' },
      { k: '03', t: 'Enamel & Freshness', d: 'A smooth, strong surface and hours of lasting fresh breath.' },
    ],
  },
  science: {
    eyebrow: 'Key Ingredient',
    h: { pre: 'The star ingredient: ', em: 'Niacinamide', post: '' },
    lead: "Skincare's beloved vitamin B3, now in oral care. Niacinamide soothes the gums, supports enamel and adds a healthy radiance to your smile, within our signature texture blended in pure water-blue and rose tones.",
    alt: 'Nialora tube with a sparkling constellation texture inside',
    stats: [
      { n: 14, pre: '', suf: ' DAYS', label: 'visible radiance*' },
      { n: 0, pre: '', suf: '%', label: 'SLS · Parabens · Microplastics' },
      { n: 24, pre: '', suf: ' HOURS', label: 'long-lasting freshness' },
    ],
    footnote: '*A brand assessment with regular use; not a medical claim.',
  },
  ritual: {
    eyebrow: 'Ritual',
    h: { pre: 'A three-moment ', em: 'ceremony', post: '.' },
    steps: [
      { k: '01', t: 'Morning', d: 'Begin the day with a shine. A gentle brightness that wakes the enamel.' },
      { k: '02', t: 'Midday', d: 'A quick refresh. An elegant pause to carry in your bag.' },
      { k: '03', t: 'Night', d: 'A nourishing ritual to close the day; let niacinamide work overnight.' },
    ],
  },
  marquee: ['NIACINAMIDE', 'GENTLE WHITENING', 'ENAMEL CARE', 'NO SLS', 'SIGNATURE FORMULA'],
  coming: {
    eyebrow: 'Early Access',
    h: 'Coming Soon.',
    lead: 'Join the exclusive launch invite list. The first collection is made in limited numbers.',
    placeholder: 'Your email address',
    button: 'Request Invite',
    done: "Thank you, you're on the list. You'll be the first to hear about the launch.",
  },
  footer: {
    tag: 'Premium dental care.',
    links: [
      { href: '#felsefe', label: 'Philosophy' },
      { href: '#formul', label: 'Formula' },
      { href: '#icerik', label: 'Ingredient' },
      { href: '#rituel', label: 'Ritual' },
      { href: '#kayit', label: 'Register' },
    ],
    rights: '© 2026 Nialora. All rights reserved.',
    note: 'Designed with care.',
  },
}

export const translations: Record<Lang, Dict> = { tr, en }

/* ───────────────────────── Context ───────────────────────── */
interface I18nValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: Dict
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang)

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try { localStorage.setItem(STORAGE_KEY, l) } catch { /* yoksay */ }
  }, [])

  useEffect(() => {
    const d = translations[lang]
    document.documentElement.lang = lang
    document.title = d.meta.title
    const set = (selector: string, content: string) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute('content', content)
    }
    set('meta[name="description"]', d.meta.description)
    set('meta[property="og:title"]', d.meta.title)
    set('meta[property="og:description"]', d.meta.description)
    set('meta[name="twitter:title"]', d.meta.title)
    set('meta[name="twitter:description"]', d.meta.description)
    set('meta[property="og:locale"]', lang === 'tr' ? 'tr_TR' : 'en_US')
  }, [lang])

  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </I18nContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
