# Hermes — Zendesk Entegrasyon POC

> Ticket'ları dinle, işle, raporla. Hiçbir şey kaçmaz.

**Hazırlayan:** Handenur Coşkun
**Tarih:** 2026-04-10
**Durum:** POC / İlk Taslak

---

## 1. Amaç

Zendesk'teki ticket hareketlerini gerçek zamanlı dinleyip kendi veri tabanımıza yazarak;
- Ham rapor (ticket yaşam döngüsü)
- Agent raporu
- SLA raporu
- Kulüp bazlı dashboard

sayfalarını canlı verilerle çalıştırmak.

---

## 2. Genel Mimari

```
Zendesk
  │
  │  (Webhook Event — HTTP POST)
  ▼
[Webhook Receiver API]   ← /api/webhooks/zendesk
  │  - İmza doğrulama (HMAC-SHA256)
  │  - HTTP 200 dön, işlemi kuyruğa at
  ▼
[Message Queue]          ← Redis / BullMQ / RabbitMQ (önerilir)
  │  - Asenkron işleme
  │  - Retry mekanizması
  ▼
[Event Processor]
  │  - Payload parse
  │  - DB yazma (upsert)
  │  - Lifecycle kaydı
  ▼
[PostgreSQL / MySQL]
  │
  ▼
[REST API / GraphQL]     ← Dashboard frontend'i buradan besler
  │
  ▼
[Olympus Frontend]       ← Mevcut Next.js uygulaması
```

> **Neden kuyruk?**
> Zendesk webhook'u 10 saniye içinde HTTP 200 görmezse timeout sayar.
> Endpoint anında 200 döner, ağır DB işlemi kuyrukta işlenir.

---

## 3. Zendesk Webhook Kurulumu

### 3.1 Hangi Events Dinlenecek

| Event | Ne zaman tetiklenir | Dashboard'da kullanım |
|---|---|---|
| `ticket.created` | Yeni ticket açıldığında | Açılış tarihi, kategori, kulüp |
| `ticket.updated` | Herhangi bir alan değiştiğinde | Durum takibi |
| `ticket.assignee_changed` | Agent ataması değiştiğinde | Agent lifecycle |
| `ticket.group_changed` | Grup değiştiğinde | Grup geçiş sayısı, lifecycle |
| `ticket.status_changed` | Durum değiştiğinde | SLA hesabı, açık/kapalı |
| `ticket.solved` | Çözüldü durumuna geçtiğinde | Çözüm süresi, SLA |
| `ticket.closed` | Kapatıldığında | Final durum |
| `ticket.priority_changed` | Öncelik değiştiğinde | Eskalasyon takibi |

> **Tek webhook yeter mi?**
> Evet. Zendesk'te bir webhook oluştururken birden fazla event subscribe edilebilir.
> `ticket.created`, `ticket.assignee_changed`, `ticket.group_changed`,
> `ticket.status_changed`, `ticket.solved`, `ticket.closed` subscribe edilirse
> tüm lifecycle yakalanır.

### 3.2 Zendesk'te Webhook Oluşturma

Admin Center → Apps and Integrations → Webhooks → Create Webhook

```json
{
  "webhook": {
    "name": "MACFit Destek Dashboard",
    "status": "active",
    "endpoint": "https://api.macfit.com.tr/webhooks/zendesk",
    "http_method": "POST",
    "request_format": "json",
    "subscriptions": [
      "zen:event-type:ticket.created",
      "zen:event-type:ticket.assignee_changed",
      "zen:event-type:ticket.group_changed",
      "zen:event-type:ticket.status_changed",
      "zen:event-type:ticket.solved",
      "zen:event-type:ticket.closed",
      "zen:event-type:ticket.priority_changed"
    ]
  }
}
```

### 3.3 Gelen Webhook Payload Örneği (ticket.group_changed)

```json
{
  "id": "01HXYZ...",
  "type": "zen:event-type:ticket.group_changed",
  "account_id": "123456",
  "time": "2026-04-10T09:15:00Z",
  "detail": {
    "id": 2570671,
    "subject": "Tunalı Çalışma Saatleri",
    "status": "open",
    "priority": "normal",
    "group_id": 900001234,
    "assignee_id": 112233,
    "requester_id": 445566,
    "organization_id": 778899,
    "created_at": "2026-04-01T06:00:00Z",
    "updated_at": "2026-04-10T09:15:00Z",
    "tags": ["kulup-tunali", "operasyon"],
    "via": { "channel": "email" },
    "custom_fields": [
      { "id": 36001234, "value": "operasyon" },
      { "id": 36001235, "value": "tunali" }
    ]
  },
  "event": {
    "previous_group_id": 900001100,
    "current_group_id": 900001234
  }
}
```

