"use client";

import { useEffect, useRef, useState } from "react";
import {
  Phone, Search, ChevronDown, Plus, MoreHorizontal, Columns2,
  Filter, ArrowUpDown, Download, Save, X, FileText,
  Mail, CheckSquare, CalendarDays, Flame, Settings2, PanelLeftClose, Maximize2,
  User, ClipboardList, Activity, FolderOpen, MessageSquare, Bell,
  RefreshCw, Ticket,
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
    kulupad: "Ortaköy", satisTemsilcisi: "Yavuz K.", olusturmaTarihi: "27.03.2026",
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

const UYE_PANEL_TABS = [
  { id: "profil",      icon: User,          label: "Profil"     },
  { id: "kisi-karti",  icon: ClipboardList, label: "Kişi Kartı" },
  { id: "not",         icon: FileText,      label: "Not"        },
  { id: "ticketlar",   icon: Ticket,        label: "Ticketlar"  },
];

const ALL_PANEL_TABS = [
  { id: "profil",      icon: User,           label: "Profil"      },
  { id: "kisi-karti",  icon: ClipboardList,  label: "Kişi Kartı"  },
  { id: "not",         icon: FileText,       label: "Not"         },
  { id: "eposta",      icon: Mail,           label: "E-Posta"     },
  { id: "ara",         icon: Phone,          label: "Ara"         },
  { id: "gorev",       icon: CheckSquare,    label: "Görev"       },
  { id: "randevu",     icon: CalendarDays,   label: "Randevu"     },
  { id: "aktivite",    icon: Activity,       label: "Aktivite"    },
  { id: "dosyalar",    icon: FolderOpen,     label: "Dosyalar"    },
  { id: "sms",         icon: MessageSquare,  label: "SMS"         },
  { id: "hatirlatici", icon: Bell,           label: "Hatırlatıcı" },
];

/* ─── Üye mock data ─────────────────────────────────────────────── */
interface UyeResult {
  ad: string; soyad: string; initials: string; color: string;
  tckn: string; uyeNo: string; uyelikTipi: string;
  uyelikDurumu: string; kulup: string;
  baslangicTarihi: string; bitisTarihi: string;
}

const MOCK_UYELER: UyeResult[] = [
  { ad: "Ahmet", soyad: "Kaya", initials: "AK", color: "bg-red-800",
    tckn: "12345678901", uyeNo: "U00123", uyelikTipi: "Bireysel",
    uyelikDurumu: "Aktif", kulup: "Ortaköy",
    baslangicTarihi: "01.01.2026", bitisTarihi: "31.12.2026" },
  { ad: "Fatma", soyad: "Demir", initials: "FD", color: "bg-blue-700",
    tckn: "98765432109", uyeNo: "U00456", uyelikTipi: "Aile",
    uyelikDurumu: "Pasif", kulup: "Mars Athletic",
    baslangicTarihi: "01.06.2025", bitisTarihi: "31.05.2026" },
];

/* ─── Zendesk ticket mock data ──────────────────────────────────── */
interface ZendeskTicket {
  id: string;
  konu: string;
  kategori: string;
  durum: "Açık" | "Beklemede" | "Çözüldü" | "Kapatıldı";
  olusturmaTarihi: string;
  guncellemeTarihi: string;
  oncelik: "Düşük" | "Normal" | "Yüksek" | "Kritik";
  aciklama: string;
}

const MOCK_TICKETS: ZendeskTicket[] = [
  {
    id: "#10234",
    konu: "Üyelik dondurma talebi",
    kategori: "Üyelik İşlemleri",
    durum: "Açık",
    olusturmaTarihi: "02.04.2026",
    guncellemeTarihi: "03.04.2026",
    oncelik: "Normal",
    aciklama: "Üyemiz 2 haftalık tatil nedeniyle üyeliğini dondurmak istiyor.",
  },
  {
    id: "#10189",
    konu: "Fatura bilgisi güncelleme",
    kategori: "Faturalama",
    durum: "Çözüldü",
    olusturmaTarihi: "28.03.2026",
    guncellemeTarihi: "30.03.2026",
    oncelik: "Düşük",
    aciklama: "Fatura adresi güncellendi ve yeni fatura gönderildi.",
  },
  {
    id: "#10155",
    konu: "Uygulama girişinde sorun",
    kategori: "Teknik Destek",
    durum: "Beklemede",
    olusturmaTarihi: "25.03.2026",
    guncellemeTarihi: "26.03.2026",
    oncelik: "Yüksek",
    aciklama: "Mobil uygulamaya giriş yapılamıyor, parola sıfırlama denendi.",
  },
  {
    id: "#10098",
    konu: "Kişisel antrenör değişikliği",
    kategori: "Hizmet Talebi",
    durum: "Kapatıldı",
    olusturmaTarihi: "18.03.2026",
    guncellemeTarihi: "20.03.2026",
    oncelik: "Normal",
    aciklama: "Üye mevcut antrenörden memnun değil, değişiklik talep etti.",
  },
];

const TICKET_DURUM_COLORS: Record<ZendeskTicket["durum"], string> = {
  "Açık":      "bg-blue-100 text-blue-700",
  "Beklemede": "bg-amber-100 text-amber-700",
  "Çözüldü":  "bg-emerald-100 text-emerald-700",
  "Kapatıldı": "bg-slate-100 text-slate-500",
};

const TICKET_ONCELIK_COLORS: Record<ZendeskTicket["oncelik"], string> = {
  "Düşük":   "text-slate-400",
  "Normal":  "text-blue-500",
  "Yüksek":  "text-amber-500",
  "Kritik":  "text-red-600",
};

const TICKET_KATEGORILER = [
  "Üyelik İşlemleri",
  "Faturalama",
  "Teknik Destek",
  "Hizmet Talebi",
  "Şikayet",
  "Bilgi Talebi",
  "Diğer",
];

/* ─── Resize constants ───────────────────────────────────────────── */
const DEFAULT_PANEL_WIDTH = 320;
const MIN_PANEL_WIDTH     = 320; // cannot go smaller than default
const SNAP_RATIO          = 0.50; // snap to full when panel >= 50% of container

/* ─── Component ──────────────────────────────────────────────────── */
export default function AdayUyePage() {
  const [activeTab, setActiveTab]         = useState("all");
  const [viewMode, setViewMode]           = useState<"leads" | "uyeler">("leads");
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const [uyeSearchQuery, setUyeSearchQuery]     = useState("");
  const [uyeSearchType, setUyeSearchType]       = useState<"tckn" | "uyeNo">("tckn");
  const [showUyeTypeDropdown, setShowUyeTypeDropdown] = useState(false);
  const [uyeSearchResult, setUyeSearchResult]   = useState<UyeResult | null>(null);
  const [uyeSearchError, setUyeSearchError]     = useState("");
  const [uyeSearched, setUyeSearched]           = useState(false);
  const [selectedUye, setSelectedUye]           = useState<UyeResult | null>(null);
  const [ticketSearch, setTicketSearch]         = useState("");
  const [ticketDurumFilter, setTicketDurumFilter] = useState<ZendeskTicket["durum"] | "Tümü">("Tümü");
  const [ticketSortDesc, setTicketSortDesc]     = useState(true);
  const [ticketDateFrom, setTicketDateFrom]     = useState("");
  const [ticketDateTo, setTicketDateTo]         = useState("");
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicketKategori, setNewTicketKategori]   = useState("");
  const [newTicketKonu, setNewTicketKonu]           = useState("");
  const [newTicketAciklama, setNewTicketAciklama]   = useState("");
  const [selectedLead, setSelectedLead]   = useState<Lead | null>(null);
  const [showAddForm, setShowAddForm]     = useState(false);
  const [activePanelTab, setActivePanelTab] = useState("profil");
  const [showMoreTabs, setShowMoreTabs]         = useState(false);
  const [showYogaSchedule, setShowYogaSchedule]   = useState(false);
  const [showAllWorkouts, setShowAllWorkouts]     = useState(false);
  const moreTabsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMoreEnter = () => {
    if (moreTabsTimer.current) clearTimeout(moreTabsTimer.current);
    setShowMoreTabs(true);
  };
  const handleMoreLeave = () => {
    moreTabsTimer.current = setTimeout(() => setShowMoreTabs(false), 150);
  };
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

  // Re-render trigger when container resizes (so tab bar recalculates visible count)
  const [, setContainerWidth] = useState(0);
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      setContainerWidth(entries[0]?.contentRect.width ?? 0);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

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
  const isLarge = isExpanded;


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
              {/* View mode dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowViewDropdown(v => !v)}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 hover:bg-slate-100 transition-colors"
                >
                  <span className="text-slate-500">{viewMode === "leads" ? "👤" : "🏅"}</span>
                  {viewMode === "leads" ? "Lead'ler" : "Üyeler"}
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>
                {showViewDropdown && (
                  <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-xl py-1 min-w-[150px]">
                    <button
                      onClick={() => { setViewMode("leads"); setShowViewDropdown(false); }}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-xs transition-colors ${viewMode === "leads" ? "text-[#df1d2f] font-semibold bg-red-50" : "text-slate-700 hover:bg-slate-50"}`}
                    >
                      <span>👤</span> Lead&apos;ler
                    </button>
                    <button
                      onClick={() => { setViewMode("uyeler"); setShowViewDropdown(false); setUyeSearchQuery(""); setUyeSearchResult(null); setUyeSearched(false); }}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-xs transition-colors ${viewMode === "uyeler" ? "text-[#df1d2f] font-semibold bg-red-50" : "text-slate-700 hover:bg-slate-50"}`}
                    >
                      <span>🏅</span> Üyeler
                    </button>
                  </div>
                )}
              </div>

              {/* Lead tabs — sadece leads modunda */}
              {viewMode === "leads" && (
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
              )}
            </div>
            {viewMode === "leads" && (
              <div className="flex items-center gap-2">
                <button className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100"><MoreHorizontal className="w-4 h-4" /></button>
                <button onClick={openAddForm} className="flex items-center gap-1.5 bg-[#df1d2f] hover:bg-[#b91827] text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">
                  Lead Ekle <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {viewMode === "uyeler" ? (
            /* ── Üye Arama UI ── */
            <div className="flex-1 flex flex-col overflow-hidden" onClick={() => setShowViewDropdown(false)}>
              {/* Toolbar Row 2 */}
              <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-200 shrink-0">
                {/* Dropdown önce */}
                <div className="relative" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setShowUyeTypeDropdown(v => !v)}
                    className="flex items-center gap-1 border border-slate-300 rounded px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                  >
                    <Columns2 className="w-3.5 h-3.5" />
                    {uyeSearchType === "tckn" ? "TCKN ile Ara" : "Üye No ile Ara"}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {showUyeTypeDropdown && (
                    <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-xl py-1 min-w-[160px]">
                      {(["tckn", "uyeNo"] as const).map(t => (
                        <button
                          key={t}
                          onClick={() => { setUyeSearchType(t); setShowUyeTypeDropdown(false); setUyeSearchQuery(""); setUyeSearchError(""); setUyeSearched(false); setUyeSearchResult(null); }}
                          className={`w-full text-left px-4 py-2 text-xs transition-colors ${uyeSearchType === t ? "text-[#df1d2f] font-semibold bg-red-50" : "text-slate-700 hover:bg-slate-50"}`}
                        >
                          {t === "tckn" ? "TCKN ile Ara" : "Üye No ile Ara"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Search bar sonra */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={uyeSearchQuery}
                    onChange={e => { setUyeSearchQuery(e.target.value); setUyeSearched(false); setUyeSearchResult(null); setUyeSearchError(""); }}
                    onKeyDown={e => {
                      if (e.key !== "Enter") return;
                      const q = uyeSearchQuery.trim();
                      if (uyeSearchType === "tckn" && !/^\d{11}$/.test(q)) { setUyeSearchError("TCKN 11 haneli olmalıdır."); return; }
                      setUyeSearchError("");
                      setUyeSearchResult(MOCK_UYELER.find(u => uyeSearchType === "tckn" ? u.tckn === q : u.uyeNo === q) ?? null);
                      setUyeSearched(true);
                    }}
                    placeholder={uyeSearchType === "tckn" ? "TCKN (11 hane)" : "Üye No (ör. U00123)"}
                    className={`pl-8 pr-3 py-1.5 text-xs border rounded w-56 focus:outline-none focus:ring-1 focus:ring-[#df1d2f]/30 ${uyeSearchError ? "border-[#df1d2f]" : "border-slate-300"}`}
                    onClick={e => e.stopPropagation()}
                  />
                </div>
                <button
                  onClick={() => {
                    const q = uyeSearchQuery.trim();
                    if (uyeSearchType === "tckn" && !/^\d{11}$/.test(q)) { setUyeSearchError("TCKN 11 haneli olmalıdır."); return; }
                    setUyeSearchError("");
                    setUyeSearchResult(MOCK_UYELER.find(u => uyeSearchType === "tckn" ? u.tckn === q : u.uyeNo === q) ?? null);
                    setUyeSearched(true);
                  }}
                  className="flex items-center gap-1 bg-[#df1d2f] hover:bg-[#b91827] text-white px-3 py-1.5 rounded text-xs font-medium transition-colors shrink-0"
                >
                  <Search className="w-3 h-3" /> Ara
                </button>
                {uyeSearchError && <span className="text-[10px] text-[#df1d2f]">{uyeSearchError}</span>}
              </div>

              {/* Sonuç alanı */}
              <div className="flex-1 overflow-auto">
                {!uyeSearched ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-6 pb-10">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      <Search className="w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-xs font-semibold text-slate-600 mb-1">Üye Ara</p>
                    <p className="text-xs text-slate-400">{uyeSearchType === "tckn" ? "11 haneli TCKN" : "Üye numarası"} girerek üyeye ulaşabilirsiniz.</p>
                  </div>
                ) : uyeSearchResult ? (
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
                      <tr>
                        {["Ad Soyad", "Üye No", "Üyelik Tipi", "Kulüp", "Başlangıç", "Bitiş", "Durum"].map(h => (
                          <th key={h} className="p-3 text-left font-medium text-slate-600 border-r border-slate-200 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        onClick={() => setSelectedUye(prev => prev?.uyeNo === uyeSearchResult.uyeNo ? null : uyeSearchResult)}
                        className={`border-b border-slate-100 cursor-pointer transition-colors ${selectedUye?.uyeNo === uyeSearchResult.uyeNo ? "bg-blue-50/50" : "hover:bg-slate-50"}`}
                      >
                        <td className="p-3 border-r border-slate-100">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 ${uyeSearchResult.color} rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{uyeSearchResult.initials}</div>
                            <span className="text-blue-600 font-medium">{uyeSearchResult.ad} {uyeSearchResult.soyad}</span>
                          </div>
                        </td>
                        <td className="p-3 border-r border-slate-100 text-slate-600">{uyeSearchResult.uyeNo}</td>
                        <td className="p-3 border-r border-slate-100 text-slate-600">{uyeSearchResult.uyelikTipi}</td>
                        <td className="p-3 border-r border-slate-100 text-slate-600">{uyeSearchResult.kulup}</td>
                        <td className="p-3 border-r border-slate-100 text-slate-600">{uyeSearchResult.baslangicTarihi}</td>
                        <td className="p-3 border-r border-slate-100 text-slate-600">{uyeSearchResult.bitisTarihi}</td>
                        <td className="p-3 border-r border-slate-100">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${uyeSearchResult.uyelikDurumu === "Aktif" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                            {uyeSearchResult.uyelikDurumu}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-xs text-slate-400">Eşleşen üye bulunamadı.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
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
                        onClick={() => { setSelectedLead(prev => { if (prev?.id === lead.id) return null; setActivePanelTab("profil"); return lead; }); }}
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
            </>
          )}
        </div>

        {/* ── Right panel ── */}
        {(selectedLead || showAddForm || selectedUye) && (
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

            {selectedUye ? (
              /* ── Üye Detail — lead panelinden TAMAMEN bağımsız ── */
              (() => {
                // Bu blok sadece üye paneline aittir. Lead panelini etkilemez.
                // İleride üyeye özel logic buraya gelecek.
                const u = selectedUye;
                const closeUyePanel = () => {
                  setSelectedUye(null);
                  setIsExpanded(false);
                  if (isExpanded) setPanelWidth(DEFAULT_PANEL_WIDTH);
                  setActivePanelTab("profil");
                };
                return (
                  <>
                    {/* Header */}
                    <div className={`flex items-center justify-between border-b border-slate-200 shrink-0 ${isLarge ? "px-6 py-4" : "px-4 py-3"}`}>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`${isLarge ? "w-12 h-12 text-sm" : "w-8 h-8 text-xs"} ${u.color} rounded-lg flex items-center justify-center text-white font-bold shrink-0`}>
                          {u.initials}
                        </div>
                        <div className="min-w-0">
                          <p className={`font-bold text-slate-900 truncate ${isLarge ? "text-base" : "text-sm"}`}>
                            {u.ad} {u.soyad}
                          </p>
                          {isLarge && (
                            <p className="text-xs text-slate-400 mt-0.5">{u.kulup} · {u.uyelikTipi}</p>
                          )}
                        </div>
                      </div>
                      <button onClick={closeUyePanel}
                        className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Actions row */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 shrink-0">
                      <div className="flex items-center gap-2">
                        {!isExpanded && (
                          <button onClick={() => { setSnapTransition(true); setIsExpanded(true); setTimeout(() => setSnapTransition(false), 250); }} title="Genişlet"
                            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors">
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button className="text-xs text-blue-600 hover:underline font-medium">Kaydı Görüntüle</button>
                      </div>
                      {(isExpanded || panelWidth > DEFAULT_PANEL_WIDTH) && (
                        <button onClick={collapsePanel} title="Küçült"
                          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors">
                          <PanelLeftClose className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Tab bar — üyeye özel UYE_PANEL_TABS */}
                    {(() => {
                      const TAB_PX  = isLarge ? 60 : 44;
                      const PADDING = 32;
                      const MORE_PX = isLarge ? 60 : 44;
                      const w       = isExpanded ? (containerRef.current?.offsetWidth ?? 1200) : panelWidth;
                      const maxMain = Math.floor((w - PADDING - MORE_PX) / TAB_PX);
                      const visibleTabs = maxMain >= UYE_PANEL_TABS.length ? UYE_PANEL_TABS : UYE_PANEL_TABS.slice(0, Math.max(3, maxMain));
                      const hiddenTabs  = UYE_PANEL_TABS.slice(visibleTabs.length);
                      const hasMore     = hiddenTabs.length > 0;
                      const iconSz      = isLarge ? "w-10 h-10" : "w-8 h-8";
                      const iconInner   = isLarge ? "w-5 h-5" : "w-4 h-4";
                      const labelSz     = isLarge ? "text-[10px]" : "text-[9px]";
                      return (
                        <div className="flex items-start gap-2 px-4 py-3 border-b border-slate-100 shrink-0">
                          {visibleTabs.map(({ id, icon: Icon, label }) => {
                            const isActive = activePanelTab === id;
                            return (
                              <div key={id} className={`flex flex-col items-center gap-1 shrink-0 ${isLarge ? "w-14" : "w-10"}`}>
                                <button onClick={() => setActivePanelTab(id)}
                                  className={`rounded-full border flex items-center justify-center transition-colors ${iconSz} ${isActive ? "border-[#df1d2f] hover:bg-red-50" : "border-slate-200 hover:bg-slate-50"}`}>
                                  <Icon className={`${iconInner} ${isActive ? "text-[#df1d2f]" : "text-slate-600"}`} />
                                </button>
                                <span className={`${labelSz} w-full text-center truncate ${isActive ? "text-[#df1d2f] font-semibold" : "text-slate-500"}`}>{label}</span>
                              </div>
                            );
                          })}
                          {hasMore && (
                            <div className={`flex flex-col items-center gap-1 shrink-0 relative ${isLarge ? "w-14" : "w-10"}`}
                              onMouseEnter={handleMoreEnter} onMouseLeave={handleMoreLeave}>
                              <button className={`rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 ${iconSz}`}>
                                <MoreHorizontal className={`${iconInner} text-slate-600`} />
                              </button>
                              <span className={`${labelSz} text-slate-500`}>Daha</span>
                              {showMoreTabs && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-xl py-1 min-w-[130px]">
                                  {hiddenTabs.map(({ id, icon: Icon, label }) => (
                                    <button key={id} onClick={() => { setActivePanelTab(id); setShowMoreTabs(false); }}
                                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors ${activePanelTab === id ? "text-[#df1d2f] font-semibold bg-red-50" : "text-slate-700 hover:bg-slate-50"}`}>
                                      <Icon className="w-3.5 h-3.5" />{label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Tab content — üyeye özel */}
                    <div className="flex-1 overflow-auto">
                      {activePanelTab === "ticketlar" ? (
                        (() => {
                          const DURUM_OPTIONS: (ZendeskTicket["durum"] | "Tümü")[] = ["Tümü", "Açık", "Beklemede", "Çözüldü", "Kapatıldı"];
                          const parseTR = (d: string) => { const [dd, mm, yyyy] = d.split(".").map(Number); return new Date(yyyy, mm - 1, dd).getTime(); };
                          const fromTs = ticketDateFrom ? new Date(ticketDateFrom).getTime() : null;
                          const toTs   = ticketDateTo   ? new Date(ticketDateTo).getTime()   : null;
                          const filtered = MOCK_TICKETS
                            .filter(t => {
                              const matchesSearch =
                                t.konu.toLowerCase().includes(ticketSearch.toLowerCase()) ||
                                t.kategori.toLowerCase().includes(ticketSearch.toLowerCase()) ||
                                t.id.toLowerCase().includes(ticketSearch.toLowerCase());
                              const matchesDurum = ticketDurumFilter === "Tümü" || t.durum === ticketDurumFilter;
                              const ts = parseTR(t.guncellemeTarihi);
                              const matchesFrom = fromTs === null || ts >= fromTs;
                              const matchesTo   = toTs   === null || ts <= toTs;
                              return matchesSearch && matchesDurum && matchesFrom && matchesTo;
                            })
                            .sort((a, b) => ticketSortDesc
                              ? parseTR(b.guncellemeTarihi) - parseTR(a.guncellemeTarihi)
                              : parseTR(a.guncellemeTarihi) - parseTR(b.guncellemeTarihi)
                            );
                          return (
                            <div className="flex flex-col h-full">
                              {/* Ticket toolbar — search + new button */}
                              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 shrink-0">
                                <div className="relative flex-1">
                                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                                  <input
                                    type="text"
                                    value={ticketSearch}
                                    onChange={e => setTicketSearch(e.target.value)}
                                    placeholder="Ticket ara..."
                                    className="w-full pl-7 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#df1d2f]/30"
                                  />
                                </div>
                                <button
                                  onClick={() => { setNewTicketKategori(""); setNewTicketKonu(""); setNewTicketAciklama(""); setShowNewTicketModal(true); }}
                                  className="flex items-center gap-1 bg-[#df1d2f] hover:bg-[#b91827] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0"
                                >
                                  <Plus className="w-3 h-3" /> Yeni Ticket
                                </button>
                              </div>

                              {/* Filters — durum + tarih sıralama */}
                              <div className="border-b border-slate-100 shrink-0">
                                {/* Statü butonları */}
                                <div className="flex items-center justify-between gap-1.5 px-3 py-1.5">
                                  <div className="flex items-center gap-1">
                                    {DURUM_OPTIONS.map(d => (
                                      <button
                                        key={d}
                                        onClick={() => setTicketDurumFilter(d)}
                                        className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium border transition-colors whitespace-nowrap ${
                                          ticketDurumFilter === d
                                            ? "bg-[#171a1d] border-[#171a1d] text-white"
                                            : "border-slate-200 text-slate-500 hover:border-slate-400"
                                        }`}
                                      >
                                        {d}
                                      </button>
                                    ))}
                                  </div>
                                  <button
                                    onClick={() => setTicketSortDesc(v => !v)}
                                    className="flex items-center gap-0.5 text-[9px] text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                                    title={ticketSortDesc ? "Yeniden Eskiye" : "Eskiden Yeniye"}
                                  >
                                    <ArrowUpDown className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                                {/* Tarih aralığı */}
                                <div className="flex items-center gap-1.5 px-3 pb-2">
                                  <CalendarDays className="w-3 h-3 text-slate-400 shrink-0" />
                                  <input
                                    type="date"
                                    value={ticketDateFrom}
                                    onChange={e => setTicketDateFrom(e.target.value)}
                                    className="flex-1 border border-slate-200 rounded px-1.5 py-0.5 text-[10px] text-slate-600 outline-none focus:ring-1 focus:ring-[#df1d2f]/30 focus:border-[#df1d2f]/50"
                                  />
                                  <span className="text-[10px] text-slate-400 shrink-0">—</span>
                                  <input
                                    type="date"
                                    value={ticketDateTo}
                                    onChange={e => setTicketDateTo(e.target.value)}
                                    className="flex-1 border border-slate-200 rounded px-1.5 py-0.5 text-[10px] text-slate-600 outline-none focus:ring-1 focus:ring-[#df1d2f]/30 focus:border-[#df1d2f]/50"
                                  />
                                  {(ticketDateFrom || ticketDateTo) && (
                                    <button
                                      onClick={() => { setTicketDateFrom(""); setTicketDateTo(""); }}
                                      className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Ticket list */}
                              <div className="flex-1 overflow-auto px-4 py-3 space-y-2">
                                {filtered.length === 0 ? (
                                  <div className="flex flex-col items-center justify-center h-32 text-slate-400">
                                    <Ticket className="w-6 h-6 mb-2 opacity-40" />
                                    <p className="text-xs">Eşleşen ticket bulunamadı.</p>
                                  </div>
                                ) : filtered.map(ticket => (
                                  <div key={ticket.id} className="border border-slate-200 rounded-xl p-3 hover:border-slate-300 hover:shadow-sm transition-all bg-white">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                      <div className="min-w-0">
                                        <p className="text-xs font-semibold text-slate-800 truncate">{ticket.konu}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{ticket.id} · {ticket.kategori}</p>
                                      </div>
                                      <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold ${TICKET_DURUM_COLORS[ticket.durum]}`}>
                                        {ticket.durum}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{ticket.aciklama}</p>
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                                      <span className={`text-[10px] font-medium ${TICKET_ONCELIK_COLORS[ticket.oncelik]}`}>
                                        ● {ticket.oncelik}
                                      </span>
                                      <span className="text-[10px] text-slate-400">Güncellendi: {ticket.guncellemeTarihi}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12 text-slate-400">
                          {(() => { const t = UYE_PANEL_TABS.find(t => t.id === activePanelTab); const Icon = t?.icon; return Icon ? <Icon className="w-8 h-8 mb-2 opacity-40" /> : null; })()}
                          <p className="text-xs font-medium text-slate-500">{UYE_PANEL_TABS.find(t => t.id === activePanelTab)?.label}</p>
                          <p className="text-[11px] mt-1 text-slate-400">Bu bölüm yakında düzenlenecek.</p>
                        </div>
                      )}
                    </div>

                    {/* Yeni Destek Talebi modal */}
                    {showNewTicketModal && (
                      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 rounded-xl">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden flex flex-col">
                          {/* Modal header */}
                          <div className="bg-[#171a1d] px-5 py-4 flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                              <Ticket className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">Yeni Destek Talebi</p>
                              <p className="text-[11px] text-white/50">Zendesk üzerinden talep oluştur</p>
                            </div>
                            <button onClick={() => setShowNewTicketModal(false)} className="ml-auto text-white/50 hover:text-white transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Modal body */}
                          <div className="px-5 py-4 space-y-4 overflow-auto">
                            {/* Kategori Seçimi */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Kategori Seçimi</label>
                              <div className="flex flex-wrap gap-1.5">
                                {TICKET_KATEGORILER.map(k => (
                                  <button
                                    key={k}
                                    onClick={() => setNewTicketKategori(k)}
                                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                                      newTicketKategori === k
                                        ? "bg-[#171a1d] border-[#171a1d] text-white"
                                        : "border-slate-200 text-slate-600 hover:border-slate-400"
                                    }`}
                                  >
                                    {k}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Konu */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Konu</label>
                              <input
                                type="text"
                                value={newTicketKonu}
                                onChange={e => setNewTicketKonu(e.target.value)}
                                placeholder="Destek talebinin konusu..."
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#df1d2f]/30 focus:border-[#df1d2f]/50"
                              />
                            </div>

                            {/* Açıklama */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Açıklama</label>
                              <textarea
                                value={newTicketAciklama}
                                onChange={e => setNewTicketAciklama(e.target.value)}
                                placeholder="Sorun veya talebi detaylı açıklayın..."
                                rows={4}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#df1d2f]/30 focus:border-[#df1d2f]/50 resize-none"
                              />
                            </div>
                          </div>

                          {/* Modal footer */}
                          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-100">
                            <button
                              onClick={() => setShowNewTicketModal(false)}
                              className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900 font-medium transition-colors"
                            >
                              Vazgeç
                            </button>
                            <button
                              onClick={() => setShowNewTicketModal(false)}
                              className="px-4 py-2 bg-[#df1d2f] hover:bg-[#b91827] text-white text-xs font-bold rounded-lg transition-colors"
                            >
                              Talebi Oluştur
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()
            ) : showAddForm ? (
              /* ── Add Lead Form ── */
              <>
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 shrink-0">
                  <div className="flex items-center gap-2">
                    {(isExpanded || panelWidth > DEFAULT_PANEL_WIDTH) && (
                      <button onClick={collapsePanel} title="Küçült"
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors">
                        <PanelLeftClose className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {!isExpanded && (
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
                  <button onClick={() => { setSelectedLead(null); setIsExpanded(false); if (isExpanded) setPanelWidth(DEFAULT_PANEL_WIDTH); setActivePanelTab("profil"); }}
                    className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Actions row */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 shrink-0">
                  <div className="flex items-center gap-2">
                    {!isExpanded && (
                      <button onClick={() => { setSnapTransition(true); setIsExpanded(true); setTimeout(() => setSnapTransition(false), 250); }} title="Genişlet"
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button className="text-xs text-blue-600 hover:underline font-medium">Kaydı Görüntüle</button>
                  </div>
                  {(isExpanded || panelWidth > DEFAULT_PANEL_WIDTH) && (
                    <button onClick={collapsePanel} title="Küçült"
                      className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors">
                      <PanelLeftClose className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Tab bar — dynamic visible count based on panel width */}
                {(() => {
                  const TAB_PX   = isLarge ? 60 : 44; // icon + label + gap per tab
                  const PADDING  = 32;
                  const MORE_PX  = isLarge ? 60 : 44;
                  const w        = isExpanded
                    ? (containerRef.current?.offsetWidth ?? 1200)
                    : panelWidth;
                  const maxMain  = Math.floor((w - PADDING - MORE_PX) / TAB_PX);
                  const visibleTabs = maxMain >= ALL_PANEL_TABS.length
                    ? ALL_PANEL_TABS
                    : ALL_PANEL_TABS.slice(0, Math.max(3, maxMain));
                  const hiddenTabs  = ALL_PANEL_TABS.slice(visibleTabs.length);
                  const hasMore     = hiddenTabs.length > 0;
                  const iconSz      = isLarge ? "w-11 h-11" : "w-8 h-8";
                  const iconInner   = isLarge ? "w-5 h-5" : "w-3.5 h-3.5";
                  const labelSz     = isLarge ? "text-xs" : "text-[9px]";

                  return (
                    <div className="border-b border-slate-200 shrink-0">
                      <div className="flex items-start gap-2 px-4 py-3">
                        {visibleTabs.map(({ id, icon: Icon, label }) => {
                          const isActive = activePanelTab === id;
                          return (
                            <div key={id} className={`flex flex-col items-center gap-1 shrink-0 ${isLarge ? "w-14" : "w-10"}`}>
                              <button
                                onClick={() => setActivePanelTab(id)}
                                className={`rounded-full border flex items-center justify-center transition-colors ${iconSz} ${isActive ? "border-[#df1d2f] hover:bg-red-50" : "border-slate-200 hover:bg-slate-50"}`}
                              >
                                <Icon className={`${iconInner} ${isActive ? "text-[#df1d2f]" : "text-slate-600"}`} />
                              </button>
                              <span className={`${labelSz} w-full text-center truncate ${isActive ? "text-[#df1d2f] font-semibold" : "text-slate-500"}`}>{label}</span>
                            </div>
                          );
                        })}

                        {hasMore && (
                          <div
                            className={`relative flex flex-col items-center gap-1 shrink-0 ${isLarge ? "w-14" : "w-10"}`}
                            onMouseEnter={handleMoreEnter}
                            onMouseLeave={handleMoreLeave}
                          >
                            <button
                              className={`rounded-full border flex items-center justify-center transition-colors ${iconSz} ${
                                hiddenTabs.some(t => t.id === activePanelTab) || showMoreTabs
                                  ? "border-[#df1d2f] hover:bg-red-50"
                                  : "border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              <MoreHorizontal className={`${iconInner} ${hiddenTabs.some(t => t.id === activePanelTab) || showMoreTabs ? "text-[#df1d2f]" : "text-slate-600"}`} />
                            </button>
                            <span className={`${labelSz} w-full text-center truncate ${hiddenTabs.some(t => t.id === activePanelTab) ? "text-[#df1d2f] font-semibold" : "text-slate-500"}`}>Daha</span>

                            {showMoreTabs && (
                              <div
                                className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 z-50 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 min-w-[160px]"
                                onMouseEnter={handleMoreEnter}
                                onMouseLeave={handleMoreLeave}
                              >
                                <div className="absolute -bottom-2 left-0 w-full h-2" />
                                {hiddenTabs.map(({ id, icon: Icon, label }) => {
                                  const isActive = activePanelTab === id;
                                  return (
                                    <button
                                      key={id}
                                      onClick={() => setActivePanelTab(id)}
                                      className={`flex items-center gap-3 w-full px-4 py-2 text-xs transition-colors ${isActive ? "text-[#df1d2f] bg-red-50" : "text-slate-600 hover:bg-slate-50"}`}
                                    >
                                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#df1d2f]" : "text-slate-400"}`} />
                                      {label}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Tab content */}
                <div className="flex-1 overflow-auto">
                  {activePanelTab === "profil" && (
                    <div className={isLarge ? "px-6 py-5 space-y-5" : "px-4 py-4 space-y-4"}>

                      {/* ── Lead Özeti — Breeze style ── */}
                      <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-xs font-semibold text-slate-700">Lead Özeti</span>
                          </div>
                          <button className="text-[10px] text-blue-500 font-bold border border-blue-200 rounded px-1.5 py-0.5 hover:bg-blue-50 transition-colors">
                            + AI
                          </button>
                        </div>
                        <div className="px-3 py-3">
                          <div className="border-l-2 border-blue-400 pl-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                                {selectedLead.olusturmaTarihi}
                              </span>
                              <button className="text-slate-300 hover:text-slate-500 transition-colors">
                                <RefreshCw className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {selectedLead.ad} {selectedLead.soyad},{" "}
                              <span className="font-medium">{selectedLead.kaynak}</span>
                              {selectedLead.kaynakDetay !== "—" ? ` (${selectedLead.kaynakDetay})` : ""} üzerinden sisteme girdi.{" "}
                              Statüsü <span className="font-medium">{selectedLead.statu}</span> olarak güncellendi.
                              {selectedLead.satisTemsilcisi !== "—" && ` Satış temsilcisi ${selectedLead.satisTemsilcisi} tarafından takip ediliyor.`}
                              {selectedLead.gorevTarihi !== "—" && ` Görev tarihi: ${selectedLead.gorevTarihi}.`}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* ── Antrenman Geçmişi ── */}
                      {(() => {
                        const antrenmanlar = [
                          { zaman: "1 HAFTA ÖNCE", sure: "20 dk", tur: "Yoga", hint: `${selectedLead.kulupad} kulübünde bu hafta içinde 2 yoga dersi mevcut — görüşmede bahsedebilirsin.`, yogaExpand: true },
                          { zaman: "2 HAFTA ÖNCE", sure: "45 dk", tur: "Spinning", hint: "Spinning derslerine düzenli katılımı var. Kardiyo odaklı üyelik paketlerini önerebilirsin." },
                          { zaman: "3 HAFTA ÖNCE", sure: "30 dk", tur: "Pilates", hint: `${selectedLead.kulupad} kulübünde haftalık 3 pilates dersi açık. Esneklik ve core çalışmasına ilgi gösteriyor.` },
                          { zaman: "1 AY ÖNCE",   sure: "60 dk", tur: "Crossfit", hint: "Yüksek yoğunluklu antrenman tercih ediyor. Grup dersi paketleri ilgisini çekebilir." },
                        ];
                        const MAX_VISIBLE = 3;
                        const gorunenler = showAllWorkouts ? antrenmanlar : antrenmanlar.slice(0, 1);
                        const kalanSayi  = antrenmanlar.length - 1;
                        return (
                          <div className="border border-slate-200 rounded-xl overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                              <div className="flex items-center gap-1.5">
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                <span className="text-xs font-semibold text-slate-700">Antrenman Geçmişi</span>
                              </div>
                              <button className="text-[10px] text-emerald-500 font-bold border border-emerald-200 rounded px-1.5 py-0.5 hover:bg-emerald-50 transition-colors">
                                + AI
                              </button>
                            </div>

                            {/* Antrenman girişleri */}
                            <div
                              className="divide-y divide-slate-50"
                              style={showAllWorkouts ? { maxHeight: `${MAX_VISIBLE * 120}px`, overflowY: "auto" } : undefined}
                            >
                              {gorunenler.map((a, i) => (
                                <div key={i} className="px-3 py-3">
                                  <div className="border-l-2 border-emerald-400 pl-3">
                                    <div className="flex items-center justify-between mb-1.5">
                                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{a.zaman}</span>
                                      <span className="text-[10px] text-slate-400 font-medium">{a.tur} · {a.sure}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                      {a.hint.split("2 yoga dersi").length > 1 ? (
                                        <>
                                          {a.hint.split("2 yoga dersi")[0]}
                                          <button onClick={() => setShowYogaSchedule(v => !v)}
                                            className="font-medium text-emerald-600 underline decoration-dashed underline-offset-2">
                                            2 yoga dersi
                                          </button>
                                          {a.hint.split("2 yoga dersi")[1]}
                                        </>
                                      ) : a.hint}
                                    </p>
                                    {a.yogaExpand && showYogaSchedule && (
                                      <div className="mt-2 border border-emerald-100 rounded-lg overflow-hidden">
                                        <div className="bg-emerald-50 px-3 py-1.5 border-b border-emerald-100">
                                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Yaklaşan Yoga Dersleri</span>
                                        </div>
                                        {[
                                          { tarih: "15 Nisan", tur: "Vinyasa",    egitmen: "Türkan Paşalıoğlu", seviye: "Başlangıç"  },
                                          { tarih: "18 Nisan", tur: "Hatha Yoga", egitmen: "Mert Aydın",        seviye: "Orta Seviye" },
                                        ].map((ders, di, arr) => (
                                          <div key={di} className={`flex items-center justify-between px-3 py-2 ${di < arr.length - 1 ? "border-b border-emerald-50" : ""}`}>
                                            <div>
                                              <p className="text-xs font-semibold text-slate-700">{ders.tarih} · {ders.tur}</p>
                                              <p className="text-[10px] text-slate-400">{ders.egitmen}</p>
                                            </div>
                                            <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5 shrink-0">
                                              {ders.seviye}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Diğer antrenmanlar */}
                            <div className="flex justify-end px-3 py-2 border-t border-slate-100">
                              <button
                                onClick={() => setShowAllWorkouts(v => !v)}
                                className="text-[10px] text-slate-500 hover:text-slate-700 font-medium transition-colors"
                              >
                                {showAllWorkouts ? "Gizle" : `Diğer antrenmanlar (${kalanSayi})`}
                              </button>
                            </div>
                          </div>
                        );
                      })()}

                    </div>
                  )}

                  {activePanelTab === "kisi-karti" && (
                    <div className="px-4 py-3">
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
                      ) : (
                        <div className="space-y-0">
                          {tableCols.map(col => (
                            <div key={col.id} className="flex items-center justify-between gap-3 py-2 border-b border-slate-50">
                              <span className="text-[10px] text-slate-400 font-medium shrink-0">{col.label}</span>
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
                      )}
                    </div>
                  )}

                  {!["profil", "kisi-karti"].includes(activePanelTab) && (
                    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12 text-slate-400">
                      {(() => { const t = ALL_PANEL_TABS.find(t => t.id === activePanelTab); const Icon = t?.icon; return Icon ? <Icon className="w-8 h-8 mb-2 opacity-40" /> : null; })()}
                      <p className="text-xs font-medium text-slate-500">{ALL_PANEL_TABS.find(t => t.id === activePanelTab)?.label}</p>
                      <p className="text-[11px] mt-1 text-slate-400">Bu bölüm yakında aktif olacak.</p>
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
