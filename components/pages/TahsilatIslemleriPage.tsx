"use client";

import { useState } from "react";
import { Search } from "lucide-react";

// --- Mock Data ---
const mockMember = {
  uyeNumarasi: "5384966",
  adSoyad: "Samet Çiftçi",
  eposta: "a.sametkra5434@gmail.com",
  telefon: "+905526823254",
  kulupAdi: "MACFit Buyaka",
  odemeKlani: "GOLD YILLIK AA",
  caymaBedeli: "6300 TL",
  uyeKaldigiSure: "82 gün",
  tenureIndirimOrani: "-",
  ucretsizDondurmaHakki: "60 gün",
  kulupGuncelAAFiyati: "4049 TL",
};

const mockFaturalar = [
  { id: 1, tarih: "2026-03-08", tutar: "3899 ₺", odenecekTutar: "3899 ₺", durum: "Ödenmedi" },
  { id: 2, tarih: "2026-02-08", tutar: "3899 ₺", odenecekTutar: "3899 ₺", durum: "Ödenmedi" },
];

const mockKartlar = [
  { id: 1, kartBilgisi: "**** **** ****8006", banka: "QNB", kartTuru: "Kredi Kartı", sonKullanim: "2030/07", varsayilan: true, hata: "" },
  { id: 2, kartBilgisi: "**** **** ****2498", banka: "DENİZBANK A.Ş.", kartTuru: "Kredi Kartı", sonKullanim: "2033/10", varsayilan: false, hata: "" },
];

// --- Component ---
export default function TahsilatIslemleriPage() {
  const [aramaNo, setAramaNo] = useState("5384966");
  const [member, setMember] = useState<typeof mockMember | null>(null);
  const [seciliFaturalar, setSeciliFaturalar] = useState<number[]>([]);

  const handleSearch = () => {
    if (aramaNo.trim() === "5384966") {
      setMember(mockMember);
    } else {
      setMember(null);
    }
  };

  const toggleFatura = (id: number) => {
    setSeciliFaturalar((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex-1 bg-white overflow-auto">
      <div className="p-8">

        {/* Başlık */}
        <h1
          className="text-lg font-bold text-slate-800 mb-6"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          Tahsilat İşlemleri
        </h1>

        {/* Arama */}
        <div className="flex items-center gap-3 mb-8">
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
        </div>

        {/* Üye Detay Bilgileri */}
        {member && (
          <>
            {/* Üye Bilgileri Tablosu */}
            <div className="border border-slate-200 rounded overflow-hidden mb-6">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-700" style={{ fontFamily: "var(--font-barlow-condensed)" }}>Borçlu Üye Bilgileri</h3>
              </div>

              {/* Satır 1: 5 kolon */}
              <div className="grid grid-cols-5 border-b border-slate-200">
                {[
                  { label: "Ad Soyad", value: member.adSoyad },
                  { label: "E-Posta", value: member.eposta },
                  { label: "Telefon Numarası", value: member.telefon },
                  { label: "Kulüp Adı", value: member.kulupAdi },
                  { label: "Ödeme Planı", value: member.odemeKlani },
                ].map((item) => (
                  <div key={item.label} className="px-5 py-4 border-r border-slate-200 last:border-r-0">
                    <p className="text-[11px] text-slate-400 mb-1.5">{item.label}</p>
                    <p className="text-sm font-medium text-slate-800">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Satır 2: 5 kolon */}
              <div className="grid grid-cols-5">
                {[
                  { label: "Cayma Bedeli", value: member.caymaBedeli },
                  { label: "Üye Kaldığı Süre", value: member.uyeKaldigiSure },
                  { label: "Tenure İndirim Oranı", value: member.tenureIndirimOrani },
                  { label: "Ücretsiz Dondurma Hakkı", value: member.ucretsizDondurmaHakki },
                  { label: "Kulüp Güncel AA Fiyatı", value: member.kulupGuncelAAFiyati },
                ].map((item) => (
                  <div key={item.label} className="px-5 py-4 border-r border-slate-200 last:border-r-0">
                    <p className="text-[11px] text-slate-400 mb-1.5">{item.label}</p>
                    <p className="text-sm font-medium text-slate-800">{item.value}</p>
                  </div>
                ))}
              </div>

            </div>

            {/* Alt Kartlar */}
            <div className="flex gap-5 items-stretch">

              {/* Sol: Ödenmeyen Faturalar */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shrink-0 shadow-sm">
                <div className="px-5 py-4 bg-white border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800" style={{ fontFamily: "var(--font-barlow-condensed)" }}>Ödenmeyen Faturalar</h3>
                </div>
                <table className="text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="w-10 px-4 py-3"></th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 whitespace-nowrap tracking-wide">Fatura Tarihi</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 whitespace-nowrap tracking-wide">Fatura Tutarı</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 whitespace-nowrap tracking-wide">Ödenecek Tutar</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 whitespace-nowrap tracking-wide">Fatura Durumu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mockFaturalar.map((fatura) => (
                      <tr key={fatura.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={seciliFaturalar.includes(fatura.id)}
                            onChange={() => toggleFatura(fatura.id)}
                            className="rounded border-slate-300 accent-[#CD3638]"
                          />
                        </td>
                        <td className="px-4 py-3.5 text-slate-700 whitespace-nowrap">{fatura.tarih}</td>
                        <td className="px-4 py-3.5 text-slate-700 whitespace-nowrap font-medium">{fatura.tutar}</td>
                        <td className="px-4 py-3.5 text-slate-700 whitespace-nowrap font-medium">{fatura.odenecekTutar}</td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                            {fatura.durum}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Sağ: Kayıtlı Kart Bilgileri */}
              <div className="border border-slate-200 rounded-xl overflow-hidden flex-1 shadow-sm">
                <div className="px-5 py-4 bg-white border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800" style={{ fontFamily: "var(--font-barlow-condensed)" }}>Kayıtlı Kart Bilgileri</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 whitespace-nowrap tracking-wide">Kart Bilgisi</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 whitespace-nowrap tracking-wide">Banka</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 whitespace-nowrap tracking-wide">Kart Türü</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 whitespace-nowrap tracking-wide">Son Kullanma Tarihi</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 whitespace-nowrap tracking-wide">Varsayılan Kart</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 whitespace-nowrap tracking-wide">Hata</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 whitespace-nowrap tracking-wide">Çözüm</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mockKartlar.map((kart) => (
                        <tr key={kart.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3.5 font-mono text-slate-700 whitespace-nowrap">{kart.kartBilgisi}</td>
                          <td className="px-4 py-3.5 text-slate-700 whitespace-nowrap">{kart.banka}</td>
                          <td className="px-4 py-3.5 text-slate-700 whitespace-nowrap">{kart.kartTuru}</td>
                          <td className="px-4 py-3.5 text-slate-700 whitespace-nowrap">{kart.sonKullanim}</td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${kart.varsayilan ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                              {kart.varsayilan ? "Evet" : "Hayır"}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-slate-400 whitespace-nowrap">{kart.hata}</td>
                          <td className="px-4 py-3.5">
                            <button
                              className="px-4 py-1.5 bg-[#CD3638] hover:bg-[#b82e30] text-white rounded-lg text-xs font-bold tracking-wide transition-colors whitespace-nowrap"
                              style={{ fontFamily: "var(--font-barlow-condensed)" }}
                            >
                              ÖDEME YAP
                            </button>
                          </td>
                        </tr>
                      ))}
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
