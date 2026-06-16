"use client";

import { useState } from "react";
import {
  Phone, AlertCircle, TrendingDown, TrendingUp, Target, Trophy,
  MessageCircle, Globe, Tag, ChevronRight, Headphones, Users, Clock, User,
} from "lucide-react";

const aksiyonListesi = [
  { id: 1, badge: "ACİL",  badgeColor: "red"   as const, name: "Ahmet Yılmaz",  source: "Sosyal Medya", sourceType: "chat"  as const, time: "3s önce"  },
  { id: 2, badge: "YENİ",  badgeColor: "blue"  as const, name: "Zeynep Kaya",   source: "Web Form",     sourceType: "globe" as const, time: "5s önce"  },
  { id: 3, badge: "YENİ",  badgeColor: "blue"  as const, name: "Caner Demir",   source: "Kampanya",     sourceType: "tag"   as const, time: "12s önce" },
  { id: 4, badge: "BUGÜN", badgeColor: "amber" as const, name: "Elif Şahin",    source: "Web Form",     sourceType: "globe" as const, time: "1sa önce" },
  { id: 5, badge: "BUGÜN", badgeColor: "amber" as const, name: "Murat Aydın",   source: "Sosyal Medya", sourceType: "chat"  as const, time: "2sa önce" },
  { id: 6, badge: "BUGÜN", badgeColor: "amber" as const, name: "Selin Yıldız",  source: "Kampanya",     sourceType: "tag"   as const, time: "4sa önce" },
  { id: 7, badge: "BUGÜN", badgeColor: "amber" as const, name: "Burak Tekin",   source: "Instagram",    sourceType: "chat"  as const, time: "5sa önce" },
  { id: 8, badge: "BUGÜN", badgeColor: "amber" as const, name: "Ayşe Güzel",    source: "Web Form",     sourceType: "globe" as const, time: "7sa önce" },
];

const ligSiralamasi = [
  { rank: 1, initial: "A", name: "Satış Temsilcisi 1", skor: 92, satis: 19, isMe: false },
  { rank: 2, initial: "B", name: "Satış Temsilcisi 2", skor: 88, satis: 18, isMe: false },
  { rank: 3, initial: "C", name: "Siz (Olympus SuperUser)", skor: 78, satis: 17, isMe: true },
  { rank: 4, initial: "D", name: "Satış Temsilcisi 4", skor: 75, satis: 16, isMe: false },
  { rank: 5, initial: "E", name: "Satış Temsilcisi 5", skor: 71, satis: 15, isMe: false },
  { rank: 6, initial: "F", name: "Satış Temsilcisi 6", skor: 68, satis: 14, isMe: false },
  { rank: 7, initial: "G", name: "Satış Temsilcisi 7", skor: 64, satis: 13, isMe: false },
  { rank: 8, initial: "H", name: "Satış Temsilcisi 8", skor: 59, satis: 12, isMe: false },
];

const kulupSiralamasi = [
  { rank: 1, name: "MAC Olympus",    hedef: 95, status: "GÜVENLİ",    statusColor: "green"  as const, isLeader: true  },
  { rank: 2, name: "MAC Bebek",      hedef: 88, status: "GÜVENLİ",    statusColor: "green"  as const, isLeader: false },
  { rank: 3, name: "MAC Kanyon",     hedef: 72, status: "DİKKAT",     statusColor: "yellow" as const, isLeader: false },
  { rank: 4, name: "MAC Fit Maslak", hedef: 54, status: "KRİTİK RİSK", statusColor: "red"   as const, isLeader: false },
];

const badgeClasses = {
  red:   "bg-red-100 text-red-700",
  blue:  "bg-blue-100 text-blue-700",
  amber: "bg-amber-100 text-amber-700",
};

const statusBarColor = {
  green:  "bg-green-500",
  yellow: "bg-yellow-400",
  red:    "bg-red-500",
};

const statusBadgeClasses = {
  green:  "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  red:    "bg-red-100 text-red-700",
};

