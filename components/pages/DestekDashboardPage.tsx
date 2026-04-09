"use client";

import { useState, useMemo } from "react";
import { TicketIcon, ChevronUp, ChevronDown, ChevronsUpDown, Search, CalendarDays } from "lucide-react";

/* ─── Kulüp verisi (gerçek liste, mock ticket sayıları) ─────── */
interface ClubRow {
  id: number;
  name: string;
  city: string;
  type: "MACFit" | "MAC/One";
  open: number;
  closed: number;
  created: number;
  assigned: number;   // üstlenilmiş & closed değil
  unassigned: number; // üstlenilmemiş & closed değil
  avgOpenHours: number;
  slaCompliance: number;
}

// Baz veri = GÜNLÜK (created: 30-40/kulüp, open: günün bir kısmı kapanmadan kalır)
// assigned = üstlenilmiş & closed değil | unassigned = üstlenilmemiş & closed değil
const CLUBS: ClubRow[] = [
  { id: 22,  name: "Akbatı",                   city: "İstanbul", type: "MACFit",  open: 18, closed: 22, created: 40,  assigned: 11, unassigned: 7,  avgOpenHours: 52, slaCompliance: 72 },
  { id: 6,   name: "Mall of Istanbul",          city: "İstanbul", type: "MACFit",  open: 16, closed: 21, created: 37,  assigned: 10, unassigned: 6,  avgOpenHours: 48, slaCompliance: 75 },
  { id: 11,  name: "Axis Kağıthane",            city: "İstanbul", type: "MACFit",  open: 15, closed: 20, created: 35,  assigned: 8,  unassigned: 7,  avgOpenHours: 61, slaCompliance: 68 },
  { id: 2,   name: "Ankamall",                  city: "Ankara",   type: "MACFit",  open: 14, closed: 20, created: 34,  assigned: 9,  unassigned: 5,  avgOpenHours: 44, slaCompliance: 79 },
  { id: 21,  name: "Armada",                    city: "Ankara",   type: "MACFit",  open: 13, closed: 21, created: 34,  assigned: 9,  unassigned: 4,  avgOpenHours: 39, slaCompliance: 82 },
  { id: 34,  name: "Maltepe Pasco Plaza",       city: "İstanbul", type: "MACFit",  open: 12, closed: 20, created: 32,  assigned: 7,  unassigned: 5,  avgOpenHours: 55, slaCompliance: 71 },
  { id: 3,   name: "Buyaka",                    city: "İstanbul", type: "MACFit",  open: 11, closed: 22, created: 33,  assigned: 8,  unassigned: 3,  avgOpenHours: 33, slaCompliance: 88 },
  { id: 14,  name: "Fulya",                     city: "İstanbul", type: "MACFit",  open: 11, closed: 20, created: 31,  assigned: 7,  unassigned: 4,  avgOpenHours: 42, slaCompliance: 80 },
  { id: 23,  name: "Kanyon",                    city: "İstanbul", type: "MAC/One", open: 10, closed: 23, created: 33,  assigned: 8,  unassigned: 2,  avgOpenHours: 29, slaCompliance: 91 },
  { id: 9,   name: "Forum Kidsmall",            city: "İzmir",    type: "MACFit",  open: 10, closed: 20, created: 30,  assigned: 5,  unassigned: 5,  avgOpenHours: 67, slaCompliance: 66 },
  { id: 32,  name: "Kocaeli Gebze Center",      city: "Kocaeli",  type: "MACFit",  open: 9,  closed: 21, created: 30,  assigned: 6,  unassigned: 3,  avgOpenHours: 38, slaCompliance: 83 },
  { id: 13,  name: "Metrogarden",               city: "İstanbul", type: "MACFit",  open: 9,  closed: 21, created: 30,  assigned: 6,  unassigned: 3,  avgOpenHours: 45, slaCompliance: 77 },
  { id: 1,   name: "Anadolu Hisarı",            city: "İstanbul", type: "MACFit",  open: 8,  closed: 22, created: 30,  assigned: 6,  unassigned: 2,  avgOpenHours: 31, slaCompliance: 89 },
  { id: 33,  name: "Antalya Lara Carrefour",    city: "Antalya",  type: "MACFit",  open: 8,  closed: 22, created: 30,  assigned: 4,  unassigned: 4,  avgOpenHours: 58, slaCompliance: 70 },
  { id: 29,  name: "Cadde",                     city: "İstanbul", type: "MACFit",  open: 7,  closed: 23, created: 30,  assigned: 5,  unassigned: 2,  avgOpenHours: 36, slaCompliance: 84 },
  { id: 25,  name: "Panora",                    city: "Ankara",   type: "MAC/One", open: 7,  closed: 24, created: 31,  assigned: 6,  unassigned: 1,  avgOpenHours: 27, slaCompliance: 93 },
  { id: 15,  name: "Bursa Podyumpark",          city: "Bursa",    type: "MACFit",  open: 7,  closed: 23, created: 30,  assigned: 5,  unassigned: 2,  avgOpenHours: 41, slaCompliance: 81 },
  { id: 31,  name: "Kartal",                    city: "İstanbul", type: "MACFit",  open: 6,  closed: 24, created: 30,  assigned: 5,  unassigned: 1,  avgOpenHours: 22, slaCompliance: 94 },
  { id: 8,   name: "Vialand",                   city: "İstanbul", type: "MACFit",  open: 6,  closed: 24, created: 30,  assigned: 4,  unassigned: 2,  avgOpenHours: 49, slaCompliance: 76 },
  { id: 12,  name: "Adana Optimum",             city: "Adana",    type: "MACFit",  open: 6,  closed: 24, created: 30,  assigned: 3,  unassigned: 3,  avgOpenHours: 53, slaCompliance: 73 },
  { id: 35,  name: "Podium",                    city: "Ankara",   type: "MACFit",  open: 5,  closed: 25, created: 30,  assigned: 4,  unassigned: 1,  avgOpenHours: 19, slaCompliance: 95 },
  { id: 28,  name: "Ortaköy Lotus",             city: "İstanbul", type: "MAC/One", open: 5,  closed: 26, created: 31,  assigned: 4,  unassigned: 1,  avgOpenHours: 24, slaCompliance: 92 },
  { id: 20,  name: "Ömür Plaza",                city: "İstanbul", type: "MACFit",  open: 5,  closed: 25, created: 30,  assigned: 3,  unassigned: 2,  avgOpenHours: 44, slaCompliance: 78 },
  { id: 5,   name: "Ormanada",                  city: "İstanbul", type: "MAC/One", open: 4,  closed: 26, created: 30,  assigned: 3,  unassigned: 1,  avgOpenHours: 18, slaCompliance: 97 },
  { id: 17,  name: "A Plus",                    city: "İstanbul", type: "MAC/One", open: 3,  closed: 27, created: 30,  assigned: 2,  unassigned: 1,  avgOpenHours: 15, slaCompliance: 98 },
];

