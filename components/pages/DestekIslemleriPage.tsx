"use client";

import { useState, useMemo } from "react";
import { X, Download, Search } from "lucide-react";

/* ─── Tipler ─────────────────────────────────────────────────── */
type Status   = "open" | "pending" | "solved" | "closed";
type Priority = "low" | "normal" | "high" | "urgent";
type Group    = "MAC Ürün Yönetimi" | "MAC Teknik Destek" | "MAC Üyelik" | "MAC Finans" | "MAC Tesis";

interface GroupStep {
  group: Group;
  agent: string;
  assignedAt: string;
  duration: string;
}

interface Ticket {
  id: string;
  subject: string;
  status: Status;
  priority: Priority;
  group: Group;
  agent: string;
  createdAt: string;
  updatedAt: string;
  totalDuration: string;
  totalMinutes: number;
  groupTransfers: number;
  agentChanges: number;
  reopened: boolean;
  escalated: boolean;
  finalStatus: Status;
  submitter: string;
  submitterClub: string;
  category: string;
  lifecycle: GroupStep[];
  resolvedAt?: string;
  resolvingAgent?: string;
  resolvingGroup?: Group;
}

/* ─── Mock veri ─────────────────────────────────────────────── */
const ALL_TICKETS: Ticket[] = [
  {
    id: "#2570671", subject: "Tunalı Çalışma Saatleri", status: "closed", priority: "normal",
    group: "MAC Ürün Yönetimi", agent: "Ayşe T.", createdAt: "01.04.2026 09:00", updatedAt: "08.04.2026 11:30",
    totalDuration: "161 saat 44 dakika", totalMinutes: 9704, groupTransfers: 0, agentChanges: 0,
    reopened: false, escalated: true, finalStatus: "closed",
    submitter: "Mehmet Yılmaz", submitterClub: "Tunalı", category: "Operasyon",
    lifecycle: [
      { group: "MAC Ürün Yönetimi", agent: "Ayşe T.", assignedAt: "01.04.2026 09:15", duration: "161 saat 44 dakika" },
    ],
    resolvedAt: "08.04.2026 10:44", resolvingAgent: "Ayşe T.", resolvingGroup: "MAC Ürün Yönetimi",
  },
  {
    id: "#2593138", subject: "Uygulama sorunu", status: "closed", priority: "high",
    group: "MAC Teknik Destek", agent: "Emre K.", createdAt: "03.04.2026 10:15", updatedAt: "08.04.2026 11:30",
    totalDuration: "69 saat 32 dakika", totalMinutes: 4172, groupTransfers: 0, agentChanges: 0,
    reopened: false, escalated: true, finalStatus: "closed",
    submitter: "Selin Çelik", submitterClub: "Ankamall", category: "Teknik",
    lifecycle: [
      { group: "MAC Teknik Destek", agent: "Emre K.", assignedAt: "03.04.2026 10:30", duration: "69 saat 32 dakika" },
    ],
    resolvedAt: "08.04.2026 08:02", resolvingAgent: "Emre K.", resolvingGroup: "MAC Teknik Destek",
  },
  {
    id: "#2601445", subject: "Ödeme terminali arızası", status: "closed", priority: "urgent",
    group: "MAC Teknik Destek", agent: "Can Y.", createdAt: "04.04.2026 08:30", updatedAt: "07.04.2026 17:00",
    totalDuration: "80 saat 30 dakika", totalMinutes: 4830, groupTransfers: 1, agentChanges: 1,
    reopened: false, escalated: true, finalStatus: "closed",
    submitter: "Ali Kaya", submitterClub: "Mall of Istanbul", category: "Teknik",
    lifecycle: [
      { group: "MAC Tesis",         agent: "Fatma S.", assignedAt: "04.04.2026 08:45", duration: "12 saat 15 dakika" },
      { group: "MAC Teknik Destek", agent: "Can Y.",   assignedAt: "04.04.2026 21:00", duration: "68 saat 15 dakika" },
    ],
    resolvedAt: "07.04.2026 17:00", resolvingAgent: "Can Y.", resolvingGroup: "MAC Teknik Destek",
  },
  {
    id: "#2612890", subject: "Üye kartı aktivasyon hatası", status: "solved", priority: "high",
    group: "MAC Üyelik", agent: "Zeynep A.", createdAt: "05.04.2026 14:00", updatedAt: "07.04.2026 10:00",
    totalDuration: "44 saat 0 dakika", totalMinutes: 2640, groupTransfers: 0, agentChanges: 0,
    reopened: false, escalated: false, finalStatus: "solved",
    submitter: "Derya Arslan", submitterClub: "Kartal", category: "Üyelik",
    lifecycle: [
      { group: "MAC Üyelik", agent: "Zeynep A.", assignedAt: "05.04.2026 14:20", duration: "44 saat 0 dakika" },
    ],
    resolvedAt: "07.04.2026 10:20", resolvingAgent: "Zeynep A.", resolvingGroup: "MAC Üyelik",
  },
  {
    id: "#2625301", subject: "Kampanya kodu geçersiz", status: "closed", priority: "normal",
    group: "MAC Ürün Yönetimi", agent: "Ayşe T.", createdAt: "06.04.2026 11:00", updatedAt: "08.04.2026 09:00",
    totalDuration: "46 saat 0 dakika", totalMinutes: 2760, groupTransfers: 0, agentChanges: 0,
    reopened: false, escalated: false, finalStatus: "closed",
    submitter: "Burak Öztürk", submitterClub: "Akbatı", category: "Kampanya",
    lifecycle: [
      { group: "MAC Ürün Yönetimi", agent: "Ayşe T.", assignedAt: "06.04.2026 11:30", duration: "46 saat 0 dakika" },
    ],
    resolvedAt: "08.04.2026 09:30", resolvingAgent: "Ayşe T.", resolvingGroup: "MAC Ürün Yönetimi",
  },
  {
    id: "#2630112", subject: "Havuz sisteminde arıza", status: "open", priority: "urgent",
    group: "MAC Tesis", agent: "Can Y.", createdAt: "07.04.2026 07:00", updatedAt: "08.04.2026 10:00",
    totalDuration: "27 saat 0 dakika", totalMinutes: 1620, groupTransfers: 2, agentChanges: 1,
    reopened: false, escalated: true, finalStatus: "open",
    submitter: "Hasan Demir", submitterClub: "Buyaka", category: "Tesis",
    lifecycle: [
      { group: "MAC Tesis",         agent: "Fatma S.", assignedAt: "07.04.2026 07:15", duration: "5 saat 45 dakika" },
      { group: "MAC Teknik Destek", agent: "Emre K.",  assignedAt: "07.04.2026 13:00", duration: "8 saat 0 dakika"  },
      { group: "MAC Tesis",         agent: "Can Y.",   assignedAt: "07.04.2026 21:00", duration: "13 saat 0 dakika" },
    ],
  },
  {
    id: "#2631058", subject: "Toplu SMS gönderimi başarısız", status: "solved", priority: "high",
    group: "MAC Teknik Destek", agent: "Emre K.", createdAt: "07.04.2026 09:30", updatedAt: "08.04.2026 08:00",
    totalDuration: "22 saat 30 dakika", totalMinutes: 1350, groupTransfers: 0, agentChanges: 0,
    reopened: true, escalated: false, finalStatus: "solved",
    submitter: "Canan Yıldız", submitterClub: "Kanyon", category: "Bildirim",
    lifecycle: [
      { group: "MAC Teknik Destek", agent: "Emre K.", assignedAt: "07.04.2026 09:45", duration: "22 saat 30 dakika" },
    ],
    resolvedAt: "08.04.2026 08:15", resolvingAgent: "Emre K.", resolvingGroup: "MAC Teknik Destek",
  },
  {
    id: "#2632900", subject: "Fatura PDF indirme hatası", status: "pending", priority: "low",
    group: "MAC Finans", agent: "Zeynep A.", createdAt: "07.04.2026 13:00", updatedAt: "08.04.2026 07:30",
    totalDuration: "18 saat 30 dakika", totalMinutes: 1110, groupTransfers: 0, agentChanges: 0,
    reopened: false, escalated: false, finalStatus: "pending",
    submitter: "Tuba Şahin", submitterClub: "Fulya", category: "Finans",
    lifecycle: [
      { group: "MAC Finans", agent: "Zeynep A.", assignedAt: "07.04.2026 13:20", duration: "18 saat 30 dakika" },
    ],
  },
  {
    id: "#2633741", subject: "Eğitmen programı güncellenemiyor", status: "open", priority: "normal",
    group: "MAC Üyelik", agent: "-", createdAt: "08.04.2026 08:00", updatedAt: "08.04.2026 08:00",
    totalDuration: "3 saat 12 dakika", totalMinutes: 192, groupTransfers: 0, agentChanges: 0,
    reopened: false, escalated: false, finalStatus: "open",
    submitter: "Orhan Çetin", submitterClub: "Armada", category: "Operasyon",
    lifecycle: [
      { group: "MAC Üyelik", agent: "-", assignedAt: "08.04.2026 08:00", duration: "3 saat 12 dakika" },
    ],
  },
  {
    id: "#2634002", subject: "Kilit dolap şifre sıfırlama", status: "solved", priority: "low",
    group: "MAC Tesis", agent: "Can Y.", createdAt: "08.04.2026 09:00", updatedAt: "08.04.2026 11:00",
    totalDuration: "2 saat 0 dakika", totalMinutes: 120, groupTransfers: 0, agentChanges: 0,
    reopened: false, escalated: false, finalStatus: "solved",
    submitter: "Nurcan Aydın", submitterClub: "Vialand", category: "Tesis",
    lifecycle: [
      { group: "MAC Tesis", agent: "Can Y.", assignedAt: "08.04.2026 09:10", duration: "2 saat 0 dakika" },
    ],
    resolvedAt: "08.04.2026 11:10", resolvingAgent: "Can Y.", resolvingGroup: "MAC Tesis",
  },
];

