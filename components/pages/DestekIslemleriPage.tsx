"use client";

import { useState } from "react";
import {
  Search, Filter, Plus, ChevronDown, Clock, CheckCircle2,
  AlertCircle, Circle, ArrowUpCircle, TrendingUp, TrendingDown,
  Minus, ChevronRight, Building2, BarChart3,
} from "lucide-react";

/* ─── Mock veri ─────────────────────────────────────────────── */

const CLUBS = [
  "Mars Athletic Club",
  "Venus Fitness",
  "Jupiter Sports",
  "Saturn Gym",
  "Neptune Wellness",
  "Mercury Active",
];

type Priority = "Kritik" | "Yüksek" | "Orta" | "Düşük";
type Status   = "Açık" | "İşlemde" | "Beklemede" | "Çözüldü";

interface Ticket {
  id: string;
  subject: string;
  club: string;
  status: Status;
  priority: Priority;
  created: string;
  slaDeadline: string;
  slaStatus: "normal" | "warning" | "breached";
  assignee: string;
  category: string;
}

const TICKETS: Ticket[] = [
  { id: "#10041", subject: "Ödeme terminali çalışmıyor", club: "Mars Athletic Club", status: "Açık", priority: "Kritik", created: "08.04.2026 09:12", slaDeadline: "08.04.2026 11:12", slaStatus: "warning", assignee: "Emre K.", category: "Teknik" },
  { id: "#10040", subject: "Üye kartı aktivasyonu yapılamıyor", club: "Venus Fitness", status: "İşlemde", priority: "Yüksek", created: "08.04.2026 08:45", slaDeadline: "08.04.2026 12:45", slaStatus: "normal", assignee: "Ayşe T.", category: "Üyelik" },
  { id: "#10039", subject: "Havuz sisteminde arıza", club: "Jupiter Sports", status: "İşlemde", priority: "Kritik", created: "07.04.2026 17:30", slaDeadline: "08.04.2026 09:30", slaStatus: "breached", assignee: "Can Y.", category: "Tesis" },
  { id: "#10038", subject: "Kampanya kodu geçersiz görünüyor", club: "Saturn Gym", status: "Beklemede", priority: "Orta", created: "07.04.2026 15:00", slaDeadline: "09.04.2026 15:00", slaStatus: "normal", assignee: "Zeynep A.", category: "Kampanya" },
  { id: "#10037", subject: "Eğitmen programı güncellenemiyor", club: "Neptune Wellness", status: "Açık", priority: "Orta", created: "07.04.2026 11:20", slaDeadline: "09.04.2026 11:20", slaStatus: "normal", assignee: "-", category: "Eğitmen" },
  { id: "#10036", subject: "Fatura PDF indirme hatası", club: "Mercury Active", status: "Çözüldü", priority: "Düşük", created: "06.04.2026 14:00", slaDeadline: "08.04.2026 14:00", slaStatus: "normal", assignee: "Emre K.", category: "Finans" },
  { id: "#10035", subject: "Toplu SMS gönderimi başarısız", club: "Mars Athletic Club", status: "Çözüldü", priority: "Yüksek", created: "05.04.2026 10:00", slaDeadline: "05.04.2026 14:00", slaStatus: "normal", assignee: "Ayşe T.", category: "Bildirim" },
  { id: "#10034", subject: "Kilit dolap şifresi sıfırlama", club: "Venus Fitness", status: "Çözüldü", priority: "Düşük", created: "04.04.2026 09:00", slaDeadline: "06.04.2026 09:00", slaStatus: "normal", assignee: "Can Y.", category: "Tesis" },
];