> **Önemli:** `solved_at` / `closed_at` Zendesk payload'unda doğrudan gelmez.
> `ticket.solved` eventini aldığında `updated_at` veya kendi `received_at` timestampini kaydet.

---

## 4. Veri Tabanı Şeması

### 4.1 `tickets` tablosu

```sql
CREATE TABLE tickets (
  id              BIGINT PRIMARY KEY,        -- Zendesk ticket ID
  subject         TEXT NOT NULL,
  status          VARCHAR(20),               -- new, open, pending, hold, solved, closed
  priority        VARCHAR(20),               -- low, normal, high, urgent
  channel         VARCHAR(50),               -- email, chat, web, phone
  requester_id    BIGINT,
  organization_id BIGINT,
  group_id        BIGINT,
  assignee_id     BIGINT,
  category        VARCHAR(100),              -- custom field'dan
  club_tag        VARCHAR(100),              -- custom field / tag'dan
  created_at      TIMESTAMPTZ NOT NULL,
  updated_at      TIMESTAMPTZ,
  solved_at       TIMESTAMPTZ,
  closed_at       TIMESTAMPTZ,
  first_assigned_at TIMESTAMPTZ,            -- ilk atanma zamanı
  raw_payload     JSONB                      -- orijinal payload, ileride lazım olur
);
```

### 4.2 `ticket_lifecycle` tablosu

Her grup/agent değişimi bir satır. SLA, lifecycle ve agent raporu buradan hesaplanır.

```sql
CREATE TABLE ticket_lifecycle (
  id          SERIAL PRIMARY KEY,
  ticket_id   BIGINT REFERENCES tickets(id),
  event_type  VARCHAR(50),                   -- assigned, group_changed, status_changed
  group_id    BIGINT,
  group_name  VARCHAR(200),
  agent_id    BIGINT,
  agent_name  VARCHAR(200),
  from_status VARCHAR(20),
  to_status   VARCHAR(20),
  occurred_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER                   -- bir sonraki event'a kadar geçen süre
                                             -- (processor tarafından hesaplanır)
);
```

### 4.3 `zendesk_groups` tablosu (lookup)

```sql
CREATE TABLE zendesk_groups (
  id    BIGINT PRIMARY KEY,
  name  VARCHAR(200) NOT NULL
);
```

### 4.4 `zendesk_agents` tablosu (lookup)

```sql
CREATE TABLE zendesk_agents (
  id    BIGINT PRIMARY KEY,
  name  VARCHAR(200) NOT NULL,
  email VARCHAR(200)
);
```

---

## 5. Webhook Receiver Endpoint

```
POST /api/webhooks/zendesk
```

### Pseudo-kod (Node.js / Express örneği)

```typescript
app.post('/api/webhooks/zendesk', async (req, res) => {
  // 1. İmza doğrula
  const signature = req.headers['x-zendesk-webhook-signature'];
  const timestamp = req.headers['x-zendesk-webhook-signature-timestamp'];
  const body = req.rawBody; // raw string body gerekli

  const expected = base64(hmacSHA256(
    secret,
    timestamp + body
  ));

  if (!timingSafeEqual(signature, expected)) {
    return res.status(401).send('Invalid signature');
  }

  // 2. Hemen 200 dön (Zendesk 10sn timeout'u var)
  res.status(200).send('OK');

  // 3. Kuyruğa at (asenkron işleme)
  await queue.add('zendesk-event', req.body);
});
```

### Event Processor

```typescript
queue.process('zendesk-event', async (job) => {
  const { type, detail, event, time } = job.data;
  const ticketId = detail.id;

  // Ticket'ı upsert et
  await db.tickets.upsert({
    id: ticketId,
    subject: detail.subject,
    status: detail.status,
    priority: detail.priority,
    group_id: detail.group_id,
    assignee_id: detail.assignee_id,
    category: getCustomField(detail.custom_fields, CATEGORY_FIELD_ID),
    club_tag: getClubFromTags(detail.tags),
    updated_at: detail.updated_at,
    ...(type === 'ticket.solved'  && { solved_at: time }),
    ...(type === 'ticket.closed'  && { closed_at: time }),
    ...(type === 'ticket.created' && { created_at: detail.created_at }),
  });

  // Lifecycle kaydı ekle
  await db.ticket_lifecycle.insert({
    ticket_id: ticketId,
    event_type: type.replace('zen:event-type:ticket.', ''),
    group_id: detail.group_id,
    agent_id: detail.assignee_id,
    from_status: event?.previous_status ?? null,
    to_status: event?.current_status ?? null,
    occurred_at: time,
  });
});
```