const GROUPS: Group[] = ["MAC Ürün Yönetimi", "MAC Teknik Destek", "MAC Üyelik", "MAC Finans", "MAC Tesis"];
const STATUS_LABELS: Record<Status, string> = { open: "Açık", pending: "Beklemede", solved: "Çözüldü", closed: "Kapatıldı" };

// Helper: "DD.MM.YYYY HH:MM" → Date (for date comparisons)
function parseTurkishDate(s: string): Date {
  const [datePart] = s.split(" ");
  const [dd, mm, yyyy] = datePart.split(".");
  return new Date(`${yyyy}-${mm}-${dd}`);
}
const STATUS_COLORS: Record<Status, string> = {
  open:    "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  solved:  "bg-emerald-100 text-emerald-700",
  closed:  "bg-slate-200 text-slate-600",
};

type TabKey = "ham" | "agent" | "sla";

/* ─── Ticket Detay Drawer ────────────────────────────────────── */
function TicketDrawer({ ticket, onClose }: { ticket: Ticket; onClose: () => void }) {
  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-[520px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div>
            <p className="text-xs text-slate-400 font-mono mb-0.5">{ticket.id}</p>
            <p className="text-sm font-bold text-slate-800 leading-snug">{ticket.subject}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors mt-0.5">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">

          {/* Temel bilgiler */}
          <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
            {[
              ["Ticket No",          ticket.id],
              ["Açılma Tarihi",      ticket.createdAt],
              ["Submitter",          ticket.submitter],
              ["Submitter Kulübü",   ticket.submitterClub],
              ["Kategori",           ticket.category],
              ["Toplam Süre",        ticket.totalDuration],
            ].map(([label, val]) => (
              <div key={label}>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                <p className="font-medium text-slate-700">{val}</p>
              </div>
            ))}
          </div>

          {/* Lifecycle */}
          <div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Grup & Agent Geçmişi</p>
            <div className="flex flex-col gap-3">
              {ticket.lifecycle.map((step, i) => (
                <div key={i} className="relative flex gap-3">
                  {/* Timeline çizgisi */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {i + 1}
                    </div>
                    {i < ticket.lifecycle.length - 1 && (
                      <div className="w-px flex-1 bg-slate-200 my-1" />
                    )}
                  </div>

                  {/* İçerik */}
                  <div className="bg-white border border-slate-200 rounded-xl p-3 flex-1 mb-1">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Atanan Grup</p>
                        <p className="font-semibold text-slate-700">{step.group}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Atanan Agent</p>
                        <p className="font-semibold text-slate-700">{step.agent}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Atanma Tarihi</p>
                        <p className="text-slate-600">{step.assignedAt}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Grupta Geçen Süre</p>
                        <p className="text-slate-600">{step.duration}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Çözüm bilgileri */}
          {ticket.resolvedAt && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">Çözüm Bilgileri</p>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider mb-0.5">Çözüm Tarihi</p>
                  <p className="font-semibold text-slate-700">{ticket.resolvedAt}</p>
                </div>
                <div>
                  <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider mb-0.5">Çözümleyen Agent</p>
                  <p className="font-semibold text-slate-700">{ticket.resolvingAgent}</p>
                </div>
                <div>
                  <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider mb-0.5">Çözümleyen Grup</p>
                  <p className="font-semibold text-slate-700">{ticket.resolvingGroup}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── CSV export ─────────────────────────────────────────────── */
function exportCSV(tickets: Ticket[], tab: TabKey) {
  let headers: string[];
  let rows: string[][];

  if (tab === "ham") {
    headers = ["Ticket ID","Konu","Durum","Öncelik","Grup","Güncellenme Tarihi","Toplam Süre","Grup Transferi","Agent Değişimi","Eskalasyon"];
    rows = tickets.map(t => [
      t.id, t.subject, STATUS_LABELS[t.status], t.priority,
      t.group, t.updatedAt, t.totalDuration,
      String(t.groupTransfers), String(t.agentChanges),
      t.escalated ? "Evet" : "Hayır",
    ]);
  } else if (tab === "agent") {
    headers = ["Atanan Agent","Ticket No","Ticket Açılma Tarihi","Kategori","Atanan Kullanıcı Grubu","Atanma Tarihi ve Saati","Çözümleyen Agent","Çözüm Tarihi","Çözümleme Süresi","Çözümleyen Agent Grubu"];
    rows = tickets.map(t => [
      t.agent, t.id, t.createdAt, t.category, t.group,
      t.lifecycle[0]?.assignedAt ?? "-",
      t.resolvingAgent ?? "-", t.resolvedAt ?? "-", t.totalDuration,
      t.resolvingGroup ?? "-",
    ]);
  } else {
    headers = ["Grup","Toplam Atanan Ticket","Zamanında Kapatılan","Geciktirilen","Ort. Bekleme Süresi","Ort. Çözüm Süresi (dk)","SLA %"];
    const SLA_THRESHOLD = 3600;
    const groupMap: Record<string, Ticket[]> = {};
    tickets.forEach(t => { (groupMap[t.group] = groupMap[t.group] || []).push(t); });
    rows = Object.entries(groupMap).map(([grp, ts]) => {
      const zamaninda  = ts.filter(t => t.totalMinutes <= SLA_THRESHOLD).length;
      const geciktirilen = ts.filter(t => t.totalMinutes > SLA_THRESHOLD).length;
      const avgRes     = Math.round(ts.reduce((s,t) => s + t.totalMinutes, 0) / ts.length);
      const avgWait    = Math.round(avgRes * 0.08);
      const sla        = Math.round(zamaninda / ts.length * 100);
      return [grp, String(ts.length), String(zamaninda), String(geciktirilen), `${avgWait} dk`, String(avgRes), `%${sla}`];
    });
  }

  const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `destek-raporu-${tab}-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─── Küçük yardımcı bileşenler ─────────────────────────────── */
function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function MetricCard({ label, value, sub, color = "text-slate-800" }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex flex-col gap-1 min-w-0">
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-tight">{label}</p>
      <p className={`text-2xl font-bold leading-tight ${color}`}>{value}</p>
      {sub && <p className="text-[10px] text-slate-400">{sub}</p>}
    </div>
  );
}

/* ─── Ham Rapor sekmesi ─────────────────────────────────────── */
function HamRapor({ tickets, onExport }: { tickets: Ticket[]; onExport: () => void }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Ticket | null>(null);
  const filtered = tickets.filter(t =>
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalMinutes = tickets.reduce((s, t) => s + t.totalMinutes, 0);
  const avgMinutes   = tickets.length ? Math.round(totalMinutes / tickets.length) : 0;
  const avgH = Math.floor(avgMinutes / 60), avgM = avgMinutes % 60;
  const avgTransfers = tickets.length ? (tickets.reduce((s,t) => s + t.groupTransfers, 0) / tickets.length).toFixed(1) : "0";

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto p-6">
      {/* Metrik kartlar */}
      <div className="grid grid-cols-7 gap-3">
        <MetricCard label="Toplam Ticket" value={tickets.length} sub="filtreyle eşleşen" />
        <MetricCard label="Ort. Yaşam Süresi" value={`${avgH} saat ${avgM} dakika`} sub="ortalama süre" color="text-indigo-600" />
        <MetricCard label="Ort. Grup Transferi" value={avgTransfers} sub="ticket başına" color="text-amber-600" />
        <MetricCard label="Yeniden Açılan" value={tickets.filter(t=>t.reopened).length} sub={`toplam %${tickets.length ? Math.round(tickets.filter(t=>t.reopened).length/tickets.length*100) : 0}'i`} />
        <MetricCard label="Eskalasyon" value={tickets.filter(t=>t.escalated).length} sub={`toplam %${tickets.length ? Math.round(tickets.filter(t=>t.escalated).length/tickets.length*100) : 0}'i`} color="text-red-500" />
        <MetricCard label="Çözümlendi" value={tickets.filter(t=>t.status==="solved").length} sub="mevcut durum" color="text-emerald-600" />
        <MetricCard label="Kapatıldı" value={tickets.filter(t=>t.status==="closed").length} sub="mevcut durum" color="text-slate-500" />
      </div>

      {/* Tablo başlığı */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col flex-1">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <p className="text-sm font-bold text-slate-700">
            Ticket Yaşam Döngüsü
            <span className="ml-2 text-xs font-normal text-slate-400">{filtered.length} / {tickets.length} ticket · 3 yaşam döngüsü adımı</span>
          </p>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Ticket ara..."
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 w-44"
              />
            </div>
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Ham Raporu Dışa Aktar
            </button>
          </div>
        </div>

        <div className="overflow-auto flex-1">
          <table className="w-full text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] uppercase tracking-wider">
                {["Ticket ID","Konu","Kategori","Durum","Güncellenme Tarihi","Toplam Süre","Grup Transferi","Agent Değişimi","Eskalasyon"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr
                  key={t.id}
                  onClick={() => setSelected(t)}
                  className={`border-b border-slate-50 hover:bg-indigo-50/40 cursor-pointer transition-colors ${i%2===1?"bg-slate-50/30":""} ${selected?.id===t.id?"bg-indigo-50":""}` }
                >
                  <td className="px-4 py-3 font-mono text-slate-500">{t.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-700 max-w-[200px] truncate">{t.subject}</td>
                  <td className="px-4 py-3">
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">{t.category}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3 text-slate-500">{t.updatedAt}</td>
                  <td className="px-4 py-3 text-slate-600">{t.totalDuration}</td>
                  <td className="px-4 py-3 text-center text-slate-600">{t.groupTransfers}</td>
                  <td className="px-4 py-3 text-center text-slate-600">{t.agentChanges}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[11px] font-medium ${t.escalated ? "text-red-500":"text-slate-400"}`}>{t.escalated?"Evet":"Hayır"}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-10 text-center text-slate-400">Sonuç bulunamadı</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {selected && <TicketDrawer ticket={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

/* ─── Agent Raporu sekmesi ───────────────────────────────────── */
function AgentRaporu({ tickets, onExport }: { tickets: Ticket[]; onExport: () => void }) {
  const uniqueAgents = [...new Set(tickets.map(t => t.agent).filter(a => a !== "-"))].length;

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto p-6">
      <div className="grid grid-cols-3 gap-3">
        <MetricCard label="Toplam Ticket" value={tickets.length} sub="filtredeki ticketlar" />
        <MetricCard label="Aktif Agent" value={uniqueAgents} sub="atanan agent sayısı" />
        <MetricCard label="Çözümlenen" value={tickets.filter(t=>t.resolvedAt).length} sub="çözüm tarihi olan" color="text-emerald-600" />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex-1">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <p className="text-sm font-bold text-slate-700">Agent Raporu</p>
          <button onClick={onExport} className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
            <Download className="w-3.5 h-3.5" /> Agent Raporunu Dışa Aktar
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] uppercase tracking-wider">
                {[
                  "Atanan Agent",
                  "Ticket No",
                  "Ticket Açılma Tarihi",
                  "Kategori",
                  "Atanan Kullanıcı Grubu",
                  "Atanma Tarihi ve Saati",
                  "Çözümleyen Agent",
                  "Çözüm Tarihi",
                  "Çözümleme Süresi",
                  "Çözümleyen Agent Grubu",
                ].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tickets.map((t, i) => (
                <tr key={t.id} className={`border-b border-slate-50 hover:bg-slate-50/70 ${i%2===1?"bg-slate-50/30":""}`}>
                  <td className="px-4 py-3 font-medium text-slate-700">{t.agent}</td>
                  <td className="px-4 py-3 font-mono text-slate-500">{t.id}</td>
                  <td className="px-4 py-3 text-slate-600">{t.createdAt}</td>
                  <td className="px-4 py-3 text-slate-600">{t.category}</td>
                  <td className="px-4 py-3 text-slate-600">{t.group}</td>
                  <td className="px-4 py-3 text-slate-600">{t.lifecycle[0]?.assignedAt ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-700">{t.resolvingAgent ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{t.resolvedAt ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{t.totalDuration}</td>
                  <td className="px-4 py-3 text-slate-600">{t.resolvingGroup ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── SLA Raporu sekmesi ─────────────────────────────────────── */
function SlaRaporu({ tickets, onExport }: { tickets: Ticket[]; onExport: () => void }) {
  // SLA eşikleri: <= 3600 dk normal (zamanında), > 3600 dk geciktirilen
  const SLA_THRESHOLD = 3600;

  // Grup bazlı özet
  const groupMap: Record<string, Ticket[]> = {};
  tickets.forEach(t => { (groupMap[t.group] = groupMap[t.group] || []).push(t); });

  const groupRows = Object.entries(groupMap).map(([grp, ts]) => {
    const zamaninda  = ts.filter(t => t.totalMinutes <= SLA_THRESHOLD).length;
    const geciktirilen = ts.filter(t => t.totalMinutes > SLA_THRESHOLD).length;
    const avgWaitMin  = Math.round(ts.reduce((s,t) => s + (t.lifecycle[0] ? 0 : 0), 0)); // ilk atama beklemesi
    // Ort. bekleme: lifecycle[0].duration dışında kalan süre (toplam - son adım süresi)
    const avgResolutionMin = Math.round(ts.reduce((s,t) => s + t.totalMinutes, 0) / ts.length);
    const slaPercent = Math.round(zamaninda / ts.length * 100);
    // Ort. bekleme: ilk lifecycle adımına kadar geçen süre proxy olarak 0-30 dk arası random mock
    const avgWaitDisplay = `${Math.round(avgResolutionMin * 0.08)} dk`;
    return { grp, total: ts.length, zamaninda, geciktirilen, avgWaitDisplay, avgResolutionMin, slaPercent };
  }).sort((a,b) => b.total - a.total);

  const totalTickets  = tickets.length;
  const totalZamaninda = groupRows.reduce((s,r) => s + r.zamaninda, 0);
  const overallSla    = totalTickets ? Math.round(totalZamaninda / totalTickets * 100) : 0;
  const totalGeciktirilen = groupRows.reduce((s,r) => s + r.geciktirilen, 0);

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto p-6">
      <div className="grid grid-cols-4 gap-3">
        <MetricCard label="Genel SLA %" value={`%${overallSla}`} sub="tüm gruplar" color={overallSla>=85?"text-emerald-600":"text-red-500"} />
        <MetricCard label="Toplam Ticket" value={totalTickets} sub="filtredeki ticketlar" color="text-slate-700" />
        <MetricCard label="Zamanında Kapanan" value={totalZamaninda} sub={`≤ ${SLA_THRESHOLD/60} saat`} color="text-emerald-600" />
        <MetricCard label="Geciktirilen" value={totalGeciktirilen} sub={`> ${SLA_THRESHOLD/60} saat`} color="text-red-500" />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex-1">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <p className="text-sm font-bold text-slate-700">SLA Raporu — Grup Bazlı Özet</p>
          <button onClick={onExport} className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
            <Download className="w-3.5 h-3.5" /> SLA Raporunu Dışa Aktar
          </button>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] uppercase tracking-wider">
              {["Grup","Toplam Atanan Ticket","Zamanında Kapatılan","Geciktirilen","Ort. Bekleme Süresi","Ort. Çözüm Süresi","SLA %"].map(h=>(
                <th key={h} className="text-left px-5 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groupRows.map((row,i) => (
              <tr key={row.grp} className={`border-b border-slate-50 hover:bg-slate-50/70 ${i%2===1?"bg-slate-50/30":""}`}>
                <td className="px-5 py-3 font-medium text-slate-700">{row.grp}</td>
                <td className="px-5 py-3 text-slate-600">{row.total}</td>
                <td className="px-5 py-3">
                  <span className="bg-emerald-50 text-emerald-700 text-[11px] font-medium px-2 py-0.5 rounded">{row.zamaninda}</span>
                </td>
                <td className="px-5 py-3">
                  {row.geciktirilen > 0
                    ? <span className="bg-red-50 text-red-700 text-[11px] font-medium px-2 py-0.5 rounded">{row.geciktirilen}</span>
                    : <span className="text-slate-400">0</span>}
                </td>
                <td className="px-5 py-3 text-slate-600">{row.avgWaitDisplay}</td>
                <td className="px-5 py-3 text-slate-600">
                  {row.avgResolutionMin >= 60
                    ? `${Math.floor(row.avgResolutionMin/60)} saat ${row.avgResolutionMin%60} dk`
                    : `${row.avgResolutionMin} dk`}
                </td>
                <td className="px-5 py-3">
                  <span className={`text-[11px] font-bold ${row.slaPercent>=85?"text-emerald-600":row.slaPercent>=70?"text-amber-600":"text-red-600"}`}>
                    %{row.slaPercent}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Ana bileşen ────────────────────────────────────────────── */
export default function DestekIslemleriPage({ activeSubId }: { activeSubId: string }) {
  const tab: TabKey = activeSubId === "agent-raporu" ? "agent" : activeSubId === "sla-raporu" ? "sla" : "ham";

  /* Filtreler */
  const [ticketIdFilter, setTicketIdFilter]         = useState("");
  const [startDate, setStartDate]                   = useState("2026-04-01");
  const [endDate, setEndDate]                       = useState("2026-04-08");
  const [selectedStatuses, setSelectedStatuses]     = useState<Status[]>([]);
  const [selectedGroups, setSelectedGroups]         = useState<Group[]>([]);
  const [selectedAgents, setSelectedAgents]         = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [appliedFilters, setAppliedFilters] = useState<{
    ticketId: string; startDate: string; endDate: string;
    statuses: Status[]; groups: Group[];
    agents: string[]; categories: string[];
  }>({ ticketId: "", startDate: "2026-04-01", endDate: "2026-04-08", statuses: [], groups: [], agents: [], categories: [] });

  const toggleStatus   = (s: Status)  => setSelectedStatuses(prev => prev.includes(s) ? prev.filter(x=>x!==s) : [...prev, s]);
  const toggleGroup    = (g: Group)   => setSelectedGroups(prev => prev.includes(g) ? prev.filter(x=>x!==g) : [...prev, g]);
  const toggleAgent    = (a: string)  => setSelectedAgents(prev => prev.includes(a) ? prev.filter(x=>x!==a) : [...prev, a]);
  const toggleCategory = (c: string)  => setSelectedCategories(prev => prev.includes(c) ? prev.filter(x=>x!==c) : [...prev, c]);

  const applyFilters = () =>
    setAppliedFilters({ ticketId: ticketIdFilter, startDate, endDate, statuses: selectedStatuses, groups: selectedGroups, agents: selectedAgents, categories: selectedCategories });

  const resetFilters = () => {
    setTicketIdFilter(""); setStartDate("2026-04-01"); setEndDate("2026-04-08");
    setSelectedStatuses([]); setSelectedGroups([]); setSelectedAgents([]); setSelectedCategories([]);
    setAppliedFilters({ ticketId: "", startDate: "2026-04-01", endDate: "2026-04-08", statuses: [], groups: [], agents: [], categories: [] });
  };

  const allAgents     = useMemo(() => [...new Set(ALL_TICKETS.map(t => t.agent).filter(a => a !== "-"))].sort(), []);
  const allCategories = useMemo(() => [...new Set(ALL_TICKETS.map(t => t.category))].sort(), []);

  const filteredTickets = useMemo(() => {
    const start = appliedFilters.startDate ? new Date(appliedFilters.startDate) : null;
    const end   = appliedFilters.endDate   ? new Date(appliedFilters.endDate)   : null;
    return ALL_TICKETS.filter(t => {
      if (appliedFilters.ticketId && !t.id.includes(appliedFilters.ticketId)) return false;
      if (appliedFilters.statuses.length && !appliedFilters.statuses.includes(t.status)) return false;
      if (appliedFilters.groups.length && !appliedFilters.groups.includes(t.group)) return false;
      if (appliedFilters.agents.length && !appliedFilters.agents.includes(t.agent)) return false;
      if (appliedFilters.categories.length && !appliedFilters.categories.includes(t.category)) return false;
      if (start || end) {
        const created = parseTurkishDate(t.createdAt);
        if (start && created < start) return false;
        if (end   && created > end)   return false;
      }
      return true;
    });
  }, [appliedFilters]);

  return (
    <div className="flex-1 bg-[#f5f8fa] flex flex-col overflow-hidden">

      {/* Filtre paneli */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
        <h2 className="text-sm font-bold text-slate-700 mb-3">Filtreler</h2>

        <div className="flex flex-wrap items-end gap-3">

          {/* Ticket ID — sadece ham raporda */}
          {tab === "ham" && (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Ticket ID</label>
              <input
                value={ticketIdFilter}
                onChange={e => setTicketIdFilter(e.target.value)}
                placeholder="örn. 12345"
                className="w-36 px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          )}

          {/* Tarih aralığı — tüm tablarda */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Başlangıç Tarihi</label>
            <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Bitiş Tarihi</label>
            <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          </div>

          {/* Durum — ham ve sla'da */}
          {tab !== "agent" && (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Durum</label>
              <div className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 min-w-[180px] flex-wrap">
                {selectedStatuses.map(s => (
                  <span key={s} className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-[10px] font-medium px-1.5 py-0.5 rounded">
                    {STATUS_LABELS[s]}
                    <button onClick={()=>toggleStatus(s)}><X className="w-2.5 h-2.5" /></button>
                  </span>
                ))}
                <div className="relative group">
                  <button className="text-[10px] text-slate-400 hover:text-slate-600">+ ekle</button>
                  <div className="absolute left-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-20 min-w-[130px] hidden group-hover:block">
                    {(["open","pending","solved","closed"] as Status[]).map(s => (
                      <button key={s} onClick={()=>toggleStatus(s)}
                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 ${selectedStatuses.includes(s)?"font-semibold text-indigo-600":""}`}>
                        {STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Agent — sadece agent raporunda */}
          {tab === "agent" && (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Agent</label>
              <div className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 min-w-[180px] flex-wrap">
                {selectedAgents.map(a => (
                  <span key={a} className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-[10px] font-medium px-1.5 py-0.5 rounded whitespace-nowrap">
                    {a}
                    <button onClick={()=>toggleAgent(a)}><X className="w-2.5 h-2.5" /></button>
                  </span>
                ))}
                <div className="relative group">
                  <button className="text-[10px] text-slate-400 hover:text-slate-600">+ ekle</button>
                  <div className="absolute left-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-20 min-w-[150px] hidden group-hover:block">
                    {allAgents.map(a => (
                      <button key={a} onClick={()=>toggleAgent(a)}
                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 whitespace-nowrap ${selectedAgents.includes(a)?"font-semibold text-indigo-600":""}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Kategori — sadece agent raporunda */}
          {tab === "agent" && (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Kategori</label>
              <div className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 min-w-[160px] flex-wrap">
                {selectedCategories.map(c => (
                  <span key={c} className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-[10px] font-medium px-1.5 py-0.5 rounded whitespace-nowrap">
                    {c}
                    <button onClick={()=>toggleCategory(c)}><X className="w-2.5 h-2.5" /></button>
                  </span>
                ))}
                <div className="relative group">
                  <button className="text-[10px] text-slate-400 hover:text-slate-600">+ ekle</button>
                  <div className="absolute left-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-20 min-w-[140px] hidden group-hover:block">
                    {allCategories.map(c => (
                      <button key={c} onClick={()=>toggleCategory(c)}
                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 whitespace-nowrap ${selectedCategories.includes(c)?"font-semibold text-indigo-600":""}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grup — tüm tablarda */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Grup</label>
            <div className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 min-w-[200px] flex-wrap">
              {selectedGroups.map(g => (
                <span key={g} className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-[10px] font-medium px-1.5 py-0.5 rounded whitespace-nowrap">
                  {g}
                  <button onClick={()=>toggleGroup(g)}><X className="w-2.5 h-2.5" /></button>
                </span>
              ))}
              <div className="relative group">
                <button className="text-[10px] text-slate-400 hover:text-slate-600">+ ekle</button>
                <div className="absolute left-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-20 min-w-[180px] hidden group-hover:block">
                  {GROUPS.map(g => (
                    <button key={g} onClick={()=>toggleGroup(g)}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 whitespace-nowrap ${selectedGroups.includes(g)?"font-semibold text-indigo-600":""}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button onClick={applyFilters}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors">
            Filtreleri Uygula
          </button>
          <button onClick={resetFilters} className="text-xs text-slate-500 hover:text-slate-700 transition-colors">
            Sıfırla
          </button>
        </div>
      </div>

      {/* İçerik */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {tab === "ham"   && <HamRapor   tickets={filteredTickets} onExport={()=>exportCSV(filteredTickets,"ham")}   />}
        {tab === "agent" && <AgentRaporu tickets={filteredTickets} onExport={()=>exportCSV(filteredTickets,"agent")} />}
        {tab === "sla"   && <SlaRaporu   tickets={filteredTickets} onExport={()=>exportCSV(filteredTickets,"sla")}   />}
      </div>
    </div>
  );
}