const CLUB_SLA = [
  { club: "Mars Athletic Club", open: 12, inProgress: 5, resolved: 89, avgFirstResponse: "1s 23d", avgResolution: "6s 45d", slaCompliance: 91 },
  { club: "Venus Fitness",       open: 7,  inProgress: 3, resolved: 64, avgFirstResponse: "2s 10d", avgResolution: "8s 12d", slaCompliance: 87 },
  { club: "Jupiter Sports",      open: 18, inProgress: 9, resolved: 72, avgFirstResponse: "3s 05d", avgResolution: "11s 30d", slaCompliance: 73 },
  { club: "Saturn Gym",          open: 4,  inProgress: 2, resolved: 55, avgFirstResponse: "1s 48d", avgResolution: "5s 55d", slaCompliance: 95 },
  { club: "Neptune Wellness",    open: 9,  inProgress: 4, resolved: 48, avgFirstResponse: "2s 33d", avgResolution: "9s 20d", slaCompliance: 82 },
  { club: "Mercury Active",      open: 3,  inProgress: 1, resolved: 41, avgFirstResponse: "0s 58d", avgResolution: "4s 10d", slaCompliance: 97 },
];

/* ─── Yardımcı bileşenler ───────────────────────────────────── */

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { label: string; cls: string; Icon: React.ElementType }> = {
    "Açık":      { label: "Açık",      cls: "bg-blue-50 text-blue-700 border-blue-200",    Icon: Circle },
    "İşlemde":   { label: "İşlemde",   cls: "bg-amber-50 text-amber-700 border-amber-200", Icon: Clock },
    "Beklemede": { label: "Beklemede", cls: "bg-slate-100 text-slate-600 border-slate-200", Icon: Minus },
    "Çözüldü":   { label: "Çözüldü",  cls: "bg-emerald-50 text-emerald-700 border-emerald-200", Icon: CheckCircle2 },
  };
  const { label, cls, Icon } = map[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${cls}`}>
      <Icon className="w-3 h-3" /> {label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const map: Record<Priority, string> = {
    Kritik: "bg-red-50 text-red-700 border-red-200",
    Yüksek: "bg-orange-50 text-orange-700 border-orange-200",
    Orta:   "bg-yellow-50 text-yellow-700 border-yellow-200",
    Düşük:  "bg-slate-100 text-slate-500 border-slate-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${map[priority]}`}>
      {priority}
    </span>
  );
}

function SlaIndicator({ slaStatus, deadline }: { slaStatus: Ticket["slaStatus"]; deadline: string }) {
  if (slaStatus === "breached") return (
    <span className="inline-flex items-center gap-1 text-[11px] text-red-600 font-medium">
      <AlertCircle className="w-3 h-3" /> İhlal
    </span>
  );
  if (slaStatus === "warning") return (
    <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 font-medium">
      <Clock className="w-3 h-3" /> {deadline.split(" ")[1]}
    </span>
  );
  return <span className="text-[11px] text-slate-400">{deadline.split(" ")[1]}</span>;
}

function ComplianceBar({ value }: { value: number }) {
  const color = value >= 90 ? "bg-emerald-500" : value >= 75 ? "bg-amber-400" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className={`text-xs font-semibold w-8 text-right ${value >= 90 ? "text-emerald-600" : value >= 75 ? "text-amber-600" : "text-red-600"}`}>
        {value}%
      </span>
    </div>
  );
}

/* ─── Alt sayfalar ───────────────────────────────────────────── */

