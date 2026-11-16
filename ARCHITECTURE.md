# ARCHITECTURE — NIALORA web

Tek sayfalık, bölüm (chapter) tabanlı bir tanıtım sitesi. Sunucu yok; statik `dist/`.

## Çalışma zamanı akışı
```
index.html (SEO meta, JSON-LD, fontlar)
└─ src/main.tsx
   └─ <I18nProvider>          dil tespiti + sözlük + <title>/meta senkronu
      └─ <MotionProvider>     MotionConfig(reducedMotion="user") + Lenis smooth scroll
         └─ <App>
            ├─ <Loader>       oturumda bir kez: NIALORA harfleri, altın çizgi, perde (sessionStorage)
            ├─ <Nav>          sabit, zeminsiz; temasını altındaki bölümden alır (light/dark)
            ├─ <main>
            │   ├─ Stage      4 bölüm, tek sabit sahne (420vh) — ürün koreografisi
            │   ├─ Lineup     üçlü ürün karesi (afiş kırpımı) + "Bakım rafınıza yakışan ilk diş macunu"
            │   ├─ Story      editoryal yayılım: ritüel karesi + 3 kısa cümle + imza
            │   ├─ Niacinamide altın bölüm + içerik şeridi
            │   ├─ Film       tam ekran video (masaüstü yatay+ses, mobil dikey kurgu) + kısa film şeridi
            │   ├─ Buy        ön yüz tüp + kanal cümlesi + Trendyol CTA
            │   ├─ Dealer     eczane bayilik formu → Formsubmit AJAX → e-posta
            │   └─ Faq        "Sıkça sorulanlar" akordeonu (kullanım, uyarı, INCI…)
            ├─ <Footer>
            ├─ <ScrollStar>   scroll ile dönen altın yıldız (ilerleme imzası)
            └─ <GrainOverlay> ince gren dokusu (blend yok)
```

## Dizin yapısı
```
src/
  content/product.ts      ürün gerçekleri (fiyat, barkod, INCI, varlık yolları)
  lib/i18n.tsx            TR/EN sözlük + context; "*kelime*" = italik vurgu
  lib/navTheme.ts         küçük store: bölüm → nav teması (light/dark)
  lib/useNavTheme.ts      useNavTheme(), useSectionTheme(ref, theme)
  lib/intro.ts            loader bir kez gösterilsin (sessionStorage)
  lib/useMediaQuery.ts
  lib/utils.ts            cn()
  motion/tokens.ts        EASE, DUR, STAGGER, SPRING, VIEWPORT
  motion/variants.ts      stagger, fadeUp (custom=delay), maskUp, materialize, drawLine
  motion/useLenis.ts      Lenis + hash link kaydırma
  motion/MotionProvider.tsx
  components/             Loader, Nav, LangToggle, ScrollStar, GrainOverlay
  components/ui/          SplitText, Rich, Reveal, Marquee, Magnetic, Button, Accordion, Star
  sections/               Stage, Lineup, Story, Niacinamide, Film, Buy, Dealer, Faq, Footer
  index.css               Tailwind v4 @theme (renk, font, easing), .statement, .em-word/.flourish, .grain
design-system/nialora/    UI UX Pro Max çıktısı (MASTER.md) + marka geçersiz kılmaları (pages/home.md)
scripts/cutout.py         beyaz zeminli ürün fotoğrafından şeffaf PNG kesimi (flood-fill)
scripts/cutout_gradient.py gri/vinyetli zemin denemesi (pembe fazı yırtıyor; referans olarak duruyor)
scripts/build-single.mjs  dist'i tek HTML'e gömer (CSS, JS, görsel/video data URI); paylaşım için
public/brand/             ürün fotoğrafları, kesim (webp), film ve posterler
```

## Sahne (Stage) koreografisi
`Stage.tsx`: `h-[420vh]` dış bölüm, içinde `sticky top-0 h-[100svh]` sahne. `useScroll` ilerlemesi (0..1)
`useSpring` ile yumuşatılır ve tüm katmanlar `useTransform` ile buna bağlanır:

