/**
 * Ürün gerçekleri — "NIALORA Ürün Bilgi Dokümanı" (Ekim 2026) kaynaklıdır.
 * Metin sözlüğü (lib/i18n.tsx) buradaki değerlere referans verir; iddia
 * sınırları için design-system/nialora/pages/home.md'ye bakın.
 */
export const PRODUCT = {
  brand: 'NIALORA',
  name: 'NIALORA Niasinamid İçeren Diş Macunu',
  nameEn: 'NIALORA Niacinamide Toothpaste',
  netWeight: '100 g',
  netWeightOz: '3.5 oz',
  barcode: '8685333870005',
  /** Fiyat sitede gösterilmez (kullanıcı kararı, 2026-10-18); yalnızca kayıt amaçlı. */
  price: 450,
  currency: 'TRY',
  shelfLifeMonths: 36,
  flavor: 'Nane',
  origin: 'Türkiye',
  owner: 'Alvion Sağlık Ürünleri ve Bilişim Teknolojileri San. Tic. Ltd. Şti.',
  trademark: 'TÜRKPATENT 2026/044925',
  /** Trendyol ürün sayfası: kesin bağlantı gelene kadar marka araması. */
  trendyolUrl: 'https://www.trendyol.com/sr?q=nialora',
  channels: ['Eczane', 'Trendyol'],
  actives: {
    niacinamide: '0,5',
    sodiumFluoride: '0,22',
    hydratedSilica: '27',
    menthol: '0,58',
    coolingAgent: '0,06',
    micaTinOxide: '0,25',
  },
  inci: [
    'Sorbitol', 'Hydrated Silica', 'Aqua', 'Sodium Lauryl Sulfate', 'Cellulose Gum',
    'Hydroxypropyl Methylcellulose', 'Aroma', 'Menthol', 'Niacinamide', 'Sodium Benzoate',
    'Sodium Saccharin', 'Imidazolidinyl Urea', 'Sodium Fluoride', 'Microcrystalline Cellulose',
    'Ascorbic Acid', 'Maris Sal', 'Lactose', 'Methyl Diisopropyl Propionamide', 'Tin Oxide',
    'Sucrose', 'Mica', 'CI 42090', 'CI 15850',
  ],
} as const

/**
 * Eczane bayilik formu. Site statik olduğu için gönderim Formsubmit'in AJAX ucuna gider ve
 * e-posta olarak iletilir. İlk gönderimde alıcı adrese tek seferlik aktivasyon maili gelir;
 * aktivasyondan sonra Formsubmit'in verdiği rastgele takma adı (alias) endpoint'e yazarak
 * e-posta adresini kaynak koddan gizleyebilirsiniz.
 */
export const DEALER = {
  email: 'alvionsaglik@gmail.com',
  endpoint: 'https://formsubmit.co/ajax/alvionsaglik@gmail.com',
} as const

export const ASSETS = {
  /** Şeffaf kesim (flood-fill ile üretildi, WebP+alpha) — hero ve iki faz sahnesi. */
  tubeCut: '/brand/tube-front.webp',
  /** Marka afişlerinden kırpılmış kareler (ekler/IMG_4994, IMG_4995; başlıklar kırpıldı). */
  lineup: '/brand/lineup.webp',
  /** Mobil: aynı kare, üstten kendi zeminiyle uzatılmış (nav payı görselin içinde). */
  lineupMobile: '/brand/lineup-mobile.webp',
  ritual: '/brand/ritual.webp',
  /** Stüdyo kareleri — editoryal çerçeveler ve OG görseli. */
  tubeFront: '/brand/tube-front.jpg',
  tubeBack: '/brand/tube-back.jpg',
  tubeCone: '/brand/tube-cone.jpg',
  film: '/brand/film-wide.mp4',
  filmPoster: '/brand/film-wide-poster.jpg',
  /** Mobilde tam ekran film: ekler'deki en uzun dikey video (kurgu, 14 sn, sessiz). */
  filmMobile: '/brand/film-mobile.mp4',
  filmMobilePoster: '/brand/film-mobile-poster.jpg',
  /** Açık yollar (şablon değil): tek dosya build'i (scripts/build-single.mjs) bunları data URI'ye çevirir. */
  reels: [
    { src: '/brand/reel-1.mp4', poster: '/brand/reel-1-poster.jpg' },
    { src: '/brand/reel-2.mp4', poster: '/brand/reel-2-poster.jpg' },
    { src: '/brand/reel-3.mp4', poster: '/brand/reel-3-poster.jpg' },
    { src: '/brand/reel-4.mp4', poster: '/brand/reel-4-poster.jpg' },
  ],
} as const
