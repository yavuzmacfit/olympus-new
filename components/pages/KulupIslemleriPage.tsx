"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, Download } from "lucide-react";

// --- Types ---
interface Aktivite {
  id: string;
  tip: string;
  egitmen: string;
  baslangic: string;
  bitis: string;
  gunOffset: number; // 0=Pzt … 6=Paz
}

// --- Color logic ---
function getKartRenk(tip: string): string {
  if (tip.includes("Özel Ders")) return "bg-red-500";
  if (tip.includes("Açık Hava") || tip.includes("Sahil")) return "bg-amber-800";
  if (
    tip.includes("MAC/One") ||
    tip.includes("Ölçüm") ||
    tip.includes("Pilates") ||
    tip.includes("GFX") ||
    tip.includes("Animal Flow") ||
    tip.includes("Kid")
  )
    return "bg-blue-600";
  return "bg-green-700";
}

// --- Mock Data (current week: 6–12 Nis 2026) ---
const mockAktiviteler: Aktivite[] = [
  // Pazartesi (0)
  { id: "14191783", tip: "Özel Ders 60 dk", egitmen: "Emre Topçu", baslangic: "06:00", bitis: "07:00", gunOffset: 0 },
  { id: "12768053", tip: "MAC/One Ölçüm ve Program", egitmen: "Hakan Can Vural", baslangic: "06:30", bitis: "07:30", gunOffset: 0 },
  { id: "14186349", tip: "Özel Ders 60 dk", egitmen: "Uygar Durak", baslangic: "06:30", bitis: "07:30", gunOffset: 0 },
  { id: "14192207", tip: "Özel Ders 60 dk", egitmen: "Özden Dikkaya", baslangic: "06:30", bitis: "07:30", gunOffset: 0 },
  { id: "14189612", tip: "Özel Ders 60 dk", egitmen: "Mehmet Emin Ergin", baslangic: "07:00", bitis: "08:00", gunOffset: 0 },
  { id: "14189878", tip: "Özel Ders 60 dk", egitmen: "Mertcan Özer", baslangic: "07:00", bitis: "08:00", gunOffset: 0 },
  { id: "14191786", tip: "Özel Ders 60 dk", egitmen: "Emre Topçu", baslangic: "07:00", bitis: "08:00", gunOffset: 0 },
  // Salı (1)
  { id: "14071718", tip: "MAC/One Ölçüm ve Program", egitmen: "Yavuz Küçüknurioğlu", baslangic: "06:00", bitis: "07:00", gunOffset: 1 },
  { id: "14071743", tip: "MAC/One Ölçüm ve Program", egitmen: "Yavuz Küçüknurioğlu", baslangic: "07:00", bitis: "07:30", gunOffset: 1 },
  { id: "14124144", tip: "MAC/One Ölçüm ve Program", egitmen: "Fatih Kaba", baslangic: "07:00", bitis: "08:00", gunOffset: 1 },
  { id: "14151312", tip: "Ölçüm ve Program", egitmen: "Fatih Kösa", baslangic: "07:00", bitis: "08:00", gunOffset: 1 },
  { id: "14164692", tip: "Özel Ders 60 dk", egitmen: "Ayça Karacan", baslangic: "07:00", bitis: "08:00", gunOffset: 1 },
  { id: "13115406", tip: "Pilates Studio", egitmen: "Fatih Kaba", baslangic: "08:00", bitis: "08:50", gunOffset: 1 },
  { id: "13791939", tip: "Cycle By ICG Connect", egitmen: "Şafak Şen", baslangic: "08:00", bitis: "08:50", gunOffset: 1 },
  // Çarşamba (2)
  { id: "14096873", tip: "Crunch & Burn", egitmen: "Yavuz Küçüknurioğlu", baslangic: "06:00", bitis: "07:00", gunOffset: 2 },
  { id: "14124195", tip: "MAC/One Ölçüm ve Program", egitmen: "Fatih Kaba", baslangic: "06:00", bitis: "07:00", gunOffset: 2 },
  { id: "12830188", tip: "Pilates Studio", egitmen: "Fatih Kaba", baslangic: "07:00", bitis: "07:50", gunOffset: 2 },
  { id: "14189634", tip: "Ölçüm ve Program", egitmen: "Mehmet Emin Ergin", baslangic: "07:20", bitis: "08:20", gunOffset: 2 },
  { id: "13361706", tip: "Core Killer", egitmen: "Ozan Sabaz", baslangic: "08:00", bitis: "08:30", gunOffset: 2 },
  { id: "14181705", tip: "Özel Ders 60 dk", egitmen: "Tetiana Matlunina", baslangic: "08:00", bitis: "09:00", gunOffset: 2 },
  { id: "13403090", tip: "Beginner's Cycle", egitmen: "Fatih Kaba", baslangic: "08:30", bitis: "09:00", gunOffset: 2 },
  // Perşembe (3)
  { id: "13624802", tip: "MAC/One Ölçüm ve Program", egitmen: "Furkan Kocaman", baslangic: "06:00", bitis: "07:00", gunOffset: 3 },
  { id: "13396630", tip: "Pilates Studio", egitmen: "Furkan Kocaman", baslangic: "07:00", bitis: "07:50", gunOffset: 3 },
  { id: "14151664", tip: "Ölçüm ve Program", egitmen: "Fatih Kösa", baslangic: "07:20", bitis: "08:20", gunOffset: 3 },
  { id: "13396663", tip: "GFX Loop", egitmen: "Furkan Kocaman", baslangic: "08:00", bitis: "08:30", gunOffset: 3 },
  { id: "14124244", tip: "MAC/One Ölçüm ve Program", egitmen: "Fatih Kaba", baslangic: "08:00", bitis: "09:00", gunOffset: 3 },
  { id: "14181752", tip: "Özel Ders 60 dk", egitmen: "Tetiana Matlunina", baslangic: "08:00", bitis: "09:00", gunOffset: 3 },
  { id: "13831554", tip: "Cycle Sprint", egitmen: "Fatih Kösa", baslangic: "08:30", bitis: "09:30", gunOffset: 3 },
  // Cuma (4)
  { id: "13062270", tip: "MAC/One Ölçüm ve Program", egitmen: "Magid Alsharabi", baslangic: "06:00", bitis: "07:00", gunOffset: 4 },
  { id: "13397062", tip: "GFX Core", egitmen: "Magid Alsharabi", baslangic: "07:00", bitis: "07:30", gunOffset: 4 },
  { id: "13134355", tip: "Brazilian Butt Fit", egitmen: "Rıza Tulgar", baslangic: "07:00", bitis: "08:00", gunOffset: 4 },
  { id: "14181747", tip: "Özel Ders 60 dk", egitmen: "Tetiana Matlunina", baslangic: "08:00", bitis: "09:00", gunOffset: 4 },
  { id: "13831882", tip: "Cycle Sprint", egitmen: "Ayça Karacan", baslangic: "09:00", bitis: "09:30", gunOffset: 4 },
  { id: "14004456", tip: "Stronger", egitmen: "Rıza Tulgar", baslangic: "09:00", bitis: "09:50", gunOffset: 4 },
  { id: "14181756", tip: "Özel Ders 60 dk", egitmen: "Tetiana Matlunina", baslangic: "09:00", bitis: "10:00", gunOffset: 4 },
  // Cumartesi (5)
  { id: "13187213", tip: "MAC/One Ölçüm ve Program", egitmen: "Hakan Çağlar", baslangic: "06:00", bitis: "07:00", gunOffset: 5 },
  { id: "13781202", tip: "Cycle Sprint By ICG Connect", egitmen: "Şafak Şen", baslangic: "08:00", bitis: "08:50", gunOffset: 5 },
  { id: "12886400", tip: "Animal Flow", egitmen: "Hakan Çağlar", baslangic: "09:00", bitis: "09:50", gunOffset: 5 },
  { id: "13780999", tip: "Pilates Studio", egitmen: "Furkan Kocaman", baslangic: "11:00", bitis: "11:50", gunOffset: 5 },
  { id: "17781232", tip: "MAC/One Ölçüm ve Program", egitmen: "Şafak Şen", baslangic: "11:00", bitis: "12:00", gunOffset: 5 },
  { id: "13781028", tip: "MAC/One Ölçüm ve Program", egitmen: "Furkan Kocaman", baslangic: "12:00", bitis: "13:00", gunOffset: 5 },
  { id: "13713487", tip: "Kid's Swim", egitmen: "Oğuzhan Gürçay", baslangic: "13:00", bitis: "13:50", gunOffset: 5 },
  // Pazar (6)
  { id: "12300393", tip: "Açık Hava Esneklik", egitmen: "Muhammet Talha Doğan", baslangic: "08:00", bitis: "08:50", gunOffset: 6 },
  { id: "14151762", tip: "Ölçüm ve Program", egitmen: "Fatih Kösa", baslangic: "08:00", bitis: "09:00", gunOffset: 6 },
  { id: "12884987", tip: "Reaxing Circuit", egitmen: "Rıza Tulgar", baslangic: "08:30", bitis: "09:20", gunOffset: 6 },
  { id: "14100960", tip: "Sahil Koşusu", egitmen: "Emre Topçu", baslangic: "09:00", bitis: "10:00", gunOffset: 6 },
  { id: "14151763", tip: "Ölçüm ve Program", egitmen: "Fatih Kösa", baslangic: "09:00", bitis: "10:00", gunOffset: 6 },
  { id: "13780601", tip: "Brazilian Butt Fit", egitmen: "Hakan Can Vural", baslangic: "10:00", bitis: "10:50", gunOffset: 6 },
  { id: "14151764", tip: "Ölçüm ve Program", egitmen: "Fatih Kösa", baslangic: "10:00", bitis: "11:00", gunOffset: 6 },
];