type SortKey  = "open" | "closed" | "created" | "assigned" | "unassigned" | "avgOpenHours" | "slaCompliance";
type SortDir  = "asc" | "desc";
type Period   = "bugun" | "haftalik" | "aylik" | "ozel";

const PERIOD_LABELS: Record<Period, string> = {
  bugun:    "Bugün",
  haftalik: "Bu Hafta",
  aylik:    "Bu Ay",
  ozel:     "Özel Aralık",
};

// Aylık baz veriyi periyoda göre ölçekle
function scaleByPeriod(val: number, factor: number) {
  return Math.max(1, Math.round(val * factor));
}

function periodFactor(period: Period, customStart: string, customEnd: string): number {
  if (period === "bugun")    return 1;   // baz veri zaten günlük
  if (period === "haftalik") return 7;
  if (period === "aylik")    return 30;
  // özel: seçilen gün sayısı
  if (customStart && customEnd) {
    const ms   = new Date(customEnd).getTime() - new Date(customStart).getTime();
    const days = Math.max(1, Math.round(ms / 86400000) + 1);
    return days;
  }
  return 1;
}

function periodSubLabel(period: Period, customStart: string, customEnd: string): string {
  if (period === "bugun") {
    return new Date().toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
  }
  if (period === "haftalik") return "son 7 gün";
  if (period === "aylik")    return "son 30 gün";
  if (customStart && customEnd) return `${customStart} – ${customEnd}`;
  return "";
}