---

## 6. Dashboard için Gerekli API Endpointleri

### Ham Rapor
```
GET /api/reports/tickets
  ?start_date=2026-04-01
  &end_date=2026-04-08
  &status[]=open&status[]=solved
  &group_id=900001234
  &agent_id=112233
  &category=Teknik
```

### Agent Raporu
```
GET /api/reports/agents
  ?start_date=...
  &end_date=...
  &group_id=...
  &category=...
```

### SLA Raporu (Grup bazlı özet)
```
GET /api/reports/sla
  ?start_date=...
  &end_date=...
  &category[]=Teknik&category[]=Üyelik

-- Dönen: group_name, total, on_time, breached, avg_resolution_min, sla_pct
```

### Dashboard (Kulüp bazlı özet)
```
GET /api/reports/dashboard
  ?period=daily|weekly|monthly
  &start_date=...  (özel aralık için)
  &end_date=...

-- Dönen: club, open, closed, assigned, unassigned, avg_open_hours, sla_pct
```

### Ticket Lifecycle Detayı
```
GET /api/tickets/:id/lifecycle
-- Dönen: lifecycle adımları, süreler, gruplar, agentlar
```

---

## 7. SLA Hesabı

Zendesk'in kendi SLA politikaları yerine kendi kuralımızı uygulayacağız:

```sql
-- Ticket bazlı çözüm süresi
SELECT
  t.id,
  t.subject,
  t.group_id,
  EXTRACT(EPOCH FROM (t.solved_at - t.created_at)) / 60 AS resolution_minutes,
  CASE
    WHEN EXTRACT(EPOCH FROM (t.solved_at - t.created_at)) / 60 <= 3600 THEN 'on_time'
    ELSE 'breached'
  END AS sla_status
FROM tickets t
WHERE t.solved_at IS NOT NULL
  AND t.created_at BETWEEN '2026-04-01' AND '2026-04-08';
```

SLA eşiği şu an 3600 dk (60 saat) olarak frontend'de tanımlı.
Kategoriye göre farklı eşik istenirse `sla_rules` tablosu eklenebilir:

```sql
CREATE TABLE sla_rules (
  category    VARCHAR(100) PRIMARY KEY,
  threshold_minutes INTEGER NOT NULL
);
```

---

## 8. Kulüp Eşleştirmesi

### 8.1 Grup Adı Yapısı

Her kulüp için Zendesk'te **iki grup** bulunuyor:

| Zendesk Grup Adı | Tür | Üye Sayısı (örnek) | Açıklama |
|---|---|---|---|
| `Buyaka` | Çalışan | 9 | Kulüp çalışanları |
| `KM-KMY Buyaka` | Yönetim | 3 | Kulüp müdürü / yönetimi |

Bu yapı tüm kulüpler için geçerli:
- Çalışan grubu: `{Kulüp Adı}` (örn. `Buyaka`, `Tunalı`, `Ankamall`)
- Yönetim grubu: `KM-KMY {Kulüp Adı}` (örn. `KM-KMY Buyaka`)

### 8.2 Kulüp Adı Çıkarma Stratejisi

Grup adından kulüp adı prefix/suffix silerek parse edilebilir:

```typescript
function extractClubName(groupName: string): string {
  return groupName
    .replace(/^KM-KMY\s+/, '')   // başındaki "KM-KMY " prefix'ini kaldır
    .trim();
  // "KM-KMY Buyaka" → "Buyaka"
  // "Buyaka"         → "Buyaka"
}

function getGroupType(groupName: string): 'management' | 'staff' {
  return groupName.startsWith('KM-KMY ') ? 'management' : 'staff';
}
```

### 8.3 Grup Türleri

Zendesk'teki gruplar üç tipe ayrılır:

| Tür | Örnekler | `club_id` | Dashboard'da |
|---|---|---|---|
| `club_staff` | `Buyaka`, `Tunalı` | dolu | Kulüp adı altında birleştirilir |
| `club_management` | `KM-KMY Buyaka`, `KM-KMY Tunalı` | dolu | Kulüp adı altında birleştirilir |
| `central` | `Yazılım 1`, `MAC Ürün Yönetimi` | NULL | Kendi adıyla ayrı satır |

