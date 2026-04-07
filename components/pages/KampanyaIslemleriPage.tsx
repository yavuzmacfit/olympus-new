"use client";

import { useState, useRef, useCallback } from "react";
import { FileText, Download, X } from "lucide-react";

// --- Mock Data (CSV yüklendikten sonra gösterilir) ---
const mockIndirimler = [
  { id: 1, uyeNo: "2957955", adSoyad: "Ahmet Yiğit Şentürk", indirimOrani: "%20", indirimTuru: "Personel İndirimi", baslangicTarihi: "01/01/2026", bitisTarihi: "31/12/2026", durum: "Aktif" },
  { id: 2, uyeNo: "5384966", adSoyad: "Samet Çiftçi", indirimOrani: "%15", indirimTuru: "Kurumsal İndirim", baslangicTarihi: "01/03/2026", bitisTarihi: "28/02/2027", durum: "Aktif" },
  { id: 3, uyeNo: "3847291", adSoyad: "Elif Kaya", indirimOrani: "%10", indirimTuru: "Aile İndirimi", baslangicTarihi: "15/02/2026", bitisTarihi: "14/02/2027", durum: "Aktif" },
  { id: 4, uyeNo: "9182736", adSoyad: "Murat Demir", indirimOrani: "%25", indirimTuru: "Öğrenci İndirimi", baslangicTarihi: "01/09/2025", bitisTarihi: "31/08/2026", durum: "Pasif" },
  { id: 5, uyeNo: "6473820", adSoyad: "Zeynep Arslan", indirimOrani: "%30", indirimTuru: "Personel İndirimi", baslangicTarihi: "01/04/2026", bitisTarihi: "31/03/2027", durum: "Aktif" },
];

export default function KampanyaIslemleriPage() {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showData, setShowData] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) return;
    setUploadedFile(file);
    setShowData(true);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleReset = () => {
    setShowData(false);
    setUploadedFile(null);
  };

  const handleDownload = () => {
    const header = "Üye No,Ad Soyad,İndirim Oranı,İndirim Türü,Başlangıç Tarihi,Bitiş Tarihi,Durum\n";
    const rows = mockIndirimler.map((r) =>
      `${r.uyeNo},${r.adSoyad},${r.indirimOrani},${r.indirimTuru},${r.baslangicTarihi},${r.bitisTarihi},${r.durum}`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ek-indirim-tanimlamalari.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 bg-white overflow-auto flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-slate-200 bg-white shrink-0">
        <h1
          className="text-lg font-bold text-slate-800 tracking-wide"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          Ek İndirim Tanımlamaları
        </h1>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-2 bg-[#CD3638] hover:bg-[#b82e30] text-white rounded text-sm font-bold tracking-wide transition-colors"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          <Download className="w-4 h-4" />
          TÜM LİSTEYİ İNDİR
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 bg-[#f5f8fa] overflow-auto">

        {!showData ? (
          // --- Drop Zone ---
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`h-full min-h-80 rounded-lg flex flex-col items-center justify-center gap-4 transition-colors cursor-default ${
              dragOver
                ? "bg-red-50 border-2 border-dashed border-[#CD3638]"
                : "bg-slate-100 border-2 border-dashed border-slate-300"
            }`}
          >
            <FileText className={`w-14 h-14 transition-colors ${dragOver ? "text-[#CD3638]" : "text-slate-400"}`} />
            <p className="text-slate-600 text-sm text-center leading-relaxed">
              Yüklemek istediğin .csv uzantılı dosyayı alana sürükle.
            </p>
            <p className="text-slate-400 text-sm">veya</p>
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2 bg-[#CD3638] hover:bg-[#b82e30] text-white rounded text-sm font-bold tracking-wide transition-colors"
                style={{ fontFamily: "var(--font-barlow-condensed)" }}
              >
                DOSYA SEÇ
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-2 border border-[#CD3638] text-[#CD3638] hover:bg-red-50 rounded text-sm font-bold tracking-wide transition-colors"
                style={{ fontFamily: "var(--font-barlow-condensed)" }}
              >
                <Download className="w-4 h-4" />
                ÖRNEK DOSYA İNDİR
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>

        ) : (
          // --- Tablo ---
          <div className="border border-slate-200 rounded overflow-hidden bg-white">

            {/* Tablo Başlık */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3
                  className="text-sm font-semibold text-slate-700"
                  style={{ fontFamily: "var(--font-barlow-condensed)" }}
                >
                  Yüklenen İndirim Tanımlamaları
                </h3>
                {uploadedFile && (
                  <p className="text-[11px] text-slate-400 mt-0.5">{uploadedFile.name}</p>
                )}
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Farklı dosya yükle
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    {[
                      "Üye No",
                      "Ad Soyad",
                      "İndirim Oranı",
                      "İndirim Türü",
                      "Başlangıç Tarihi",
                      "Bitiş Tarihi",
                      "Durum",
                    ].map((col) => (
                      <th
                        key={col}
                        className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockIndirimler.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 text-slate-700 whitespace-nowrap font-mono text-xs">
                        {row.uyeNo}
                      </td>
                      <td className="px-5 py-3.5 text-slate-800 font-medium whitespace-nowrap">
                        {row.adSoyad}
                      </td>
                      <td className="px-5 py-3.5 text-slate-700 whitespace-nowrap font-semibold">
                        {row.indirimOrani}
                      </td>
                      <td className="px-5 py-3.5 text-slate-700 whitespace-nowrap">
                        {row.indirimTuru}
                      </td>
                      <td className="px-5 py-3.5 text-slate-700 whitespace-nowrap">
                        {row.baslangicTarihi}
                      </td>
                      <td className="px-5 py-3.5 text-slate-700 whitespace-nowrap">
                        {row.bitisTarihi}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            row.durum === "Aktif"
                              ? "bg-green-50 text-green-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {row.durum}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
