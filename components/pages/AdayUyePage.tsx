"use client";

import { useEffect, useRef, useState } from "react";
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
  const [showAddForm, setShowAddForm]     = useState(false);
  const [visibleCols, setVisibleCols]     = useState<Set<ColId>>(new Set(DEFAULT_VISIBLE));
  const [showColPicker, setShowColPicker] = useState(false);

  // Add form state
  const [formData, setFormData] = useState({
    ad: "", soyad: "", ulkeKodu: "90", telefon: "",
    eposta: "", cinsiyet: "", dogumTarihi: "", ulke: "Turkey", kaynak: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // OTP modal state
  const [showOtpModal, setShowOtpModal]   = useState(false);
  const [otpValues, setOtpValues]         = useState(["", "", "", ""]);
  const [otpCountdown, setOtpCountdown]   = useState(180);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const openAddForm = () => {
    setSelectedLead(null);
    setFormData({ ad: "", soyad: "", ulkeKodu: "90", telefon: "", eposta: "", cinsiyet: "", dogumTarihi: "", ulke: "Turkey", kaynak: "" });
    setFormErrors({});
    setShowAddForm(true);
  };

  const closeAddForm = () => {
    setShowAddForm(false);
    setIsExpanded(false);
    setPanelWidth(DEFAULT_PANEL_WIDTH);
  };

  const handleFormSubmit = () => {
    const errors: Record<string, string> = {};
    if (!formData.ad.trim())      errors.ad      = "Ad zorunludur";
    if (!formData.soyad.trim())   errors.soyad   = "Soyad zorunludur";
    if (!formData.telefon.trim()) errors.telefon = "Telefon zorunludur";
    if (!formData.kaynak)         errors.kaynak  = "Kaynak bilgisi zorunludur";
    if (Object.keys(errors).length) { setFormErrors(errors); return; }

    // Show OTP verification modal
    setOtpValues(["", "", "", ""]);
    setOtpCountdown(180);
    setShowOtpModal(true);
  };

  const handleOtpConfirm = () => {
    // Add to leads list (mock — replace with API call + OTP verification later)
    const initials = (formData.ad[0] ?? "") + (formData.soyad[0] ?? "");
    const colors = ["bg-red-700", "bg-blue-700", "bg-emerald-700", "bg-purple-700", "bg-orange-700"];
    const newLead: Lead = {
      id: leads.length + 1,
      initials: initials.toUpperCase(),
      color: colors[leads.length % colors.length],
      ad: formData.ad, soyad: formData.soyad,
      telefon: `+${formData.ulkeKodu} ${formData.telefon}`,
      eposta: formData.eposta || "—",
      kulupad: "Mars Athletic", satisTemsilcisi: "—",
      olusturmaTarihi: new Date().toLocaleDateString("tr-TR"),
      kaynak: formData.kaynak, kaynakDetay: "—",
      statu: "Yeni Lead", gorevTarihi: "—",
      ayrUyelikTipi: "—", ayrUyelikSuresi: "—",
      isBankasiKKTipi: "—",
      iletisimIzni: "—", smsOnay: "—",
    };
    leads.push(newLead);
    setShowOtpModal(false);
    setShowAddForm(false);
    setSelectedLead(newLead);
  };

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

  // OTP countdown timer
  useEffect(() => {
    if (!showOtpModal || otpCountdown <= 0) return;
    const t = setTimeout(() => setOtpCountdown(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [showOtpModal, otpCountdown]);

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
              <button onClick={openAddForm} className="flex items-center gap-1.5 bg-[#df1d2f] hover:bg-[#b91827] text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">
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
        {(selectedLead || showAddForm) && (
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

            {showAddForm ? (
              /* ── Add Lead Form ── */
              <>
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 shrink-0">
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <button onClick={collapsePanel} title="Küçült"
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors">
                        <PanelLeftClose className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button onClick={() => { setSnapTransition(true); setIsExpanded(true); setTimeout(() => setSnapTransition(false), 250); }} title="Genişlet"
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Aday Üye Ekle</h2>
                  </div>
                  <button onClick={closeAddForm} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-auto px-4 py-4 space-y-4">
                  {/* Ad / Soyad */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-600 mb-1 block">Ad <span className="text-[#df1d2f]">*</span></label>
                      <input value={formData.ad} onChange={e => setFormData(p => ({ ...p, ad: e.target.value }))}
                        placeholder="Ad"
                        className={`w-full border rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#df1d2f]/40 ${formErrors.ad ? "border-[#df1d2f]" : "border-slate-300"}`} />
                      {formErrors.ad && <p className="text-[10px] text-[#df1d2f] mt-0.5">{formErrors.ad}</p>}
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-600 mb-1 block">Soyad <span className="text-[#df1d2f]">*</span></label>
                      <input value={formData.soyad} onChange={e => setFormData(p => ({ ...p, soyad: e.target.value }))}
                        placeholder="Soyad"
                        className={`w-full border rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#df1d2f]/40 ${formErrors.soyad ? "border-[#df1d2f]" : "border-slate-300"}`} />
                      {formErrors.soyad && <p className="text-[10px] text-[#df1d2f] mt-0.5">{formErrors.soyad}</p>}
                    </div>
                  </div>

                  {/* Ülke Kodu / Telefon */}
                  <div className="grid grid-cols-[100px_1fr] gap-3">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-600 mb-1 block">Ülke Kodu <span className="text-[#df1d2f]">*</span></label>
                      <div className="flex items-center border border-slate-300 rounded-lg px-3 py-2 gap-1">
                        <input value={formData.ulkeKodu} onChange={e => setFormData(p => ({ ...p, ulkeKodu: e.target.value }))}
                          className="w-full text-xs outline-none" />
                        <button onClick={() => setFormData(p => ({ ...p, ulkeKodu: "" }))} className="text-slate-400 hover:text-slate-600"><X className="w-3 h-3" /></button>
                        <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-600 mb-1 block">Telefon <span className="text-[#df1d2f]">*</span></label>
                      <input value={formData.telefon} onChange={e => setFormData(p => ({ ...p, telefon: e.target.value }))}
                        placeholder="(5xx) xxx-xxxx"
                        className={`w-full border rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#df1d2f]/40 ${formErrors.telefon ? "border-[#df1d2f]" : "border-slate-300"}`} />
                      {formErrors.telefon && <p className="text-[10px] text-[#df1d2f] mt-0.5">{formErrors.telefon}</p>}
                    </div>
                  </div>

                  {/* E-posta */}
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600 mb-1 block">E-posta</label>
                    <input value={formData.eposta} onChange={e => setFormData(p => ({ ...p, eposta: e.target.value }))}
                      placeholder="E-posta"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#df1d2f]/40" />
                  </div>

                  {/* Cinsiyet */}
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600 mb-2 block">Cinsiyet</label>
                    <div className="flex items-center gap-4">
                      {["Kadın", "Erkek"].map(c => (
                        <label key={c} className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                          <input type="radio" name="cinsiyet" value={c}
                            checked={formData.cinsiyet === c}
                            onChange={() => setFormData(p => ({ ...p, cinsiyet: c }))}
                            className="accent-[#df1d2f]" />
                          {c}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Doğum Tarihi */}
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600 mb-1 block">Doğum Tarihi</label>
                    <input type="date" value={formData.dogumTarihi} onChange={e => setFormData(p => ({ ...p, dogumTarihi: e.target.value }))}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#df1d2f]/40" />
                  </div>

                  {/* Ülke */}
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600 mb-1 block">Ülke</label>
                    <input value={formData.ulke} onChange={e => setFormData(p => ({ ...p, ulke: e.target.value }))}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#df1d2f]/40" />
                  </div>

                  {/* Kaynak */}
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600 mb-1 block">Kaynak Bilgileri <span className="text-[#df1d2f]">*</span></label>
                    <select value={formData.kaynak} onChange={e => setFormData(p => ({ ...p, kaynak: e.target.value }))}
                      className={`w-full border rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#df1d2f]/40 bg-white ${formErrors.kaynak ? "border-[#df1d2f]" : "border-slate-300"}`}>
                      <option value="">Seç</option>
                      {["Instagram", "TikTok", "Google", "Web Sitesi", "Referans", "Diğer"].map(k => (
                        <option key={k} value={k}>{k}</option>
                      ))}
                    </select>
                    {formErrors.kaynak && <p className="text-[10px] text-[#df1d2f] mt-0.5">{formErrors.kaynak}</p>}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-slate-200 shrink-0">
                  <button onClick={closeAddForm} className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900 font-medium transition-colors">
                    Çık
                  </button>
                  <button onClick={handleFormSubmit} className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors">
                    Devam Et
                  </button>
                </div>
              </>
            ) : selectedLead ? (
              /* ── Lead Detail ── */
              <>
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
                  <button onClick={() => { setSelectedLead(null); setIsExpanded(false); setPanelWidth(DEFAULT_PANEL_WIDTH); }}
                    className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Actions row */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 shrink-0">
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <button onClick={collapsePanel} title="Küçült"
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors">
                        <PanelLeftClose className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button onClick={() => { setSnapTransition(true); setIsExpanded(true); setTimeout(() => setSnapTransition(false), 250); }} title="Genişlet"
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button className="text-xs text-blue-600 hover:underline font-medium">Kaydı Görüntüle</button>
                  </div>
                  <button className="text-xs text-slate-600 flex items-center gap-1 hover:text-slate-900 font-medium">
                    İşlemler <ChevronDown className="w-3 h-3" />
                  </button>
                </div>

                {/* Action buttons */}
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

                {/* Fields */}
                <div className="flex-1 overflow-auto px-4 py-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Lead Bilgileri</p>
                  {isLarge ? (
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
              </>
            ) : null}
          </div>
        )}
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-0">
              <div />
              <button
                onClick={() => setShowOtpModal(false)}
                className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col items-center px-6 pt-2 pb-6 text-center">
              {/* Phone icon */}
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Phone className="w-7 h-7 text-slate-500" />
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">Telefon numaranızı doğrulayın</h3>
              <p className="text-xs text-slate-500 mb-1">
                Aşağıdaki numaraya SMS ile bir kod gönderdik:
              </p>
              <p className="text-sm font-semibold text-slate-700 mb-4">
                +{formData.ulkeKodu} {formData.telefon.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "$1 - $2 - $3 - $4")}
              </p>

              {/* OTP inputs */}
              <div className="flex items-center gap-3 mb-4">
                {otpValues.map((val, i) => (
                  <input
                    key={i}
                    ref={el => { otpInputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={e => {
                      const ch = e.target.value.replace(/\D/, "");
                      const next = [...otpValues];
                      next[i] = ch;
                      setOtpValues(next);
                      if (ch && i < 3) otpInputRefs.current[i + 1]?.focus();
                    }}
                    onKeyDown={e => {
                      if (e.key === "Backspace" && !val && i > 0) otpInputRefs.current[i - 1]?.focus();
                    }}
                    className="w-12 h-14 text-center text-lg font-bold border-2 border-slate-200 rounded-xl outline-none focus:border-teal-500 transition-colors"
                  />
                ))}
              </div>

              {/* Countdown */}
              <p className="text-xs text-slate-400 mb-5">
                Kodun geçerlilik süresi:{" "}
                <span className="font-semibold text-slate-700">
                  {String(Math.floor(otpCountdown / 60)).padStart(2, "0")}:
                  {String(otpCountdown % 60).padStart(2, "0")}
                </span>
              </p>

              {/* Actions */}
              <div className="flex items-center gap-3 w-full mb-4">
                <button
                  onClick={() => setShowOtpModal(false)}
                  className="flex-1 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Geri
                </button>
                <button
                  onClick={handleOtpConfirm}
                  disabled={otpValues.join("").length < 4}
                  className="flex-1 py-2.5 bg-teal-500 hover:bg-teal-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Kodu Doğrula
                </button>
              </div>

              {/* Resend links */}
              <p className="text-[11px] text-slate-400">
                Bir kod almadınız mı?{" "}
                <button
                  onClick={() => setOtpCountdown(180)}
                  className="text-teal-600 font-semibold hover:underline"
                >
                  Yeniden Gönder
                </button>
              </p>
              <button className="mt-2 text-[11px] text-emerald-600 font-semibold hover:underline">
                Whatsapp ile Gönder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