**Dashboard kuralı:**
- `club_staff` + `club_management` → aynı kulübün metrikleri → **tek satırda birleşir** (örn. `Buyaka`)
- `central` → kendi grup adıyla ayrı satır olarak dashboard'da görünür

### 8.4 Veritabanı Şeması — Grup & Kulüp

```sql
-- Kulüpler tablosu (sadece fiziksel kulüpler)
CREATE TABLE clubs (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(200) NOT NULL UNIQUE  -- "Buyaka", "Tunalı", "Ankamall"
);

-- Zendesk grupları tablosu
CREATE TABLE zendesk_groups (
  id            BIGINT PRIMARY KEY,
  name          VARCHAR(200) NOT NULL,   -- "KM-KMY Buyaka", "Yazılım 1"
  type          VARCHAR(20) NOT NULL,    -- 'club_staff' | 'club_management' | 'central'
  club_id       INT REFERENCES clubs(id) -- NULL ise merkezi grup
);
```

`type` belirleme mantığı:
```typescript
function classifyGroup(groupName: string): 'club_management' | 'club_staff' | 'central' {
  if (groupName.startsWith('KM-KMY ')) return 'club_management';

  // Bilinen merkezi grupları listeyle eşleştir
  const CENTRAL_GROUPS = ['Yazılım 1', 'MAC Ürün Yönetimi', /* diğerleri */];
  if (CENTRAL_GROUPS.includes(groupName))   return 'central';

  return 'club_staff';  // geri kalan = kulüp çalışan grubu
}
```

> **Not:** İlk senkronizasyonda merkezi gruplar admin tarafından onaylanarak
> `CENTRAL_GROUPS` listesine eklenmeli. Sonrasında yeni grup eklendiğinde
> sistem `club_staff` varsayar, gerekirse düzeltilebilir.

### 8.5 Dashboard Sorgusu

Dashboard iki farklı satır tipi gösterir:

1. **Kulüp satırı** — `club_staff` + `club_management` birleştirilir, kulüp adıyla tek satır
2. **Merkezi grup satırı** — `central` gruplar kendi adlarıyla ayrı satır

```sql
-- Dashboard: kulüp grupları birleştirilmiş + merkezi gruplar ayrı satır
SELECT
  COALESCE(c.name, zg.name)        AS display_name,   -- kulüp adı veya grup adı
  zg.type = 'central'              AS is_central,
  COUNT(*) FILTER (WHERE t.status IN ('open','pending'))  AS open_count,
  COUNT(*) FILTER (WHERE t.status IN ('solved','closed')) AS closed_count,
  COUNT(*) FILTER (WHERE t.assignee_id IS NOT NULL
                     AND t.status NOT IN ('solved','closed')) AS assigned_count,
  COUNT(*) FILTER (WHERE t.assignee_id IS NULL
                     AND t.status NOT IN ('solved','closed')) AS unassigned_count,
  ROUND(AVG(
    EXTRACT(EPOCH FROM (COALESCE(t.solved_at, NOW()) - t.created_at)) / 3600
  ), 1)                            AS avg_open_hours
FROM tickets t
JOIN zendesk_groups zg ON zg.id = t.group_id
LEFT JOIN clubs c ON c.id = zg.club_id   -- central'lar için NULL, LEFT JOIN ile kalır
WHERE t.created_at BETWEEN :start AND :end
GROUP BY
  COALESCE(c.name, zg.name),      -- kulüp adı veya grup adı üzerinden grupla
  (zg.type = 'central')
ORDER BY open_count DESC;
```

**Örnek çıktı:**

| display_name | is_central | open | closed | … |
|---|---|---|---|---|
| Buyaka | false | 12 | 45 | … |  ← club_staff + club_management birleşik
| Tunalı | false | 8 | 30 | … |
| MAC Ürün Yönetimi | true | 5 | 20 | … |  ← kendi satırı
| Yazılım 1 | true | 3 | 11 | … |

### 8.6 SLA Raporu — Grup Tipi Ayrımı

KM-KMY grupları ile çalışan grupları SLA açısından farklı değerlendirilebilir:

