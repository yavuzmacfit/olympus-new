"use client";

import { useState, useMemo } from "react";
import { X, Download, Search } from "lucide-react";

/* ─── Tipler ─────────────────────────────────────────────────── */
type Status   = "open" | "pending" | "solved" | "closed";
type Priority = "low" | "normal" | "high" | "urgent";
type Group    = "MAC Ürün Yönetimi" | "MAC Teknik Destek" | "MAC Üyelik" | "MAC Finans" | "MAC Tesis";

interface Ticket {
  id: string;
  subject: string;
  status: Status;
  priority: Priority;
  group: Group;
  agent: string;
  createdAt: string;
  updatedAt: string;
  totalDuration: string; // "X saat Y dakika"
  totalMinutes: number;
  groupTransfers: number;
  agentChanges: number;
  reopened: boolean;
  escalated: boolean;
  finalStatus: Status;
}

/* ─── Mock veri ─────────────────────────────────────────────── */
const ALL_TICKETS: Ticket[] = [
  { id: "#2570671", subject: "Tunalı Çalışma Saatleri",       status: "closed", priority: "normal", group: "MAC Ürün Yönetimi", agent: "Ayşe T.",   createdAt: "01.04.2026 09:00", updatedAt: "08.04.2026 11:30", totalDuration: "161 saat 44 dakika", totalMinutes: 9704, groupTransfers: 0, agentChanges: 0, reopened: false, escalated: true,  finalStatus: "closed" },
  { id: "#2593138", subject: "Uygulama sorunu",                status: "closed", priority: "high",   group: "MAC Teknik Destek", agent: "Emre K.",   createdAt: "03.04.2026 10:15", updatedAt: "08.04.2026 11:30", totalDuration: "69 saat 32 dakika",  totalMinutes: 4172, groupTransfers: 0, agentChanges: 0, reopened: false, escalated: true,  finalStatus: "closed" },
  { id: "#2601445", subject: "Ödeme terminali arızası",        status: "closed", priority: "urgent", group: "MAC Teknik Destek", agent: "Can Y.",    createdAt: "04.04.2026 08:30", updatedAt: "07.04.2026 17:00", totalDuration: "80 saat 30 dakika",  totalMinutes: 4830, groupTransfers: 1, agentChanges: 1, reopened: false, escalated: true,  finalStatus: "closed" },
  { id: "#2612890", subject: "Üye kartı aktivasyon hatası",    status: "solved", priority: "high",   group: "MAC Üyelik",        agent: "Zeynep A.", createdAt: "05.04.2026 14:00", updatedAt: "07.04.2026 10:00", totalDuration: "44 saat 0 dakika",   totalMinutes: 2640, groupTransfers: 0, agentChanges: 0, reopened: false, escalated: false, finalStatus: "solved" },
  { id: "#2625301", subject: "Kampanya kodu geçersiz",         status: "closed", priority: "normal", group: "MAC Ürün Yönetimi", agent: "Ayşe T.",   createdAt: "06.04.2026 11:00", updatedAt: "08.04.2026 09:00", totalDuration: "46 saat 0 dakika",   totalMinutes: 2760, groupTransfers: 0, agentChanges: 0, reopened: false, escalated: false, finalStatus: "closed" },
  { id: "#2630112", subject: "Havuz sisteminde arıza",         status: "open",   priority: "urgent", group: "MAC Tesis",         agent: "Can Y.",    createdAt: "07.04.2026 07:00", updatedAt: "08.04.2026 10:00", totalDuration: "27 saat 0 dakika",   totalMinutes: 1620, groupTransfers: 2, agentChanges: 1, reopened: false, escalated: true,  finalStatus: "open"   },
  { id: "#2631058", subject: "Toplu SMS gönderimi başarısız",  status: "solved", priority: "high",   group: "MAC Teknik Destek", agent: "Emre K.",   createdAt: "07.04.2026 09:30", updatedAt: "08.04.2026 08:00", totalDuration: "22 saat 30 dakika",  totalMinutes: 1350, groupTransfers: 0, agentChanges: 0, reopened: true,  escalated: false, finalStatus: "solved" },
  { id: "#2632900", subject: "Fatura PDF indirme hatası",      status: "pending",priority: "low",    group: "MAC Finans",        agent: "Zeynep A.", createdAt: "07.04.2026 13:00", updatedAt: "08.04.2026 07:30", totalDuration: "18 saat 30 dakika",  totalMinutes: 1110, groupTransfers: 0, agentChanges: 0, reopened: false, escalated: false, finalStatus: "pending" },
  { id: "#2633741", subject: "Eğitmen programı güncellenemiyor",status:"open",   priority: "normal", group: "MAC Üyelik",        agent: "-",         createdAt: "08.04.2026 08:00", updatedAt: "08.04.2026 08:00", totalDuration: "3 saat 12 dakika",   totalMinutes: 192,  groupTransfers: 0, agentChanges: 0, reopened: false, escalated: false, finalStatus: "open"   },
  { id: "#2634002", subject: "Kilit dolap şifre sıfırlama",    status: "solved", priority: "low",    group: "MAC Tesis",         agent: "Can Y.",    createdAt: "08.04.2026 09:00", updatedAt: "08.04.2026 11:00", totalDuration: "2 saat 0 dakika",    totalMinutes: 120,  groupTransfers: 0, agentChanges: 0, reopened: false, escalated: false, finalStatus: "solved" },
];

