"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface AktiviteSablonu {
  id: number;
  isim: string;
  aktiviteTipi: string;
}

const mockSablonlar: AktiviteSablonu[] = [
  { id: 1,  isim: "Aacayip Cycle",              aktiviteTipi: "Grup Dersleri" },
  { id: 2,  isim: "Aacayip Cycle",              aktiviteTipi: "Grup Dersleri" },
  { id: 3,  isim: "ABS Crunch",                 aktiviteTipi: "Grup Dersleri" },
  { id: 4,  isim: "Abs & Glute",                aktiviteTipi: "Grup Dersleri" },
  { id: 5,  isim: "Açık Hava Bisiklet",         aktiviteTipi: "Grup Dersleri Outdoor" },
  { id: 6,  isim: "Açık Hava Bisiklet",         aktiviteTipi: "Etkinlik/Yarış" },
  { id: 7,  isim: "Açık Hava Dans",             aktiviteTipi: "Grup Dersleri Outdoor" },
  { id: 8,  isim: "Açık Hava Dans",             aktiviteTipi: "Etkinlik/Yarış" },
  { id: 9,  isim: "Açık Hava Esneklik",         aktiviteTipi: "Etkinlik/Yarış" },
  { id: 10, isim: "Açık Hava Esneklik",         aktiviteTipi: "Grup Dersleri Outdoor" },
  { id: 11, isim: "Açık Hava Koşu",             aktiviteTipi: "Etkinlik/Yarış" },
  { id: 12, isim: "Açık Hava Koşu",             aktiviteTipi: "Grup Dersleri Outdoor" },
  { id: 13, isim: "Aerial Yoga",                aktiviteTipi: "Grup Dersleri" },
  { id: 14, isim: "Afrobeats Dance",            aktiviteTipi: "Grup Dersleri" },
  { id: 15, isim: "Animal Flow",                aktiviteTipi: "Grup Dersleri" },
  { id: 16, isim: "Aqua Aerobics",              aktiviteTipi: "Aqua Fitness" },
  { id: 17, isim: "Aqua Cycling",               aktiviteTipi: "Aqua Fitness" },
  { id: 18, isim: "Aqua Fitness",               aktiviteTipi: "Aqua Fitness" },
  { id: 19, isim: "Aqua Zumba",                 aktiviteTipi: "Aqua Fitness" },
  { id: 20, isim: "Ballet Fit",                 aktiviteTipi: "Grup Dersleri" },
  { id: 21, isim: "Beginner's Cycle",           aktiviteTipi: "Spinning/Cycle" },
  { id: 22, isim: "Body Balance",               aktiviteTipi: "Grup Dersleri" },
  { id: 23, isim: "Body Combat",                aktiviteTipi: "Grup Dersleri" },
  { id: 24, isim: "Body Pump",                  aktiviteTipi: "Grup Dersleri" },
  { id: 25, isim: "Body Step",                  aktiviteTipi: "Grup Dersleri" },
  { id: 26, isim: "Boxing",                     aktiviteTipi: "Grup Dersleri" },
  { id: 27, isim: "Brazilian Butt Fit",         aktiviteTipi: "Grup Dersleri" },
  { id: 28, isim: "Cardio Dance",               aktiviteTipi: "Grup Dersleri" },
  { id: 29, isim: "Circuit Training",           aktiviteTipi: "Fonksiyonel Antrenman" },
  { id: 30, isim: "Core Killer",                aktiviteTipi: "Grup Dersleri" },
  { id: 31, isim: "Crunch & Burn",              aktiviteTipi: "Grup Dersleri" },
  { id: 32, isim: "Cycle By ICG Connect",       aktiviteTipi: "Spinning/Cycle" },
  { id: 33, isim: "Cycle Sprint",               aktiviteTipi: "Spinning/Cycle" },
  { id: 34, isim: "Deep Stretch",               aktiviteTipi: "Grup Dersleri" },
  { id: 35, isim: "Fitbox",                     aktiviteTipi: "Grup Dersleri" },
  { id: 36, isim: "Fonksiyonel Antrenman",      aktiviteTipi: "Fonksiyonel Antrenman" },
  { id: 37, isim: "GFX Core",                   aktiviteTipi: "Grup Dersleri" },
  { id: 38, isim: "GFX Loop",                   aktiviteTipi: "Grup Dersleri" },
  { id: 39, isim: "Hatha Yoga",                 aktiviteTipi: "Yoga" },
  { id: 40, isim: "HIIT",                       aktiviteTipi: "Fonksiyonel Antrenman" },
  { id: 41, isim: "Hip Hop Dance",              aktiviteTipi: "Grup Dersleri" },
  { id: 42, isim: "Hot Yoga",                   aktiviteTipi: "Yoga" },
  { id: 43, isim: "İşlevsel Mobilite",          aktiviteTipi: "Grup Dersleri" },
  { id: 44, isim: "Jump",                       aktiviteTipi: "Grup Dersleri" },
  { id: 45, isim: "Kickboxing",                 aktiviteTipi: "Grup Dersleri" },
  { id: 46, isim: "Kid's Swim",                 aktiviteTipi: "Aqua Fitness" },
  { id: 47, isim: "Latin Dans",                 aktiviteTipi: "Grup Dersleri" },
  { id: 48, isim: "MAC/One Ölçüm ve Program",   aktiviteTipi: "Özel Ders" },
  { id: 49, isim: "Meditasyon",                 aktiviteTipi: "Yoga" },
  { id: 50, isim: "Mobility",                   aktiviteTipi: "Grup Dersleri" },
  { id: 51, isim: "Ölçüm ve Program",           aktiviteTipi: "Özel Ders" },
  { id: 52, isim: "Özel Ders 45 dk",            aktiviteTipi: "Özel Ders" },
  { id: 53, isim: "Özel Ders 60 dk",            aktiviteTipi: "Özel Ders" },
  { id: 54, isim: "Özel Ders 90 dk",            aktiviteTipi: "Özel Ders" },
  { id: 55, isim: "Pilates Chair",              aktiviteTipi: "Pilates Studio" },
  { id: 56, isim: "Pilates Mat",                aktiviteTipi: "Pilates Studio" },
  { id: 57, isim: "Pilates Reformer",           aktiviteTipi: "Pilates Studio" },
  { id: 58, isim: "Pilates Studio",             aktiviteTipi: "Pilates Studio" },
  { id: 59, isim: "Power Yoga",                 aktiviteTipi: "Yoga" },
  { id: 60, isim: "Reaxing Circuit",            aktiviteTipi: "Fonksiyonel Antrenman" },
  { id: 61, isim: "Sahil Koşusu",               aktiviteTipi: "Etkinlik/Yarış" },
  { id: 62, isim: "Spinning",                   aktiviteTipi: "Spinning/Cycle" },
  { id: 63, isim: "Stretch & Relax",            aktiviteTipi: "Grup Dersleri" },
  { id: 64, isim: "Stronger",                   aktiviteTipi: "Fonksiyonel Antrenman" },
  { id: 65, isim: "TRX",                        aktiviteTipi: "Fonksiyonel Antrenman" },
  { id: 66, isim: "Vinyasa Yoga",               aktiviteTipi: "Yoga" },
  { id: 67, isim: "Yüzme",                      aktiviteTipi: "Aqua Fitness" },
  { id: 68, isim: "Zumba",                      aktiviteTipi: "Grup Dersleri" },
  { id: 69, isim: "Zumba Gold",                 aktiviteTipi: "Grup Dersleri" },
  { id: 70, isim: "Zumba Kids",                 aktiviteTipi: "Grup Dersleri" },
];

