"use client";

import { useState } from "react";
import { Search, ExternalLink, Send, Snowflake, CalendarPlus, X, Plus, ChevronDown } from "lucide-react";

// --- Mock Data ---
const mockMember = {
  uyeNumarasi: "2957955",
  adSoyad: "Ahmet Yiğit Şentürk",
  eposta: "yigit.senturk@marsathletic.com",
  telefon: "+905389742567",
  kimlikNumarasi: "506********",
  uyapBilgisi: "UYAP - flyby.su - 17.02.2026",
  kulupAdi: "Ortaköy Lotus",
  odemePlani: "Employee Plan-HQ",
  bakiye: "119.4",
  uyeDurumu: "Aktif",
  sozlesmeDurumu: "Devam Ediyor",
  baslangicTarihi: "01/03/2023",
  bitisTarihi: "-",
  sonZiyaretTarihi: "30/03/2026",
};

const mockKart = {
  durum: "Aktif",
  bakiye: 58,
  olusturmaTarihi: "11/08/2025",
  guncellemeTarihi: "17/03/2026",
};

// --- Toggle Switch ---
function Toggle({ value, onChange, disabled }: { value: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={() => !disabled && onChange()}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
        value ? "bg-[#34C759]" : "bg-slate-300"
      } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          value ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// --- Component ---
export default function UyelikIslemleriPage() {
  const [aramaNo, setAramaNo] = useState("2957955");
  const [member, setMember] = useState<typeof mockMember | null>(null);

  const [eposta, setEposta] = useState("");
  const [telefon, setTelefon] = useState("");

  const [emailBildirim, setEmailBildirim] = useState(false);
  const [smsBildirim, setSmsBildirim] = useState(true);
  const [aramaBildirim, setAramaBildirim] = useState(true);

  const handleSearch = () => {
    if (aramaNo.trim() === "2957955") {
      setMember(mockMember);
    } else {
      setMember(null);
    }
  };

  return (
    <div className="flex-1 bg-white overflow-auto">
      <div className="p-8">

        {/* Başlık */}
        <h1
          className="text-lg font-bold text-slate-800 mb-6"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          Üyelik İşlemleri
        </h1>

        {/* Arama */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={aramaNo}
              onChange={(e) => setAramaNo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Üye numarası giriniz"
              className="pl-9 pr-4 py-2 border border-slate-300 rounded text-sm w-64 focus:outline-none focus:ring-1 focus:ring-[#CD3638] focus:border-[#CD3638]"
            />
          </div>
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-5 py-2 bg-[#CD3638] hover:bg-[#b82e30] text-white rounded text-sm font-medium transition-colors"
            style={{ fontFamily: "var(--font-barlow-condensed)" }}
          >
            <Search className="w-4 h-4" />
            BUL
          </button>
          <button
            className="flex items-center gap-2 px-5 py-2 border border-[#CD3638] text-[#CD3638] hover:bg-red-50 rounded text-sm font-bold tracking-wide transition-colors"
            style={{ fontFamily: "var(--font-barlow-condensed)" }}
          >
            <ExternalLink className="w-4 h-4" />
            PORTALE GİT
          </button>
          <button
            className="flex items-center gap-2 px-5 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded text-sm font-bold tracking-wide transition-colors"
            style={{ fontFamily: "var(--font-barlow-condensed)" }}
          >
            <Send className="w-4 h-4" />
            PORTAL LİNKİ GÖNDER
          </button>
        </div>

        {/* Üye Detay */}
        {member && (
          <>
            {/* Üye Bilgileri Tablosu */}
            <div className="border border-slate-200 rounded overflow-hidden mb-6">

              {/* Başlık */}
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-700" style={{ fontFamily: "var(--font-barlow-condensed)" }}>
                  Üye Bilgileri
                </h3>
              </div>

              {/* Satır 1: Ad Soyad, E-posta, Telefon, Kimlik */}
              <div className="grid grid-cols-4 border-b border-slate-200">
                <div className="px-5 py-4 border-r border-slate-200">
                  <p className="text-[11px] text-slate-400 mb-1.5 tracking-wide">Ad Soyad</p>
                  <p className="text-sm font-medium text-slate-800">{member.adSoyad}</p>
                </div>
                <div className="px-5 py-4 border-r border-slate-200">
                  <p className="text-[11px] text-slate-400 mb-1.5 tracking-wide">E-Posta</p>
                  <p className="text-sm font-medium text-slate-800">{member.eposta}</p>
                </div>
                <div className="px-5 py-4 border-r border-slate-200">
                  <p className="text-[11px] text-slate-400 mb-1.5 tracking-wide">Telefon Numarası</p>
                  <p className="text-sm font-medium text-slate-800">{member.telefon}</p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-[11px] text-slate-400 mb-1.5 tracking-wide">Kimlik Numarası</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-slate-800">{member.kimlikNumarasi}</p>
                    <button className="flex items-center gap-1 px-2.5 py-1 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded text-xs font-medium transition-colors whitespace-nowrap">
                      ✓ BlackList&apos;ten Çıkar
                    </button>
                    <span className="text-xs text-slate-400 whitespace-nowrap">{member.uyapBilgisi}</span>
                  </div>
                </div>
              </div>

              {/* Satır 2: Kulüp, Ödeme Planı, Bakiye, Üye Durumu */}
              <div className="grid grid-cols-4 border-b border-slate-200">
                {[
                  { label: "Kulüp Adı", value: member.kulupAdi },
                  { label: "Ödeme Planı", value: member.odemePlani },
                  { label: "Bakiye", value: member.bakiye },
                  { label: "Üye Durumu", value: member.uyeDurumu },
                ].map((item: { label: string; value: string }) => (
                  <div key={item.label} className="px-5 py-4 border-r border-slate-200 last:border-r-0">
                    <p className="text-[11px] text-slate-400 mb-1.5 tracking-wide">{item.label}</p>
                    <p className="text-sm font-medium text-slate-800">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Satır 3: Sözleşme Durumu, Başlangıç, Bitiş, Son Ziyaret */}
              <div className="grid grid-cols-4">
                <div className="px-5 py-4 border-r border-slate-200">
                  <p className="text-[11px] text-slate-400 mb-1.5 tracking-wide">Sözleşme Durumu</p>
                  <p className="text-sm font-medium text-slate-800">{member.sozlesmeDurumu}</p>
                </div>
                <div className="px-5 py-4 border-r border-slate-200">
                  <p className="text-[11px] text-slate-400 mb-1.5 tracking-wide">Başlangıç Tarihi</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-slate-800">{member.baslangicTarihi}</p>
                    <button className="flex items-center gap-1 px-2.5 py-1 border border-[#CD3638] text-[#CD3638] hover:bg-red-50 rounded text-xs font-medium transition-colors whitespace-nowrap">
                      <Snowflake className="w-3 h-3" />
                      Üyeliği Dondur
                    </button>
                  </div>
                </div>
                <div className="px-5 py-4 border-r border-slate-200">
                  <p className="text-[11px] text-slate-400 mb-1.5 tracking-wide">Bitiş Tarihi</p>
                  <p className="text-sm font-medium text-slate-800">{member.bitisTarihi}</p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-[11px] text-slate-400 mb-1.5 tracking-wide">Son Ziyaret Tarihi</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-slate-800">{member.sonZiyaretTarihi}</p>
                    <button className="flex items-center gap-1 px-2.5 py-1 border border-[#CD3638] text-[#CD3638] hover:bg-red-50 rounded text-xs font-medium transition-colors whitespace-nowrap">
                      <CalendarPlus className="w-3 h-3" />
                      Ziyaret Ekle
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Alt 3 Kart */}
            <div className="grid grid-cols-3 gap-5 items-stretch">

              {/* 1. Üye Bilgileri Güncelleme */}
              <div className="border border-slate-200 rounded overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-700" style={{ fontFamily: "var(--font-barlow-condensed)" }}>
                    Üye Bilgileri Güncelleme
                  </h3>
                </div>
                <div className="p-5 flex flex-col gap-3">
                  <input
                    type="email"
                    value={eposta}
                    onChange={(e) => setEposta(e.target.value)}
                    placeholder="E-posta Adresi"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#CD3638] focus:border-[#CD3638]"
                  />
                  <div className="flex gap-2">
                    <div className="relative">
                      <select className="appearance-none pl-3 pr-7 py-2 border border-slate-300 rounded text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#CD3638] w-20 bg-white">
                        <option value="90">90</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    </div>
                    <input
                      type="tel"
                      value={telefon}
                      onChange={(e) => setTelefon(e.target.value)}
                      placeholder="Cep Telefonu"
                      className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#CD3638] focus:border-[#CD3638]"
                    />
                  </div>
                  <button
                    className="mt-1 px-5 py-2 bg-[#CD3638] hover:bg-[#b82e30] text-white rounded text-sm font-medium transition-colors w-fit"
                    style={{ fontFamily: "var(--font-barlow-condensed)" }}
                  >
                    GÜNCELLE
                  </button>
                </div>
              </div>

              {/* 2. Bildirim Tercihleri Güncelleme */}
              <div className="border border-slate-200 rounded overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-700" style={{ fontFamily: "var(--font-barlow-condensed)" }}>
                    Bildirim Tercihleri Güncelleme
                  </h3>
                </div>
                <div className="p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">E-posta Bildirimleri</span>
                    <Toggle value={emailBildirim} onChange={() => setEmailBildirim(!emailBildirim)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700 flex items-center gap-1">
                      SMS Bildirimleri <span className="text-slate-400 text-xs">🔒</span>
                    </span>
                    <Toggle value={smsBildirim} onChange={() => setSmsBildirim(!smsBildirim)} disabled />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700 flex items-center gap-1">
                      Arama Bildirimleri <span className="text-slate-400 text-xs">🔒</span>
                    </span>
                    <Toggle value={aramaBildirim} onChange={() => setAramaBildirim(!aramaBildirim)} disabled />
                  </div>
                  <button
                    className="mt-1 px-5 py-2 bg-[#CD3638] hover:bg-[#b82e30] text-white rounded text-sm font-medium transition-colors w-fit"
                    style={{ fontFamily: "var(--font-barlow-condensed)" }}
                  >
                    GÜNCELLE
                  </button>
                </div>
              </div>

              {/* 3. Dijital Kart Bilgileri Güncelleme */}
              <div className="border border-slate-200 rounded overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-700" style={{ fontFamily: "var(--font-barlow-condensed)" }}>
                    Dijital Kart Bilgileri Güncelleme
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">Kart Durumu</th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">Kart Bakiyesi</th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">Oluşturma Tarihi</th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">Güncelleme Tarihi</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-slate-100">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-slate-800">{mockKart.durum}</span>
                            <button className="flex items-center gap-1 px-2.5 py-1 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded text-xs font-medium transition-colors whitespace-nowrap">
                              <X className="w-3 h-3" />
                              Devre Dışı Bırak
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-slate-800">{mockKart.bakiye}</span>
                            <button className="flex items-center gap-1 px-2.5 py-1 border border-[#CD3638] text-[#CD3638] hover:bg-red-50 rounded text-xs font-medium transition-colors whitespace-nowrap">
                              <Plus className="w-3 h-3" />
                              Kredi Yükle
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-slate-700 whitespace-nowrap">{mockKart.olusturmaTarihi}</td>
                        <td className="px-4 py-3.5 text-sm text-slate-700 whitespace-nowrap">{mockKart.guncellemeTarihi}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
}