const egitmenler = [...new Set(mockAktiviteler.map((a) => a.egitmen))].sort();
const aktiviteTipleri = [...new Set(mockAktiviteler.map((a) => a.tip))].sort();

// --- Date Helpers ---
const TR_AYLAR = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
const TR_GUNLER = ["PZT", "SAL", "ÇAR", "PER", "CUM", "CMT", "PAZ"];

const TODAY = new Date(2026, 3, 6); // 6 Nisan 2026

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatHaftaAraligi(monday: Date): string {
  const sunday = addDays(monday, 6);
  if (monday.getMonth() === sunday.getMonth()) {
    return `${monday.getDate()} – ${sunday.getDate()} ${TR_AYLAR[monday.getMonth()]} ${monday.getFullYear()}`;
  }
  return `${monday.getDate()} ${TR_AYLAR[monday.getMonth()]} – ${sunday.getDate()} ${TR_AYLAR[sunday.getMonth()]} ${sunday.getFullYear()}`;
}

function formatGunBaslik(monday: Date, offset: number): string {
  const d = addDays(monday, offset);
  return `${d.getDate()}/${String(d.getMonth() + 1).padStart(2, "0")} ${TR_GUNLER[offset]}`;
}

// --- Placeholder ---
function PlaceholderView({ title }: { title: string }) {
  return (
    <div className="flex-1 bg-white overflow-auto">
      <div className="p-8 flex flex-col gap-6">
        <h1
          className="text-lg font-bold text-slate-800"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          {title}
        </h1>
        <div className="border border-slate-200 rounded p-12 flex items-center justify-center">
          <p className="text-sm text-slate-400">Yakında</p>
        </div>
      </div>
    </div>
  );
}

