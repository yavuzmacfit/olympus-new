# Olympus — Proje Dokümantasyonu

> **Hazırlayan:** Yavuz Karavelioğlu
> **Tarih:** Mart 2026
> **Stack:** Next.js 15+, React 19, TypeScript, Tailwind CSS v4

---

## 1. Ürün Vizyonu

Olympus, spor kulüpleri (gym, fitness center) için geliştirilmiş bir **iç operasyon yönetim platformudur**. Amacı; satış ekiplerinin lead'leri takip etmesini, üyelik işlemlerini yönetmesini ve kampanya süreçlerini tek bir arayüzden yürütmesini sağlamaktır.

**Hedef kullanıcılar:**
- Satış temsilcileri (aday üye takibi, arama operasyonları)
- Üyelik danışmanları (sözleşme, ödeme, üye bilgisi güncelleme)
- Kampanya yöneticileri (promosyon, indirim, referans kampanyaları)

---

## 2. Modüller

### 2.1 Aday Üye (Lead Yönetimi)
Spor kulübüne ilgi gösteren potansiyel üyelerin (lead) listelenmesi, takibi ve aranması.

**Temel özellikler:**
- Lead listeleme (tablo görünümü, özelleştirilebilir sütunlar)
- Lead detay paneli (sağ tarafta açılır, genişletilebilir)
- Operasyon banner'ı (günlük istatistikler: gelen lead, hot lead, bekleyen, satış)
- Arama operasyonu başlatma butonu

### 2.2 Üyelik İşlemleri
Mevcut üyelerin işlemlerinin yönetilmesi.

**Planlanan özellikler:**
- Üyelik işlemi oluşturma
- Üye bilgisi güncelleme
- Borçlu üye tahsilatı

### 2.3 Kampanya İşlemleri
Satış ve üyelik kampanyalarının yönetimi.

**Planlanan özellikler:**
- Ek indirim tanımlamaları
- Promosyon kodu oluşturma ve listeleme
- Yeni banka indirimi ekleme
- Referans kampanyası
- Dondurma kampanyası

---

## 3. Genel Arayüz Mimarisi