function fmtHours(h: number) {
  if (h < 24) return `${h} saat`;
  const d = Math.floor(h / 24);
  const rem = h % 24;
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

export default function DestekDashboardPage() {
  const [sortKey, setSortKey]   = useState<SortKey>("open");
  const [sortDir, setSortDir]   = useState<SortDir>("desc");
  const [period, setPeriod]         = useState<Period>("bugun");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd]     = useState("");
  const [clubSearch, setClubSearch] = useState("");

  const factor = useMemo(
    () => periodFactor(period, customStart, customEnd),
    [period, customStart, customEnd]
  );

  // Ölçeklenmiş kulüp verisi
  const scaledClubs = useMemo(() =>
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


  const sorted = [...scaledClubs]
    .filter(c => !clubSearch || c.name.toLowerCase().includes(clubSearch.toLowerCase()))
    .sort((a, b) => {
      const diff = a[sortKey] - b[sortKey];
      return sortDir === "desc" ? -diff : diff;
    });

  const maxOpen = Math.max(...sorted.map(c => c.open), 1);

  const totalOpen    = scaledClubs.reduce((s, c) => s + c.open, 0);
  const totalClosed  = scaledClubs.reduce((s, c) => s + c.closed, 0);
  const totalCreated = scaledClubs.reduce((s, c) => s + c.created, 0);
  const avgOpen      = Math.round(CLUBS.reduce((s, c) => s + c.avgOpenHours, 0) / CLUBS.length);
  const avgSla       = Math.round(CLUBS.reduce((s, c) => s + c.slaCompliance, 0) / CLUBS.length);
  const breachCount  = CLUBS.filter(c => c.slaCompliance < 75).length;
  const worstClub    = [...scaledClubs].sort((a, b) => b.open - a.open)[0];
  const subLabel     = periodSubLabel(period, customStart, customEnd);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ChevronsUpDown className="w-3 h-3 text-slate-300" />;
    return sortDir === "desc"
      ? <ChevronDown className="w-3 h-3 text-indigo-500" />
      : <ChevronUp   className="w-3 h-3 text-indigo-500" />;
  };

  return (
    <div className="flex flex-col gap-5 p-6 h-full w-full overflow-y-auto bg-[#f5f8fa]">

      {/* ── Periyod seçici ───────────────────────────────────── */}
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
        {subLabel && (
          <span className="text-xs text-slate-400 ml-1">{subLabel}</span>
        )}
      </div>

      {/* ── Özet kartlar ─────────────────────────────────────── */}
      <div className="grid grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-4 col-span-1">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Toplam Açık</p>
          <p className="text-2xl font-bold text-red-500">{totalOpen}</p>
          <p className="text-[10px] text-slate-400 mt-1">{PERIOD_LABELS[period].toLowerCase()}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-4 col-span-1">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Toplam Kapalı</p>
          <p className="text-2xl font-bold text-emerald-600">{totalClosed}</p>
          <p className="text-[10px] text-slate-400 mt-1">{PERIOD_LABELS[period].toLowerCase()}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-4 col-span-1">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Toplam Oluşturulan</p>
          <p className="text-2xl font-bold text-slate-700">{totalCreated}</p>
          <p className="text-[10px] text-slate-400 mt-1">{PERIOD_LABELS[period].toLowerCase()}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-4 col-span-1">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Ort. Açık Kalma</p>
          <p className="text-2xl font-bold text-amber-600">{fmtHours(avgOpen)}</p>
          <p className="text-[10px] text-slate-400 mt-1">kulüp ortalaması</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-4 col-span-1">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Ort. SLA Uyumu</p>
          <p className={`text-2xl font-bold ${avgSla >= 85 ? "text-emerald-600" : "text-amber-600"}`}>%{avgSla}</p>
          <p className="text-[10px] text-slate-400 mt-1">{breachCount} kulüp ihlalde</p>
        </div>
        <div className="bg-white border border-red-100 rounded-xl px-4 py-4 col-span-1">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">En Yoğun Kulüp</p>
          <p className="text-sm font-bold text-slate-700 leading-tight">{worstClub.name}</p>
          <p className="text-[10px] text-red-500 mt-1">{worstClub.open} açık ticket</p>
        </div>
      </div>

      {/* ── Arama ────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="relative ml-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            value={clubSearch}
            onChange={e => setClubSearch(e.target.value)}
            placeholder="Kulüp ara..."
            className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 w-44"
          />
        </div>
        <span className="text-xs text-slate-400 shrink-0">{sorted.length} kulüp gösteriliyor</span>
      </div>

      {/* ── Tablo ────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex-1">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
          <TicketIcon className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-bold text-slate-700">Kulüp Bazlı Ticket Özeti</span>
          <span className="text-xs text-slate-400 ml-1">— en çok açık ticketten en aza sıralı</span>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-semibold w-8">#</th>
                <th className="text-left px-4 py-3 font-semibold">Kulüp</th>
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
              {sorted.map((club, i) => (
                <tr key={club.id} className={`border-b border-slate-50 hover:bg-indigo-50/30 transition-colors ${i % 2 === 1 ? "bg-slate-50/30" : ""}`}>
                  <td className="px-4 py-3 text-slate-400 font-mono text-[10px]">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700">{club.name}</td>
                  <td className="px-4 py-3">
                    <OpenBar value={club.open} max={maxOpen} />
                  </td>
                  <td className="px-4 py-3 text-emerald-600 font-semibold">{club.closed}</td>
                  <td className="px-4 py-3 text-slate-600">{club.created}</td>
                  <td className="px-4 py-3 font-semibold text-amber-600">{club.assigned}</td>
                  <td className="px-4 py-3 font-semibold text-red-500">{club.unassigned}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${club.avgOpenHours > 48 ? "text-red-500" : club.avgOpenHours > 24 ? "text-amber-600" : "text-emerald-600"}`}>
                      {fmtHours(club.avgOpenHours)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <SlaBar value={club.slaCompliance} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
