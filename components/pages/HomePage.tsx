"use client";

import { Users, Bookmark, Sparkles, ChevronRight } from "lucide-react";

const modules = [
  {
    id: "aday-uye",
    icon: <Users className="w-7 h-7 text-blue-600" />,
    iconBg: "bg-blue-50",
    title: "Aday Üye",
    description: "Aday üyelerinizi yönetin, listeleri takip edin ve üyelik süreçlerini hızlandırın.",
    buttonLabel: "Görüntüle",
  },
  {
    id: "uyelik-islemleri",
    icon: <Bookmark className="w-7 h-7 text-emerald-600" />,
    iconBg: "bg-emerald-50",
    title: "Üyelik İşlemleri",
    description: "Mevcut üyelerin işlemlerini gerçekleştirin, sözleşmeleri ve ödemeleri takip edin.",
    buttonLabel: "İşlemlere Git",
  },
  {
    id: "kampanya-islemleri",
    icon: <Sparkles className="w-7 h-7 text-purple-600" />,
    iconBg: "bg-purple-50",
    title: "Kampanya İşlemleri",
    description: "Aktif kampanyaları yönetin, yeni teklifler oluşturun ve performans analizi yapın.",
    buttonLabel: "Daha Fazla Bilgi",
  },
];

interface HomePageProps {
  onOpenModule: (id: string) => void;
}

export default function HomePage({ onOpenModule }: HomePageProps) {
  return (
    <div className="flex-1 py-10 px-16 bg-[#f5f8fa]">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Modules</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        {modules.map((mod) => (
          <div
            key={mod.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-all"
          >
            <div className={`w-16 h-16 rounded-full ${mod.iconBg} flex items-center justify-center mb-5`}>
              {mod.icon}
            </div>
            <h2 className="text-base font-bold text-slate-900 mb-3">{mod.title}</h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">{mod.description}</p>
            <button
              onClick={() => onOpenModule(mod.id)}
              className="w-full border border-slate-300 rounded-lg py-2.5 flex items-center justify-center gap-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors mt-auto cursor-pointer font-medium"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              {mod.buttonLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
