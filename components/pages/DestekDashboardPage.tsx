"use client";

import { useState, useMemo } from "react";
import { TicketIcon, ChevronUp, ChevronDown, ChevronsUpDown, CalendarDays, X, Download } from "lucide-react";

/* ─── Veri tipleri ──────────────────────────────────────────── */
interface Row {
  id: number;
  name: string;
  isClub: boolean;           // true = kulüp, false = merkezi grup
  open: number;
  closed: number;
  created: number;
  assigned: number;
  unassigned: number;
  avgOpenHours: number;
  slaCompliance: number;
}

/* ─── Mock veri ─────────────────────────────────────────────── */
const CLUBS: Row[] = [
  { id: 22, name: "Akbatı",                isClub: true,  open: 18, closed: 22, created: 40,  assigned: 11, unassigned: 7,  avgOpenHours: 52, slaCompliance: 72 },
  { id: 6,  name: "Mall of Istanbul",      isClub: true,  open: 16, closed: 21, created: 37,  assigned: 10, unassigned: 6,  avgOpenHours: 48, slaCompliance: 75 },
  { id: 11, name: "Axis Kağıthane",        isClub: true,  open: 15, closed: 20, created: 35,  assigned: 8,  unassigned: 7,  avgOpenHours: 61, slaCompliance: 68 },
  { id: 2,  name: "Ankamall",              isClub: true,  open: 14, closed: 20, created: 34,  assigned: 9,  unassigned: 5,  avgOpenHours: 44, slaCompliance: 79 },
  { id: 21, name: "Armada",                isClub: true,  open: 13, closed: 21, created: 34,  assigned: 9,  unassigned: 4,  avgOpenHours: 39, slaCompliance: 82 },
  { id: 34, name: "Maltepe Pasco Plaza",   isClub: true,  open: 12, closed: 20, created: 32,  assigned: 7,  unassigned: 5,  avgOpenHours: 55, slaCompliance: 71 },
  { id: 3,  name: "Buyaka",                isClub: true,  open: 11, closed: 22, created: 33,  assigned: 8,  unassigned: 3,  avgOpenHours: 33, slaCompliance: 88 },
  { id: 14, name: "Fulya",                 isClub: true,  open: 11, closed: 20, created: 31,  assigned: 7,  unassigned: 4,  avgOpenHours: 42, slaCompliance: 80 },
  { id: 23, name: "Kanyon",                isClub: true,  open: 10, closed: 23, created: 33,  assigned: 8,  unassigned: 2,  avgOpenHours: 29, slaCompliance: 91 },
  { id: 9,  name: "Forum Kidsmall",        isClub: true,  open: 10, closed: 20, created: 30,  assigned: 5,  unassigned: 5,  avgOpenHours: 67, slaCompliance: 66 },
  { id: 32, name: "Kocaeli Gebze Center",  isClub: true,  open: 9,  closed: 21, created: 30,  assigned: 6,  unassigned: 3,  avgOpenHours: 38, slaCompliance: 83 },
  { id: 13, name: "Metrogarden",           isClub: true,  open: 9,  closed: 21, created: 30,  assigned: 6,  unassigned: 3,  avgOpenHours: 45, slaCompliance: 77 },
  { id: 1,  name: "Anadolu Hisarı",        isClub: true,  open: 8,  closed: 22, created: 30,  assigned: 6,  unassigned: 2,  avgOpenHours: 31, slaCompliance: 89 },
  { id: 33, name: "Antalya Lara Carrefour",isClub: true,  open: 8,  closed: 22, created: 30,  assigned: 4,  unassigned: 4,  avgOpenHours: 58, slaCompliance: 70 },
  { id: 29, name: "Cadde",                 isClub: true,  open: 7,  closed: 23, created: 30,  assigned: 5,  unassigned: 2,  avgOpenHours: 36, slaCompliance: 84 },
  { id: 25, name: "Panora",                isClub: true,  open: 7,  closed: 24, created: 31,  assigned: 6,  unassigned: 1,  avgOpenHours: 27, slaCompliance: 93 },
  { id: 15, name: "Bursa Podyumpark",      isClub: true,  open: 7,  closed: 23, created: 30,  assigned: 5,  unassigned: 2,  avgOpenHours: 41, slaCompliance: 81 },
  { id: 31, name: "Kartal",                isClub: true,  open: 6,  closed: 24, created: 30,  assigned: 5,  unassigned: 1,  avgOpenHours: 22, slaCompliance: 94 },
  { id: 8,  name: "Vialand",               isClub: true,  open: 6,  closed: 24, created: 30,  assigned: 4,  unassigned: 2,  avgOpenHours: 49, slaCompliance: 76 },
  { id: 12, name: "Adana Optimum",         isClub: true,  open: 6,  closed: 24, created: 30,  assigned: 3,  unassigned: 3,  avgOpenHours: 53, slaCompliance: 73 },
  { id: 35, name: "Podium",                isClub: true,  open: 5,  closed: 25, created: 30,  assigned: 4,  unassigned: 1,  avgOpenHours: 19, slaCompliance: 95 },
  { id: 28, name: "Ortaköy Lotus",         isClub: true,  open: 5,  closed: 26, created: 31,  assigned: 4,  unassigned: 1,  avgOpenHours: 24, slaCompliance: 92 },
  { id: 20, name: "Ömür Plaza",            isClub: true,  open: 5,  closed: 25, created: 30,  assigned: 3,  unassigned: 2,  avgOpenHours: 44, slaCompliance: 78 },
  { id: 5,  name: "Ormanada",              isClub: true,  open: 4,  closed: 26, created: 30,  assigned: 3,  unassigned: 1,  avgOpenHours: 18, slaCompliance: 97 },
  { id: 17, name: "A Plus",                isClub: true,  open: 3,  closed: 27, created: 30,  assigned: 2,  unassigned: 1,  avgOpenHours: 15, slaCompliance: 98 },
  // Merkezi gruplar
  { id: 101, name: "MAC Ürün Yönetimi",   isClub: false, open: 9,  closed: 18, created: 27,  assigned: 7,  unassigned: 2,  avgOpenHours: 38, slaCompliance: 81 },
  { id: 102, name: "MAC Teknik Destek",   isClub: false, open: 7,  closed: 15, created: 22,  assigned: 5,  unassigned: 2,  avgOpenHours: 44, slaCompliance: 74 },
  { id: 103, name: "MAC Üyelik",          isClub: false, open: 6,  closed: 20, created: 26,  assigned: 6,  unassigned: 0,  avgOpenHours: 28, slaCompliance: 88 },
  { id: 104, name: "MAC Finans",          isClub: false, open: 4,  closed: 14, created: 18,  assigned: 3,  unassigned: 1,  avgOpenHours: 52, slaCompliance: 70 },
  { id: 105, name: "MAC Tesis",           isClub: false, open: 5,  closed: 16, created: 21,  assigned: 4,  unassigned: 1,  avgOpenHours: 35, slaCompliance: 83 },
  { id: 106, name: "Yazılım 1",           isClub: false, open: 3,  closed: 12, created: 15,  assigned: 3,  unassigned: 0,  avgOpenHours: 22, slaCompliance: 92 },
];

