"use client";

import { useRef, useState } from "react";
import {
  Phone, Search, ChevronDown, Plus, MoreHorizontal, Columns2,
  Filter, ArrowUpDown, Download, Save, X, FileText,
  Mail, CheckSquare, CalendarDays, Flame, Settings2, PanelLeftClose, Maximize2,
} from "lucide-react";

/* ─── Column definitions ─────────────────────────────────────────── */
const COLUMNS = [
  { id: "id",              label: "ID",                  fixed: true  },
  { id: "ad",              label: "Ad",                  fixed: true  },
  { id: "soyad",           label: "Soyad",               fixed: true  },
  { id: "telefon",         label: "Telefon",             fixed: true  },
  { id: "eposta",          label: "E-Posta",             fixed: false },
  { id: "kulupad",         label: "Kulüp Adı",           fixed: false },
  { id: "satisTemsilcisi", label: "Satış Temsilcisi",    fixed: false },
  { id: "olusturmaTarihi", label: "Oluşturma Tarihi",    fixed: false },
  { id: "kaynak",          label: "Kaynak",              fixed: false },
  { id: "kaynakDetay",     label: "Kaynak Detay",        fixed: false },
  { id: "statu",           label: "Statü",               fixed: false },
  { id: "gorevTarihi",     label: "Görev Tarihi",        fixed: false },
  { id: "ayrUyelikTipi",   label: "Ayr. Üyelik Tipi",   fixed: false },
  { id: "ayrUyelikSuresi", label: "Ayr. Üyelik Süresi", fixed: false },
  { id: "isBankasiKKTipi", label: "İş Bankası KK Tipi", fixed: false },
  { id: "iletisimIzni",    label: "İletişim İzni",       fixed: false },
  { id: "smsOnay",         label: "SMS Onay",            fixed: false },
] as const;

type ColId = typeof COLUMNS[number]["id"];

const DEFAULT_VISIBLE = new Set<ColId>([
  "id", "ad", "soyad", "telefon",
  "eposta", "satisTemsilcisi", "olusturmaTarihi",
  "kaynak", "kaynakDetay", "statu", "gorevTarihi",
  "iletisimIzni", "smsOnay",
]);

/* ─── Mock data ──────────────────────────────────────────────────── */
interface Lead {
  id: number; initials: string; color: string;
  ad: string; soyad: string; telefon: string; eposta: string;
  kulupad: string; satisTemsilcisi: string; olusturmaTarihi: string;
  kaynak: string; kaynakDetay: string; statu: string; gorevTarihi: string;
  ayrUyelikTipi: string; ayrUyelikSuresi: string; isBankasiKKTipi: string;
  iletisimIzni: string; smsOnay: string;
}

const leads: Lead[] = [
  { id: 1, initials: "AK", color: "bg-red-800",
    ad: "Ahmet", soyad: "Kaya", telefon: "0532 111 22 33", eposta: "ahmet.kaya@gmail.com",
    kulupad: "Mars Athletic", satisTemsilcisi: "Yavuz K.", olusturmaTarihi: "27.03.2026",
    kaynak: "Instagram", kaynakDetay: "Reels Kampanyası", statu: "Yeni Lead",
    gorevTarihi: "28.03.2026", ayrUyelikTipi: "Bireysel", ayrUyelikSuresi: "12 Ay",
    isBankasiKKTipi: "Axess", iletisimIzni: "Evet", smsOnay: "Evet" },
  { id: 2, initials: "FD", color: "bg-blue-700",
    ad: "Fatma", soyad: "Demir", telefon: "0544 222 33 44", eposta: "fatma.demir@hotmail.com",
    kulupad: "Mars Athletic", satisTemsilcisi: "Yavuz K.", olusturmaTarihi: "27.03.2026",
    kaynak: "Web Sitesi", kaynakDetay: "Üyelik Formu", statu: "Arandı",
    gorevTarihi: "29.03.2026", ayrUyelikTipi: "Aile", ayrUyelikSuresi: "6 Ay",
    isBankasiKKTipi: "—", iletisimIzni: "Evet", smsOnay: "Hayır" },
  { id: 3, initials: "MC", color: "bg-emerald-700",
    ad: "Murat", soyad: "Çelik", telefon: "0555 333 44 55", eposta: "murat.celik@yandex.com",
    kulupad: "Mars Athletic", satisTemsilcisi: "Yiğit S.", olusturmaTarihi: "26.03.2026",
    kaynak: "Referans", kaynakDetay: "Üye Referansı", statu: "Takip",
    gorevTarihi: "31.03.2026", ayrUyelikTipi: "Bireysel", ayrUyelikSuresi: "—",
    isBankasiKKTipi: "Bonus", iletisimIzni: "Hayır", smsOnay: "Hayır" },
  { id: 4, initials: "ZY", color: "bg-purple-700",
    ad: "Zeynep", soyad: "Yılmaz", telefon: "0506 444 55 66", eposta: "zeynep.y@gmail.com",
    kulupad: "Mars Athletic", satisTemsilcisi: "Yiğit S.", olusturmaTarihi: "25.03.2026",
    kaynak: "TikTok", kaynakDetay: "Story Linki", statu: "Sıcak Lead",
    gorevTarihi: "28.03.2026", ayrUyelikTipi: "—", ayrUyelikSuresi: "—",
    isBankasiKKTipi: "—", iletisimIzni: "Evet", smsOnay: "Evet" },
  { id: 5, initials: "EO", color: "bg-orange-700",
    ad: "Emre", soyad: "Özkan", telefon: "0533 555 66 77", eposta: "emre.ozkan@icloud.com",
    kulupad: "Mars Athletic", satisTemsilcisi: "Yavuz K.", olusturmaTarihi: "24.03.2026",
    kaynak: "Google", kaynakDetay: "Arama Reklamı", statu: "Ulaşılamadı",
    gorevTarihi: "01.04.2026", ayrUyelikTipi: "Bireysel", ayrUyelikSuresi: "3 Ay",
    isBankasiKKTipi: "Miles&Smiles", iletisimIzni: "Evet", smsOnay: "Evet" },
];

