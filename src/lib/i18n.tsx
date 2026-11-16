import { Fragment, createContext, useCallback, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from 'react'

export type Lang = 'tr' | 'en'

export interface Stat { v: number; pre?: string; suf?: string; decimals?: number; label: string }
export interface FaqItem { q: string; a?: string; list?: string[]; inci?: boolean }

const STORAGE_KEY = 'nialora-lang'

/** Kayıtlı tercih varsa o; yoksa cihaz dili Türkçe ise 'tr', değilse 'en'. */
function detectLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'tr' || stored === 'en') return stored
  } catch { /* localStorage kapalıysa yoksay */ }
  if (typeof navigator === 'undefined') return 'en'
  const primary = (navigator.languages && navigator.languages[0]) || navigator.language || 'en'
  return primary.toLowerCase().startsWith('tr') ? 'tr' : 'en'
}

/* ═══════════════════════════ Sözlük (TR) ═══════════════════════════
   İddia kuralları: "beyazlatıcı", "çürüğe karşı", "klinik test", "premium
   formül", "SLS içermez", "alkol içermez", "onaylı", rakip adı, "mucize",
   "en iyi" KULLANILMAZ. (Ürün Bilgi Dokümanı, Ekim 2026)
   "*kelime*" → italik serif vurgu.
══════════════════════════════════════════════════════════════════════ */
const tr = {
  meta: {
    title: 'NIALORA — Niasinamid İçeren Diş Macunu · 100 g',
    description:
      'NIALORA, niasinamid içeren çift fazlı diş macunu. Turkuaz ve pembe iki faz, florürlü formül, nane ferahlığı ve ışıltılı jel görünümü. 100 g. Eczanelerde ve Trendyol\'da.',
  },
  a11y: { skip: 'İçeriğe atla', lang: 'Dil', menu: 'Menü', close: 'Kapat', scrollTop: 'Başa dön' },
  loader: { eyebrow: 'Niasinamid içeren diş macunu' },
  nav: {
    menu: 'Menü',
    close: 'Kapat',
    buy: 'Satın Al',
    links: [
      { href: '#sahne', label: 'Başlangıç' },
      { href: '#hikaye', label: 'Hikaye' },
      { href: '#niasinamid', label: 'Niasinamid' },
      { href: '#film', label: 'Film' },
      { href: '#satin-al', label: 'Satın Al' },
      { href: '#bayilik', label: 'Eczaneler' },
      { href: '#sss', label: 'Sıkça Sorulanlar' },
    ],
    trendyol: 'Trendyol\'da Satın Al',
  },
  stage: {
    seo: 'NIALORA niasinamid içeren diş macunu, 100 g.',
    ch1: { line: 'Cildine gösterdiğin özeni *gülüşüne* de göster.', sub: 'Rutininizin unutulan adımı.' },
    ch2: { tag: 'Turkuaz faz', line: 'Güne *ferah* bir başlangıç.' },
    ch3: { tag: 'Pembe faz', line: '*Tatlı* bir kapanış.' },
    ch4: { line: 'İkisi aynı tüpte yaşıyor ama birbirine karışmıyor.', sub: 'Bu konuda bizden daha *disiplinliler.*' },
    cue: 'Kaydırın',
    alt: 'NIALORA niasinamid içeren diş macunu, altın kapaklı pembe-turkuaz tüp',
  },
  lineup: {
    line: 'Bakım rafınıza yakışan *ilk* diş macunu.',
    caption: 'Niasinamid · 100 g',
    alt: 'NIALORA koleksiyonu: koni, ön yüz ve arka yüz, pembe podyumda',
  },
  story: {
    eyebrow: 'Her sabah, ışıltılı bir ritüel',
    alt: 'NIALORA tüpü pembe zeminde inciler arasında',
    lines: [
      'Yıllarca cildimize özen gösterdik.',
      'Gülüşümüz hâlâ sıradan bir tüple idare ediyordu.',
      'Niasinamidi diş macununa taşıdık.',
    ],
    signature: 'Cildine gösterdiğin özeni gülüşüne de göster.',
  },
  niacinamide: {
    tag: 'Niasinamid · %0,5',
    line: 'Cilt bakımından tanıdığınız *B3 vitamini*, şimdi diş macununda.',
    why: [
      { t: 'Niasinamid', d: 'Markanın imza bileşeni.' },
      { t: 'Florürlü', d: 'Günlük ağız bakımı. Nane aromalı.' },
      { t: 'Ferah nefes', d: 'Mentol ve uzun süren serinlik.' },
      { t: 'Temiz dişler', d: 'Temizleyerek daha parlak görünüm.' },
    ],
    ticker: ['%0,5 niasinamid', '%0,22 sodyum florür', 'nane ferahlığı', 'mika & kalay oksit ışıltısı', 'çift fazlı formül', '100 g', 'ilk üretim · sınırlı sayıda'],
  },
  film: {
    line: 'Ferahlığın en *zarif* hali.',
    reels: 'Kısa filmler',
    reelsHint: 'Üzerine gelin, oynasın',
    unmute: 'Sesi aç',
    mute: 'Sesi kapat',
    play: 'Oynat',
    pause: 'Durdur',
  },
  buy: {
    line: 'Seçili eczanelerde ve *Trendyol\'da.*',
    sub: 'İlk üretim, sınırlı sayıda.',
    product: 'NIALORA Niasinamid İçeren Diş Macunu · 100 g · Nane · Florürlü',
    trendyol: 'Trendyol\'da Satın Al',
    pharmacy: 'Eczanelerde tezgah standında. Market rafında ve indirim sitelerinde değil.',
    dealerLink: 'Eczane misiniz? Bayilik başvurusu',
    alt: 'NIALORA tüpünün ön yüzü, altın etiket',
  },
  dealer: {
    eyebrow: 'Eczaneler için',
    line: 'Eczanenizde *NIALORA* olsun.',
    lead: 'Bayilik için formu doldurun; ekibimiz tezgah standı, adet ve teslimat detaylarıyla size dönsün.',
    fields: { pharmacy: 'Eczane adı', pharmacist: 'Eczacı adı soyadı', email: 'E-posta', phone: 'Telefon', city: 'Şehir / ilçe', message: 'Talebiniz' },
    placeholders: { pharmacy: 'Örn. Gül Eczanesi', pharmacist: 'Ad Soyad', email: 'ornek@eczane.com', phone: '05xx xxx xx xx', city: 'İstanbul / Kadıköy', message: 'Örn. 15\'li tezgah standı istiyoruz, aylık tahmini adet…' },
    optional: 'isteğe bağlı',
    consent: 'Bilgilerimin bayilik başvurumun değerlendirilmesi için Alvion Sağlık\'a iletilmesini kabul ediyorum.',
    submit: 'Başvuruyu Gönder',
    sending: 'Gönderiliyor…',
    sent: { title: 'Başvurunuz alındı.', text: 'En kısa sürede e-posta ya da telefonla dönüş yapacağız.' },
    error: { title: 'Gönderilemedi.', text: 'Lütfen tekrar deneyin ya da doğrudan e-posta gönderin:' },
    subject: 'NIALORA eczane bayilik başvurusu',
  },
  faq: {
    title: 'Sıkça *sorulanlar.*',
    items: [
      {
        q: 'Nasıl kullanılır?',
        a: 'Dişlerinizi günde en az iki kez, tercihen sabah ve akşam, yaklaşık 2 dakika fırçalayınız. Bezelye büyüklüğünde macun yeterlidir. Fırçaladıktan sonra tükürünüz, yutmayınız.',
      },
      {
        q: 'Uyarılar',
        list: [
          'Sodyum florür içerir.',
          '6 yaş ve altı çocuklarda bezelye büyüklüğünde ve yetişkin gözetiminde kullanılır.',
          'Başka kaynaklardan florür alınıyorsa diş hekimine danışınız.',
          'Gözle temasından kaçınınız; temas halinde bol suyla yıkayınız.',
          'Tahriş oluşursa kullanımı bırakınız.',
          'Formaldehit salıcı madde içerir.',
          'Çocukların ulaşamayacağı yerde saklayınız.',
        ],
      },
      {
        q: 'Saklama',
        a: 'Serin ve kuru yerde, doğrudan güneş ışığından uzak saklayınız. Kullandıktan sonra kapağı kapatınız. Raf ömrü 36 aydır; parti numarası ve son kullanma tarihi kutunun altındadır.',
      },
      {
        q: 'İçindekiler (INCI)',
        inci: true,
      },
      {
        q: 'Nerede satılır?',
        a: 'Seçili eczanelerde tezgah standında ve Trendyol\'da. Market rafında ve indirim sitelerinde değil.',
      },
      {
        q: 'Eczane olarak nasıl bayi olurum?',
        a: 'Sayfadaki bayilik formunu doldurun; ekibimiz tezgah standı, adet ve teslimat detaylarıyla dönüş yapar. Doğrudan e-posta için: alvionsaglik@gmail.com.',
      },
      {
        q: 'Kim üretiyor?',
        a: 'NIALORA, Alvion Sağlık Ürünleri ve Bilişim Teknolojileri San. Tic. Ltd. Şti. markasıdır. Türkiye\'de üretilir. Tek parti, sınırlı sayıda ilk üretim.',
      },
    ] as FaqItem[],
  },
  footer: {
    line: 'Gülüşünüz de *özen* ister.',
    tag: 'Niasinamid içeren diş macunu',
    social: [
      { label: 'Instagram', href: '#' },
      { label: 'TikTok', href: '#' },
    ],
    legal: '© 2026 Alvion Sağlık Ürünleri ve Bilişim Teknolojileri San. Tic. Ltd. Şti.',
    made: 'Türkiye\'de üretilmiştir.',
    note: 'Özenle tasarlandı.',
  },
}

