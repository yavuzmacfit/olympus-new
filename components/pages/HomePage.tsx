"use client";

import { Users, Bookmark, Sparkles, Banknote, Building2 } from "lucide-react";

const modules = [
  {
    id: "aday-uye",
    icon: <Users className="w-7 h-7 text-blue-600" />,
    iconBg: "bg-blue-50",
    title: "Satış İşlemleri",
    description: "Aday üyelerinizi yönetin, listeleri takip edin ve üyelik süreçlerini hızlandırın.",
    buttonLabel: "İŞLEMLERE GİT",
  },
  {
    id: "kulup-islemleri",
    icon: <Building2 className="w-7 h-7 text-rose-600" />,
    iconBg: "bg-rose-50",
    title: "Kulüp İşlemleri",
    description: "Kulüp bilgilerini yönetin, personel işlemlerini gerçekleştirin ve kulüp ayarlarını düzenleyin.",
    buttonLabel: "İŞLEMLERE GİT",
  },
  {
    id: "kampanya-islemleri",
    icon: <Sparkles className="w-7 h-7 text-purple-600" />,
    iconBg: "bg-purple-50",
    title: "Kampanya İşlemleri",
    description: "Aktif kampanyaları yönetin, yeni teklifler oluşturun ve performans analizi yapın.",
    buttonLabel: "İŞLEMLERE GİT",
  },
  {
    id: "tahsilat-islemleri",
    icon: <Banknote className="w-7 h-7 text-orange-600" />,
    iconBg: "bg-orange-50",
    title: "Tahsilat İşlemleri",
    description: "Üye tahsilatlarını takip edin, bekleyen ödemeleri görüntüleyin ve tahsilat işlemlerini yönetin.",
    buttonLabel: "İŞLEMLERE GİT",
  },
  {
    id: "uyelik-islemleri",
    icon: <Bookmark className="w-7 h-7 text-emerald-600" />,
    iconBg: "bg-emerald-50",
    title: "Üyelik İşlemleri",
    description: "Mevcut üyelerin işlemlerini gerçekleştirin, sözleşmeleri ve ödemeleri takip edin.",
    buttonLabel: "İŞLEMLERE GİT",
  },
];

interface HomePageProps {
  onOpenModule: (id: string) => void;
}

export default function HomePage({ onOpenModule }: HomePageProps) {
  return (
    <div className="flex-1 py-10 px-16 bg-[#f5f8fa] overflow-y-auto flex flex-col">
      <h1 className="text-3xl font-bold text-slate-900 mb-8" style={{ fontFamily: "var(--font-barlow-condensed)" }}>Hoş Geldin, Mars Athletic Club 👋</h1>
      <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        {modules.map((mod) => (
          <div
            key={mod.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-all"
          >
            <div className={`w-16 h-16 rounded-full ${mod.iconBg} flex items-center justify-center mb-5`}>
              {mod.icon}
            </div>
            <h2 className="text-base font-bold text-slate-900 mb-3" style={{ fontFamily: "var(--font-barlow-condensed)" }}>{mod.title}</h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">{mod.description}</p>
            <button
              onClick={() => onOpenModule(mod.id)}
              className="w-full bg-[#CD3638] hover:bg-[#b82e30] rounded-lg py-2.5 text-center text-xs text-white transition-colors mt-auto cursor-pointer font-medium" style={{ fontFamily: "var(--font-barlow-condensed)" }}
            >
              {mod.buttonLabel}
            </button>
          </div>
        ))}
      </div>
      <footer className="mt-auto pt-10">
        <div className="border-t border-slate-200 py-4">
          <p className="text-xs text-slate-400">© 2026 MACFit. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
