"use client";

import { useState } from "react";
import { Home, BarChart2, Users, Calendar, ChevronUp, ChevronDown, ChevronLeft, Bookmark, CreditCard, Percent, Ticket, List, Landmark, UserPlus, Snowflake } from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  id: string;
  children?: { label: string; id: string }[];
}

const navItemsByModule: Record<string, NavItem[]> = {
  "aday-uye": [
    { icon: Home, label: "Anasayfa", id: "home" },
    { icon: BarChart2, label: "İstatistikler", id: "istatistikler" },
    {
      icon: Users,
      label: "Aday Üye",
      id: "aday-uye",
      children: [
        { label: "Aday Üye Listesi", id: "aday-uye-listesi" },
        { label: "Takvim", id: "aday-uye-takvim" },
        { label: "QR Kodları", id: "aday-uye-qr" },
        { label: "Farklı Kulübe Gidenler", id: "aday-uye-farklı" },
      ],
    },
    { icon: Calendar, label: "Takvim", id: "takvim" },
  ],
  "uyelik-islemleri": [
    { icon: Home, label: "Anasayfa", id: "home" },
    { icon: Bookmark, label: "Üyelik İşlemleri", id: "uyelik-islemleri" },
    { icon: Users, label: "Üye Bilgisi Güncelle", id: "uye-bilgisi-guncelle" },
    { icon: CreditCard, label: "Borçlu Üye Tahsilatı", id: "borclu-uye-tahsilati" },
  ],
  "kampanya-islemleri": [
    { icon: Home, label: "Anasayfa", id: "home" },
    { icon: Percent, label: "Ek İndirim Tanımlamaları", id: "ek-indirim" },
    { icon: Ticket, label: "Promosyon Kodu Oluşturma", id: "promosyon-olusturma" },
    { icon: List, label: "Promosyon Kodu Listeleme", id: "promosyon-listeleme" },
    { icon: Landmark, label: "Yeni Banka İndirimi Ekleme", id: "banka-indirimi" },
    { icon: UserPlus, label: "Referans Kampanyası", id: "referans-kampanya" },
    { icon: Snowflake, label: "Dondurma Kampanyası", id: "dondurma-kampanya" },
  ],
};

interface SidebarProps {
  activeModuleId: string;
  collapsed: boolean;
  onCollapse: (val: boolean) => void;
}

export default function Sidebar({ activeModuleId, collapsed, onCollapse }: SidebarProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    activeModuleId === "aday-uye" ? "aday-uye" : null
  );
  const [activeSubId, setActiveSubId] = useState<string>("aday-uye-listesi");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <aside
      className={`bg-[#171a1d] flex flex-col shrink-0 transition-all duration-200 ${
        collapsed ? "w-14 overflow-visible" : "w-64 overflow-hidden"
      }`}
    >
      <nav className={`flex-1 py-3 ${collapsed ? "overflow-visible" : "overflow-y-auto overflow-x-hidden"}`}>
        {(navItemsByModule[activeModuleId] ?? navItemsByModule["aday-uye"]).map(({ icon: Icon, label, id, children }: NavItem, index: number) => {
          const isExpanded = expandedId === id;
          const isHovered = hoveredId === id;

          return (
            <div
              key={id}
              className="relative"
              onMouseEnter={() => collapsed && setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {index === 1 && (
                <div className="mx-2 h-[1px] bg-white/10 my-1" />
              )}
              <div className="px-2">
                <button
                  onClick={() => {
                    if (!collapsed && children) {
                      toggleExpand(id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-2 py-4 rounded-md text-xs font-medium transition-colors ${
                    !children && activeModuleId === id
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left whitespace-nowrap">{label}</span>
                      {children && (
                        isExpanded
                          ? <ChevronUp className="w-3.5 h-3.5 text-white/40 shrink-0" />
                          : <ChevronDown className="w-3.5 h-3.5 text-white/40 shrink-0" />
                      )}
                    </>
                  )}
                </button>
              </div>

              {/* Expanded sub-menu (normal mod) */}
              {!collapsed && children && isExpanded && (
                <div className="px-2 mt-0.5 mb-1">
                  {children.map((child) => {
                    const isChildActive = activeSubId === child.id;
                    return (
                      <button
                        key={child.id}
                        onClick={() => setActiveSubId(child.id)}
                        className={`w-full flex items-center pl-10 pr-4 py-2 text-xs rounded-md transition-colors whitespace-nowrap mb-0.5 ${
                          isChildActive
                            ? "bg-[#80111b] text-white font-bold"
                            : "text-white/60 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {child.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Hover flyout (collapsed mod) */}
              {collapsed && isHovered && (
                children ? (
                  <div className="absolute left-full top-0 ml-1 z-50 bg-[#171a1d] border border-white/10 rounded-xl shadow-2xl py-3 min-w-[200px]">
                    <p className="px-4 pb-2 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                      {label}
                    </p>
                    {children.map((child) => {
                      const isChildActive = activeSubId === child.id;
                      return (
                        <button
                          key={child.id}
                          onClick={() => setActiveSubId(child.id)}
                          className={`flex items-center px-4 py-2.5 text-xs rounded-lg transition-colors whitespace-nowrap ${
                            isChildActive
                              ? "bg-[#80111b] text-white font-bold mx-2"
                              : "w-full text-white/70 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {child.label}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 bg-[#1e2125] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap pointer-events-none">
                    {label}
                  </div>
                )
              )}
            </div>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <button
        onClick={() => onCollapse(!collapsed)}
        className="flex items-center gap-3 px-4 py-3.5 text-xs text-white/70 hover:text-white hover:bg-white/5 border-t border-white/10 transition-colors shrink-0"
      >
        <ChevronLeft
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
        />
        {!collapsed && <span className="whitespace-nowrap font-medium">Navigation&apos;ı Daralt</span>}
      </button>
    </aside>
  );
}
