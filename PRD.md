# PRD — Olympus Operasyon Yönetim Platformu

> **Hazırlayan:** Yavuz Karavelioğlu (Product Manager)
> **Versiyon:** 0.2 — Nisan 2026
> **Durum:** Prototip aşaması
> **Hedef:** Backend ve frontend ekiplerine iletilecek gereksinim belgesi

---

## 1. Ürün Vizyonu

Olympus, spor kulüpleri (gym, fitness center) için geliştirilmiş bir **iç operasyon yönetim platformudur.** Satış ekiplerinin lead'leri takip etmesini, üyelik işlemlerini yönetmesini ve kampanya süreçlerini tek bir arayüzden yürütmesini sağlar.

### Hedef Kullanıcılar

| Rol | Birincil Görev |
|---|---|
| Satış Temsilcisi | Lead takibi, arama operasyonları |
| Üyelik Danışmanı | Sözleşme, ödeme, üye bilgisi güncelleme |
| Kampanya Yöneticisi | Promosyon, indirim, referans kampanyaları |

---

## 2. Modüller

### 2.1 Aday Üye (Lead Yönetimi)
Spor kulübüne ilgi gösteren potansiyel üyelerin (lead) listelenmesi, takibi ve aranması.

### 2.2 Üyelik İşlemleri
Mevcut üyelerin sözleşme, ödeme ve bilgi güncelleme işlemleri.

### 2.3 Kampanya İşlemleri
Ek indirim tanımlamaları, promosyon kodları, banka indirimleri, referans ve dondurma kampanyaları.

---

