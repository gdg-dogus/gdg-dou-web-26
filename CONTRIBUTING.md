# Katkı rehberi

Geliştirme ortamını kurmak için [README](README.md)'ye bak. Bu dosyada iş akışı ile kod ve tasarım
kuralları var. Kod yazmadan önce tamamını oku. Bir kural işini engelliyorsa kuralı çiğneme; PR
açıklamasında sor.

AI kod asistanı (Claude, Copilot, Cursor, Gemini vb.) kullanıyorsan ona da bu dosyayı okut.
AI ile üretilen kodun sorumluluğu PR sahibindedir; gönderilen her satır okunmuş ve anlaşılmış olmalı.

## Proje

Doğuş Üniversitesi GDG on Campus topluluğunun iki dilli (TR/EN) web sitesi.
Statik site olarak build edilir (`output: "export"`) ve GitHub Pages'te yayınlanır. Sunucu yoktur.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (Radix) ·
next-intl · next-themes · Motion · Zod · Biome · pnpm · Sveltia CMS

Next.js 16'da API'ler, kurallar ve dosya yapısı önceki sürümlerden farklı olabilir. Emin olmadığın bir
konuda `node_modules/next/dist/docs/` altındaki ilgili belgeyi oku ve kullanımdan kaldırma
uyarılarına dikkat et.

## Komutlar

```bash
pnpm dev            # http://localhost:3000
pnpm check          # lint + tip + içerik + build. PR açmadan önce MUTLAKA çalıştır
pnpm format         # Biome ile formatla ve import'ları sırala
pnpm check:content  # content/ ve messages/ dosyalarını doğrula
COMMUNITY_EVENTS=off pnpm dev   # GDG Community API'sini kapat (internet yoksa)
```

## İş akışı

1. Güncel `main`'den yeni bir branch aç.
2. Değişikliği yap, commit'le.
3. `pnpm check` hatasız geçtikten sonra push et ve PR aç.
4. Review'dan gelen düzeltmeleri aynı branch'e push et.
5. Onaylanan PR `main`'e merge edilir ve site otomatik olarak yayınlanır.

`main`'e doğrudan push yapılmaz. Yazma yetkisi olmayan katkıcılar fork üzerinden PR açar.

### Branch

```bash
git checkout main
git pull
git checkout -b feat/blog-detay
```

- Format: `feat/<kisa-ad>`, `fix/<kisa-ad>`
- Küçük harf, Türkçe karakter yok, kelimeler arasında tire
- Her branch tek bir iş içerir; merge sonrası silinir.

### Commit

