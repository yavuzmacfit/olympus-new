"use client";

import { Fragment, useLayoutEffect, useRef, useState } from "react";
import { Phone, Bell, ChevronDown, Home, X, Users, Bookmark, Sparkles, Banknote, Building2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import HomePageContent from "@/components/pages/HomePage";
import AdayUyePage from "@/components/pages/AdayUyePage";
import UyelikIslemleriPage from "@/components/pages/UyelikIslemleriPage";
import KampanyaIslemleriPage from "@/components/pages/KampanyaIslemleriPage";
import TahsilatIslemleriPage from "@/components/pages/TahsilatIslemleriPage";
import KulupIslemleriPage from "@/components/pages/KulupIslemleriPage";

interface Tab { id: string; title: string; icon: React.ElementType; }

const MODULE_CONFIG: Record<string, { title: string; icon: React.ElementType }> = {
  "aday-uye":            { title: "Satış İşlemleri",      icon: Users    },
  "uyelik-islemleri":    { title: "Üyelik İşlemleri",    icon: Bookmark },
  "kampanya-islemleri":  { title: "Kampanya İşlemleri",  icon: Sparkles },
  "tahsilat-islemleri":  { title: "Tahsilat İşlemleri",  icon: Banknote  },
  "kulup-islemleri":     { title: "Kulüp İşlemleri",     icon: Building2 },
};

// Concave corners live INSIDE each tab button so they move with it during drag.
// Junction is now just a spacer + optional divider.
function Junction({ leftActive, rightActive }: { leftActive: boolean; rightActive: boolean }) {
  return (
    <div className="relative w-3 h-9 self-end shrink-0">
      {!leftActive && !rightActive && (
        <div className="absolute top-2 bottom-3 left-1/2 w-px -translate-x-1/2 bg-white/20" />
      )}
    </div>
  );
}

// Both concaves — used by module tabs (inline, moves with tab during drag)
function TabConcaves() {
  return (
    <>
      <div className="absolute -left-3 bottom-0 w-3 h-3 overflow-hidden bg-[#f5f8fa] pointer-events-none">
        <div className="w-full h-full bg-[#171a1d] rounded-br-lg" />
      </div>
      <div className="absolute -right-3 bottom-0 w-3 h-3 overflow-hidden bg-[#f5f8fa] pointer-events-none">
        <div className="w-full h-full bg-[#171a1d] rounded-bl-lg" />
      </div>
    </>
  );
}

// Standalone sibling concave — used for Anasayfa's LEFT side
// (Anasayfa is the first flex item so -left-3 would escape the overflow-hidden container)
function StandaloneConcave({ side, visible }: { side: "left" | "right"; visible: boolean }) {
  return (
    <div className={`self-end w-3 h-3 shrink-0 overflow-hidden bg-[#f5f8fa] ${visible ? "visible" : "invisible"}`}>
      <div className={`w-full h-full bg-[#171a1d] ${side === "left" ? "rounded-br-lg" : "rounded-bl-lg"}`} />
    </div>
  );
}

export default function Page() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeView, setActiveView] = useState<string>("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [clubMenuOpen, setClubMenuOpen] = useState(false);

  // Drag state — use refs to avoid stale closures in pointer handlers
  const [dragState, setDragStateRaw] = useState<{
    dragIndex: number; hoverIndex: number; translateX: number;
  } | null>(null);
  const dragStateRef = useRef(dragState);
  const setDragState = (s: typeof dragState) => {
    dragStateRef.current = s;
    setDragStateRaw(s);
  };

  const isDraggingRef = useRef(false);
  const dragIdxRef    = useRef(-1);
  const hasMoved      = useRef(false);
  const pointerStartX = useRef(0);
  const tabPositions  = useRef<{ center: number; width: number }[]>([]);
  const tabWidths     = useRef<number[]>([]);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // FLIP animation refs
  const preFlipPositions = useRef<Map<string, number>>(new Map());
  const flipNeeded = useRef(false);
  const flipSkipId = useRef<string | null>(null); // dragged tab skips FLIP (snaps instantly)

  useLayoutEffect(() => {
    if (!flipNeeded.current || !tabsContainerRef.current) return;
    flipNeeded.current = false;

    // The dragged tab: kill any pending CSS transition so it snaps to new position instantly.
    // (Without this, the browser would animate from old-offset in new DOM position → wrong direction.)
    if (flipSkipId.current) {
      const draggedBtn = tabsContainerRef.current.querySelector<HTMLElement>(
        `[data-tab-id="${flipSkipId.current}"]`
      );
      if (draggedBtn) draggedBtn.style.transition = "none";
      flipSkipId.current = null;
    }

    // FLIP for displaced (non-dragged) tabs
    const btns = tabsContainerRef.current.querySelectorAll<HTMLElement>("[data-tab-id]");
    const invert: { el: HTMLElement; dx: number }[] = [];

    btns.forEach(btn => {
      const id = btn.dataset.tabId!;
      const pre = preFlipPositions.current.get(id);
      if (pre == null) return;
      const now = btn.getBoundingClientRect().left;
      const dx = pre - now;
      if (Math.abs(dx) < 1) return;
      invert.push({ el: btn, dx });
    });

    if (!invert.length) return;

    // Apply inverse transform instantly (no transition)
    invert.forEach(({ el, dx }) => {
      el.style.transition = "none";
      el.style.transform = `translateX(${dx}px)`;
    });

    // Force reflow so browser registers the starting position
    tabsContainerRef.current.getBoundingClientRect();

    // Now animate to natural (zero) position
    invert.forEach(({ el }) => {
      el.style.transition = "transform 300ms cubic-bezier(0.2, 0, 0, 1)";
      el.style.transform = "";
    });

    const timeout = setTimeout(() => {
      invert.forEach(({ el }) => {
        el.style.transition = "";
        el.style.transform = "";
      });
    }, 320);

    return () => clearTimeout(timeout);
  });

  /* ── Module tab management ── */
  const handleOpenModule = (id: string) => {
    const config = MODULE_CONFIG[id];
    if (!config) return;
    setTabs(prev => prev.find(t => t.id === id) ? prev : [...prev, { id, ...config }]);
    setActiveView(id);
  };

  const closeTab = (id: string) => {
    setTabs(prev => {
      const idx  = prev.findIndex(t => t.id === id);
      const next = prev.filter(t => t.id !== id);
      if (activeView === id) setActiveView(next[idx - 1]?.id ?? next[0]?.id ?? "home");
      return next;
    });
  };

  /* ── Pointer-based drag ── */
  const startDrag = (e: React.PointerEvent<HTMLButtonElement>, index: number) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    hasMoved.current    = false;
    isDraggingRef.current = true;
    dragIdxRef.current  = index;
    pointerStartX.current = e.clientX;

    // Snapshot tab positions for the whole drag gesture
    if (tabsContainerRef.current) {
      const btns = tabsContainerRef.current.querySelectorAll<HTMLElement>("[data-tab-idx]");
      const m = Array.from(btns).map(b => {
        const r = b.getBoundingClientRect();
        return { center: r.left + r.width / 2, width: r.width };
      });
      tabPositions.current = m;
      tabWidths.current    = m.map(x => x.width);
    }

    setDragState({ dragIndex: index, hoverIndex: index, translateX: 0 });
  };

  const moveDrag = (e: React.PointerEvent<HTMLButtonElement>, index: number) => {
    if (!isDraggingRef.current || dragIdxRef.current !== index) return;

    const translateX = e.clientX - pointerStartX.current;
    if (Math.abs(translateX) > 3) hasMoved.current = true;

    const positions = tabPositions.current;
    if (!positions.length) return;

    const newCenter = positions[index].center + translateX;
    let closestIdx = index, closestDist = Infinity;
    positions.forEach((p, i) => {
      const d = Math.abs(p.center - newCenter);
      if (d < closestDist) { closestDist = d; closestIdx = i; }
    });

    setDragState({ dragIndex: index, hoverIndex: closestIdx, translateX });
  };

  const endDrag = (index: number) => {
    if (!isDraggingRef.current || dragIdxRef.current !== index) return;
    isDraggingRef.current = false;
    dragIdxRef.current = -1;

    const s = dragStateRef.current;
    if (s && s.dragIndex !== s.hoverIndex) {
      const { dragIndex, hoverIndex } = s;

      // Record current visual positions BEFORE reorder (FLIP: First)
      // Skip the dragged tab — it will snap instantly to its new position
      flipSkipId.current = tabs[dragIndex]?.id ?? null;
      if (tabsContainerRef.current) {
        const btns = tabsContainerRef.current.querySelectorAll<HTMLElement>("[data-tab-id]");
        preFlipPositions.current.clear();
        btns.forEach(btn => {
          const id = btn.dataset.tabId!;
          preFlipPositions.current.set(id, btn.getBoundingClientRect().left);
        });
        flipNeeded.current = true;
      }

      setTabs(prev => {
        const next = [...prev];
        const [removed] = next.splice(dragIndex, 1);
        next.splice(hoverIndex, 0, removed);
        return next;
      });
    }
    setDragState(null);
  };

  const getTabTransform = (index: number) => {
    if (!dragState) return "";
    const { dragIndex, hoverIndex, translateX } = dragState;
    if (index === dragIndex) return `translateX(${translateX}px)`;

    const shift = (tabWidths.current[dragIndex] ?? 150) + 12; // tab + junction
    if (hoverIndex > dragIndex && index > dragIndex && index <= hoverIndex)
      return `translateX(-${shift}px)`;
    if (hoverIndex < dragIndex && index >= hoverIndex && index < dragIndex)
      return `translateX(${shift}px)`;
    return "translateX(0)";
  };

  /* ── Layout ── */
  const homeActive  = activeView === "home";
  const sidebarWidth = !homeActive ? (sidebarCollapsed ? 56 : 256) : 56;

  return (
    <div className="h-screen bg-[#f5f8fa] flex flex-col">

      {/* Navbar */}
      <header className="bg-[#171a1d] text-white flex items-stretch h-12 shrink-0">

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
          width: sidebarWidth, flexShrink: 0, transition: "width 200ms" }}>
          <span className="font-black italic text-[14px] tracking-tighter text-white">
            MAC<span className="text-[#df1d2f] not-italic ml-0.5 text-base font-bold">+</span>
          </span>
        </div>

        {/* Tabs */}
        <div ref={tabsContainerRef} className="flex items-end flex-1 overflow-hidden select-none">

          {/* Sol concave — Anasayfa (sibling, not inside button — prevents overflow-hidden clipping) */}
          <StandaloneConcave side="left" visible={homeActive} />

          {/* Anasayfa — only RIGHT concave is inline */}
          <button
            onClick={() => setActiveView("home")}
            style={{ position: "relative", overflow: "visible", zIndex: homeActive ? 2 : 1 }}
            className={`flex items-center gap-2 px-4 h-9 rounded-t-lg text-xs font-medium transition-colors min-w-[120px] shrink-0 ${
              homeActive ? "bg-[#f5f8fa] text-slate-700" : "text-white/60 hover:bg-white/5"
            }`}
          >
            {homeActive && (
              <div className="absolute -right-3 bottom-0 w-3 h-3 overflow-hidden bg-[#f5f8fa] pointer-events-none">
                <div className="w-full h-full bg-[#171a1d] rounded-bl-lg" />
              </div>
            )}
            <Home className="w-4 h-4 shrink-0" />
            <span className="truncate">Anasayfa</span>
          </button>

          {/* Junction: Anasayfa | first tab */}
          {tabs.length > 0 ? (
            <Junction leftActive={homeActive} rightActive={activeView === tabs[0].id} />
          ) : null}

          {/* Module tabs */}
          {tabs.map((tab, index) => {
            const isActive   = activeView === tab.id;
            const Icon       = tab.icon;
            const nextTab    = tabs[index + 1];
            const isDragging = dragState?.dragIndex === index;
            const transform  = getTabTransform(index);

            return (
              <Fragment key={tab.id}>
                <button
                  data-tab-idx={index}
                  data-tab-id={tab.id}
                  onPointerDown={e => startDrag(e, index)}
                  onPointerMove={e => moveDrag(e, index)}
                  onPointerUp={() => endDrag(index)}
                  onPointerCancel={() => endDrag(index)}
                  onClick={() => { if (!hasMoved.current) setActiveView(tab.id); }}
                  style={{
                    transform,
                    overflow: "visible",
                    transition: isDragging ? "none" : "transform 250ms cubic-bezier(0.2, 0, 0, 1)",
                    zIndex:    isDragging ? 10 : isActive ? 2 : 1,
                    position:  "relative",
                  }}
                  className={`flex items-center gap-2 px-4 h-9 rounded-t-lg text-xs font-medium min-w-[120px] max-w-[200px] shrink-0 touch-none ${
                    isActive ? "bg-[#f5f8fa] text-slate-700" : "text-white/60 hover:bg-white/5"
                  } ${isDragging ? "cursor-grabbing shadow-lg" : "cursor-pointer"}`}
                >
                  {isActive && <TabConcaves />}
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-slate-500" : "text-white/40"}`} />
                  <span className="truncate flex-1 text-left">{tab.title}</span>
                  <span
                    onPointerDown={e => e.stopPropagation()}
                    onClick={e => { e.stopPropagation(); closeTab(tab.id); }}
                    className={`ml-1 shrink-0 cursor-pointer ${
                      isActive ? "text-slate-400 hover:text-slate-700" : "text-white/30 hover:text-white/60"
                    }`}
                  >
                    <X className="w-3 h-3" />
                  </span>
                </button>

                {nextTab ? (
                  <Junction leftActive={isActive} rightActive={activeView === nextTab.id} />
                ) : null}
              </Fragment>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 pr-4 text-white/80">
          <button className="hover:text-white transition-colors"><Phone className="w-4 h-4" /></button>
          <button className="hover:text-white transition-colors"><Bell className="w-4 h-4" /></button>
          <div className="relative border-l border-white/20 pl-3">
            <button
              onClick={() => setClubMenuOpen(prev => !prev)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-slate-400 flex items-center justify-center text-white text-[10px] font-bold">MA</div>
              <span className="text-xs text-white/80">Mars Athletic Club</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/60" />
            </button>
            {clubMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#171a1d] rounded-lg shadow-lg border border-white/10 py-1 z-50">
                <button className="w-full text-left px-4 py-2 text-xs text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                  Kullanıcı Yönetimi
                </button>
                <div className="mx-3 h-px bg-white/10 my-1" />
                <button className="w-full text-left px-4 py-2 text-xs text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        </div>

      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden bg-[#171a1d]">

        <div className={`flex flex-1 overflow-hidden ${homeActive ? "" : "hidden"}`}>
          <HomePageContent onOpenModule={handleOpenModule} />
        </div>

        {tabs.length > 0 && (
          <div className={`flex flex-1 overflow-hidden ${!homeActive ? "" : "hidden"}`}>
            <Sidebar activeModuleId={activeView} collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />
            <div className="flex-1 overflow-hidden relative">
              {tabs.map(tab => (
                <div key={tab.id} className={`absolute inset-0 ${activeView === tab.id ? "flex" : "hidden"}`}>
                  {tab.id === "aday-uye"            && <AdayUyePage />}
                  {tab.id === "uyelik-islemleri"   && <UyelikIslemleriPage />}
                  {tab.id === "kampanya-islemleri" && <KampanyaIslemleriPage />}
                  {tab.id === "tahsilat-islemleri" && <TahsilatIslemleriPage />}
                  {tab.id === "kulup-islemleri"    && <KulupIslemleriPage />}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