## 3. Genel Arayüz Mimarisi

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR (48px, #171a1d)                                 │
│  [Logo] [Anasayfa][Tab1][Tab2]...    [Phone][Bell][User]│
├──────────┬──────────────────────────────────────────────┤
│ SIDEBAR  │  SAYFA İÇERİĞİ                               │
│ (56/256px)│  (her modül kendi sayfasını render eder)    │
└──────────┴──────────────────────────────────────────────┘
```

### 3.1 Renk Paleti (Design Tokens)

| Kullanım | Değer |
|---|---|
| Navbar / Sidebar arkaplanı | `#171a1d` |
| Sayfa arkaplanı | `#f5f8fa` |
| Birincil aksiyon (kırmızı) | `#df1d2f` |
| Hover kırmızı | `#b91827` |
| Aktif sidebar öğesi | `#80111b` |
| Aktif tab arkaplanı | `#f5f8fa` |

---

## 4. Navbar — Çok Sekmeli (Multi-Tab) Sistem

Chrome benzeri sekme sistemi. Her modül açıldığında kendi sekmesini oluşturur.

### 4.1 Sekme Davranışları

| Durum | Davranış |
|---|---|
| Modüle tıklandı | Zaten açıksa o sekmeye geçer, yoksa yeni sekme açar |
| Sekme kapatıldı | Soldaki sekmeye geçer; o da yoksa sağdakine; ikisi de yoksa Anasayfa'ya döner |
| Sekmeler arası geçiş | Sayfa state'i **korunur** — CSS `hidden` ile gizlenir, unmount yapılmaz |
| Anasayfa sekmesi | Her zaman en solda, sabit, **kapatılamaz** |

### 4.2 Sürükleme (Drag & Drop)

- Teknoloji: Pointer Events API (`setPointerCapture`) — HTML5 Drag API kullanılmaz
- Anasayfa sekmesi sürüklenemez
- Sürükleme sırasında sekmenin kendisi hareket eder (ghost image yok)
- Bırakıldıktan sonra FLIP animasyonu uygulanır (300ms `cubic-bezier(0.2, 0, 0, 1)`)

### 4.3 Görsel Detaylar

- Aktif sekmenin sol ve sağ alt köşelerinde **concave köşe** efekti uygulanır
- Sekme aralarında 12px `Junction` alanı; ikisi de aktif değilse ortada ince beyaz çizgi görünür

---

## 5. Sidebar (Sol Panel)

| Özellik | Değer |
|---|---|
| Kapalı genişlik | 56px |
| Açık genişlik | 256px |
| Geçiş animasyonu | `transition-all duration-200` |

### 5.1 Kapalı Mod Davranışları

- İkon üzerine hover → alt menüsüz öğelerde **tooltip**, alt menülü öğelerde **flyout panel** açılır
- Flyout panel ile ikon arasındaki 4px boşluktan geçerken kapanmayı engellemek için görünmez köprü `div` kullanılır

### 5.2 Modüle Göre Dinamik Menü

**Aday Üye:** Anasayfa, İstatistikler, Aday Üye (Listesi / Takvim / QR / Farklı Kulübe Gidenler), Takvim

**Üyelik İşlemleri:** Anasayfa, Üyelik İşlemleri, Üye Bilgisi Güncelle, Borçlu Üye Tahsilatı

**Kampanya İşlemleri:** Anasayfa, Ek İndirim, Promosyon Kodu Oluştur/Listele, Banka İndirimi, Referans Kampanyası, Dondurma Kampanyası

---

## 6. Aday Üye Sayfası

### 6.1 Operasyon Banner'ı

Sayfanın üstünde sabit banner. İçerik:
- Bugün Gelen Lead sayısı
- Hot Lead sayısı
- Bekleyen arama sayısı
- Satış sayısı
- **"Şimdi Aramaya Başla"** CTA butonu (`#df1d2f`)

### 6.2 Görünüm Modu Seçici (Lead'ler / Üyeler)

Toolbar'ın sol üstündeki "Lead'ler" butonu bir dropdown açar:

| Seçenek | Davranış |
|---|---|
| **Lead'ler** | Varsayılan. "Tüm Lead'ler" / "Lead'lerim" tab'ları + lead tablosu görünür |
| **Üyeler** | Tab'lar ve lead tablosu gizlenir. Sadece TCKN / Üye No arama kutusu gösterilir |

**Üyeler modunda kurallar:**
- "Tüm Lead'ler" ve "Lead'lerim" tab'ları gösterilmez; üye listesi görüntülenmez
- Toolbar Row 2'de sadece arama kutusu ve arama tipi dropdown'ı bulunur (diğer araçlar — filtrele, sırala, sütun düzenle vb. — gösterilmez)
- Arama tipi dropdown'ı (leads modundaki "Table view" konumunda): **TCKN ile Ara** / **Üye No ile Ara** seçenekleri içerir
- Arama tipi değiştirildiğinde sorgu alanı sıfırlanır
- **TCKN validasyonu:** Tam olarak 11 rakam girilmesi zorunludur; hatalıysa hata mesajı gösterilir, arama yapılmaz
- Eşleşen üye sonuç tablosunda gösterilir (Ad Soyad, Üye No, Üyelik Tipi, Kulüp, Başlangıç, Bitiş, Durum)
- Tablodaki satıra tıklandığında sağda üye detay paneli açılır (lead detay paneliyle aynı genişlik/resize/expand kuralları geçerlidir)
- Eşleşme yoksa "Eşleşen üye bulunamadı" mesajı gösterilir
- Amaç: Satış temsilcisi TCKN/üye no bilmeden üyeyle ilgili işlem yapamaz

### 6.3 Lead Tablosu

#### Sütun Tanımları

| Sütun | Sabit mi? | Varsayılan Görünür |
|---|---|---|
| ID | ✅ Sabit | ✅ |
| Ad | ✅ Sabit | ✅ |
| Soyad | ✅ Sabit | ✅ |
| Telefon | ✅ Sabit | ✅ |
| E-Posta | ⬜ Açılıp kapatılabilir | ✅ |
| Kulüp Adı | ⬜ | ⬜ |
| Satış Temsilcisi | ⬜ | ✅ |
| Oluşturma Tarihi | ⬜ | ✅ |
| Kaynak | ⬜ | ✅ |
| Kaynak Detay | ⬜ | ✅ |
| Statü | ⬜ | ✅ |
| Görev Tarihi | ⬜ | ✅ |
| Ayr. Üyelik Tipi | ⬜ | ⬜ |
| Ayr. Üyelik Süresi | ⬜ | ⬜ |
| İş Bankası KK Tipi | ⬜ | ⬜ |
| İletişim İzni | ⬜ | ✅ |
| SMS Onay | ⬜ | ✅ |

#### Statü Renk Kodlaması

| Statü | Renk |
|---|---|
| Yeni Lead | Mavi |
| Sıcak Lead | Kırmızı |
| Arandı | Sarı |
| Takip | Mor |
| Ulaşılamadı | Gri |

#### Tablo Araç Çubuğu

- Arama kutusu
- Table view seçici
- **Sütunları Düzenle** — dropdown ile toggle, sabit sütunlar disable
- Filtrele, Sırala, Dışa Aktar, Kaydet butonları
- **Lead Ekle** butonu (`#df1d2f`) — sağ paneli form modunda açar

---

## 7. Lead Detay Paneli (Sağ Panel)

### 7.1 Açılma / Kapanma

- Tablodaki satıra tıklandığında sağdan açılır
- Aynı satıra tekrar tıklamak paneli kapatır
- Farklı bir satıra tıklamak o lead'i açar; panel **mevcut genişlikte** kalır

### 7.2 Genişlik Kuralları

| Özellik | Değer |
|---|---|
| Varsayılan genişlik | 320px |
| Minimum genişlik | 320px — kullanıcı default'tan küçültemez |
| Snap eşiği | Container genişliğinin **%50**'si |
| Snap davranışı | Eşik aşılırsa animasyonlu tam genişliğe snap eder |

#### Genişlik Hafızası
- Kullanıcı panel genişliğini ayarladıktan sonra **farklı bir lead'e tıklarsa** panel o genişlikte açılır
- Her lead seçiminde kullanıcıyı yeniden ayar yapmaya zorlamak kabul edilemez

#### Animasyon Kuralları
- **Sürükleme sırasında:** Animasyon yok, anlık takip
- **Snap / Collapse anında:** `width 220ms cubic-bezier(0.4, 0, 0.2, 1)`, sağ kenar sabit (panel sola doğru büyür)

### 7.3 Genişletme / Daraltma Butonları

Panel genişliğine göre hangi butonların göründüğü:

Aksiyon satırı iki bölüme ayrılır:

**Sol:** Expand butonu (panel full değilse) + "Kaydı Görüntüle" linki

**Sağ:** Panel genişliğine göre değişir —

| Panel Durumu | Sağ Taraf |
|---|---|
| Default genişlik (320px) | Boş |
| Default'tan geniş (> 320px) | **Collapse** butonu (PanelLeftClose ikonu) |
| Tam genişlik (full expand) | **Collapse** butonu (PanelLeftClose ikonu) |

- Collapse → Default genişliğe döner
- X (kapat) → Panel full expanded'dan kapanırsa default'a sıfırlar; değilse mevcut genişliği korur

### 7.4 Responsive İçerik Düzeni

Her yeni bölüm eklenirken **üç durum** için ayrı düzen tanımlanmalıdır:

| Durum | Kriter | Düzen Prensibi |
|---|---|---|
| Dar | 320px (default) | Dikey yığın |
| Orta | > 420px | Yatay satır — etiket solda, değer sağda |
| Genişletilmiş | Full width | Grid (2–3 kolon) |

> ⚠️ **Kural:** Panele yapılan her geliştirmede dar / orta / genişletilmiş durumlarının tamamı tasarlanmalıdır. Yalnızca bir durum için tasarım yapmak kabul edilemez.

### 7.5 İkon Tab Çubuğu

Panelin üst bölümünde yatay ikon tab çubuğu bulunur.

**Davranış Kuralları:**
- Panel genişliğine göre kaç ikon sığıyorsa otomatik olarak o kadarı gösterilir
- Sığmayan ikonlar **"Daha"** butonuna hover'da açılan menüde listelenir — tıklama gerekmez
- "Daha" menüsü hover ile açılır, 150ms gecikme ile kapanır (mouse geçişlerinde kapanmayı önlemek için)
- İkonlar sol dayalıdır, yayılmaz

**Mevcut Sekmeler:**

| Sekme | İkon | Açıklama |
|---|---|---|
| Profil | User | Lead'in profil özeti |
| Kişi Kartı | ClipboardList | Tablo sütunlarına dayalı detay bilgileri |
| Not | FileText | Not ekleme |
| E-Posta | Mail | E-posta gönderme |
| Ara | Phone | Arama başlatma |
| Görev | CheckSquare | Görev oluşturma |
| Randevu | CalendarDays | Randevu oluşturma |
| Aktivite | Activity | Aktivite geçmişi |
| Dosyalar | FolderOpen | İlgili dosyalar |
| SMS | MessageSquare | SMS gönderme |
| Hatırlatıcı | Bell | Hatırlatıcı oluşturma |

**Aktif sekme gösterimi:** İkon kenarlığı ve etiketi kırmızı (`#df1d2f`), dolgu yok

**Sekme değişimi:** Lead değiştirildiğinde sekme **Profil'e** sıfırlanır

### 7.6 Profil Sekmesi İçeriği

**Dar modda:** Avatar (küçük) + ad/soyad/kulüp dikey yığın + iletişim bilgileri + statü + Lead Özeti kartı (oluşturma, kaynak, görev tarihi, satış temsilcisi)

**Orta modda:** Avatar yatay + iletişim bilgileri yan yana + 2×2 özet grid

**Genişletilmiş modda:** 2 kolon — sol: avatar (büyük) + iletişim; sağ: 2×3 özet grid kartı

### 7.7 Kişi Kartı Sekmesi İçeriği

Tabloda o an görünür olan sütunların tamamı listelenir. Sütun kapatılırsa panelden de kalkar.

**Profil sekmesi iki kart içerir:**

**1. Lead Özeti kartı** (mavi sol kenarlık)
- Başlık: "Lead Özeti" + `+ AI` butonu
- Leadın kaynağı, statüsü, satış temsilcisi ve görev tarihine dayalı otomatik özet metin
- Sağ üstte yenile ikonu

**2. Antrenman Geçmişi kartı** (yeşil sol kenarlık)
- Başlık: "Antrenman Geçmişi" + `+ AI` butonu
- MAC+ uygulamasındaki antrenman geçmişine dayalı satış hinleri; her giriş zaman damgası (ör. "1 HAFTA ÖNCE"), süre ve tür içerir
- Amaç: Satış temsilcisine görüşmede kullanabileceği kişiselleştirilmiş bilgi sunmak

**Genişletme davranışı:**
- Varsayılan: yalnızca en son 1 antrenman girişi gösterilir
- Kartın sağ altında **"Diğer antrenmanlar (N)"** butonu bulunur — tıklandığında kart genişler, tüm geçmiş listelenir
- Maksimum görünür giriş sayısı **3**; 3'ten fazla giriş varsa liste içinde scroll aktif olur (`max-height: 3 × 120px`, `overflow-y: auto`)
- Tekrar tıklandığında "Gizle" olarak değişir, kart varsayılan durumuna döner

**Ders takvimi accordion (yoga örneği):**
- Bir giriş metni içinde tıklanabilir ders bağlantısı bulunabilir (ör. "2 yoga dersi")
- Bağlantıya tıklandığında giriş kartının altında yaklaşan ders takvimi accordion olarak açılır
- Tekrar tıklandığında kapanır

> Backend notu: Bu veriler MAC+ fitness uygulamasından çekilecek. Lead'in kulüp üyeliği ve antrenman logları API üzerinden sorgulanacak. Ders takvimi kulübün aktif seanslarından çekilecek.

---

**Dar ve orta modda:** Yatay satır — etiket solda, değer sağa hizalı, her satırın altında ince border

**Genişletilmiş modda:** 3 kolonlu grid

---

## 8. Lead Ekleme Formu

### 8.1 Açılma
"Lead Ekle" butonuna tıklandığında sağ panel **form modunda** açılır. Aynı genişlik kuralları geçerlidir (expand/collapse dahil).

### 8.2 Form Alanları

| Alan | Zorunlu | Tip |
|---|---|---|
| Ad | ✅ | Text |
| Soyad | ✅ | Text |
| Ülke Kodu | ✅ | Text (varsayılan: 90) |
| Telefon | ✅ | Text |
| E-posta | ⬜ | Email |
| Cinsiyet | ⬜ | Radio (Kadın / Erkek) |
| Doğum Tarihi | ⬜ | Date |
| Ülke | ⬜ | Text (varsayılan: Turkey) |
| Kaynak Bilgileri | ✅ | Select |

**Kaynak seçenekleri:** Instagram, TikTok, Google, Web Sitesi, Referans, Diğer

### 8.3 OTP Doğrulama Akışı

"Devam Et" butonuna tıklandığında form doğrulanır. Zorunlu alanlar eksiksizse **OTP modal'ı** açılır.

**OTP Modal İçeriği:**
- Telefon ikonu (gri daire içinde)
- Başlık: "Telefon numaranızı doğrulayın"
- Girilen telefon numarası (maskelenmiş format)
- 4 ayrı rakam input kutusu — otomatik odak geçişi, backspace ile geri
- 3 dakika geri sayım sayacı (`MM:SS`)
- **Geri** butonu → modal kapanır, forma döner
- **Kodu Doğrula** butonu (teal) → 4 hane dolu olduğunda aktifleşir
- "Yeniden Gönder" linki → sayaç sıfırlanır
- "Whatsapp ile Gönder" linki

**Başarılı doğrulama sonrası:** Lead listeye eklenir, form kapanır, yeni lead detay panelinde açılır.

---

## 9. Teknik Notlar (Frontend)

### State Yönetimi
- Global state yok (Redux / Context kullanılmıyor)
- Tüm state `page.tsx`'de `useState` ile yönetiliyor
- Modül değişimi mount/unmount yapmaz; `hidden` CSS sınıfıyla gizleme yapılır → state korunur

### Drag & Drop (Sekme Sürükleme)
```
startDrag → setPointerCapture → snapshot tab positions
moveDrag  → translateX hesapla → hoverIndex güncelle
endDrag   → preFlipPositions kaydet → setTabs reorder → setDragState(null)
useLayoutEffect → FLIP animasyonu uygula
```

### Panel Resize
- Sol kenarda görünmez sürükleme tutacağı (`cursor-col-resize`)
- `setPointerCapture` ile pointer, element dışına çıksa bile event alınır
- Snap sırasında `position: absolute; right: 0` — sağ kenar sabit kalır, panel sola doğru büyür

### ResizeObserver
- Panel container'ı `ResizeObserver` ile izlenir
- Container genişliği değiştiğinde ikon tab çubuğu otomatik olarak yeniden hesaplanır

---

## 10. Teknik Notlar (Backend)

### Lead (Aday Üye) Entity

```
Lead {
  id:               number
  ad:               string
  soyad:            string
  telefon:          string
  eposta:           string
  kulupad:          string
  satisTemsilcisi:  string
  olusturmaTarihi:  date
  kaynak:           enum (Instagram | TikTok | Google | Web Sitesi | Referans | Diğer)
  kaynakDetay:      string
  statu:            enum (Yeni Lead | Sıcak Lead | Arandı | Takip | Ulaşılamadı)
  gorevTarihi:      date | null
  ayrUyelikTipi:    string | null
  ayrUyelikSuresi:  string | null
  isBankasiKKTipi:  string | null
  iletisimIzni:     boolean
  smsOnay:          boolean
}
```

### OTP Akışı

1. `POST /otp/send` — `{ telefon: string }` → SMS gönder, `{ otpId: string }` dön
2. `POST /otp/verify` — `{ otpId: string, code: string }` → `{ verified: boolean }` dön
3. Doğrulama başarılıysa `POST /leads` isteği atılır

### İstenen API Yapısı

- RESTful
- Pagination: `GET /leads?page=1&limit=25`
- Filtreleme: `GET /leads?statu=Yeni Lead&kaynak=Instagram`
- Sıralama: `GET /leads?sort=olusturmaTarihi&order=desc`

---

## 11. Dosya Yapısı (Frontend)

```
olympus-nextjs/
├── app/
│   ├── page.tsx                      # Ana layout, multi-tab, drag&drop
│   ├── layout.tsx                    # Root layout
│   └── globals.css                   # Global stiller
├── components/
│   ├── Sidebar.tsx                   # Collapsible sol panel
│   └── pages/
│       ├── HomePage.tsx              # Modül kartları (anasayfa)
│       ├── AdayUyePage.tsx           # Lead listesi + sağ panel
│       ├── UyelikIslemleriPage.tsx   # (İçerik bekleniyor)
│       └── KampanyaIslemleriPage.tsx # (İçerik bekleniyor)
├── PRD.md                            # Bu döküman
└── PROJECT.md                        # Teknik implementasyon notları
```

---

## 12. Backlog

### Kısa Vadeli
- [ ] Filtreleme ve sıralama işlevselliği
- [ ] Gerçek arama operasyonu akışı
- [ ] Lead statü güncelleme
- [ ] Not / Görev / Randevu sekmeleri içeriği

### Orta Vadeli
- [ ] Backend API entegrasyonu
- [ ] Gerçek lead verisi
- [ ] Üyelik İşlemleri sayfası içeriği
- [ ] Kampanya İşlemleri sayfası içeriği
- [ ] Kullanıcı kimlik doğrulama

### Uzun Vadeli
- [ ] Takvim modülü
- [ ] QR kod sistemi
- [ ] İstatistik dashboard'u
- [ ] Çoklu kulüp desteği
- [ ] Mobil uyumluluk

---

## 13. Versiyon Geçmişi

| Tarih | Versiyon | Değişiklik |
|---|---|---|
| Mart 2026 | 0.1 | İlk prototip — multi-tab, sidebar, modül sayfaları |
| Nisan 2026 | 0.2 | Lead tablosu, sağ panel, OTP akışı, ikon tab çubuğu |
