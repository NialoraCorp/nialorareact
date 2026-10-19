# MEMORY — proje hafızası

Koddan türetilemeyen kararlar, bağlam ve açık işler. Yeni bir karar alındığında buraya ekleyin.

## Marka ve ürün (Ürün Bilgi Dokümanı, 17 Ekim 2026)
- Marka sahibi: Alvion Sağlık Ürünleri ve Bilişim Teknolojileri San. Tic. Ltd. Şti. Marka başvurusu
  TÜRKPATENT 2026/044925 (sınıf 3 ve 35; 5. sınıf çıkarıldı). Üretici: Prp İlaç (İkitelli OSB, İstanbul).
- Ürün: NIALORA Niasinamid İçeren Diş Macunu, 100 g, nane, florürlü (NaF %0,22), niasinamid %0,5, barkod
  8685333870005, raf ömrü 36 ay. İki faz: turkuaz (CI 42090) ve pembe (CI 15850). Mika + kalay oksit ışıltı.
- Fiyat disiplini: 450 TL, hiçbir kanalda kırılmaz; indirim yerine ikili set / hediye kutusu. Kanal: eczane
  (15'li tezgah standı) + Trendyol. Market rafı ve indirim siteleri yok. Tek parti, "ilk üretim, sınırlı sayıda".
- Hedef kitle 18–35, estetik/cilt bakımı ilgili. Ana hikaye: "Cildine gösterdiğin özeni gülüşüne de göster."
- Görsel ilkeler: az kelime, bol boşluk, altın + iki renk; cilt bakımı estetiği; kalabalık/çok renkli görsel yok.
- İddia sınırları `CLAUDE.md` ve `design-system/nialora/pages/home.md`'de. Tüp üzerindeki
  "Whitening & Daily Care Toothpaste" satırı markanın düzeltmesi gereken açık nokta (sitede tekrar edilmez).
- Formülde SLS ve formaldehit salıcı koruyucu var → "SLS içermez", "premium formül" denmez; uyarılar listesi zorunlu.

## Tasarım kararları
- Kullanıcı Marvis (marvis.com/turkey/tr) tarzını istedi: tek cümlelik tam ekran bölümler, düz doygun zemin,
  kalın büyük harf tipografi, scroll ile dönen heykelsi ürün, esprili ton, "AI'a prompt verilmiş gibi" olmayan,
  alışılmışın dışında kurgu. Önceki kart/istatistik/eyebrow kalıpları bilinçli olarak terk edildi.
- Ürünün **ön yüzü** vurgulanır; satış bölümünde de ön yüz. Eczane bilgisi buton değil, metin.
- **Fiyat sitede gösterilmez** (kullanıcı, 18 Ekim 2026): satış bölümü yalnızca kanal + yönlendirme.
- Vurgu kelimeleri: italik serif + süs kıvrımı "AI'ım diye bağırıyor" dendi → aynı font, yalnızca tema tonu.
- Film kaynağı WhatsApp'tan gelen 1024×576; 1080p'ye büyütüldü ama gerçek detay sınırlı. Daha iyi sonuç için
  markadan orijinal render (en az 1080p, tercihen ProRes/yüksek bit hızlı) istenmeli.
- Kullanıcı 18 Ekim akşamı `~/Downloads/nialora/ekler` ekledi: 4 afiş (IMG_4992–4995), stüdyo karesi (IMG_7106),
  4 reel (1080×1920). Afişlerin başlıkları kırpılarak `lineup.webp` / `ritual.webp` üretildi; reel'ler 720p'ye kodlandı.
  Çizgi şişeli raf sahnesi ve kaydırdıkça değişen cümleler kullanıcı tarafından beğenilmedi, kaldırıldı.
- `ekler/IMG_7106.jpeg` (1536×2752, gri vinyetli stüdyo) hero kesimi için denendi: gradyan-toleranslı flood-fill
  pembe fazı yırttı (`scripts/cutout_gradient.py`). Hero'da beyaz zeminli kesim kaldı; daha iyi kaynak için
  markadan şeffaf PNG ya da saf beyaz zeminli yüksek çözünürlüklü kare istenmeli.
- Kullanıcı istekleri (18 Ekim gece): hero'da eyebrow yok; yıldızlar sahne boyunca kalsın ve zemine göre renk
  değiştirsin; kısa filmler filmin altında; satış tüpü büyük.
- Gri stüdyo zeminli fotoğraflarda flood-fill kesim başarısız oldu (pembe faz zemine karışıyor); yalnızca beyaz
  zeminli ön yüz kesildi. Arka/koni fotoğrafları fotoğraf olarak kullanılır.
- Loader oturumda bir kez (sessionStorage `nialora-intro`); dil tercihi `localStorage['nialora-lang']`.

## Araçlar
- UI UX Pro Max'in önerdiği "Liquid Glass + siyah/altın" sistemi marka belgesine göre geçersiz kılındı
  (`pages/home.md`). Tipografi önerisi (Cormorant + Montserrat) benimsendi.
- 21st.dev: hem MCP hem shadcn kayıt URL'leri API anahtarı istiyor (anonim `/r/` isteği 403). Anahtar
  https://21st.dev/mcp'den kullanıcı tarafından alınmalı; `API_KEY_21ST` ortam değişkeni.

## SEO notları
- Sekme/`<title>` kullanıcı kararıyla yalnızca "Nialora" (açıklayıcı başlık önerildi, 18 Ekim 2026'da reddedildi; tekrar önerme).
- Fiyat sitede olmadığı için Product şemasındaki Offer'da price yok; Google "ürün snippet"i için fiyat ister, bilinçli.
- Yayın sonrası: Search Console (DNS TXT ile doğrulama) + sitemap gönderimi; Instagram/TikTok adresleri gelince
  footer bağlantıları ve Organization `sameAs` eklenecek.

## Kullanıcı düzeltmeleri
- **Hediye kutusu yok** (19 Ekim 2026): PDF'teki "indirim yerine hediye kutusu" ilkesi uygulanmıyor; sitede hediye kutusundan bahsetme.

## Açık işler
- [ ] Trendyol ürün sayfasının kesin bağlantısı (`PRODUCT.trendyolUrl` şu an marka araması).
- [ ] Instagram / TikTok bağlantıları (`#` yer tutucu).
- [ ] `API_KEY_21ST` tanımlanınca 21st.dev bileşenlerinin denenmesi.
- [ ] `public/bg*.mp4|webm|gif` eski videolar (≈31 MB) — kullanıcıya sorulup temizlenebilir.
- [ ] `src/assets/` (Vite şablon kalıntıları + hero.png) kullanılmıyor.
- [ ] Kullanıcı localde onaylamadan push yok.

## Kaynaklar
- Marka belgesi ve görseller: `~/Downloads/nialora/` (PDF + WhatsApp fotoğraf/video dışa aktarımları).
- Uzak depo: github.com/NialoraCorp/nialorareact (main).
