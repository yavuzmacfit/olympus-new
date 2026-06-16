# Hermes — Ticket Servis Teknik Tasarım Dokümanı

## 1. Genel Mimari

Hermes, Zendesk ile tüm tüketici kanallar (MAC+, Olympus, Chatbot) arasında merkezi bir API katmanıdır. Hiçbir kanal Zendesk'e doğrudan erişmez.

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    MAC+     │     │   Olympus   │     │   Chatbot   │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       └───────────────────┼───────────────────┘
                           │
                  ┌────────▼────────┐
                  │   Hermes API    │
                  └────────┬────────┘
                           │
              ┌────────────┼────────────┐
              ▼                         ▼
       ┌─────────────┐         ┌─────────────┐
       │  Hermes DB  │◄────────│   Zendesk   │
       │ (kendi DB)  │ webhook │             │
       └─────────────┘         └─────────────┘
```

**Okuma işlemleri** (GetTickets) Hermes DB'den yapılır — Zendesk'e gidilmez.  
**Yazma işlemleri** (Create/Update/Close) Zendesk API'sine gönderilir, webhook ile DB'ye yansır.

---

## 2. Üye — Zendesk Eşleştirmesi

### Temel Prensipler

- Her üyenin macfit numarası Zendesk'te `external_id` olarak kayıtlıdır.
- Hermes DB'deki her ticket kaydında `member_id` (macfit numarası) tutulur.
- Ayrı bir mapping tablosuna gerek yoktur.

### Nasıl Dolar?

**Yeni ticket (Hermes üzerinden):**  
CreateTicket isteğinde `requester.external_id` gönderilir. Zendesk response'unda `requester_id` döner. İkisi birlikte DB'ye yazılır.

```json
// İstek
"requester": { "external_id": "1422620" }

// Yanıt
"requester_id": 19109218599836,
"id": 2992550
```

**Her türlü ticket (Zendesk UI, email, agent açışı):**  
Zendesk webhook tetiklenir. Payload'da `{{ticket.requester.external_id}}` varsa `member_id` otomatik kaydedilir.

> **Zorunlu Aksiyon:** Zendesk webhook payload'una `{{ticket.requester.external_id}}` eklenmeli.

### Mevcut Ticketlar İçin Backfill

Webhook güncellenmeden önce açılmış ticketlarda `member_id` boşsa:

```
GET /api/v2/incremental/users?start_time=0
→ 1000'er batch, ~3000 istek, ~8 dakika
→ Gelen (zendesk_user_id, external_id) çiftleri ile DB toplu güncellenir
```

---

## 3. Kimlik Doğrulama

Her kanal Hermes'e `X-Hermes-Api-Key` header'ı ile erişir.

| Kanal   | Tip        |
|---------|------------|
| MAC+    | Per-tenant |
| Olympus | Static key |
| Chatbot | Static key |

**Yetkilendirme kuralları:**
- Üye yalnızca kendi ticketlarını görebilir (`member_id` token'dan doğrulanır)
- Kulüp çalışanı yalnızca kendi kulübüne ait ticketları görebilir
- Chatbot üye adına işlem yaparken `actingAs: memberId` zorunludur

---

## 4. Ortak Tipler

```typescript
type TicketStatus   = "new" | "open" | "pending" | "on_hold" | "solved" | "closed";
type TicketPriority = "low" | "normal" | "high" | "urgent";
type TicketSource   = "mac_plus" | "olympus" | "chatbot";

interface Ticket {
  id:           string;
  subject:      string;
  status:       TicketStatus;
  priority:     TicketPriority;
  group:        string;
  agent:        string | null;
  createdAt:    string;   // ISO 8601
  updatedAt:    string;   // ISO 8601
  resolvedAt?:  string;
  memberId:     string;   // macfit numarası
  clubId:       string;
  category:     string;
  source:       TicketSource;
}

interface PaginatedResponse<T> {
  data:    T[];
  total:   number;
  page:    number;
  limit:   number;
  hasMore: boolean;
}