| İlerleme | Zemin | Metin | Tüp (x, y, dönüş, ölçek) |
|---|---|---|---|
| 0.00–0.25 | ivory | Ch1 manifesto (h1) | sağda dik, −8° |
| 0.25–0.50 | turkuaz (opacity) | Ch2 "Güne ferah bir başlangıç" | sol yarıda, düşeyde ortalı, +10…13°, 1.12× |
| 0.50–0.75 | pembe | Ch3 "Tatlı bir kapanış" | sağ yarıda, düşeyde ortalı, −14…−11°, 1.12× |
| 0.75–1.00 | altın (#e0c57e) | Ch4 "Aynı tüpte… karışmıyor" | yatay (−74°…−80°), 1.42×, ekranı kesiyor |

Keyframe'ler `DESKTOP` / `MOBILE` sabitlerinde, 8 noktalı (`K`): her bölümde tüp yazı görünürken karşı yarıda
hafifçe süzülür (0.30–0.46, 0.58–0.72, 0.86–1), geçişler `easeInOut` ile; scroll yayı stiffness 55 / damping 22;
kırılım değişince bileşen `key` ile yeniden kurulur.
`StarField`: üç katman minik beş köşeli yıldız (deterministik dağılım), katman başına farklı scroll hızı
(`y` −220/−460/−760px) ve bölüm zeminine göre `color` geçişi (ivory → turkuaz → pembe → altın paletleri);
yıldızlar `fill: currentColor` ile katman rengini alır, yalnızca 3 motion öğesi güncellenir.
Yalnızca transform + opacity animasyonu var (compositor); reduced-motion'da `StaticStage` düz bloklar çizer.

## Nav teması
Zeminsiz üst bar, rengi altındaki bölüme göre değişir. Her bölüm `useSectionTheme(ref, 'light'|'dark')` ile
IntersectionObserver (nav'ın hemen altındaki ince şerit) üzerinden temayı bildirir (Stage her zaman light; Film ve
Footer dark). `ScrollStar` aynı temayı dinler.

## Metin bileşenleri
- `SplitText`: kelime kelime maske içinden yükselen başlık; `*vurgu*` parçası tek birim (bölünmez), ardındaki
  noktalama vurguya yapışır; `immediate` ile mount'ta, aksi halde görünümde tetiklenir.
- `Rich`: aynı `*vurgu*` sözdizimi, animasyonsuz (scroll ile opacity'si değişen bloklar için).
- `.em-word`: vurgu kelimesi aynı font/ağırlıkta; rengi `--em-color` (varsayılan altın; `on-dark`, `on-turq`,
  `on-pink` sınıfları bölüme göre tonu değiştirir).

## Performans kararları
- Scroll'a bağlı değerler sadece `x/y/rotate/scale/opacity`. Zemin renk geçişleri ayrı düz katmanların opacity'si.
- `drop-shadow`/`backdrop-filter`/`mix-blend-mode` hareket eden katmanlarda yok; grain katmanı blend'siz.
- Kelime başına `will-change` yok (Framer animasyon sırasında kendisi ekler).
- Video: tek film, görünümdeyken oynar (`useInView`), `preload="metadata"`.
- Loader varlık yüklemesine bağlı değil (eski 121 kare ön-yükleme kaldırıldı).

## Varlık üretimi
```bash
# ürün fotoğrafı → şeffaf kesim → webp
#   thr=232 kenar flood-fill · alt bölgede (0.76H↓) soft_thr=205 gölge temizliği · 0.905H altı yansıma atılır ·
#   0.80H altı cam taban parlaklığa göre yarı saydam
python3 scripts/cutout.py "<kaynak.jpg>" public/brand/tube-front.png 1600 232 205 0.76 0.905 0.80
cwebp -q 86 -alpha_q 92 -m 6 public/brand/tube-front.png -o public/brand/tube-front.webp
# film: kaynak 1024×576 (WhatsApp); denoise + lanczos 1080p + hafif unsharp, crf 18 (~4.9 Mbps, 6.3 MB)
ffmpeg -i "<kaynak.mp4>" -vf "hqdn3d=1.5:1.5:4:4,scale=1920:1080:flags=lanczos,unsharp=5:5:0.6:5:5:0.0" \
  -c:v libx264 -crf 18 -preset slow -tune film -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 128k public/brand/film-wide.mp4
# OG görseli (1200×630, blush zemin)
ffmpeg -f lavfi -i "color=c=0xF7ECEA:s=1200x630" -i public/brand/tube-front.jpg -filter_complex "[1:v]scale=-2:600[t];[0:v][t]overlay=(W-w)/2:(H-h)/2" -frames:v 1 public/og-image.jpg
```
Gri stüdyo zeminli fotoğraflar (arka yüz, koni) kesime uygun değil ve şu an kullanılmıyor (`public/brand/` içinde duruyor).

## Bayilik formu
Sunucu kodu yok; `Dealer.tsx` formu JSON olarak `DEALER.endpoint`'e (Formsubmit AJAX) POST eder, servis e-postayı
`DEALER.email`'e iletir (`_subject`, `_replyto`, `_template: table`). Spam için gizli `_honey` alanı; zorunlu alanlar
tarayıcı doğrulamasıyla (`reportValidity`). Hata durumunda `mailto:` yedeği gösterilir. İlk gönderimde Formsubmit
alıcıya aktivasyon maili yollar; aktivasyon sonrası verilen takma ad endpoint'e yazılarak adres gizlenebilir.

## SEO
`index.html`: TR meta, OG/Twitter, JSON-LD (Organization, WebSite, Product+Offer 450 TRY, gtin13).
`I18nProvider` dil değişince description/og/locale'i günceller; `<title>` her dilde yalnızca "Nialora". `public/robots.txt`, `public/sitemap.xml`.
Alan adı `https://nialora.com` üç dosyada sabit: index.html, robots.txt, sitemap.xml.