### 3.1 Layout

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR (48px, #171a1d)                                 │
│  [Logo] [Anasayfa][Tab1][Tab2]...    [Phone][Bell][User]│
├──────────┬──────────────────────────────────────────────┤
│ SIDEBAR  │  SAYFA İÇERİĞİ                               │
│ (56/256px)│  (her modül kendi sayfasını render eder)    │
└──────────┴──────────────────────────────────────────────┘
```

### 3.2 Renk Paleti

| Kullanım | Renk |
|---|---|
| Navbar / Sidebar arka plan | `#171a1d` |
| Sayfa arka planı | `#f5f8fa` |
| Aktif tab arka planı | `#f5f8fa` (navbar ile aynı, concave için) |
| Birincil aksiyon (kırmızı) | `#df1d2f` |
| Hover kırmızı | `#b91827` |
| Aktif sidebar öğesi | `#80111b` |

---

## 4. Navbar — Çok Sekmeli (Multi-Tab) Sistem

Chrome benzeri sekme sistemi. Her modül açıldığında kendi sekmesini oluşturur.

### Davranışlar

| Durum | Davranış |
|---|---|
| Modüle tıklandı | Zaten açıksa o sekmeye geçer, yoksa yeni sekme açar |
| Sekme kapatıldı | Varsa solundaki sekmeye, yoksa sağındaki sekmeye geçer; ikisi de yoksa Anasayfa'ya döner |
| Sekmeler arası geçiş | Sayfa state'i korunur (hidden CSS, unmount yapılmaz) |
| Anasayfa sekmesi | Her zaman en solda, sabit, kapatılamaz |

### Sürükleme (Drag & Drop)

- **Teknoloji:** HTML5 Drag API değil, Pointer Events API (`setPointerCapture`)
- **Anasayfa sekmesi** sürüklenemez, sadece modül sekmeleri
- Sürükleme sırasında sekmenin kendisi taşınır (ghost yok)
- Yandaki sekmenin yarısı geçildiğinde o sekme `translateX` ile yer değiştirir (bounce efekti)
- Bırakıldıktan sonra: **FLIP animasyonu** (First–Last–Invert–Play tekniği) — sekme bırakıldığı noktadan yeni konumuna smooth geçiş yapar, agresif zıplama olmaz

### Sekme Concave Köşeler

- Aktif sekmenin sol ve sağ alt köşelerinde yuvarlatılmış "çentik" efekti
- **Teknik:** Dış `div` arka planı `#f5f8fa` (sayfa rengi), iç `div` arka planı `#171a1d` (navbar rengi) + `rounded-br-lg` veya `rounded-bl-lg`
- Concave'ler sekme button'ının **içinde** `overflow: visible` ile tanımlanır → drag sırasında sekmeyle birlikte taşınır
- Anasayfa'nın sol concave'i: flex container'ın `overflow-hidden`'ı tarafından kırpılmaması için sibling element olarak ayrı tanımlanmış (`StandaloneConcave` komponenti)

### Junction (Sekme Arası Boşluk)

- İki sekme arasında 12px genişliğinde spacer
- İkisi de aktif değilse ortasında ince `bg-white/20` dikey çizgi gösterilir
- Aksi halde sadece boşluk

---

## 5. Sidebar (Sol Panel)

### Özellikler

- **Genişlik:** Kapalı 56px, Açık 256px
- **Geçiş:** `transition-all duration-200`
- **Modüle göre dinamik menü:** Her modülün kendi `navItemsByModule` kaydı var
- **Tek divider:** Sadece Anasayfa ikonu ile diğer ikonlar arasında (index === 1)

### Modül Menüleri

**Aday Üye:**
- Anasayfa, İstatistikler, Aday Üye (alt menüyle: Liste, Takvim, QR Kodları, Farklı Kulübe Gidenler), Takvim

**Üyelik İşlemleri:**
- Anasayfa, Üyelik İşlemleri, Üye Bilgisi Güncelle, Borçlu Üye Tahsilatı

**Kampanya İşlemleri:**
- Anasayfa, Ek İndirim Tanımlamaları, Promosyon Kodu Oluşturma, Promosyon Kodu Listeleme, Yeni Banka İndirimi Ekleme, Referans Kampanyası, Dondurma Kampanyası

### Kapalı Mod Davranışları

- İkon üzerine hover → tooltip (alt menüsüz öğeler) veya flyout panel (alt menülü öğeler) açılır
- Flyout ile ikon arasındaki 4px gap'te kapanma sorunu: **görünmez köprü div** (`absolute -left-1`) ile çözüldü
- İkona tıklamak sidebar'ı genişletmez (kapalı kalır)

---

## 6. Aday Üye Sayfası — Detaylı Analiz

### 6.1 Operasyon Banner'ı

Sayfanın üstünde günlük operasyon özeti:
- Bugün Gelen Lead sayısı
- Hot Lead sayısı
- Bekleyen arama sayısı
- Satış sayısı
- "Şimdi Aramaya Başla" CTA butonu

### 6.2 Lead Tablosu

**Sütun Sistemi:**

| ID | Sabit mi? |
|---|---|
| ID | ✅ Sabit |
| Ad | ✅ Sabit |
| Soyad | ✅ Sabit |
| Telefon | ✅ Sabit |
| E-Posta | ⬜ Açılıp kapatılabilir |
| Kulüp Adı | ⬜ |
| Satış Temsilcisi | ⬜ |
| Oluşturma Tarihi | ⬜ |
| Kaynak | ⬜ |
| Kaynak Detay | ⬜ |
| Statü | ⬜ |
| Görev Tarihi | ⬜ |
| Ayr. Üyelik Tipi | ⬜ |
| Ayr. Üyelik Süresi | ⬜ |
| İş Bankası KK Tipi | ⬜ |
| İletişim İzni | ⬜ |
| SMS Onay | ⬜ |

> **Not:** "Dij. Kampanya Adı" sütunu kaldırıldı. "Detaylar (Tags)" → "Kaynak Detay", "SMS" → "SMS Onay" olarak isimlendirildi.

**Varsayılan görünür sütunlar:**
E-Posta, Satış Temsilcisi, Oluşturma Tarihi, Kaynak, Kaynak Detay, Statü, Görev Tarihi, İletişim İzni, SMS Onay

**Statü renk kodlaması:**

| Statü | Renk |
|---|---|
| Yeni Lead | Mavi |
| Sıcak Lead | Kırmızı |
| Arandı | Sarı |
| Takip | Mor |
| Ulaşılamadı | Gri |

### 6.3 Lead Detay Paneli (Sağ Panel)

**Açılma:** Tablodaki satıra tıklandığında sağdan açılır. Aynı satıra tekrar tıklamak kapatır.

**Varsayılan genişlik:** 320px

**Gösterilen içerik:** Tabloda o an görünür olan sütunlar (sütun kapatılırsa panelden de kalkar)

**Responsive layout (panel genişliğine göre):**

| Panel Genişliği | Alan Düzeni |
|---|---|
| < 420px (dar) | Dikey yığın — etiket üst, değer alt |
| 420–100% (orta) | Yatay satır — etiket solda (w-32), değer sağda |
| Tam genişlik (expanded) | 3 kolonlu grid |

**Resizable (Genişletilebilir):**

- Sol kenarda görünmez sürükleme tutacağı (4px, `cursor-col-resize`)
- Sola sürükleyerek genişletilir
- Min genişlik: 260px
- Eşik: Container genişliğinin **%50**'si — bu noktaya ulaşıldığında tam genişliğe snap eder
- Snap animasyonu: `width 220ms cubic-bezier(0.4, 0, 0.2, 1)`, **sağdan sola** (sağ kenar sabit, sol kenar genişler)
- Sürükleme sırasında animasyon yoktur; sadece snap/collapse anında animasyon tetiklenir
- **Animasyon tekniği:** Snap sırasında panel `position: absolute; right: 0` yapılır → sağ kenar container'a sabitlenir → genişleme sola doğru olur

**Header butonları:**

| Buton | Davranış |
|---|---|
| `Maximize2` ikonu | Tam genişliğe snap eder (animasyonlu) |
| `PanelLeftClose` ikonu | Varsayılan genişliğe döner (animasyonlu) |
| `X` ikonu | Paneli kapatır, genişlik sıfırlanır |

**Aksiyon butonları:** Not, E-Posta, Ara, Görev, Randevu, Daha

---

## 7. Teknik Kararlar ve Notlar

### State Yönetimi

- Global state yok (Context/Redux kullanılmıyor). Tüm state `page.tsx`'de `useState` ile yönetiliyor.
- Sayfa değiştirmek mount/unmount yapmaz; `hidden` CSS sınıfıyla gizleme yapılır → state korunur.

### Drag & Drop (Sekme Sürükleme)

```
startDrag → setPointerCapture → snapshot tab positions
moveDrag  → translateX hesapla → hoverIndex güncelle
endDrag   → preFlipPositions kaydet → setTabs reorder → setDragState(null)
useLayoutEffect → FLIP animasyonu uygula
```

**FLIP Animasyonu:**
1. `endDrag`'de DOM reorder öncesi her sekmenin `getBoundingClientRect().left` değeri kaydedilir
2. `setTabs` + `setDragState(null)` aynı render'da commit edilir
3. `useLayoutEffect`'te yeni DOM pozisyonları ölçülür
4. `dx = pre - now` hesaplanır, anında uygulanır (`transition: none`)
5. Force reflow
6. `transition: transform 300ms` + `transform: ""` → smooth settle animasyonu
7. Sürüklenen sekme FLIP'ten hariç tutulur (`flipSkipId`) — snap yaparak yerine oturur; ek `transition: none` ile agresif hareket engellenir

### Pointer Events Tercih Sebebi

HTML5 Drag API'sine göre avantajlar:
- Drag ghost yok → sekmenin kendisi hareket eder
- `setPointerCapture` ile pointer, element dışına çıksa bile event dinlenir
- Z-index kontrolü tam
- Mobil/touch desteği otomatik (`touch-action: none`)

### Concave Köşe Tekniği

```html
<!-- Dış kutu: sayfa rengi arka plan -->
<div style="width:12px; height:12px; overflow:hidden; background:#f5f8fa">
  <!-- İç kutu: navbar rengi + köşe yuvarlaması -->
  <div style="width:100%; height:100%; background:#171a1d; border-radius: 0 0 8px 0" />
</div>
```

Concave'lerin sekme button'ı içinde olması (`overflow: visible` ile) → drag transform'u sırasında concave'ler sekmeyle birlikte taşınır.

### Sidebar Flyout Gap Fix

Hover flyout `ml-1` (4px) ile icon'dan ayrı → mouse bu gap'ten geçerken `onMouseLeave` tetiklenip flyout kapanıyordu.

**Çözüm:** Flyout container'ının sol kenarına `<div className="absolute -left-1 top-0 w-1 h-full" />` eklendi → gap görünmez ama hover alanı içinde kalıyor.

---

## 8. Dosya Yapısı

```
olympus-nextjs/
├── app/
│   ├── page.tsx          # Ana layout, multi-tab sistemi, drag&drop
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global stiller
├── components/
│   ├── Sidebar.tsx       # Collapsible sol panel
│   └── pages/
│       ├── HomePage.tsx           # Modül kartları (anasayfa)
│       ├── AdayUyePage.tsx        # Lead listesi + resizable detay paneli
│       ├── UyelikIslemleriPage.tsx
│       └── KampanyaIslemleriPage.tsx
└── PROJECT.md            # Bu döküman
```

---

## 9. Yapılacaklar / Backlog

### Kısa Vadeli
- [ ] Lead detay paneli: tüm alanların gösterimi (şu an sadece görünür tablo sütunları)
- [ ] Lead ekleme formu
- [ ] Filtreleme ve sıralama işlevselliği
- [ ] Gerçek arama operasyonu akışı

### Orta Vadeli
- [ ] Üyelik İşlemleri sayfası içeriği
- [ ] Kampanya İşlemleri sayfası içeriği
- [ ] Backend entegrasyonu (API katmanı)
- [ ] Gerçek veri ile lead listesi

### Uzun Vadeli
- [ ] Takvim modülü
- [ ] QR kod sistemi
- [ ] İstatistik dashboard'u
- [ ] Çoklu kulüp desteği

---

## 10. Versiyon Geçmişi

| Tarih | Branch | Açıklama |
|---|---|---|
| 24 Mart 2026 | main | Initial commit (Create Next App) |
| 27 Mart 2026 | main | Multi-tab sistemi, sidebar, modül sayfaları |
| 27 Mart 2026 | yavuz-1 | Sol panel flyout gap fix |
| 27 Mart 2026 | ygt-1 | Tahsilat İşlemleri modülü menüye eklendi |
