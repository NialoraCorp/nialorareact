# Changelog

Biçim: [Keep a Changelog](https://keepachangelog.com/tr/1.1.0/). Tarihler ISO (YYYY-MM-DD).

## [Unreleased]
- Eczane bayilik başvuru formu (`Dealer`): eczane adı, eczacı, e-posta, telefon, şehir (isteğe bağlı), talep; KVKK
  onay kutusu, bal küpü (honeypot), gönderiliyor/alındı/hata durumları ve mailto yedeği. Gönderim Formsubmit AJAX
  ucu üzerinden alvionsaglik@gmail.com'a e-posta olarak gider (ilk gönderimde tek seferlik aktivasyon maili).
  Nav/footer'a "Eczaneler", satış notuna bağlantı, SSS'ye (+JSON-LD) "Eczane olarak nasıl bayi olurum?" eklendi.
  Form "Bayilik Başvurusu Yap" düğmesiyle açılır; e-posta adresi sayfada hiçbir yerde gösterilmez.
- Sahne koreografisi: tüp her bölümde yazının karşı yarısında, düşeyde ortalı ve tamamı görünür; bölüm boyunca
  hafif süzülme, geçişler uzun pencerelerde ease-in-out ile, scroll yayı yumuşatıldı; hero yazısı geçişten önce söner.
- Satış bölümünden "Hediye kutusuyla" ibaresi kaldırıldı (TR/EN); ürünün hediye kutusu yok.
- SEO: FAQPage JSON-LD (6 soru, görünür SSS ile birebir), Product şemasına size/countryOfOrigin, og:type website,
  og:image:type ve twitter:image:alt, application-name/format-detection meta, sitemap lastmod; H1 görünen slogan +
  ekran okuyucuya özel ürün adı; `#` yer tutucu sosyal bağlantılar gerçek adres gelene kadar gizlendi.
- Yayın: `public/web.config` (IIS MIME/önbellek/sıkıştırma) dist'e eklendi; `DEPLOY.md` (Plesk/Windows + Hostinger DNS adımları).
- Tek dosya build: `npm run build:single` → `scripts/build-single.mjs` CSS/JS'yi gömer, `/brand/*` ve ikonları
  data URI'ye çevirir; çıktı `nialora.html` çift tıklayınca (file://) açılır. Reel yolları şablon yerine açık yazıldı.

## [2.0.0] — 2026-10-18 — Rebranding
### Added
- Framer Motion 14 tabanlı yeni animasyon altyapısı: `src/motion/` (tokens, variants, Lenis, MotionProvider).
- Tailwind CSS v4 (`@tailwindcss/vite`) ve `@/` alias; shadcn/21st.dev bileşen sözleşmesi (`components.json`, `cn`).
- UI UX Pro Max skill'i proje içine kuruldu (`.claude/skills/`); `design-system/nialora/` (MASTER.md + home.md).
- 21st.dev MCP yapılandırması (`.mcp.json`, `API_KEY_21ST` ile).
- Marvis tarzı bölüm kurgusu: `Stage` (4 bölümlük sabit sahne, scroll ile dönen ön yüz tüp), `Lineup` (üçlü ürün karesi),
  `Story`, `Niacinamide`, `Film`, `Buy`, `Faq` (Sıkça sorulanlar), yeni `Footer`; tam ekran `MENÜ`, `ScrollStar`.
- Gerçek ürün fotoğrafları ve filmler `public/brand/`; şeffaf ön yüz kesimi (`scripts/cutout.py`, WebP+alpha).
- Yeni OG görseli ve favicon; JSON-LD'ye Offer (450 TRY) ve gtin13.
- Proje belgeleri: `CLAUDE.md`, `ARCHITECTURE.md`, `MEMORY.md`, `CHANGELOG.md`.
### Changed
- Tüm metin, Ürün Bilgi Dokümanı'nın iddia sınırlarına göre yeniden yazıldı (TR/EN). "Beyazlatıcı",
  "SLS/paraben içermez", "mineyi korur" gibi ifadeler kaldırıldı; site "çok yakında"dan satışa geçti
  (450 TL, Trendyol + eczane).
- Tipografi: Montserrat 700 büyük harf cümleler + Cormorant Garamond italik vurgu; palet ivory/plum/altın +
  turkuaz/pembe bölüm renkleri.
- Eczane bilgisi buton yerine metin; satış bölümünde ürünün ön yüzü. Fiyat sitede, SSS'de ve JSON-LD'de yok;
  yalnızca kanal yönlendirmesi (eczane + Trendyol).
- Vurgu kelimeleri aynı font/ağırlıkta, yalnızca tema tonu (bölüme göre altın / teal / gül / açık altın).
- Hikaye bölümü editoryal yayılıma çevrildi: markanın "Her sabah ışıltılı bir ritüel" karesi + 3 kısa cümle +
  imza. "Obelisk" yerine afişten kırpılan üçlü ürün karesi (`Lineup`). Yüksek kaliteli (1080p kaynak) dört
  dikey kısa film, tam ekran filmin altında şerit olarak. 4. bölüm zemini altın; "Küçük harfler" → "Sıkça
  sorulanlar". Hero'daki eyebrow satırı kaldırıldı; satış bölümünde tüp büyütüldü.
- Mobilde Lineup ve Hikaye görselleri artık kendi oranlarında, kırpmasız (üstte nav payı). Masaüstünde Lineup
  görsel sütunu ekran yüksekliğine bağlı (en fazla 88svh) tutularak "cover" kırpması küçük tutuldu; Hikaye
  yakınlaştırması azaltıldı.
- Mobilde Lineup görseli üstten kendi zeminiyle uzatıldı (`lineup-mobile.webp`), nav payı görselin içinde;
  arada boş pembe bant kalmadı. Satış bölümünde mobil üst boşluk kaldırıldı, tüp metnin sağında ve CTA altta.
- Mobilde tam ekran film, ekler'deki en uzun dikey video ("kurgu", 14 sn, sessiz; `film-mobile.mp4`); ses düğmesi
  mobilde gizli, şeritte aynı reel tekrarlanmaz. Masaüstü yatay film değişmedi.
- Sekme başlığı yalnızca "Nialora"; yeni favicon (iki fazlı daire, altın çerçeve, serif N) ve ürün görselli
  `apple-touch-icon.png`. OG/Twitter başlıkları açıklayıcı kalmaya devam eder.
- Kısa filmler şeridi sığdığı genişliklerde ortalanır (`justify-content: safe center`).
- Türkçe büyük harflerde (İ noktası, Ş/Ç çengeli) satırların üst üste binmesi giderildi: `.statement` satır
  aralığı 0.98 → 1.08, `.statement-sm` 1.02 → 1.12; SplitText kelime maskelerine üstten pay eklendi.
- EN sürümde büyük harf dönüşümünde Türkçe "İ" çıkması giderildi: `<html lang>` React yeniden çizmeden önce
  güncellenir ve ağaç `key={lang}` ile yeniden kurulur (CSS `text-transform` dilin harf eşlemesini kullanır).
- Sahne arka planına jeldeki yıldızlardan esinlenen, kaydırdıkça üç derinlikte kayan ve bölüm zeminine göre
  renk değiştiren ince bir yıldız alanı eklendi (yalnızca sahnede).
- Film 1080p'ye yeniden kodlandı (denoise + lanczos + unsharp, crf 18); kesimde cam taban yarı saydam, zemin
  yansıması ve gölge kalıntısı temizlendi.
- Performans: scroll'a bağlı her şey transform/opacity; blend/filter/backdrop animasyonları kaldırıldı.
- `.gitignore`: `.claude/skills` ve `launch.json` artık izlenir, yalnızca `settings.local.json` yok sayılır.
### Removed
- Canvas tabanlı 121 karelik scroll-scrub hero, `public/frames/`, eski AI ürün görselleri, e-posta ön kayıt formu,
  eski `App.css`/`sections.tsx`/`ScrollVideo` ve ilgili hook'lar.

## [1.1.0] — 2026-06-14
- SEO (meta, JSON-LD, OG görseli, robots, sitemap), marquee düzenlemesi.

## [1.0.0] — 2026-06-14
- Premium scroll-scrub ürün sitesi, TR/EN i18n.

## [0.1.0] — 2026-04
- İlk "çok yakında" sayfası, mobil uyumlu video arka plan.