const GROUPS: Group[] = ["MAC Ürün Yönetimi", "MAC Teknik Destek", "MAC Üyelik", "MAC Finans", "MAC Tesis"];
const STATUS_LABELS: Record<Status, string> = { open: "Açık", pending: "Beklemede", solved: "Çözüldü", closed: "Kapatıldı" };
const STATUS_COLORS: Record<Status, string> = {
  open:    "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  solved:  "bg-emerald-100 text-emerald-700",
  closed:  "bg-slate-200 text-slate-600",
};

type TabKey = "ham" | "agent" | "sla";

/* ─── CSV export ─────────────────────────────────────────────── */
function exportCSV(tickets: Ticket[], tab: TabKey) {
  let headers: string[];
  let rows: string[][];

  if (tab === "ham") {
    headers = ["Ticket ID","Konu","Durum","Öncelik","Grup","Güncellenme Tarihi","Toplam Süre","Grup Transferi","Agent Değişimi","Yeniden Açıldı","Eskalasyon","Final Durum"];
    rows = tickets.map(t => [
      t.id, t.subject, STATUS_LABELS[t.status], t.priority,
      t.group, t.updatedAt, t.totalDuration,
      String(t.groupTransfers), String(t.agentChanges),
      t.reopened ? "Evet" : "Hayır",
      t.escalated ? "Evet" : "Hayır",
      STATUS_LABELS[t.finalStatus],
    ]);
  } else if (tab === "agent") {
    headers = ["Agent","Ticket Sayısı","Ort. Çözüm Süresi (dk)","Çözülen","Kapatılan","Eskalasyon"];
    const agentMap: Record<string, Ticket[]> = {};
    tickets.forEach(t => { (agentMap[t.agent] = agentMap[t.agent] || []).push(t); });
    rows = Object.entries(agentMap).map(([agent, ts]) => [
      agent,
      String(ts.length),
      String(Math.round(ts.reduce((s,t) => s + t.totalMinutes, 0) / ts.length)),
      String(ts.filter(t => t.status === "solved").length),
      String(ts.filter(t => t.status === "closed").length),
      String(ts.filter(t => t.escalated).length),
    ]);
  } else {
    headers = ["Ticket ID","Konu","Öncelik","Grup","Toplam Süre (dk)","SLA Durumu"];
    rows = tickets.map(t => [
      t.id, t.subject, t.priority, t.group, String(t.totalMinutes),
      t.totalMinutes > 4800 ? "İhlal" : t.totalMinutes > 3600 ? "Uyarı" : "Normal",
    ]);
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
                {["Ticket ID","Konu","Durum","Güncellenme Tarihi","Toplam Süre","Grup Transferi","Agent Değişimi","Yeniden Açıldı","Eskalasyon","Final Durum"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={t.id} className={`border-b border-slate-50 hover:bg-slate-50/70 transition-colors ${i%2===1?"bg-slate-50/30":""}`}>
                  <td className="px-4 py-3 font-mono text-slate-500">{t.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-700 max-w-[200px] truncate">{t.subject}</td>
                  <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3 text-slate-500">{t.updatedAt}</td>
                  <td className="px-4 py-3 text-slate-600">{t.totalDuration}</td>
                  <td className="px-4 py-3 text-center text-slate-600">{t.groupTransfers}</td>
                  <td className="px-4 py-3 text-center text-slate-600">{t.agentChanges}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[11px] font-medium ${t.reopened ? "text-amber-600":"text-slate-400"}`}>{t.reopened?"Evet":"Hayır"}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[11px] font-medium ${t.escalated ? "text-red-500":"text-slate-400"}`}>{t.escalated?"Evet":"Hayır"}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={t.finalStatus} /></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="px-4 py-10 text-center text-slate-400">Sonuç bulunamadı</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Agent Raporu sekmesi ───────────────────────────────────── */
function AgentRaporu({ tickets, onExport }: { tickets: Ticket[]; onExport: () => void }) {
  const agentMap: Record<string, Ticket[]> = {};
  tickets.forEach(t => { (agentMap[t.agent] = agentMap[t.agent] || []).push(t); });
  const agents = Object.entries(agentMap).map(([agent, ts]) => ({
    agent,
    count: ts.length,
    avgMinutes: Math.round(ts.reduce((s,t) => s+t.totalMinutes, 0) / ts.length),
    solved: ts.filter(t=>t.status==="solved").length,
    closed: ts.filter(t=>t.status==="closed").length,
    escalated: ts.filter(t=>t.escalated).length,
  })).sort((a,b) => b.count - a.count);

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto p-6">
      <div className="grid grid-cols-3 gap-3">
        <MetricCard label="Aktif Agent" value={Object.keys(agentMap).filter(a=>a!=="-").length} sub="filtredeki ticketlar" />
        <MetricCard label="Ort. Ticket / Agent" value={(tickets.length / Math.max(Object.keys(agentMap).filter(a=>a!=="-").length,1)).toFixed(1)} sub="dağılım" />
        <MetricCard label="Eskalasyon Oranı" value={`%${tickets.length ? Math.round(tickets.filter(t=>t.escalated).length/tickets.length*100) : 0}`} sub="filtredeki ticketlar" color="text-red-500" />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex-1">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <p className="text-sm font-bold text-slate-700">Agent Performansı</p>
          <button onClick={onExport} className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
            <Download className="w-3.5 h-3.5" /> Agent Raporunu Dışa Aktar
          </button>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] uppercase tracking-wider">
              {["Agent","Ticket Sayısı","Ort. Çözüm Süresi","Çözülen","Kapatılan","Eskalasyon"].map(h=>(
                <th key={h} className="text-left px-5 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {agents.map((row,i) => (
              <tr key={row.agent} className={`border-b border-slate-50 hover:bg-slate-50/70 ${i%2===1?"bg-slate-50/30":""}`}>
                <td className="px-5 py-3 font-medium text-slate-700">{row.agent}</td>
                <td className="px-5 py-3 text-slate-600">{row.count}</td>
                <td className="px-5 py-3 text-slate-600">{Math.floor(row.avgMinutes/60)} saat {row.avgMinutes%60} dk</td>
                <td className="px-5 py-3 text-emerald-600 font-medium">{row.solved}</td>
                <td className="px-5 py-3 text-slate-500">{row.closed}</td>
                <td className="px-5 py-3">
                  <span className={`font-medium ${row.escalated > 0 ? "text-red-500" : "text-slate-400"}`}>{row.escalated}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── SLA Raporu sekmesi ─────────────────────────────────────── */
function SlaRaporu({ tickets, onExport }: { tickets: Ticket[]; onExport: () => void }) {
  const slaRows = tickets.map(t => ({
    ...t,
    sla: t.totalMinutes > 4800 ? "breached" : t.totalMinutes > 3600 ? "warning" : "ok" as "ok"|"warning"|"breached",
  }));
  const ok       = slaRows.filter(r=>r.sla==="ok").length;
  const warning  = slaRows.filter(r=>r.sla==="warning").length;
  const breached = slaRows.filter(r=>r.sla==="breached").length;
  const compliance = tickets.length ? Math.round(ok/tickets.length*100) : 0;

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto p-6">
      <div className="grid grid-cols-4 gap-3">
        <MetricCard label="SLA Uyumu" value={`%${compliance}`} sub="filtredeki ticketlar" color={compliance>=85?"text-emerald-600":"text-red-500"} />
        <MetricCard label="Normal" value={ok} sub="SLA içinde" color="text-emerald-600" />
        <MetricCard label="Uyarı" value={warning} sub="> %75 doluluk" color="text-amber-600" />
        <MetricCard label="İhlal" value={breached} sub="SLA aşıldı" color="text-red-500" />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex-1">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <p className="text-sm font-bold text-slate-700">SLA Detay Tablosu</p>
          <button onClick={onExport} className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
            <Download className="w-3.5 h-3.5" /> SLA Raporunu Dışa Aktar
          </button>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] uppercase tracking-wider">
              {["Ticket ID","Konu","Öncelik","Grup","Toplam Süre","SLA Durumu"].map(h=>(
                <th key={h} className="text-left px-5 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slaRows.map((row,i) => (
              <tr key={row.id} className={`border-b border-slate-50 hover:bg-slate-50/70 ${i%2===1?"bg-slate-50/30":""}`}>
                <td className="px-5 py-3 font-mono text-slate-500">{row.id}</td>
                <td className="px-5 py-3 font-medium text-slate-700 max-w-[200px] truncate">{row.subject}</td>
                <td className="px-5 py-3 capitalize text-slate-600">{row.priority}</td>
                <td className="px-5 py-3 text-slate-600">{row.group}</td>
                <td className="px-5 py-3 text-slate-600">{row.totalDuration}</td>
                <td className="px-5 py-3">
                  {row.sla === "ok"       && <span className="bg-emerald-50 text-emerald-700 text-[11px] font-medium px-2 py-0.5 rounded">Normal</span>}
                  {row.sla === "warning"  && <span className="bg-amber-50 text-amber-700 text-[11px] font-medium px-2 py-0.5 rounded">Uyarı</span>}
                  {row.sla === "breached" && <span className="bg-red-50 text-red-700 text-[11px] font-medium px-2 py-0.5 rounded">İhlal</span>}
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
  const [ticketIdFilter, setTicketIdFilter]     = useState("");
  const [startDate, setStartDate]               = useState("2026-04-01");
  const [endDate, setEndDate]                   = useState("2026-04-08");
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);
  const [selectedGroups, setSelectedGroups]     = useState<Group[]>([]);
  const [appliedFilters, setAppliedFilters]     = useState<{
    ticketId: string; startDate: string; endDate: string;
    statuses: Status[]; groups: Group[];
  }>({ ticketId: "", startDate: "2026-04-01", endDate: "2026-04-08", statuses: [], groups: [] });

  const toggleStatus = (s: Status) =>
    setSelectedStatuses(prev => prev.includes(s) ? prev.filter(x=>x!==s) : [...prev, s]);
  const toggleGroup  = (g: Group) =>
    setSelectedGroups(prev => prev.includes(g) ? prev.filter(x=>x!==g) : [...prev, g]);

  const applyFilters = () =>
    setAppliedFilters({ ticketId: ticketIdFilter, startDate, endDate, statuses: selectedStatuses, groups: selectedGroups });

  const resetFilters = () => {
    setTicketIdFilter(""); setStartDate("2026-04-01"); setEndDate("2026-04-08");
    setSelectedStatuses([]); setSelectedGroups([]);
    setAppliedFilters({ ticketId: "", startDate: "2026-04-01", endDate: "2026-04-08", statuses: [], groups: [] });
  };

  const filteredTickets = useMemo(() => {
    return ALL_TICKETS.filter(t => {
      if (appliedFilters.ticketId && !t.id.includes(appliedFilters.ticketId)) return false;
      if (appliedFilters.statuses.length && !appliedFilters.statuses.includes(t.status)) return false;
      if (appliedFilters.groups.length && !appliedFilters.groups.includes(t.group)) return false;
      return true;
    });
  }, [appliedFilters]);

  return (
    <div className="flex-1 bg-[#f5f8fa] flex flex-col overflow-hidden">

      {/* Filtre paneli */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
        <h2 className="text-sm font-bold text-slate-700 mb-3">Filtreler</h2>

        <div className="flex flex-wrap items-end gap-3">
          {/* Ticket ID */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Ticket ID</label>
            <input
              value={ticketIdFilter}
              onChange={e => setTicketIdFilter(e.target.value)}
              placeholder="örn. 12345"
              className="w-36 px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Tarih aralığı */}
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

          {/* Durum çoklu seçim */}
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

          {/* Grup çoklu seçim */}
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
