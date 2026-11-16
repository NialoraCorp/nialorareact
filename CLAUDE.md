# CLAUDE.md — NIALORA web

Bu dosya, bu depoda çalışan Claude Code (ve diğer ajanlar) için çalışma kurallarıdır.
Mimari için `ARCHITECTURE.md`, karar/bağlam notları için `MEMORY.md`, değişiklikler için `CHANGELOG.md`.

## Proje
NIALORA: niasinamid içeren, çift fazlı (turkuaz + pembe) diş macunu. Tek sayfalık, TR/EN tanıtım + satış sitesi.
Marka sahibi Alvion Sağlık. Ürün 100 g, 450 TL, eczane + Trendyol.

## Komutlar
```bash
npm run dev      # Vite dev server (http://localhost:5173)
npm run build    # tsc -b && vite build  → dist/
npm run lint     # eslint
npm run preview  # dist/ önizleme
npm run build:single  # her şeyi gömen tek dosya (nialora.html); hafif videolar için: node scripts/build-single.mjs <dizin> <çıktı>
npm run deploy        # build → GitHub `deploy` dalı → Plesk Git httpdocs'a çeker (kullanıcı isteyince)
npm run deploy:ftp    # build → FTPS ile doğrudan httpdocs; kimlik bilgileri yerel `.env.deploy` (git dışı, sohbete yazılmaz)
```
Dev server'ı Claude Code içinde `.claude/launch.json` ("nialora") ile başlatın; Bash ile arka planda çalıştırmayın.

## Stack
Vite 8 · React 19 · TypeScript 6 · Tailwind CSS v4 (`@tailwindcss/vite`, tema `src/index.css` içinde `@theme`)
· Framer Motion 14 (`framer-motion`) · Lenis (smooth scroll) · lucide-react · `@/` alias → `src/`.
shadcn/21st.dev bileşen sözleşmesi: `components.json`, `src/lib/utils.ts` (`cn`), bileşenler `src/components/ui/`.

## Tasarım dili (değiştirme, genişlet)
- Marvis tarzı "bölümler": her ekran tek bir cümle, düz ve doygun zemin, kalın büyük harf sans (Montserrat 700,
  `.statement`). Vurgu kelimesi **aynı font ve ağırlıkta**, yalnızca tema tonuyla ayrılır (`.em-word`, metinde
  `*kelime*`; ton bölüme göre `--em-color`: altın / `on-dark` açık altın / `on-turq` teal / `on-pink` gül).
  İtalik serif, süs kıvrımı gibi "AI görünümlü" süslemeler kullanılmaz.
- Ürünün **ön yüzü** ana görseldir (`public/brand/tube-front.webp`, şeffaf kesim). Sahne (`Stage.tsx`) boyunca
  scroll ile döner/kayar; satış bölümünde yine ön yüz.
- Renk: ivory/pearl zemin, plum metin, altın vurgu, bölüm renkleri `--color-ch-turq / ch-pink / ch-gold`.
- Az kelime, bol boşluk. Kart ızgaraları, istatistik satırları, "AI landing page" kalıpları yok.
- Eczane bilgisi **buton değil, metin** (eczane listesi/linki yok).
- **Fiyat sitede yazılmaz** (kullanıcı kararı). Satış bölümü yalnızca kanalları (eczane + Trendyol) ve yönlendirmeyi verir.

## İddia kuralları (zorunlu — Ürün Bilgi Dokümanı, Ekim 2026)
Kullanılabilir: çift fazlı formül · niasinamid içerir · florürlü · nane ferahlığı, uzun süren serinlik ·
ışıltılı jel görünümü · dişleri temizler, daha parlak görünüm · 100 g · "premium diş macunu deneyimi".
**Yasak:** "beyazlatıcı/whitening", "çürüğe karşı koruma", "dermatolojik/klinik test edilmiştir",
"premium formül / premium içerik", "SLS içermez", "alkol içermez", "Bakanlık/TİTCK onaylı", rakip adı (Marvis dahil),
"mucize", "en iyi". Meta/SEO dahil her yerde geçerlidir. Tam liste: `design-system/nialora/pages/home.md`.

## Animasyon kuralları
- Yalnızca Framer Motion (`src/motion/*`): easing/duration `tokens.ts`, varyantlar `variants.ts`.
- Scroll'a bağlı her şey **transform + opacity** ile; `background`, `filter`, `border-radius`, `box-shadow`
  animasyonu yok (takılma yaratır). Büyük blur/backdrop katmanlarını hareket ettirmeyin.
- `MotionConfig reducedMotion="user"` açık; scroll sahneleri için ayrıca `useReducedMotion` ile statik fallback verin.
- Lenis `data-lenis-prevent` yalnızca gerçekten yakalanması gereken katmanlarda (menü).

## Metin / i18n
Tüm görünür metin `src/lib/i18n.tsx` sözlüğünde (TR birincil, EN ikincil). Bileşene sabit metin yazmayın.
Ürün gerçekleri `src/content/product.ts`. Trendyol bağlantısı `PRODUCT.trendyolUrl` (şimdilik arama linki).

## Araçlar
- **UI UX Pro Max** (`.claude/skills/ui-ux-pro-max`): tasarım kararı gerekince
  `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<sorgu>" --domain style|typography|ux|landing`.
  Üretilen sistem: `design-system/nialora/MASTER.md`; marka geçersiz kılmaları `pages/home.md` (öncelikli).
- **21st.dev**: MCP `.mcp.json` içinde (`API_KEY_21ST` ortam değişkeni gerekir; anahtar https://21st.dev/mcp).
  Bileşen kurulumu: `npx shadcn@latest add "https://21st.dev/r/<yazar>/<bileşen>?api_key=$API_KEY_21ST"`.
  Kurulan bileşenler `src/components/ui/` altına gelir; Tailwind v4 + `cn` hazır.

## Bayilik formu
`src/sections/Dealer.tsx` + `DEALER` (`src/content/product.ts`). Alıcı alvionsaglik@gmail.com, Formsubmit AJAX ucu.
Alan ekler/çıkarırken `i18n.dealer.fields` ve payload anahtarlarını birlikte güncelleyin (anahtarlar e-postada etiket olur).

## Varlıklar
`public/brand/`: ürün fotoğrafları ve afiş kırpımları (orijinaller `~/Downloads/nialora` ve `ekler/`), kesim
`scripts/cutout.py` ile; film `film-wide.mp4` (+poster), kısa filmler `reel-1..4.mp4` (Story bölümünde).
`public/bg*.mp4|webm|gif`: eski site videoları, kullanılmıyor, kullanıcının orijinalleri — sormadan silmeyin.

## Teslim
Kullanıcı son hali localde görmeden **push yapmayın**; commit için de onay isteyin. `dist/` git'e girmez.
Her değişiklikte `CHANGELOG.md` güncellenir.