const STATU_COLORS: Record<string, string> = {
  "Yeni Lead":   "bg-blue-100 text-blue-700",
  "Sıcak Lead":  "bg-red-100 text-red-700",
  "Arandı":      "bg-yellow-100 text-yellow-700",
  "Takip":       "bg-purple-100 text-purple-700",
  "Ulaşılamadı": "bg-slate-100 text-slate-500",
};

function getCellValue(lead: Lead, colId: ColId): string {
  return String((lead as unknown as Record<string, unknown>)[colId] ?? "—");
}

const ACTION_BUTTONS = [
  { icon: FileText,    label: "Not"     },
  { icon: Mail,        label: "E-Posta" },
  { icon: Phone,       label: "Ara"     },
  { icon: CheckSquare, label: "Görev"   },
  { icon: CalendarDays,label: "Randevu" },
  { icon: MoreHorizontal, label: "Daha" },
];

/* ─── Resize constants ───────────────────────────────────────────── */
const DEFAULT_PANEL_WIDTH = 320;
const MIN_PANEL_WIDTH     = 260;
const SNAP_RATIO          = 0.50; // snap to full when panel >= 50% of container

/* ─── Component ──────────────────────────────────────────────────── */
export default function AdayUyePage() {
  const [activeTab, setActiveTab]         = useState("all");
  const [selectedLead, setSelectedLead]   = useState<Lead | null>(null);
  const [visibleCols, setVisibleCols]     = useState<Set<ColId>>(new Set(DEFAULT_VISIBLE));
  const [showColPicker, setShowColPicker] = useState(false);

  // Panel resize state
  const [panelWidth, setPanelWidth]         = useState(DEFAULT_PANEL_WIDTH);
  const [isExpanded, setIsExpanded]         = useState(false);
  const [isResizing, setIsResizing]         = useState(false);
  const [snapTransition, setSnapTransition] = useState(false);
  const containerRef    = useRef<HTMLDivElement>(null);
  const panelRef        = useRef<HTMLDivElement>(null);
  const resizeDragging  = useRef(false);
  const resizeStartX    = useRef(0);
  const resizeStartWidth = useRef(DEFAULT_PANEL_WIDTH);

  const toggleCol = (id: ColId) => {
    setVisibleCols(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const tableCols = COLUMNS.filter(c => visibleCols.has(c.id));

  /* ── Resize handlers ── */
  const handleResizeStart = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    resizeDragging.current  = true;
    setIsResizing(true);
    resizeStartX.current    = e.clientX;
    resizeStartWidth.current = isExpanded
      ? (containerRef.current?.offsetWidth ?? 800)
      : panelWidth;
  };

  const handleResizeMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!resizeDragging.current) return;
    const dx       = resizeStartX.current - e.clientX; // drag left → positive
    const newWidth = Math.max(MIN_PANEL_WIDTH, resizeStartWidth.current + dx);
    const cw       = containerRef.current?.offsetWidth ?? 800;

    if (newWidth >= cw * SNAP_RATIO) {
      if (!isExpanded) {
        setIsExpanded(true);
        setSnapTransition(true);
        setTimeout(() => setSnapTransition(false), 250);
      }
    } else {
      if (isExpanded) setIsExpanded(false);
      setPanelWidth(newWidth);
    }
  };

  const handleResizeEnd = () => {
    resizeDragging.current = false;
    setIsResizing(false);
  };

  const collapsePanel = () => {
    setSnapTransition(true);
    setIsExpanded(false);
    setPanelWidth(DEFAULT_PANEL_WIDTH);
    setTimeout(() => setSnapTransition(false), 250);
  };

  /* ── Panel size category ── */
  const isMedium = !isExpanded && panelWidth >= 420;
  const isLarge  = isExpanded;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f5f8fa] rounded-tl-2xl">

      {/* Banner */}
      <div className="mx-5 mt-4 bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm border border-slate-100 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#171a1d] rounded-xl shadow-sm flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Operasyon Zamanı!</h2>
            <div className="flex items-center gap-4 text-xs text-slate-600 mt-1">
              <span>🎯 <span className="font-medium">Bugün Gelen:</span> <span className="font-bold text-slate-900">124</span></span>
              <span>🔥 <span className="font-medium">Hot Lead:</span> <span className="font-bold text-[#df1d2f]">37</span></span>
              <span>📞 <span className="font-medium">Bekleyen:</span> <span className="font-bold text-slate-900">52</span></span>
              <span>💰 <span className="font-medium">Satış:</span> <span className="font-bold text-emerald-600">9</span></span>
            </div>
            <p className="text-xs text-slate-400 mt-1 italic">Not: Aranmayan lead&#39;ler performans skorunu düşürür.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-[#df1d2f] hover:bg-[#b91827] text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-colors shrink-0">
          <Flame className="w-4 h-4" />
          Şimdi Aramaya Başla
        </button>
      </div>

      {/* Main area */}
      <div ref={containerRef} className="flex flex-1 gap-3 mx-5 mt-3 mb-5 overflow-hidden relative">

        {/* Table panel — hidden when right panel is fully expanded */}
        <div className={`bg-white rounded-xl flex flex-col overflow-hidden shadow-sm border border-slate-200 flex-1 min-w-0 ${isExpanded && !snapTransition ? "hidden" : ""}`}>

          {/* Toolbar Row 1 */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-slate-200 shrink-0">
            <div className="flex items-center gap-1">
              <button className="flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 hover:bg-slate-100 transition-colors">
                <span className="text-slate-500">👤</span> Lead&apos;ler <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>
              <div className="flex items-center ml-2">
                {[
                  { id: "all", label: "Tüm Lead'ler", count: leads.length },
                  { id: "my",  label: "Lead'lerim" },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors ${
                      activeTab === tab.id
                        ? "bg-slate-100 border-b-2 border-[#df1d2f] text-slate-800 font-medium rounded-b-none"
                        : "text-slate-500 hover:bg-slate-50"}`}>
                    {tab.label}
                    {"count" in tab && <span className="text-[10px] bg-slate-200 text-slate-600 rounded-full px-1.5 py-0.5">{tab.count}</span>}
                  </button>
                ))}
                <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 ml-1">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100"><MoreHorizontal className="w-4 h-4" /></button>
              <button className="flex items-center gap-1.5 bg-[#df1d2f] hover:bg-[#b91827] text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">
                Lead Ekle <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Toolbar Row 2 */}
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-200 shrink-0 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input type="text" placeholder="Ara..." className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded w-44 focus:outline-none focus:ring-1 focus:ring-[#df1d2f]/30" />
            </div>
            <button className="flex items-center gap-1 border border-slate-300 rounded px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-50">
              <Columns2 className="w-3.5 h-3.5" /> Table view <ChevronDown className="w-3 h-3" />
            </button>
            <button className="flex items-center gap-1 border border-slate-300 rounded px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-50">
              <Settings2 className="w-3.5 h-3.5" />
            </button>

            {/* Column picker */}
            <div className="relative">
              <button onClick={() => setShowColPicker(v => !v)}
                className={`flex items-center gap-1 border rounded px-2 py-1.5 text-xs transition-colors ${showColPicker ? "border-[#df1d2f] text-[#df1d2f] bg-red-50" : "border-slate-300 text-slate-600 hover:bg-slate-50"}`}>
                <Columns2 className="w-3.5 h-3.5" /> Sütunları Düzenle
              </button>
              {showColPicker && (
                <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 w-56">
                  <p className="px-4 pt-1 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sütunlar</p>
                  {COLUMNS.map(col => (
                    <label key={col.id} className={`flex items-center gap-3 px-4 py-2 text-xs cursor-pointer hover:bg-slate-50 ${col.fixed ? "opacity-50" : ""}`}>
                      <input type="checkbox" checked={visibleCols.has(col.id)} disabled={col.fixed}
                        onChange={() => !col.fixed && toggleCol(col.id)} className="accent-[#df1d2f]" />
                      <span className="text-slate-700">{col.label}</span>
                      {col.fixed && <span className="ml-auto text-[10px] text-slate-400">sabit</span>}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <button className="flex items-center gap-1 border border-slate-300 rounded px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-50">
              <Filter className="w-3.5 h-3.5" /> Filtrele
            </button>
            <button className="flex items-center gap-1 border border-slate-300 rounded px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-50">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sırala
            </button>
            <button className="flex items-center gap-1 border border-slate-300 rounded px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-50">
              <Download className="w-3.5 h-3.5" /> Dışa Aktar
            </button>
            <button className="flex items-center gap-1 px-2 py-1.5 text-xs text-slate-400 rounded hover:bg-slate-50">
              <Save className="w-3.5 h-3.5" /> Kaydet
            </button>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto" onClick={() => setShowColPicker(false)}>
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="w-10 p-3 text-left border-r border-slate-200">
                    <input type="checkbox" className="rounded border-slate-300" />
                  </th>
                  {tableCols.map(col => (
                    <th key={col.id} className="p-3 text-left font-medium text-slate-600 border-r border-slate-200 whitespace-nowrap">
                      <div className="flex items-center gap-1">{col.label}<ArrowUpDown className="w-3 h-3 opacity-40" /></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead.id}
                    onClick={() => setSelectedLead(prev => prev?.id === lead.id ? null : lead)}
                    className={`border-b border-slate-100 cursor-pointer transition-colors ${selectedLead?.id === lead.id ? "bg-blue-50/50" : "hover:bg-slate-50"}`}>
                    <td className="p-3 border-r border-slate-100">
                      <input type="checkbox" className="rounded border-slate-300" onClick={e => e.stopPropagation()} />
                    </td>
                    {tableCols.map(col => (
                      <td key={col.id} className="p-3 border-r border-slate-100 whitespace-nowrap">
                        {col.id === "ad" ? (
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 ${lead.color} rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{lead.initials}</div>
                            <span className="text-blue-600 font-medium">{lead.ad}</span>
                          </div>
                        ) : col.id === "statu" ? (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATU_COLORS[lead.statu] ?? "bg-slate-100 text-slate-500"}`}>{lead.statu}</span>
                        ) : col.id === "eposta" ? (
                          <span className="text-blue-600">{getCellValue(lead, col.id)}</span>
                        ) : (
                          <span className="text-slate-600">{getCellValue(lead, col.id)}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="h-12 flex items-center justify-center gap-4 border-t border-slate-200 shrink-0">
            <button className="text-xs text-slate-500 hover:text-slate-700">‹ Önceki</button>
            <button className="w-6 h-6 flex items-center justify-center text-xs bg-slate-100 rounded font-medium">1</button>
            <button className="text-xs text-slate-500 hover:text-slate-700">Sonraki ›</button>
            <select className="ml-4 border border-slate-300 rounded px-1 py-0.5 text-xs outline-none">
              <option>25 / sayfa</option>
              <option>50 / sayfa</option>
            </select>
          </div>
        </div>

        {/* ── Right panel ── */}
        {selectedLead && (
          <div
            ref={panelRef}
            style={{
              width: isExpanded ? "100%" : panelWidth,
              // Absolute positioning while snapping or expanded keeps right edge fixed
              // so the panel grows leftward (right→left) instead of leftward-from-left
              ...(isExpanded || snapTransition
                ? { position: "absolute", right: 0, top: 0, bottom: 0 }
                : {}),
              transition: snapTransition ? "width 220ms cubic-bezier(0.4, 0, 0.2, 1)" : "none",
              userSelect: isResizing ? "none" : undefined,
            }}
            className="bg-white rounded-xl flex flex-col overflow-hidden shadow-sm border border-slate-200 shrink-0 relative"
          >
            {/* Resize handle — drag leftward to expand */}
            <div
              onPointerDown={handleResizeStart}
              onPointerMove={handleResizeMove}
              onPointerUp={handleResizeEnd}
              onPointerCancel={handleResizeEnd}
              className="absolute left-0 top-0 w-1.5 h-full z-20 cursor-col-resize"
            />

            {/* Header */}
            <div className={`flex items-center justify-between border-b border-slate-200 shrink-0 ${isLarge ? "px-6 py-4" : "px-4 py-3"}`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className={`${isLarge ? "w-12 h-12 text-sm" : "w-8 h-8 text-xs"} ${selectedLead.color} rounded-lg flex items-center justify-center text-white font-bold shrink-0`}>
                  {selectedLead.initials}
                </div>
                <div className="min-w-0">
                  <p className={`font-bold text-slate-900 truncate ${isLarge ? "text-base" : "text-sm"}`}>
                    {selectedLead.ad} {selectedLead.soyad}
                  </p>
                  {isLarge && (
                    <p className="text-xs text-slate-400 mt-0.5">{selectedLead.telefon} · {selectedLead.eposta}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {isExpanded ? (
                  <button onClick={collapsePanel} title="Küçült"
                    className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors">
                    <PanelLeftClose className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={() => { setSnapTransition(true); setIsExpanded(true); setTimeout(() => setSnapTransition(false), 250); }} title="Genişlet"
                    className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => { setSelectedLead(null); setIsExpanded(false); setPanelWidth(DEFAULT_PANEL_WIDTH); }}
                  className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions row */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 shrink-0">
              <button className="text-xs text-blue-600 hover:underline font-medium">Kaydı Görüntüle</button>
              <button className="text-xs text-slate-600 flex items-center gap-1 hover:text-slate-900 font-medium">
                İşlemler <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Action buttons — row grows with panel */}
            <div className={`border-b border-slate-200 shrink-0 ${isLarge ? "px-6 py-4" : "px-4 py-3"}`}>
              <div className={`flex items-start ${isLarge ? "gap-6 justify-start" : "justify-between gap-1"}`}>
                {ACTION_BUTTONS.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <button className={`rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors ${isLarge ? "w-11 h-11" : "w-8 h-8"}`}>
                      <Icon className={`text-slate-600 ${isLarge ? "w-5 h-5" : "w-3.5 h-3.5"}`} />
                    </button>
                    <span className={`text-slate-500 ${isLarge ? "text-xs" : "text-[9px]"}`}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fields — layout adapts to panel size */}
            <div className="flex-1 overflow-auto px-4 py-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Lead Bilgileri</p>

              {isLarge ? (
                /* Expanded: 3-column grid */
                <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                  {tableCols.map(col => (
                    <div key={col.id} className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-400 font-medium">{col.label}</span>
                      {col.id === "statu" ? (
                        <span className={`inline-flex w-fit px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATU_COLORS[selectedLead.statu] ?? "bg-slate-100 text-slate-500"}`}>{selectedLead.statu}</span>
                      ) : col.id === "eposta" ? (
                        <span className="text-sm text-blue-600 truncate">{getCellValue(selectedLead, col.id)}</span>
                      ) : (
                        <span className="text-sm text-slate-700">{getCellValue(selectedLead, col.id)}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : isMedium ? (
                /* Medium: label left / value right */
                <div className="space-y-2">
                  {tableCols.map(col => (
                    <div key={col.id} className="flex items-start justify-between gap-3 py-1 border-b border-slate-50">
                      <span className="text-[10px] text-slate-400 font-medium shrink-0 w-32">{col.label}</span>
                      {col.id === "statu" ? (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATU_COLORS[selectedLead.statu] ?? "bg-slate-100 text-slate-500"}`}>{selectedLead.statu}</span>
                      ) : col.id === "eposta" ? (
                        <span className="text-xs text-blue-600 truncate">{getCellValue(selectedLead, col.id)}</span>
                      ) : (
                        <span className="text-xs text-slate-700 text-right">{getCellValue(selectedLead, col.id)}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* Narrow: stacked */
                <div className="space-y-3">
                  {tableCols.map(col => (
                    <div key={col.id} className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-400 font-medium">{col.label}</span>
                      {col.id === "statu" ? (
                        <span className={`inline-flex w-fit px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATU_COLORS[selectedLead.statu] ?? "bg-slate-100 text-slate-500"}`}>{selectedLead.statu}</span>
                      ) : col.id === "eposta" ? (
                        <span className="text-xs text-blue-600">{getCellValue(selectedLead, col.id)}</span>
                      ) : (
                        <span className="text-xs text-slate-700">{getCellValue(selectedLead, col.id)}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