// --- Component ---
export default function KulupIslemleriPage({ activeSubId = "aktivite-takvimi" }: { activeSubId?: string }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [gorunum, setGorunum] = useState<"haftalik" | "aylik">("haftalik");
  const [egitmenFilter, setEgitmenFilter] = useState("");
  const [aktiviteTipiFilter, setAktiviteTipiFilter] = useState("");
  const [baslangicFilter, setBaslangicFilter] = useState("");
  const [bitisFilter, setBitisFilter] = useState("");

  const monday = useMemo(() => {
    const m = getMondayOfWeek(TODAY);
    m.setDate(m.getDate() + weekOffset * 7);
    return m;
  }, [weekOffset]);

  const temizle = () => {
    setEgitmenFilter("");
    setAktiviteTipiFilter("");
    setBaslangicFilter("");
    setBitisFilter("");
  };

  const aktivitelerByGun = useMemo(() => {
    const byGun: Record<number, Aktivite[]> = {};
    for (let i = 0; i < 7; i++) byGun[i] = [];

    // Mock data yalnızca mevcut hafta için gösterilir
    if (weekOffset !== 0) return byGun;

    mockAktiviteler
      .filter((a) => {
        if (egitmenFilter && a.egitmen !== egitmenFilter) return false;
        if (aktiviteTipiFilter && a.tip !== aktiviteTipiFilter) return false;
        return true;
      })
      .forEach((a) => {
        byGun[a.gunOffset] = [...byGun[a.gunOffset], a];
      });

    // Başlangıç saatine göre sırala
    for (let i = 0; i < 7; i++) {
      byGun[i].sort((a, b) => a.baslangic.localeCompare(b.baslangic));
    }
    return byGun;
  }, [weekOffset, egitmenFilter, aktiviteTipiFilter]);

  if (activeSubId === "egitmen-listesi") return <PlaceholderView title="Eğitmen Listesi" />;
  if (activeSubId === "egitmen-egitimleri") return <PlaceholderView title="Eğitmen Eğitimleri" />;
  if (activeSubId === "egitmen-paketleri") return <PlaceholderView title="Eğitmen Paketleri" />;
  if (activeSubId === "biletlerim") return <PlaceholderView title="Biletlerim" />;

  return (
    <div className="flex-1 bg-white overflow-auto">
      <div className="p-8 flex flex-col gap-6">

        {/* Başlık */}
        <h1
          className="text-lg font-bold text-slate-800"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          Aktivite Takvimi
        </h1>

        {/* Filtreler */}
        <div className="flex gap-4 flex-wrap items-end">

          {/* Eğitmen */}
          <div className="flex flex-col gap-1.5 min-w-[200px]">
            <label className="text-[11px] text-slate-400 tracking-wide">Eğitmen</label>
            <div className="relative">
              <select
                value={egitmenFilter}
                onChange={(e) => setEgitmenFilter(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2 border border-slate-300 rounded text-sm text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#CD3638] focus:border-[#CD3638]"
              >
                <option value="">Seçiniz</option>
                {egitmenler.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Aktivite Tipi */}
          <div className="flex flex-col gap-1.5 min-w-[220px]">
            <label className="text-[11px] text-slate-400 tracking-wide">Aktivite Tipi</label>
            <div className="relative">
              <select
                value={aktiviteTipiFilter}
                onChange={(e) => setAktiviteTipiFilter(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2 border border-slate-300 rounded text-sm text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#CD3638] focus:border-[#CD3638]"
              >
                <option value="">Seçiniz</option>
                {aktiviteTipleri.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Başlangıç */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-slate-400 tracking-wide">Başlangıç</label>
            <input
              type="date"
              value={baslangicFilter}
              onChange={(e) => setBaslangicFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#CD3638] focus:border-[#CD3638]"
            />
          </div>

          {/* Bitiş */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-slate-400 tracking-wide">Bitiş</label>
            <input
              type="date"
              value={bitisFilter}
              onChange={(e) => setBitisFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#CD3638] focus:border-[#CD3638]"
            />
          </div>

          {/* Butonlar */}
          <div className="flex gap-2">
            <button
              className="flex items-center gap-2 px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded text-sm font-bold tracking-wide transition-colors"
              style={{ fontFamily: "var(--font-barlow-condensed)" }}
            >
              <Download className="w-4 h-4" />
              İNDİR
            </button>
            <button
              onClick={temizle}
              className="px-5 py-2 bg-[#CD3638] hover:bg-[#b82e30] text-white rounded text-sm font-bold tracking-wide transition-colors"
              style={{ fontFamily: "var(--font-barlow-condensed)" }}
            >
              TEMİZLE
            </button>
          </div>

        </div>

        {/* Takvim Navigasyon */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">
            <button
              onClick={() => setWeekOffset((w) => w - 1)}
              className="p-1.5 rounded hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <button
              onClick={() => setWeekOffset((w) => w + 1)}
              className="p-1.5 rounded hover:bg-slate-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
            <button
              onClick={() => setWeekOffset(0)}
              className="px-3 py-1.5 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              style={{ fontFamily: "var(--font-barlow-condensed)" }}
            >
              Bugün
            </button>
          </div>

          <h2
            className="text-base font-bold text-slate-800"
            style={{ fontFamily: "var(--font-barlow-condensed)" }}
          >
            {formatHaftaAraligi(monday)}
          </h2>

          <div className="flex border border-slate-300 rounded overflow-hidden">
            <button
              onClick={() => setGorunum("aylik")}
              className={`px-4 py-1.5 text-sm font-bold tracking-wide transition-colors ${
                gorunum === "aylik"
                  ? "bg-slate-800 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
              style={{ fontFamily: "var(--font-barlow-condensed)" }}
            >
              Aylık
            </button>
            <button
              onClick={() => setGorunum("haftalik")}
              className={`px-4 py-1.5 text-sm font-bold tracking-wide transition-colors border-l border-slate-300 ${
                gorunum === "haftalik"
                  ? "bg-slate-800 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
              style={{ fontFamily: "var(--font-barlow-condensed)" }}
            >
              Haftalık
            </button>
          </div>

        </div>

        {/* Haftalık Grid */}
        {gorunum === "haftalik" && (
          <div className="border border-slate-200 rounded overflow-hidden">

            {/* Gün Başlıkları */}
            <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
              {Array.from({ length: 7 }, (_, i) => (
                <div
                  key={i}
                  className={`px-2 py-3 text-center text-xs font-semibold text-slate-500 tracking-wide ${i < 6 ? "border-r border-slate-200" : ""}`}
                  style={{ fontFamily: "var(--font-barlow-condensed)" }}
                >
                  {formatGunBaslik(monday, i)}
                </div>
              ))}
            </div>

            {/* Aktivite Kolonları */}
            <div className="grid grid-cols-7">
              {Array.from({ length: 7 }, (_, i) => (
                <div
                  key={i}
                  className={`p-1.5 flex flex-col gap-1 min-h-96 bg-white ${i < 6 ? "border-r border-slate-200" : ""}`}
                >
                  {(aktivitelerByGun[i] ?? []).map((a) => (
                    <div
                      key={a.id}
                      className={`${getKartRenk(a.tip)} rounded px-2 py-1.5 text-white cursor-pointer hover:opacity-90 transition-opacity shrink-0`}
                    >
                      <p className="text-[9px] font-bold opacity-70 leading-none">{a.id}</p>
                      <p className="text-[11px] font-bold leading-tight mt-0.5">{a.tip}</p>
                      <p className="text-[10px] mt-0.5 opacity-90 leading-tight">{a.egitmen}</p>
                      <p className="text-[10px] mt-0.5 font-semibold opacity-80 leading-none">{a.baslangic} – {a.bitis}</p>
                    </div>
                  ))}
                  {(aktivitelerByGun[i] ?? []).length === 0 && (
                    <div className="flex-1 flex items-center justify-center">
                      <span className="text-xs text-slate-300">—</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Aylık View */}
        {gorunum === "aylik" && (
          <div className="border border-slate-200 rounded p-12 flex items-center justify-center">
            <p className="text-sm text-slate-400">Aylık görünüm yakında</p>
          </div>
        )}

      </div>
    </div>
  );
}