function TicketListesi() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "Tümü">("Tümü");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "Tümü">("Tümü");

  const filtered = TICKETS.filter(t => {
    const matchSearch = t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.id.includes(search) || t.club.toLowerCase().includes(search.toLowerCase());
    const matchStatus   = statusFilter === "Tümü" || t.status === statusFilter;
    const matchPriority = priorityFilter === "Tümü" || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const counts = { Açık: 0, İşlemde: 0, Beklemede: 0, Çözüldü: 0 };
  TICKETS.forEach(t => counts[t.status]++);

  return (
    <div className="flex flex-col gap-5 p-6 h-full overflow-y-auto">

      {/* Üst istatistik kartları */}
      <div className="grid grid-cols-4 gap-4">
        {(["Açık", "İşlemde", "Beklemede", "Çözüldü"] as Status[]).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(prev => prev === s ? "Tümü" : s)}
            className={`bg-white border rounded-xl p-4 text-left transition-all hover:shadow-md ${statusFilter === s ? "border-[#CD3638] shadow-sm" : "border-slate-200"}`}
          >
            <p className="text-[11px] text-slate-400 mb-1">{s}</p>
            <p className="text-2xl font-bold text-slate-800">{counts[s]}</p>
            <div className="mt-2"><StatusBadge status={s} /></div>
          </button>
        ))}
      </div>

      {/* Araç çubuğu */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Talep ara..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#CD3638]/20 focus:border-[#CD3638]"
          />
        </div>

        <div className="relative">
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value as Priority | "Tümü")}
            className="appearance-none pl-3 pr-7 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none cursor-pointer"
          >
            <option value="Tümü">Tüm Öncelikler</option>
            {(["Kritik","Yüksek","Orta","Düşük"] as Priority[]).map(p => <option key={p}>{p}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as Status | "Tümü")}
            className="appearance-none pl-3 pr-7 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none cursor-pointer"
          >
            <option value="Tümü">Tüm Durumlar</option>
            {(["Açık","İşlemde","Beklemede","Çözüldü"] as Status[]).map(s => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
        </div>

        <button className="ml-auto flex items-center gap-2 bg-[#CD3638] hover:bg-[#b82e30] text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Yeni Talep
        </button>
      </div>

      {/* Tablo */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex-1">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
              <th className="text-left px-4 py-3 font-semibold">Talep</th>
              <th className="text-left px-4 py-3 font-semibold">Kulüp</th>
              <th className="text-left px-4 py-3 font-semibold">Kategori</th>
              <th className="text-left px-4 py-3 font-semibold">Öncelik</th>
              <th className="text-left px-4 py-3 font-semibold">Durum</th>
              <th className="text-left px-4 py-3 font-semibold">SLA</th>
              <th className="text-left px-4 py-3 font-semibold">Sorumlu</th>
              <th className="text-left px-4 py-3 font-semibold">Oluşturulma</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => (
              <tr key={t.id} className={`border-b border-slate-50 hover:bg-slate-50/70 transition-colors ${i % 2 === 1 ? "bg-slate-50/30" : ""}`}>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-slate-700">{t.subject}</span>
                    <span className="text-slate-400 text-[10px]">{t.id}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{t.club}</td>
                <td className="px-4 py-3">
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-medium">{t.category}</span>
                </td>
                <td className="px-4 py-3"><PriorityBadge priority={t.priority} /></td>
                <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-3"><SlaIndicator slaStatus={t.slaStatus} deadline={t.slaDeadline} /></td>
                <td className="px-4 py-3 text-slate-600">{t.assignee}</td>
                <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{t.created}</td>
                <td className="px-4 py-3">
                  <button className="text-slate-400 hover:text-slate-700 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-slate-400">Sonuç bulunamadı</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SlaRaporlari() {
  return (
    <div className="flex flex-col gap-5 p-6 h-full overflow-y-auto">

      {/* Özet kartlar */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Ort. İlk Yanıt Süresi", value: "1s 52d", sub: "Son 30 gün", trend: "down", trendVal: "-%12", good: true },
          { label: "Ort. Çözüm Süresi",      value: "7s 28d", sub: "Son 30 gün", trend: "down", trendVal: "-%8",  good: true },
          { label: "SLA Uyumu",               value: "%87",   sub: "Tüm kulüpler", trend: "up", trendVal: "+3p",  good: true },
          { label: "İhlal Edilen Talepler",  value: "14",    sub: "Bu ay",         trend: "up", trendVal: "+2",   good: false },
        ].map(card => (
          <div key={card.label} className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-[11px] text-slate-400 mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-slate-800 mb-2">{card.value}</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400">{card.sub}</span>
              <span className={`flex items-center gap-0.5 text-[11px] font-semibold ${card.good ? "text-emerald-600" : "text-red-500"}`}>
                {card.trend === "down" ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                {card.trendVal}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* İki kolon */}
      <div className="grid grid-cols-2 gap-5 flex-1">

        {/* SLA hedef tablosu */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700">SLA Hedefleri</h3>
            <span className="text-[10px] text-slate-400">Bu ay</span>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-semibold">Öncelik</th>
                <th className="text-left px-5 py-3 font-semibold">İlk Yanıt Hedefi</th>
                <th className="text-left px-5 py-3 font-semibold">Çözüm Hedefi</th>
                <th className="text-left px-5 py-3 font-semibold">Uyum</th>
              </tr>
            </thead>
            <tbody>
              {[
                { p: "Kritik", fr: "1 saat",  res: "4 saat",  comp: 79 },
                { p: "Yüksek", fr: "2 saat",  res: "8 saat",  comp: 85 },
                { p: "Orta",   fr: "4 saat",  res: "24 saat", comp: 92 },
                { p: "Düşük",  fr: "8 saat",  res: "48 saat", comp: 97 },
              ].map(row => (
                <tr key={row.p} className="border-b border-slate-50 hover:bg-slate-50/60">
                  <td className="px-5 py-3"><PriorityBadge priority={row.p as Priority} /></td>
                  <td className="px-5 py-3 text-slate-600">{row.fr}</td>
                  <td className="px-5 py-3 text-slate-600">{row.res}</td>
                  <td className="px-5 py-3 w-32"><ComplianceBar value={row.comp} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Kategori dağılımı */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700">Kategori Bazlı Talepler</h3>
            <span className="text-[10px] text-slate-400">Son 30 gün</span>
          </div>
          <div className="p-5 flex flex-col gap-3">
            {[
              { cat: "Teknik",   count: 34, pct: 31, color: "bg-blue-500" },
              { cat: "Üyelik",   count: 28, pct: 25, color: "bg-emerald-500" },
              { cat: "Tesis",    count: 21, pct: 19, color: "bg-amber-400" },
              { cat: "Finans",   count: 15, pct: 14, color: "bg-purple-500" },
              { cat: "Kampanya", count: 8,  pct: 7,  color: "bg-rose-500" },
              { cat: "Diğer",    count: 4,  pct: 4,  color: "bg-slate-400" },
            ].map(row => (
              <div key={row.cat} className="flex items-center gap-3">
                <span className="text-xs text-slate-600 w-20 shrink-0">{row.cat}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${row.color}`} style={{ width: `${row.pct}%` }} />
                </div>
                <span className="text-xs text-slate-500 w-8 text-right">{row.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KulupBazliRapor() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex gap-5 p-6 h-full overflow-hidden">

      {/* Kulüp listesi */}
      <div className="w-72 shrink-0 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" /> Kulüpler
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {CLUB_SLA.map(row => (
            <button
              key={row.club}
              onClick={() => setSelected(prev => prev === row.club ? null : row.club)}
              className={`w-full text-left px-5 py-3.5 border-b border-slate-50 hover:bg-slate-50 transition-colors flex items-center justify-between ${selected === row.club ? "bg-red-50/60 border-l-2 border-l-[#CD3638]" : ""}`}
            >
              <div>
                <p className="text-xs font-semibold text-slate-700 leading-tight">{row.club}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{row.open + row.inProgress} açık · {row.resolved} çözüldü</p>
              </div>
              <span className={`text-xs font-bold ${row.slaCompliance >= 90 ? "text-emerald-600" : row.slaCompliance >= 75 ? "text-amber-600" : "text-red-500"}`}>
                %{row.slaCompliance}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Sağ panel */}
      <div className="flex-1 overflow-y-auto">
        {selected ? (
          (() => {
            const row = CLUB_SLA.find(r => r.club === selected)!;
            return (
              <div className="flex flex-col gap-5">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <h2 className="text-base font-bold text-slate-800 mb-1">{row.club}</h2>
                  <p className="text-xs text-slate-400">Güncel destek talebi özeti</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Açık Talepler",   value: row.open,       color: "text-blue-600" },
                    { label: "İşlemdekiler",     value: row.inProgress, color: "text-amber-600" },
                    { label: "Çözülen",          value: row.resolved,   color: "text-emerald-600" },
                  ].map(c => (
                    <div key={c.label} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                      <p className={`text-3xl font-bold ${c.color}`}>{c.value}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{c.label}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-slate-400" /> SLA Metrikleri
                  </h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-[11px] text-slate-400 mb-1">Ort. İlk Yanıt</p>
                      <p className="text-lg font-bold text-slate-700">{row.avgFirstResponse}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 mb-1">Ort. Çözüm Süresi</p>
                      <p className="text-lg font-bold text-slate-700">{row.avgResolution}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 mb-1">SLA Uyumu</p>
                      <div className="mt-1"><ComplianceBar value={row.slaCompliance} /></div>
                    </div>
                  </div>
                </div>

                {/* Bu kulübün aktif talepleri */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-700">Aktif Talepler</h3>
                  </div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] uppercase tracking-wider">
                        <th className="text-left px-5 py-3 font-semibold">Talep</th>
                        <th className="text-left px-5 py-3 font-semibold">Öncelik</th>
                        <th className="text-left px-5 py-3 font-semibold">Durum</th>
                        <th className="text-left px-5 py-3 font-semibold">SLA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TICKETS.filter(t => t.club === selected && t.status !== "Çözüldü").map(t => (
                        <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                          <td className="px-5 py-3">
                            <div>
                              <p className="font-semibold text-slate-700">{t.subject}</p>
                              <p className="text-slate-400 text-[10px]">{t.id}</p>
                            </div>
                          </td>
                          <td className="px-5 py-3"><PriorityBadge priority={t.priority} /></td>
                          <td className="px-5 py-3"><StatusBadge status={t.status} /></td>
                          <td className="px-5 py-3"><SlaIndicator slaStatus={t.slaStatus} deadline={t.slaDeadline} /></td>
                        </tr>
                      ))}
                      {TICKETS.filter(t => t.club === selected && t.status !== "Çözüldü").length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-5 py-6 text-center text-slate-400">Aktif talep yok</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-slate-400" /> Tüm Kulüpler — SLA Uyumu
              </h3>
              <div className="flex flex-col gap-3">
                {CLUB_SLA.sort((a, b) => b.slaCompliance - a.slaCompliance).map(row => (
                  <div key={row.club} className="flex items-center gap-4">
                    <span className="text-xs text-slate-600 w-40 shrink-0 truncate">{row.club}</span>
                    <div className="flex-1"><ComplianceBar value={row.slaCompliance} /></div>
                    <span className="text-[10px] text-slate-400 w-12 text-right">{row.open + row.inProgress} açık</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-700">Kulüp Detayı</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Sol taraftan bir kulüp seçin</p>
              </div>
              <div className="px-5 py-8 flex items-center justify-center">
                <p className="text-xs text-slate-400">Detayları görüntülemek için bir kulüp seçin</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Ana bileşen ────────────────────────────────────────────── */

type SubPage = "destek-talepleri" | "sla-raporlari" | "kulup-bazli-rapor";

interface Props { activeSubId: string; }

export default function DestekIslemleriPage({ activeSubId }: Props) {
  const sub = activeSubId as SubPage;
  return (
    <div className="flex-1 bg-[#f5f8fa] overflow-hidden flex flex-col">
      {sub === "destek-talepleri"  && <TicketListesi />}
      {sub === "sla-raporlari"     && <SlaRaporlari />}
      {sub === "kulup-bazli-rapor" && <KulupBazliRapor />}
    </div>
  );
}