export type Dict = typeof tr

/* ═══════════════════════════ Dictionary (EN) ═══════════════════════════ */
const en: Dict = {
  meta: {
    title: 'NIALORA — Niacinamide Toothpaste · 100 g',
    description:
      'NIALORA is a dual-phase toothpaste with niacinamide. Turquoise and pink phases, fluoride formula, mint freshness and a shimmering gel look. 100 g. In pharmacies and on Trendyol.',
  },
  a11y: { skip: 'Skip to content', lang: 'Language', menu: 'Menu', close: 'Close', scrollTop: 'Back to top' },
  loader: { eyebrow: 'Niacinamide toothpaste' },
  nav: {
    menu: 'Menu',
    close: 'Close',
    buy: 'Buy',
    links: [
      { href: '#sahne', label: 'Start' },
      { href: '#hikaye', label: 'Story' },
      { href: '#niasinamid', label: 'Niacinamide' },
      { href: '#film', label: 'Film' },
      { href: '#satin-al', label: 'Buy' },
      { href: '#bayilik', label: 'Pharmacies' },
      { href: '#sss', label: 'FAQ' },
    ],
    trendyol: 'Buy on Trendyol',
  },
  stage: {
    seo: 'NIALORA niacinamide toothpaste, 100 g.',
    ch1: { line: 'Show your *smile* the care you show your skin.', sub: 'The forgotten step of your routine.' },
    ch2: { tag: 'Turquoise phase', line: 'A *fresh* start to the day.' },
    ch3: { tag: 'Pink phase', line: 'A *sweet* finish.' },
    ch4: { line: 'They live in the same tube but never mix.', sub: 'On that matter, they are more *disciplined* than we are.' },
    cue: 'Scroll',
    alt: 'NIALORA niacinamide toothpaste, gold-capped pink and turquoise tube',
  },
  lineup: {
    line: 'The *first* toothpaste that belongs on your skincare shelf.',
    caption: 'Niacinamide · 100 g',
    alt: 'The NIALORA collection: cone, front and back, on a pink podium',
  },
  story: {
    eyebrow: 'Every morning, a shimmering ritual',
    alt: 'NIALORA tube on a pink backdrop among pearls',
    lines: [
      'For years we cared for our skin.',
      'Our smile was still making do with an ordinary tube.',
      'So we brought niacinamide into toothpaste.',
    ],
    signature: 'Show your smile the care you show your skin.',
  },
  niacinamide: {
    tag: 'Niacinamide · 0.5%',
    line: 'The *vitamin B3* you know from skincare, now in toothpaste.',
    why: [
      { t: 'Niacinamide', d: 'The signature ingredient.' },
      { t: 'With fluoride', d: 'Daily oral care. Mint flavour.' },
      { t: 'Fresh breath', d: 'Menthol and long-lasting coolness.' },
      { t: 'Clean teeth', d: 'Cleans for a brighter-looking smile.' },
    ],
    ticker: ['0.5% niacinamide', '0.22% sodium fluoride', 'mint freshness', 'mica & tin oxide shimmer', 'dual-phase formula', '100 g', 'first batch · limited'],
  },
  film: {
    line: 'The most *elegant* form of freshness.',
    reels: 'Short films',
    reelsHint: 'Hover to play',
    unmute: 'Unmute',
    mute: 'Mute',
    play: 'Play',
    pause: 'Pause',
  },
  buy: {
    line: 'In selected pharmacies and on *Trendyol.*',
    sub: 'First batch, limited.',
    product: 'NIALORA Niacinamide Toothpaste · 100 g · Mint · With fluoride',
    trendyol: 'Buy on Trendyol',
    pharmacy: 'On pharmacy counters. Not on supermarket shelves or discount sites.',
    dealerLink: 'Are you a pharmacy? Apply to stock NIALORA',
    alt: 'Front of the NIALORA tube with its gold label',
  },
  dealer: {
    eyebrow: 'For pharmacies',
    line: 'Bring *NIALORA* to your pharmacy.',
    lead: 'Fill in the form; our team will get back to you with counter display, quantity and delivery details.',
    fields: { pharmacy: 'Pharmacy name', pharmacist: 'Pharmacist full name', email: 'Email', phone: 'Phone', city: 'City / district', message: 'Your request' },
    placeholders: { pharmacy: 'e.g. Gül Pharmacy', pharmacist: 'Full name', email: 'you@pharmacy.com', phone: '+90 5xx xxx xx xx', city: 'Istanbul / Kadıköy', message: 'e.g. we would like a 15-unit counter display, estimated monthly quantity…' },
    optional: 'optional',
    consent: 'I agree that my details are shared with Alvion Sağlık to evaluate my application.',
    submit: 'Send Application',
    sending: 'Sending…',
    sent: { title: 'Application received.', text: 'We will get back to you by email or phone shortly.' },
    error: { title: 'Could not send.', text: 'Please try again or email us directly:' },
    subject: 'NIALORA pharmacy partnership application',
  },
  faq: {
    title: 'Frequently *asked.*',
    items: [
      {
        q: 'How to use',
        a: 'Brush your teeth at least twice a day, ideally morning and night, for about 2 minutes. A pea-sized amount is enough. Spit after brushing, do not swallow.',
      },
      {
        q: 'Warnings',
        list: [
          'Contains sodium fluoride.',
          'Children aged 6 and under: use a pea-sized amount under adult supervision.',
          'If fluoride is taken from other sources, consult your dentist.',
          'Avoid contact with eyes; if contact occurs, rinse with plenty of water.',
          'Discontinue use if irritation occurs.',
          'Contains a formaldehyde-releasing agent.',
          'Keep out of reach of children.',
        ],
      },
      {
        q: 'Storage',
        a: 'Store in a cool, dry place away from direct sunlight. Close the cap after use. Shelf life is 36 months; batch number and expiry date are on the bottom of the box.',
      },
      {
        q: 'Ingredients (INCI)',
        inci: true,
      },
      {
        q: 'Where is it sold?',
        a: 'On the counters of selected pharmacies and on Trendyol. Not on supermarket shelves or discount sites.',
      },
      {
        q: 'How can my pharmacy stock NIALORA?',
        a: 'Fill in the partnership form on this page; our team will get back to you with counter display, quantity and delivery details. Direct email: alvionsaglik@gmail.com.',
      },
      {
        q: 'Who makes it?',
        a: 'NIALORA is a brand of Alvion Sağlık Ürünleri ve Bilişim Teknolojileri San. Tic. Ltd. Şti. Made in Türkiye. A single, limited first batch.',
      },
    ] as FaqItem[],
  },
  footer: {
    line: 'Your smile deserves *care* too.',
    tag: 'Niacinamide toothpaste',
    social: [
      { label: 'Instagram', href: '#' },
      { label: 'TikTok', href: '#' },
    ],
    legal: '© 2026 Alvion Sağlık Ürünleri ve Bilişim Teknolojileri San. Tic. Ltd. Şti.',
    made: 'Made in Türkiye.',
    note: 'Designed with care.',
  },
}

const translations: Record<Lang, Dict> = { tr, en }

/* ═══════════════════════════ Context ═══════════════════════════ */
interface I18nValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: Dict
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang)

  const setLang = useCallback((l: Lang) => {
    // CSS text-transform büyük/küçük harf eşlemesini <html lang> üzerinden seçer (tr: i→İ, en: i→I).
    // Yeni metin düğümleri oluşmadan ÖNCE dil özniteliği güncellenir; ağaç key={lang} ile yeniden kurulur.
    document.documentElement.lang = l
    setLangState(l)
    try { localStorage.setItem(STORAGE_KEY, l) } catch { /* yoksay */ }
  }, [])

  useLayoutEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    const d = translations[lang]
    document.title = 'Nialora' // sekme başlığı yalnızca marka adı, bu yazımla (kullanıcı kararı)
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
      <Fragment key={lang}>{children}</Fragment>
    </I18nContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