const ALL_NAMES        = CLUBS.map(r => r.name);
const CLUB_NAMES       = CLUBS.filter(r => r.isClub).map(r => r.name);
const CENTRAL_NAMES    = CLUBS.filter(r => !r.isClub).map(r => r.name);

/* ─── Tipler ────────────────────────────────────────────────── */
type SortKey = "open" | "closed" | "created" | "assigned" | "unassigned" | "avgOpenHours" | "slaCompliance";
type SortDir = "asc" | "desc";
type Period  = "bugun" | "haftalik" | "aylik" | "ozel";

const PERIOD_LABELS: Record<Period, string> = {
  bugun: "Bugün", haftalik: "Bu Hafta", aylik: "Bu Ay", ozel: "Özel Aralık",
};

function scaleByPeriod(val: number, factor: number) {
  return Math.max(1, Math.round(val * factor));
}

function periodFactor(period: Period, customStart: string, customEnd: string): number {
  if (period === "bugun")    return 1;
  if (period === "haftalik") return 7;
  if (period === "aylik")    return 30;
  if (customStart && customEnd) {
    const ms = new Date(customEnd).getTime() - new Date(customStart).getTime();
    return Math.max(1, Math.round(ms / 86400000) + 1);
  }
  return 1;
}

function periodSubLabel(period: Period, customStart: string, customEnd: string): string {
  if (period === "bugun") return new Date().toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
  if (period === "haftalik") return "son 7 gün";
  if (period === "aylik")    return "son 30 gün";
  if (customStart && customEnd) return `${customStart} – ${customEnd}`;
  return "";
}