```sql
-- Grup tipi bazlı SLA
SELECT
  zg.name                     AS group_name,
  zg.type                     AS group_type,
  c.name                      AS club_name,
  COUNT(*)                    AS total,
  COUNT(*) FILTER (
    WHERE EXTRACT(EPOCH FROM (t.solved_at - t.created_at))/60 <= sla.threshold_minutes
  )                           AS on_time,
  ROUND(100.0 * COUNT(*) FILTER (
    WHERE EXTRACT(EPOCH FROM (t.solved_at - t.created_at))/60 <= sla.threshold_minutes
  ) / COUNT(*), 1)            AS sla_pct
FROM tickets t
JOIN zendesk_groups zg ON zg.id = t.group_id
JOIN clubs c ON c.id = zg.club_id
LEFT JOIN sla_rules sla ON sla.category = t.category
WHERE t.solved_at IS NOT NULL
  AND t.created_at BETWEEN :start AND :end
GROUP BY zg.id, zg.name, zg.type, c.name;
```

### 8.7 İlk Yükleme — Grup Listesi Senkronizasyonu

Zendesk Groups API'sinden mevcut gruplar çekilip `zendesk_groups` + `clubs` tabloları doldurulur.
Bu işlem webhook kurulmadan önce **bir kez** çalıştırılır:

```
GET https://{subdomain}.zendesk.com/api/v2/groups.json
Authorization: Basic {email/token}

→ Her grup için:
  1. extractClubName(group.name) → clubs tablosuna upsert
  2. getGroupType(group.name)    → zendesk_groups tablosuna upsert
```

---

## 9. POC Kapsamı (İlk Aşama)

| # | Görev | Öncelik |
|---|---|---|
| 1 | Webhook receiver endpoint (imza doğrulama + 200) | 🔴 Kritik |
| 2 | `tickets` + `ticket_lifecycle` tablolarının oluşturulması | 🔴 Kritik |
| 3 | Event processor (ticket upsert + lifecycle insert) | 🔴 Kritik |
| 4 | `GET /api/reports/tickets` endpointi | 🔴 Kritik |
| 5 | `GET /api/reports/dashboard` endpointi | 🔴 Kritik |
| 6 | Zendesk'te test webhook'u kurulumu + canlı test | 🔴 Kritik |
| 7 | `GET /api/reports/agents` endpointi | 🟡 Önemli |
| 8 | `GET /api/reports/sla` endpointi | 🟡 Önemli |
| 9 | `GET /api/tickets/:id/lifecycle` endpointi | 🟡 Önemli |
| 10 | Kulüp / group / agent lookup tabloları senkronizasyonu | 🟢 Sonraki aşama |
| 11 | Kategori bazlı SLA eşik kuralları tablosu | 🟢 Sonraki aşama |

---

## 10. Frontend Entegrasyonu

Mevcut `DestekIslemleriPage.tsx` ve `DestekDashboardPage.tsx` bileşenlerinde mock data yerine API çağrısı yapılacak:

```typescript
// Örnek: Dashboard verisi çekme
const { data } = useSWR(
  `/api/reports/dashboard?period=${period}&start=${start}&end=${end}`,
  fetcher
);
```

Mock data → API geçişi sırasında arayüzde değişiklik gerekmez; sadece veri kaynağı değişir.

---

## 11. Teknik Stack Önerileri

| Katman | Öneri | Alternatif |
|---|---|---|
| Webhook Receiver | Node.js / Express veya NestJS | Go (Fiber) |
| Message Queue | BullMQ (Redis üstü) | RabbitMQ |
| Veritabanı | PostgreSQL | MySQL |
| ORM | Prisma | TypeORM |
| Cache | Redis | — |
| Deploy | Docker + Kubernetes | Railway / Render (hızlı POC için) |

---

## 12. Güvenlik Notları

- Webhook endpoint'i mutlaka `x-zendesk-webhook-signature` ile doğrula
- Signing secret Zendesk admin panelinden alınır, `.env` dosyasında saklanır
- Endpoint public olmalı ama rate limit + IP whitelist önerilir
  (Zendesk'in IP aralıkları: dokümantasyondan alınabilir)
- `raw_payload JSONB` kolonuna yazarken PII (kişisel veri) politikasına dikkat

---

## Ekler

**Zendesk Kaynakları:**
- Webhook kurulumu: `developer.zendesk.com/documentation/webhooks`
- Event türleri: `developer.zendesk.com/api-reference/webhooks/event-types/ticket-events`
- İmza doğrulama: `developer.zendesk.com/documentation/webhooks/verifying`
- Rate limitler: Enterprise plan → 700 req/dk, yeterli

**Zendesk'ten Önce Alınması Gereken Bilgiler (Backend Ekibine):**
1. Webhook signing secret (Admin Center → Webhooks → webhook detayı)
2. Category custom field ID
3. Club custom field ID (veya tag naming convention)
4. Group ID → Group name mapping
5. Agent ID → Agent name mapping