interface HermesError {
  code:      string;
  message:   string;
  retryable: boolean;
}
```

---

## 5. Servis Kontratları

### 5.1 GetMemberTickets

**Amaç:** Üyenin destek taleplerini listeler.  
**Kaynak:** Hermes DB — Zendesk'e gidilmez.  
**Kullananlar:** MAC+, Olympus, Chatbot

```
GET /hermes/v1/members/{memberId}/tickets
```

| Parametre   | Zorunlu | Varsayılan  | Açıklama                    |
|-------------|---------|-------------|-----------------------------|
| `status`    | Hayır   | —           | Durum filtresi               |
| `startDate` | Hayır   | 3 ay önce   | ISO 8601                    |
| `endDate`   | Hayır   | bugün       | ISO 8601                    |
| `page`      | Hayır   | 1           |                             |
| `limit`     | Hayır   | 20 (max 100)|                             |

**Başarılı Yanıt (200):** `PaginatedResponse<Ticket>`

**Hata Yanıtları:**

| Kod | Hata                  | Açıklama                              |
|-----|-----------------------|---------------------------------------|
| 404 | `MEMBER_NOT_FOUND`    | Üye bulunamadı                        |
| 206 | `STALE_DATA`          | Cache'den döndü, DB güncel değil      |

---

### 5.2 GetClubTickets

**Amaç:** Kulübe ait destek taleplerini listeler.  
**Kaynak:** Hermes DB — Zendesk'e gidilmez.  
**Kullananlar:** Olympus

```
GET /hermes/v1/clubs/{clubId}/tickets
```

| Parametre   | Zorunlu | Varsayılan   | Açıklama                    |
|-------------|---------|--------------|----------------------------|
| `status`    | Hayır   | —            | Durum filtresi              |
| `startDate` | Hayır   | 30 gün önce  | ISO 8601                   |
| `endDate`   | Hayır   | bugün        | ISO 8601                   |
| `page`      | Hayır   | 1            |                            |
| `limit`     | Hayır   | 50 (max 200) |                            |

**Başarılı Yanıt (200):** `PaginatedResponse<Ticket>`

**Hata Yanıtları:** `GetMemberTickets` ile aynı + `CLUB_NOT_FOUND (404)`

---

### 5.3 CreateTicket

**Amaç:** Yeni destek talebi oluşturur.  
**Kullananlar:** MAC+, Olympus, Chatbot

```
POST /hermes/v1/tickets
```

**Request Body:**
```json
{
  "memberId":    "1422620",
  "clubId":      "tunali",
  "subject":     "Uygulamada donma yaşıyorum",
  "description": "Açıklama metni",
  "category":    "mac_digital__eğitmenden_gelen_mesajlar",
  "source":      "mac_plus",
  "actingAs":    "1422620"
}
```

| Alan          | Zorunlu | Açıklama                                       |
|---------------|---------|------------------------------------------------|
| `subject`     | Evet    | Ticket başlığı                                 |
| `description` | Evet    | Açıklama (min 10 karakter)                     |
| `clubId`      | Evet    | İlgili kulüp                                   |
| `category`    | Evet    | Zendesk custom field değeri                    |
| `source`      | Evet    | Açılışı yapan kanal                            |
| `memberId`    | Hayır   | Üyeye bağlı ticket için                        |
| `actingAs`    | Hayır   | Chatbot üye adına açıyorsa zorunlu             |

**Zendesk'e Gönderilen İstek:**
```json
{
  "ticket": {
    "via": { "channel": "application" },
    "custom_fields": [{ "id": 19618839454364, "value": "{{category}}" }],
    "comment": { "body": "{{description}}" },
    "requester": { "external_id": "{{memberId}}" },
    "submitter_id": 19898673731228,
    "subject": "{{subject}}"
  }
}
```

**Başarılı Yanıt (201):**
```json
{
  "id":        "2992550",
  "status":    "new",
  "createdAt": "2026-06-16T12:53:32Z"
}
```

**Hata Yanıtları:**

| Kod | Hata                  | Açıklama                        |
|-----|-----------------------|---------------------------------|
| 400 | `VALIDATION_ERROR`    | Eksik veya geçersiz alan        |
| 503 | `ZENDESK_UNAVAILABLE` | Zendesk'e erişilemiyor          |
| 500 | `CREATE_FAILED`       | Zendesk ticket oluşturamadı     |

---

### 5.4 UpdateTicket

**Amaç:** Ticket durumu, önceliği veya ataması güncellenir.  
**Kullananlar:** Olympus

```
PATCH /hermes/v1/tickets/{ticketId}
```

**Request Body:**
```json
{
  "status":   "pending",
  "priority": "high",
  "comment":  "Teknik ekibe iletildi."
}
```

| Alan       | Açıklama                       |
|------------|--------------------------------|
| `status`   | Yeni durum                     |
| `priority` | Yeni öncelik                   |
| `agentId`  | Yeni atanan agent              |
| `group`    | Yeni grup                      |
| `comment`  | Dahili not (Zendesk'e yazılır) |

**Başarılı Yanıt (200):** Güncellenmiş `Ticket` nesnesi.

---

### 5.5 CloseTicket

**Amaç:** Ticket kapatılır.  
**Kullananlar:** MAC+, Olympus

```
POST /hermes/v1/tickets/{ticketId}/close
```

**Request Body:**
```json
{
  "reason": "Sorun çözüldü.",
  "rating": 4
}
```

| Alan     | Zorunlu | Açıklama               |
|----------|---------|------------------------|
| `reason` | Evet    | Kapatma sebebi         |
| `rating` | Hayır   | Memnuniyet puanı (1-5) |

**Başarılı Yanıt (200):**
```json
{
  "id":       "2992550",
  "status":   "closed",
  "closedAt": "2026-06-16T14:30:00Z"
}
```

---

## 6. Kullanım Dağılımı

| Servis           | MAC+ | Olympus | Chatbot |
|------------------|------|---------|---------|
| GetMemberTickets | ✓    | ✓       | ✓       |
| GetClubTickets   | —    | ✓       | —       |
| CreateTicket     | ✓    | ✓       | ✓       |
| UpdateTicket     | —    | ✓       | —       |
| CloseTicket      | ✓    | ✓       | —       |

---

## 7. Failure / Retry Stratejisi

### Retry Politikası

| Durum                      | Retry | Backoff           | Max Deneme |
|----------------------------|-------|-------------------|------------|
| Zendesk 5xx                | Evet  | 1s → 2s → 4s      | 3          |
| Zendesk timeout (>10s)     | Evet  | 2s → 4s → 8s      | 3          |
| Zendesk 4xx                | Hayır | —                 | 1          |
| Network hatası             | Evet  | 1s → 2s → 4s      | 3          |

### Cache Politikası

| Servis           | Süre      | Stale Veri |
|------------------|-----------|------------|
| GetMemberTickets | 2 dakika  | Evet — HTTP 206 |
| GetClubTickets   | 5 dakika  | Evet — HTTP 206 |
| CreateTicket     | —         | Hayır       |
| UpdateTicket     | —         | Hayır       |
| CloseTicket      | —         | Hayır       |

Stale veri döndüğünde response header'a eklenir:
```
X-Hermes-Stale: true
X-Hermes-Cache-Age: 420
```

**Kullanıcıya gösterilecek mesaj:**
> "Destek talepleriniz şu an güncellenemiyor. Son bilinen veriler gösteriliyor."

---

## 8. Monitoring ve Alarmlar

| Metrik                              | Uyarı       | Kritik      |
|-------------------------------------|-------------|-------------|
| Zendesk yanıt süresi (p95)          | > 3 saniye  | > 8 saniye  |
| Ticket okuma hata oranı             | > %5        | > %20       |
| Ticket oluşturma hata oranı         | > %2        | > %10       |
| Cache stale oranı                   | > %30       | > %70       |
| Kesintisiz veri alınamayan süre     | > 5 dakika  | > 15 dakika |

**Alarm Kanalları:**
- Uyarı seviyesi → Slack `#hermes-alerts`
- Kritik seviye → Slack `#hermes-alerts` + PagerDuty

---

## 9. Implementasyon Sırası

| Sıra | İş                              | Not                                      |
|------|---------------------------------|------------------------------------------|
| 1    | Webhook'a `external_id` ekle    | Tüm servislerin temeli                   |
| 2    | Backfill (incremental export)   | Mevcut ticketlara `member_id` yaz        |
| 3    | GetMemberTickets                | En yüksek kullanım hacmi                 |
| 4    | GetClubTickets                  | Olympus dashboard için kritik            |
| 5    | CreateTicket                    | Chatbot entegrasyonu bekliyor            |
| 6    | UpdateTicket                    | Olympus için                             |
| 7    | CloseTicket                     | Son kullanıcı akışını tamamlar           |
| 8    | Retry + Cache layer             | Production'a çıkmadan zorunlu            |
| 9    | Monitoring alarmları            | Canlıya geçişte hazır olmalı             |