const aktiviteTipleri = [...new Set(mockSablonlar.map((s) => s.aktiviteTipi))].sort();

const SAYFA_BOYUTU = 10;

export default function AktiviteIslemleriPage() {
  const [aramaGirdisi, setAramaGirdisi] = useState("");
  const [aramaUygulandi, setAramaUygulandi] = useState("");
  const [tipiFilter, setTipiFilter] = useState("");
  const [sayfa, setSayfa] = useState(1);

  const filtrelenmis = useMemo(() => {
    return mockSablonlar.filter((s) => {
      if (aramaUygulandi && !s.isim.toLowerCase().includes(aramaUygulandi.toLowerCase())) return false;
      if (tipiFilter && s.aktiviteTipi !== tipiFilter) return false;
      return true;
    });
  }, [aramaUygulandi, tipiFilter]);

  const toplamSayfa = Math.max(1, Math.ceil(filtrelenmis.length / SAYFA_BOYUTU));

  const sayfadakiKayitlar = useMemo(() => {
    const baslangic = (sayfa - 1) * SAYFA_BOYUTU;
    return filtrelenmis.slice(baslangic, baslangic + SAYFA_BOYUTU);
  }, [filtrelenmis, sayfa]);

  const handleAra = () => {
    setAramaUygulandi(aramaGirdisi);
    setSayfa(1);
  };

  const handleTipiChange = (tip: string) => {
    setTipiFilter(tip);
    setSayfa(1);
  };

  const gotoSayfa = (n: number) => {
    if (n < 1 || n > toplamSayfa) return;
    setSayfa(n);
  };

  // Pagination: gösterilecek sayfa numaraları (max 7)
  const sayfaNumaralari = useMemo(() => {
    if (toplamSayfa <= 7) return Array.from({ length: toplamSayfa }, (_, i) => i + 1);
    if (sayfa <= 4) return [1, 2, 3, 4, 5, 6, 7];
    if (sayfa >= toplamSayfa - 3) {
      return [toplamSayfa - 6, toplamSayfa - 5, toplamSayfa - 4, toplamSayfa - 3, toplamSayfa - 2, toplamSayfa - 1, toplamSayfa];
    }
    return [sayfa - 3, sayfa - 2, sayfa - 1, sayfa, sayfa + 1, sayfa + 2, sayfa + 3];
  }, [sayfa, toplamSayfa]);

  return (
    <div className="flex-1 bg-white overflow-auto flex flex-col">

      {/* Başlık */}
      <div className="px-8 py-5 border-b border-slate-200 shrink-0">
        <h1
          className="text-xl font-bold text-slate-800 tracking-wide"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          Aktivite Şablonu
        </h1>
      </div>

      {/* Filtreler */}
      <div className="px-8 py-5 flex gap-4 items-end flex-wrap shrink-0">

        {/* Arama */}
        <div className="flex flex-1 min-w-[260px] max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Aktivite Şablonu"
              value={aramaGirdisi}
              onChange={(e) => setAramaGirdisi(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAra()}
              className="w-full pl-9 pr-3 py-2.5 border border-slate-300 border-r-0 rounded-l text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#CD3638] focus:border-[#CD3638]"
            />
          </div>
          <button
            onClick={handleAra}
            className="px-6 py-2.5 bg-[#CD3638] hover:bg-[#b82e30] text-white text-sm font-bold tracking-wide rounded-r transition-colors shrink-0"
            style={{ fontFamily: "var(--font-barlow-condensed)" }}
          >
            ARA
          </button>
        </div>

        {/* Aktivite Tipi */}
        <div className="flex flex-col gap-1.5 min-w-[220px]">
          <label className="text-[11px] text-slate-400 tracking-wide">Aktivite Tipi</label>
          <div className="relative">
            <select
              value={tipiFilter}
              onChange={(e) => handleTipiChange(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2.5 border border-slate-300 rounded text-sm text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#CD3638] focus:border-[#CD3638]"
            >
              <option value="">Seçiniz</option>
              {aktiviteTipleri.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Yeni Ekle */}
        <button
          className="ml-auto px-8 py-2.5 bg-[#CD3638] hover:bg-[#b82e30] text-white text-sm font-bold tracking-wide rounded transition-colors shrink-0"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          YENİ EKLE
        </button>

      </div>

      {/* Tablo */}
      <div className="px-8 pb-8 flex-1 flex flex-col">
        <div className="border border-slate-200 rounded overflow-hidden flex flex-col flex-1">

          {/* Tablo Başlığı */}
          <div className="grid grid-cols-[1fr_1fr_120px] bg-[#111111] text-white">
            <div
              className="px-6 py-4 text-xs font-bold tracking-widest uppercase"
              style={{ fontFamily: "var(--font-barlow-condensed)" }}
            >
              İsim
            </div>
            <div
              className="px-6 py-4 text-xs font-bold tracking-widest uppercase"
              style={{ fontFamily: "var(--font-barlow-condensed)" }}
            >
              Aktivite Tipi
            </div>
            <div />
          </div>

          {/* Satırlar */}
          <div className="flex-1 divide-y divide-slate-100 bg-white">
            {sayfadakiKayitlar.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <p className="text-sm text-slate-400">Kayıt bulunamadı.</p>
              </div>
            ) : (
              sayfadakiKayitlar.map((sablon) => (
                <div
                  key={sablon.id}
                  className="grid grid-cols-[1fr_1fr_120px] items-center hover:bg-slate-50 transition-colors"
                >
                  <div className="px-6 py-4 text-sm text-slate-800">{sablon.isim}</div>
                  <div className="px-6 py-4 text-sm text-slate-700">{sablon.aktiviteTipi}</div>
                  <div className="px-4 py-3 flex justify-end">
                    <button className="px-4 py-1.5 border border-slate-300 rounded-full text-xs font-medium text-slate-700 hover:border-[#CD3638] hover:text-[#CD3638] transition-colors whitespace-nowrap">
                      Güncelle
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {toplamSayfa > 1 && (
            <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-end gap-1 shrink-0">

              {/* İlk sayfa */}
              <button
                onClick={() => gotoSayfa(1)}
                disabled={sayfa === 1}
                className="w-8 h-8 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              {/* Önceki sayfa */}
              <button
                onClick={() => gotoSayfa(sayfa - 1)}
                disabled={sayfa === 1}
                className="w-8 h-8 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Sayfa numaraları */}
              {sayfaNumaralari.map((n) => (
                <button
                  key={n}
                  onClick={() => gotoSayfa(n)}
                  className={`w-8 h-8 flex items-center justify-center rounded text-xs font-medium transition-colors ${
                    n === sayfa
                      ? "bg-[#111111] text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {n}
                </button>
              ))}

              {/* Sonraki sayfa */}
              <button
                onClick={() => gotoSayfa(sayfa + 1)}
                disabled={sayfa === toplamSayfa}
                className="w-8 h-8 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Son sayfa */}
              <button
                onClick={() => gotoSayfa(toplamSayfa)}
                disabled={sayfa === toplamSayfa}
                className="w-8 h-8 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>

    </div>
  );
}