function fmtHours(h: number) {
  if (h < 24) return `${h} saat`;
  const d = Math.floor(h / 24), rem = h % 24;
  return rem > 0 ? `${d}g ${rem}s` : `${d} gün`;
}

function SlaBar({ value }: { value: number }) {
  const color = value >= 90 ? "bg-emerald-500" : value >= 75 ? "bg-amber-400" : "bg-red-500";
  const text  = value >= 90 ? "text-emerald-600" : value >= 75 ? "text-amber-600" : "text-red-600";
  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className={`text-[11px] font-semibold w-8 text-right ${text}`}>%{value}</span>
    </div>
  );
}

function OpenBar({ value, max }: { value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  const color = pct > 70 ? "bg-red-400" : pct > 40 ? "bg-amber-400" : "bg-indigo-400";
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-slate-700 w-4 text-right">{value}</span>
    </div>
  );
}

/* ─── Gruplu Birim Dropdown ─────────────────────────────────── */
function BirimDropdown({
  selected, onToggle, onClear,
}: {
  selected: string[];
  onToggle: (name: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");

  const filteredClubs   = CLUB_NAMES.filter(n => n.toLowerCase().includes(search.toLowerCase()));
  const filteredCentral = CENTRAL_NAMES.filter(n => n.toLowerCase().includes(search.toLowerCase()));

  const label = selected.length === 0
    ? "Tüm Birimler"
    : selected.length === 1
    ? selected[0]
    : `${selected.length} birim seçili`;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className="flex items-center justify-between gap-2 px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white hover:bg-slate-50 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-indigo-200"
      >
        <span className={selected.length ? "text-slate-700 font-medium" : "text-slate-400"}>
          {label}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {selected.length > 0 && (
            <span
              onClick={e => { e.stopPropagation(); onClear(); }}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </span>
          )}
          <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd"/>
          </svg>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-30 bg-white border border-slate-200 rounded-xl shadow-xl w-64">
          {/* Arama */}
          <div className="p-2 border-b border-slate-100">
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Birim ara..."
              className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div className="max-h-72 overflow-y-auto">
            {/* Kulüpler bölümü */}
            {filteredClubs.length > 0 && (
              <>
                <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">📍 Kulüpler</span>
                  <button
                    onClick={() => filteredClubs.forEach(n => { if (!selected.includes(n)) onToggle(n); })}
                    className="text-[10px] text-indigo-500 hover:text-indigo-700 font-medium"
                  >
                    Tümünü seç
                  </button>
                </div>
                {filteredClubs.map(name => (
                  <label key={name} className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-slate-50 cursor-pointer">
                    <input type="checkbox" checked={selected.includes(name)} onChange={() => onToggle(name)}
                      className="accent-indigo-600 w-3.5 h-3.5 shrink-0" />
                    <span className="text-xs text-slate-700">{name}</span>
                  </label>
                ))}
              </>
            )}

            {/* Merkezi Gruplar bölümü */}
            {filteredCentral.length > 0 && (
              <>
                <div className="flex items-center justify-between px-3 pt-3 pb-1 border-t border-slate-100 mt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">🏢 Merkezi Gruplar</span>
                  <button
                    onClick={() => filteredCentral.forEach(n => { if (!selected.includes(n)) onToggle(n); })}
                    className="text-[10px] text-indigo-500 hover:text-indigo-700 font-medium"
                  >
                    Tümünü seç
                  </button>
                </div>
                {filteredCentral.map(name => (
                  <label key={name} className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-slate-50 cursor-pointer">
                    <input type="checkbox" checked={selected.includes(name)} onChange={() => onToggle(name)}
                      className="accent-indigo-600 w-3.5 h-3.5 shrink-0" />
                    <span className="text-xs text-slate-700">{name}</span>
                  </label>
                ))}
              </>
            )}

            {filteredClubs.length === 0 && filteredCentral.length === 0 && (
              <p className="px-3 py-4 text-xs text-slate-400 text-center">Sonuç bulunamadı</p>
            )}
          </div>

          {/* Alt bar */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100">
            <span className="text-[10px] text-slate-400">{selected.length} birim seçili</span>
            <button onClick={() => { onClear(); setSearch(""); }} className="text-[10px] text-indigo-600 hover:text-indigo-700 font-medium">
              Temizle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Ana bileşen ────────────────────────────────────────────── */
export default function DestekDashboardPage() {
  const [sortKey, setSortKey]         = useState<SortKey>("open");
  const [sortDir, setSortDir]         = useState<SortDir>("desc");
  const [period, setPeriod]           = useState<Period>("bugun");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd]     = useState("");
  const [selectedBirim, setSelectedBirim] = useState<string[]>([]);
  const [page, setPage]               = useState(1);
  const PAGE_SIZE = 10;

  const toggleBirim = (name: string) =>
    setSelectedBirim(prev => prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]);

  const factor = useMemo(
    () => periodFactor(period, customStart, customEnd),
    [period, customStart, customEnd]
  );

  const scaledRows = useMemo(() =>
    CLUBS.map(c => ({
      ...c,
      open:       scaleByPeriod(c.open, factor),
      closed:     scaleByPeriod(c.closed, factor),
      created:    scaleByPeriod(c.created, factor),
      assigned:   scaleByPeriod(c.assigned, factor),
      unassigned: scaleByPeriod(c.unassigned, factor),
    })),
    [factor]
  );

  const sorted = [...scaledRows]
    .filter(r => selectedBirim.length === 0 || selectedBirim.includes(r.name))
    .sort((a, b) => {
      const diff = a[sortKey] - b[sortKey];
      return sortDir === "desc" ? -diff : diff;
    });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paged      = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const maxOpen    = Math.max(...sorted.map(c => c.open), 1);

  // Özet metrikler: sadece kulüpleri baz al
  const clubRows   = scaledRows.filter(r => r.isClub);
  const totalOpen  = scaledRows.reduce((s, c) => s + c.open, 0);
  const totalClosed  = scaledRows.reduce((s, c) => s + c.closed, 0);
  const totalCreated = scaledRows.reduce((s, c) => s + c.created, 0);
  const avgOpen    = Math.round(clubRows.reduce((s, c) => s + c.avgOpenHours, 0) / clubRows.length);
  const avgSla     = Math.round(clubRows.reduce((s, c) => s + c.slaCompliance, 0) / clubRows.length);
  const breachCount = clubRows.filter(c => c.slaCompliance < 75).length;
  const worstClub  = [...clubRows].sort((a, b) => b.open - a.open)[0];
  const subLabel   = periodSubLabel(period, customStart, customEnd);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
    setPage(1);
  };

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ChevronsUpDown className="w-3 h-3 text-slate-300" />;
    return sortDir === "desc"
      ? <ChevronDown className="w-3 h-3 text-indigo-500" />
      : <ChevronUp   className="w-3 h-3 text-indigo-500" />;
  };

  return (
    <div className="flex flex-col gap-5 p-6 h-full w-full overflow-y-auto bg-[#f5f8fa]">

      {/* ── Periyod seçici ─────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
        <div className="flex gap-1">
          {(["bugun", "haftalik", "aylik", "ozel"] as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${period === p ? "bg-[#CD3638] text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
        {period === "ozel" && (
          <div className="flex items-center gap-2 ml-1">
            <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-200" />
            <span className="text-xs text-slate-400">—</span>
            <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-200" />
          </div>
        )}
        {subLabel && <span className="text-xs text-slate-400 ml-1">{subLabel}</span>}
      </div>

      {/* ── Özet kartlar ───────────────────────────────────────── */}
      <div className="grid grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-4">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Toplam Açık</p>
          <p className="text-2xl font-bold text-red-500">{totalOpen}</p>
          <p className="text-[10px] text-slate-400 mt-1">{PERIOD_LABELS[period].toLowerCase()}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-4">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Toplam Kapalı</p>
          <p className="text-2xl font-bold text-emerald-600">{totalClosed}</p>
          <p className="text-[10px] text-slate-400 mt-1">{PERIOD_LABELS[period].toLowerCase()}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-4">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Toplam Oluşturulan</p>
          <p className="text-2xl font-bold text-slate-700">{totalCreated}</p>
          <p className="text-[10px] text-slate-400 mt-1">{PERIOD_LABELS[period].toLowerCase()}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-4">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Ort. Açık Kalma</p>
          <p className="text-2xl font-bold text-amber-600">{fmtHours(avgOpen)}</p>
          <p className="text-[10px] text-slate-400 mt-1">birim ortalaması</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-4">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Ort. SLA Uyumu</p>
          <p className={`text-2xl font-bold ${avgSla >= 85 ? "text-emerald-600" : "text-amber-600"}`}>%{avgSla}</p>
          <p className="text-[10px] text-slate-400 mt-1">{breachCount} birim ihlalde</p>
        </div>
        <div className="bg-white border border-red-100 rounded-xl px-4 py-4">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">En Yoğun Birim</p>
          <p className="text-sm font-bold text-slate-700 leading-tight">{worstClub.name}</p>
          <p className="text-[10px] text-red-500 mt-1">{worstClub.open} açık ticket</p>
        </div>
      </div>

      {/* ── Tablo ──────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TicketIcon className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-bold text-slate-700">Birim Bazlı Ticket Özeti</span>
            <span className="text-xs text-slate-400 ml-1">— {sorted.length} birim</span>
          </div>
          <div className="flex items-center gap-2">
            <BirimDropdown
              selected={selectedBirim}
              onToggle={name => { toggleBirim(name); setPage(1); }}
              onClear={() => { setSelectedBirim([]); setPage(1); }}
            />
          <button
            onClick={() => {
              const headers = ["Birim", "Açık", "Kapalı", "Toplam", "Üstlenilmiş", "Üstlenilmemiş", "Ort. Açık Kalma (saat)", "SLA %"];
              const rows = sorted.map(r => [r.name, r.open, r.closed, r.created, r.assigned, r.unassigned, r.avgOpenHours, r.slaCompliance]);
              const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
              const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = `dashboard-${new Date().toISOString().slice(0,10)}.csv`; a.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center text-slate-500 hover:text-slate-700 border border-slate-200 hover:border-slate-400 p-1.5 rounded-lg transition-colors"
            title="CSV Dışa Aktar"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-semibold w-8">#</th>
                <th className="text-left px-4 py-3 font-semibold">Birim</th>
                <th className="text-left px-4 py-3 font-semibold cursor-pointer hover:text-slate-700 select-none" onClick={() => handleSort("open")}>
                  <div className="flex items-center gap-1">Açık <SortIcon k="open" /></div>
                </th>
                <th className="text-left px-4 py-3 font-semibold cursor-pointer hover:text-slate-700 select-none" onClick={() => handleSort("closed")}>
                  <div className="flex items-center gap-1">Kapalı <SortIcon k="closed" /></div>
                </th>
                <th className="text-left px-4 py-3 font-semibold cursor-pointer hover:text-slate-700 select-none" onClick={() => handleSort("created")}>
                  <div className="flex items-center gap-1">Toplam <SortIcon k="created" /></div>
                </th>
                <th className="text-left px-4 py-3 font-semibold cursor-pointer hover:text-slate-700 select-none" onClick={() => handleSort("assigned")}>
                  <div className="flex items-center gap-1">Üstlenilmiş <SortIcon k="assigned" /></div>
                </th>
                <th className="text-left px-4 py-3 font-semibold cursor-pointer hover:text-slate-700 select-none" onClick={() => handleSort("unassigned")}>
                  <div className="flex items-center gap-1">Üstlenilmemiş <SortIcon k="unassigned" /></div>
                </th>
                <th className="text-left px-4 py-3 font-semibold cursor-pointer hover:text-slate-700 select-none min-w-[130px]" onClick={() => handleSort("avgOpenHours")}>
                  <div className="flex items-center gap-1">Ort. Açık Kalma <SortIcon k="avgOpenHours" /></div>
                </th>
                <th className="text-left px-4 py-3 font-semibold cursor-pointer hover:text-slate-700 select-none min-w-[140px]" onClick={() => handleSort("slaCompliance")}>
                  <div className="flex items-center gap-1">SLA Uyumu <SortIcon k="slaCompliance" /></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paged.map((row, i) => (
                <tr key={row.id} className={`border-b border-slate-50 hover:bg-indigo-50/30 transition-colors ${i % 2 === 1 ? "bg-slate-50/30" : ""}`}>
                  <td className="px-4 py-3 text-slate-400 font-mono text-[10px]">{(safePage - 1) * PAGE_SIZE + i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">{row.name}</span>
                      {!row.isClub && (
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">merkezi</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3"><OpenBar value={row.open} max={maxOpen} /></td>
                  <td className="px-4 py-3 text-emerald-600 font-semibold">{row.closed}</td>
                  <td className="px-4 py-3 text-slate-600">{row.created}</td>
                  <td className="px-4 py-3 font-semibold text-amber-600">{row.assigned}</td>
                  <td className="px-4 py-3 font-semibold text-red-500">{row.unassigned}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${row.avgOpenHours > 48 ? "text-red-500" : row.avgOpenHours > 24 ? "text-amber-600" : "text-emerald-600"}`}>
                      {fmtHours(row.avgOpenHours)}
                    </span>
                  </td>
                  <td className="px-4 py-3"><SlaBar value={row.slaCompliance} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
            <span className="text-xs text-slate-400">
              {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, sorted.length)} / {sorted.length} birim
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(1)} disabled={safePage === 1}
                className="px-2 py-1 text-xs rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">«</button>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}
                className="px-2.5 py-1 text-xs rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(n => n === 1 || n === totalPages || Math.abs(n - safePage) <= 1)
                .reduce<(number | "...")[]>((acc, n, idx, arr) => {
                  if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push("...");
                  acc.push(n);
                  return acc;
                }, [])
                .map((n, idx) =>
                  n === "..." ? (
                    <span key={`e-${idx}`} className="px-1 text-xs text-slate-400">…</span>
                  ) : (
                    <button key={n} onClick={() => setPage(n as number)}
                      className={`px-2.5 py-1 text-xs rounded border transition-colors ${safePage === n ? "bg-[#CD3638] border-[#CD3638] text-white font-semibold" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                      {n}
                    </button>
                  )
                )}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
                className="px-2.5 py-1 text-xs rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">›</button>
              <button onClick={() => setPage(totalPages)} disabled={safePage === totalPages}
                className="px-2 py-1 text-xs rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">»</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