function RankMedal({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-lg leading-none">🥇</span>;
  if (rank === 2) return <span className="text-lg leading-none">🥈</span>;
  if (rank === 3) return <span className="text-lg leading-none">🥉</span>;
  return <span className="text-sm font-semibold text-slate-500">{rank}.</span>;
}

function SourceIcon({ type }: { type: "chat" | "globe" | "tag" }) {
  if (type === "chat")  return <MessageCircle className="w-3.5 h-3.5 text-slate-400" />;
  if (type === "globe") return <Globe className="w-3.5 h-3.5 text-slate-400" />;
  return <Tag className="w-3.5 h-3.5 text-slate-400" />;
}

export default function SatisMerkeziPage() {
  const [dateFilter, setDateFilter] = useState<"bu-ay" | "bugun" | "ozel">("bu-ay");
  const [ligView, setLigView] = useState<"skor" | "satis">("skor");

  return (
    <div className="flex-1 overflow-y-auto bg-[#f5f8fa] p-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Satış Merkezi</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Satış performansınızı ve lead durumlarını buradan takip edin.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {(["bu-ay", "bugun", "ozel"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setDateFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                dateFilter === f ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {f === "bu-ay" ? "Bu Ay" : f === "bugun" ? "Bugün" : "Özel Tarih"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Top Stats Cards ── */}
      <div className="grid grid-cols-5 gap-4 mb-5">

        {/* Card 1 – Performans Skoru */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-1">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center mb-1">
            <Headphones className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-xs text-slate-500">Performans Skoru</p>
          <p className="text-2xl font-bold text-slate-800 leading-tight">
            78 <span className="text-base font-medium text-slate-400">/ 100</span>
          </p>
          <p className="text-xs text-slate-500">
            Sıra: <span className="font-semibold text-slate-700">3 / 8</span>
          </p>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mt-1">
            KULÜP ORT.: 71
          </p>
        </div>

        {/* Card 2 – Bugün aranacak lead */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-1 relative">
          <span className="absolute top-3 right-3 bg-blue-100 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
            BEKLEMEde
          </span>
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center mb-1">
            <Phone className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-xs text-slate-500">Bugün aranacak lead</p>
          <p className="text-3xl font-bold text-slate-800 leading-tight">18</p>
        </div>

        {/* Card 3 – Dün aranmayan lead */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-1 relative">
          <span className="absolute top-3 right-3 bg-red-100 text-red-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
            KRİTİK
          </span>
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center mb-1">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-xs text-slate-500">Dün aranmayan lead</p>
          <p className="text-3xl font-bold text-slate-800 leading-tight">5</p>
        </div>

        {/* Card 4 – İlk gün arama oranı */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-1 relative">
          <span className="absolute top-3 right-3 bg-red-100 text-red-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
            KRİTİK
          </span>
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center mb-1">
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-xs text-slate-500">İlk gün arama oranı</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-red-600 leading-tight">%68</p>
            <p className="text-xs text-slate-400">Hedef: %90</p>
          </div>
          <p className="text-xs font-bold text-red-600">-22 PUAN GERİDE</p>
          <div className="w-full bg-red-100 rounded-full h-1.5 mt-1">
            <div className="bg-red-500 h-1.5 rounded-full" style={{ width: "68%" }} />
          </div>
        </div>

        {/* Card 5 – Bu ay satış / hedef */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-1">
          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center mb-1">
            <Target className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-xs text-slate-500">Bu ay satış / hedef</p>
          <p className="text-2xl font-bold text-slate-800 leading-tight">
            12 <span className="text-base font-medium text-slate-400">/ 20</span>
          </p>
          <p className="text-xs text-slate-500">%60 Tamamlandı</p>
          <div className="w-full bg-orange-100 rounded-full h-1.5 mt-1">
            <div className="bg-orange-400 h-1.5 rounded-full" style={{ width: "60%" }} />
          </div>
        </div>
      </div>

      {/* ── Operasyon Banner ── */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
            <Phone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-slate-800 font-bold text-base">Operasyon Zamanı!</h3>
            <p className="text-slate-600 text-sm mt-0.5">
              24 saati dolmak üzere{" "}
              <span className="text-orange-500 font-bold">9 lead</span> var.
            </p>
            <p className="text-slate-400 text-xs mt-0.5">
              Not: Aranmayan lead&apos;ler performans skorunu düşürür.
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shrink-0">
          🔥 Şimdi Aramaya Başla
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Main two-column layout ── */}
      <div className="grid grid-cols-2 gap-4 mb-4">

        {/* Left: Aksiyon Listesi */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <h3 className="font-semibold text-slate-800">Aksiyon Listesi</h3>
            </div>
            <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">
              8 Yeni Lead
            </span>
          </div>

          <div className="flex flex-col divide-y divide-slate-100">
            {aksiyonListesi.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-3">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 uppercase tracking-wide ${badgeClasses[item.badgeColor]}`}>
                  {item.badge}
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <SourceIcon type={item.sourceType} />
                    <span className="text-[11px] text-slate-400">{item.source}</span>
                    <span className="text-[11px] text-slate-300">·</span>
                    <span className="text-[11px] text-slate-400">{item.time}</span>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                  Ara
                </button>
              </div>
            ))}
          </div>

          <button className="w-full text-center text-sm text-slate-400 hover:text-slate-600 mt-3 py-2 transition-colors">
            Tüm Listeyi Gör
          </button>
        </div>

        {/* Right: Kişisel Hedef + Kulüp Hedefi */}
        <div className="flex flex-col gap-4">

          {/* Kişisel Hedef */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <h3 className="font-semibold text-slate-800">Kişisel Hedef</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="bg-orange-100 text-orange-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                  RİSK: ORTA
                </span>
                <span className="bg-blue-100 text-blue-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                  BİREYSEL
                </span>
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">SATIŞ / HEDEF</p>
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-4xl font-bold text-slate-800">12 / 20</p>
              <p className="text-xl font-semibold text-slate-500">%60</p>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-2 mb-4">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: "60%" }} />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">KALAN GÜN</p>
                <p className="text-sm font-bold text-slate-700 mt-1">14 Gün</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">HIZ BEKLENTİSİ</p>
                <p className="text-sm font-bold text-slate-700 mt-1">1.2/gün</p>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-3 flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Bu hızla:</span>
                <span className="font-semibold text-slate-700">17 satış</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Hedef için günlük:</span>
                <span className="font-semibold text-blue-600">1.4 satış gerekir</span>
              </div>
            </div>
          </div>

          {/* Kulüp Hedefi */}
          <div
            className="bg-white rounded-xl border border-slate-200 p-5"
            style={{ borderLeftColor: '#fb923c', borderLeftWidth: '4px' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                <h3 className="font-semibold text-slate-800">Kulüp Hedefi</h3>
              </div>
              <span className="bg-orange-100 text-orange-500 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                TAKIM
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">TOPLAM SATIŞ</p>
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-4xl font-bold text-slate-800">165 / 200</p>
              <p className="text-xl font-semibold text-slate-400">%82.5</p>
            </div>
            <div className="w-full bg-yellow-100 rounded-full h-2 mb-4">
              <div className="bg-yellow-400 h-2 rounded-full" style={{ width: "82.5%" }} />
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span className="text-xs font-bold text-orange-500 uppercase tracking-wide">RİSK: ORTA</span>
              </div>
              <p className="text-sm text-slate-700">
                Senin katkın:{" "}
                <span className="font-semibold text-orange-500">17 satış</span>{" "}
                <span className="text-orange-400">(%10.3 takım payı)</span>
              </p>
              <p className="text-sm text-slate-700 mt-1.5">
                Takım olarak{" "}
                <span className="font-bold">+35 satış</span>{" "}
                gerekiyor. Liderliğimizi korumak için tempoyu artıralım!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom two-column layout ── */}
      <div className="grid grid-cols-2 gap-4">

        {/* Left: Kulüp İçi Satış Ligi */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <h3 className="font-semibold text-slate-800">Kulüp İçi Satış Ligi</h3>
              <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded-full">
                + Haftalık Mini Lig
              </span>
            </div>
            <div className="flex border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setLigView("skor")}
                className={`text-xs px-3 py-1.5 font-medium transition-colors ${
                  ligView === "skor" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                Skora Göre
              </button>
              <button
                onClick={() => setLigView("satis")}
                className={`text-xs px-3 py-1.5 font-medium transition-colors border-l border-slate-200 ${
                  ligView === "satis" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                Satışa Göre
              </button>
            </div>
          </div>

          {/* Table header row */}
          <div className="flex items-center gap-2 px-2 mb-2">
            <span className="bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
              GÜNCEL
            </span>
            <div className="flex-1" />
            <span className="text-[10px] font-bold text-slate-400 uppercase w-12 text-right">SKOR</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase w-12 text-right">SATIŞ</span>
          </div>

          <div className="flex flex-col gap-1">
            {ligSiralamasi.map((item) => (
              <div
                key={item.rank}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                  item.isMe
                    ? "border-2 border-red-400 bg-red-50"
                    : "hover:bg-slate-50"
                }`}
              >
                <div className="w-6 flex justify-center shrink-0">
                  <RankMedal rank={item.rank} />
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">{item.initial}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold truncate ${item.isMe ? "text-slate-800" : "text-slate-700"}`}>
                    {item.name}
                  </p>
                  {item.isMe && (
                    <span className="text-[9px] font-bold text-red-600 uppercase tracking-wide">
                      TERKİYE YAKINI
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold text-slate-700 w-12 text-right">
                  {ligView === "skor" ? item.skor : item.satis}
                </span>
                <span className="text-sm font-semibold text-slate-400 w-12 text-right">
                  {ligView === "skor" ? item.satis : item.skor}
                </span>
              </div>
            ))}
          </div>

          <button className="w-full text-center text-xs text-slate-400 hover:text-slate-600 mt-4 pt-3 border-t border-slate-100 transition-colors">
            Tüm Sıralamayı Gör
          </button>
        </div>

        {/* Right: Kulüpler Arası Lig */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              <h3 className="font-semibold text-slate-800">Kulüpler Arası Lig</h3>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 bg-slate-900 text-white text-sm font-bold px-3 py-1.5 rounded-lg">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>6 / 14</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 text-right">Kulüp Sıralamanız</p>
            </div>
          </div>

          {/* Club cards */}
          <div className="flex flex-col gap-3">
            {kulupSiralamasi.map((club) => (
              <div key={club.rank} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2">
                    {club.rank === 1 && (
                      <Trophy className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        SIRA: {club.rank}
                      </p>
                      <p className={`font-bold text-sm leading-tight ${club.rank === 1 ? "text-blue-600" : "text-slate-800"}`}>
                        {club.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${statusBadgeClasses[club.statusColor]}`}>
                      {club.status}
                    </span>
                    <span className="text-sm font-bold text-slate-700">%{club.hedef} Hedef</span>
                  </div>
                </div>

                {/* Primary progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${statusBarColor[club.statusColor]}`}
                    style={{ width: `${club.hedef}%` }}
                  />
                </div>

                {/* Club 1 only: secondary bar + label */}
                {club.rank === 1 && (
                  <>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5">
                      <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: "32%" }} />
                    </div>
                    <p className="text-[10px] text-blue-500 font-semibold mt-1 text-right">
                      Mevcut İlerleme
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Kulüp Vizyonu */}
          <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                Kulüp Vizyonu:
              </p>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                &quot;Lider Mac Olympus ile aranızdaki fark kapanıyor! Bu hızla devam edersek ilk 5&apos;e girebilirsiniz.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