[Conventional Commits](https://www.conventionalcommits.org/) biçimi kullanılır, kapsam özelliğin adıdır:

```
feat(events): kategori filtresi eklendi
fix(team): mobilde kart taşması düzeltildi
style(home): başlık boşlukları düzenlendi
docs: README kurulum adımları güncellendi
chore: bağımlılıklar güncellendi
içerik: yeni etkinlik eklendi          ← CMS commit'leri
```

### Pull request

- PR açmadan önce `pnpm check` (lint, tip, içerik, build) hatasız geçmeli. CI aynı kontrolü çalıştırır.
- Arayüz değişikliklerinde ekran görüntüsü ekle: masaüstü ve mobil (390px), açık ve koyu tema.
- PR'ı küçük tut: bir bileşen ya da bir sayfa. 400 satırı geçen değişiklikleri böl.
- Henüz review'a hazır olmayan işler için draft PR aç.

### Review

- Ortak dosyalara dokunan PR'lar bakımcı onayı bekler
  (bkz. [kural 7](#7-bağımlılıklar-ve-ortak-dosyalar)).
- Yeni bağımlılık ekleyen PR'larda neden gerektiğini açıkla.

## Klasör yapısı ve neyin nereye gittiği

```
content/                 Site içeriği (JSON + Markdown). CMS de buraya yazar.
  events/<slug>.json     Etkinlikler
  members/<isim>.json    Ekip üyeleri
  teams.json             Ekipler
  offers/<id>.json       Öğrenci teklifleri
  projects/<slug>.json   Projeler (oyunlar, uygulamalar)
  blog/<slug>.<tr|en>.md Blog yazıları
messages/<tr|en>/<sayfa>.json   Arayüz metinleri (sayfa başına ayrı dosya)
public/images/           Görseller (events/, blog/, team/, projects/)
public/admin/            CMS (Sveltia) ayarları
src/
  app/[locale]/          Sayfalar (route'lar). Sayfa dosyası ince olur; veriyi alır, bileşene verir.
  components/ui/         shadcn/ui bileşenleri — ORTAK, bakımcı onayı gerekir
  components/layout/     Header, footer — ORTAK
  components/            Sayfalar arası paylaşılan bileşenler (PageHeader, Material şekilleri,
                         ZoomableImage) — ORTAK
  features/<özellik>/    Her özelliğin her şeyi burada:
    schema.ts            Zod şeması (content/ dosyalarının yapısı)
    data.ts              Veri okuma fonksiyonları (sadece server'da çalışır)
    components/          O özelliğe ait bileşenler
  i18n/                  Dil ayarları — ORTAK
  lib/                   Yardımcılar (cn, asset, localize, content okuma) — ORTAK
  config/site.ts         Sosyal medya linkleri, alan adı vb.
```

**Üzerinde çalıştığın özelliğin klasöründe kal.** Etkinliklerle ilgili bir iş `src/features/events/` ve
`src/app/[locale]/events/` içinde kalır. Başka bir özelliğin klasörüne dokunman gerekiyorsa
bunu PR açıklamasında belirt.

## Örnek alınacak kod

Etkinlikler özelliği hem kod hem tasarım için eksiksiz yapılmış referans örnektir.
Yeni bir sayfa yaparken önce şunlara bak:
- `src/features/events/` — şema, veri katmanı, bileşenler
- `src/app/[locale]/events/page.tsx` — liste sayfası (canlı başlık, vitrin, liste)
- `src/app/[locale]/events/[slug]/page.tsx` — detay sayfası (generateStaticParams ile)

## Kurallar

### 1. Statik site kısıtları (en sık hata buradan çıkar)

Build çıktısı düz HTML dosyalarıdır. Bu yüzden şunlar **kullanılamaz**:
Server Actions, API route'ları (`route.ts` ile POST vb.), `cookies()`, `headers()`, middleware/proxy,
`redirect`/`rewrite` ayarları, ISR/revalidate, varsayılan `next/image` optimizasyonu.

- Dinamik route (`[slug]`) her zaman `generateStaticParams()` ve `export const dynamicParams = false` içerir.
- Her sayfa ve layout'ta `setRequestLocale(locale)` çağrılır (statik dil desteği için gerekli).
- Kullanıcıdan veri toplamak gerekiyorsa (form vb.) Google Forms linki kullanılır.

### 2. İçerik (veri)

- Etkinlik, ekip, teklif, blog gibi içerikler **asla bileşenin içine yazılmaz**; `content/` altındadır.
- `content/` dosyaları `features/<özellik>/schema.ts` içindeki Zod şemalarıyla doğrulanır.
  Şemalar `.strict()` — bilinmeyen alan build'i durdurur. Bu bilinçli bir tercih.
- Yeni bir alan eklerken üç yeri birlikte güncelle: `schema.ts`, `public/admin/config.yml` (CMS formu)
  ve mevcut içerik dosyaları.
- İki dilli alanlar `{ "tr": "...", "en": "..." }` biçimindedir. Okurken `localize(alan, locale)` kullan.
- Veri okuma fonksiyonları (`getEvents`, `getTeams`...) sadece Server Component'lerde çağrılır.
  Client bileşenine tek dile çevrilmiş sade nesne gönder (bkz. `toEventView`).
- `"use client"` dosyasından server bileşenine **sadece bileşen** import edilebilir. Sabit, dizi ya da
  fonksiyon gerekiyorsa direktifsiz ayrı bir dosyaya koy (bkz. `components/accents.ts`); yoksa
  değer sunucuda `undefined` gelir ve build kırılır.

### 3. Metinler ve çeviri

- Arayüzdeki **her** metin `messages/tr/<sayfa>.json` ve `messages/en/<sayfa>.json` içindedir.
  Bileşende sabit Türkçe/İngilizce metin yazma (aria-label'lar dahil).
- Server Component: `await getTranslations("events")`. Client/senkron bileşen: `useTranslations("events")`.
- Yeni bir çeviri dosyası eklersen `src/i18n/namespaces.ts` ve `src/i18n/messages.d.ts`'e de ekle.
- İki dildeki anahtarlar birebir aynı olmalı; `pnpm check:content` bunu kontrol eder.
- Yazım dili: sade, cümle düzeninde, ünlem ve abartı yok. Butonlar ne yaptığını söyler ("Kayıt ol").

### 4. Stil ve tasarım

Tasarım dili: **Google'ın dört rengi + Material 3'ün yuvarlak şekilleri.** Canlı ama düzenli.
Referans etkinlikler sayfasıdır (`/events` ve bir etkinliğin detay sayfası); yeni bir sayfa
tasarlamadan önce ona bak.

**Renkler**
- **Sadece Tailwind sınıfları.** Ayrı `.css` dosyası, inline `style` (dinamik konum hariç) ve hex renk yazma.
- Renkler `src/app/globals.css` içindeki değişkenlerden gelir: `bg-background`, `text-foreground`,
  `text-muted-foreground`, `bg-card`, `border-border`, `bg-primary`, `text-primary` ve Google renkleri
  `g-blue`, `g-red`, `g-yellow`, `g-green` (`bg-`, `text-`, `fill-`, `border-` ve `bg-g-blue/10` gibi
  saydam tonlarıyla). Yeni renk ekleme.
- Dolu Google renkli zemin üstünde yazı `text-white`, sarı zeminde `text-neutral-900` olur (beyaz
  okunmaz). Bunun dışında `white`/`black`/`neutral` kullanma; koyu temada bozulur.
- Etkinlik kategorisi renkleri sadece `features/events/category.ts`'ten alınır.
- Listede her öğeye sırayla farklı renk vermek için `accents` kullan (`@/components/accents`).

**Sayfa düzeni**
- Sayfanın üstünde **bir canlı alan** olur: Material şekilleri, renkli sayaçlar ya da renkli zeminli
  bir vitrin kartı. Altındaki içerik daha sakindir: liste satırları, net başlıklar, bol boşluk.
- Vurgu kartları `rounded-3xl`/`rounded-4xl` ve `bg-g-*/10` zeminlidir. Dolu renkli (`bg-g-blue`)
  kart bir sayfada en fazla bir tane olur (ör. etkinliklerdeki "Duyuruları kaçırma").
- Sıradan kartlar `rounded-3xl border bg-card`. Gölge sadece öne çıkan görsellerde (afiş gibi).
- Şekiller için kendi SVG'ni çizme; `@/components/shapes` kullan: `Shape`, `SpinningShape`,
  `ShapeCluster`, `CountUp`. Yeni bir şekil gerekiyorsa oraya ekle.
- Tıklanınca büyüyen görsel için `@/components/zoomable-image`.

**Hareket**
- Animasyonlar `motion/react` ile yapılır ve `MotionConfig reducedMotion="user"` içinde olur.
  Tailwind animasyonlarını `motion-reduce:` ile kapat.
- Sürekli dönen/süzülen şekiller sadece dekoratiftir (`aria-hidden`) ve yavaştır (20 saniye ve üstü).
- Hover'da renk değişimi, hafif kayma ya da dönme (`rotate-3`, `scale-105`) yeterli.
- İçeriği gizli (opacity 0) başlatıp sonra gösteren giriş animasyonu yapma: JavaScript yüklenmezse
  ya da gecikirse içerik görünmez kalır. Bu sadece dekoratif şekillerde serbest.

**Tipografi ve bileşenler**
- Font tek: Google Sans Flex. Başlıklar (`h1–h3`) otomatik olarak yuvarlak uçlu (ROND) çizilir.
  Büyük başlıklar için `text-display` ve `text-headline` sınıflarını kullan.
- Buton, sekme, dialog gibi parçalar `@/components/ui/*`'dan gelir. Yeni shadcn bileşeni gerekiyorsa
  `pnpm dlx shadcn@latest add <ad>` ile ekle ve PR'da belirt.
- Her şey 390px mobil genişlikte ve koyu temada düzgün görünmeli.

### 5. Linkler ve görseller

- Site içi link: `import { Link } from "@/i18n/navigation"` (dil önekini kendisi ekler). `next/link` değil.
- Görsel yolu: `src={asset("/images/...")}` — GitHub Pages alt yolunu ekler. Doğrudan "/images/..." yazma.
- `next/image` kullan; dekoratif görsellerde `alt=""`, bilgi taşıyanlarda açıklayıcı alt metin.
- Etkinlik afişleri 4:5 oranındadır (1080×1350). Görselleri WebP olarak, en fazla ~300 KB ekle.

### 6. Erişilebilirlik

- Her etkileşimli öğe klavyeyle kullanılabilir ve odak halkası görünür olmalı.
- İkon tek başına buton ise `aria-label` (çeviri dosyasından) ver.
- Animasyonları `motion/react` ile yap; otomatik animasyonlar `MotionConfig reducedMotion="user"` içinde olsun.

### 7. Bağımlılıklar ve ortak dosyalar

- Yeni npm paketi eklemeden önce PR açıklamasında sor. Çoğu işin çözümü zaten projede var.
- `components/ui`, `components/layout`, `globals.css`, `lib/`, `i18n/`, ayar dosyaları ortaktır.
  Değişiklik gerekiyorsa ayrı ve küçük bir PR aç, gerekçesini açıklamada yaz.
