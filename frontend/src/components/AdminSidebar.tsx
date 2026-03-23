"use client";

import { usePathname, useRouter } from "next/navigation";
import { useBuildings } from "@/hooks/useBuildings";
import { useAuthStore } from "@/store/useAuthStore";
import { useExpiringContracts } from "@/hooks/useContracts";

interface NavItem {
  href: string;
  icon: string;
  label: string;
  requiresBuilding?: boolean;
  badgeKey?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin/dashboard",   icon: "📊", label: "대시보드" },
  { href: "/admin/units",       icon: "🏢", label: "내 건물 관리",  requiresBuilding: true },
  { href: "/admin/ledger",      icon: "💰", label: "수납 장부",     requiresBuilding: true },
  { href: "/admin/renewals",    icon: "🔄", label: "계약 갱신",     requiresBuilding: true, badgeKey: "expiring" },
  { href: "/admin/maintenance", icon: "🛠", label: "유지보수",      requiresBuilding: true },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { data: buildings = [] } = useBuildings();
  const { data: expiringContracts = [] } = useExpiringContracts(30);

  const hasBuildings = buildings.length > 0;
  const badges: Record<string, number> = {
    expiring: expiringContracts.length,
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="hidden md:flex w-64 flex-col bg-slate-900 text-white fixed h-full z-10">
      {/* 로고 */}
      <div className="h-16 flex items-center px-6 border-b border-slate-700 font-bold text-xl tracking-tight">
        Billim <span className="text-blue-400 ml-1">Admin</span>
      </div>

      {/* 메뉴 */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {NAV_ITEMS.map(({ href, icon, label, requiresBuilding, badgeKey }) => {
          const isDisabled = requiresBuilding && !hasBuildings;
          const isActive = pathname.startsWith(href);
          const badgeCount = badgeKey ? badges[badgeKey] ?? 0 : 0;

          if (isDisabled) {
            return (
              <div
                key={href}
                title="건물을 먼저 등록해주세요"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 cursor-not-allowed opacity-50 select-none"
              >
                <span>{icon}</span>
                <span>{label}</span>
                <span className="ml-auto text-xs">🔒</span>
              </div>
            );
          }

          return (
            <a
              key={href}
              href={href}
              className={
                isActive
                  ? "flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-xl text-white font-medium shadow-lg shadow-blue-900/50"
                  : "flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
              }
            >
              <span>{icon}</span>
              <span>{label}</span>
              {badgeCount > 0 && (
                <span className="ml-auto text-xs bg-amber-500 text-white font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {badgeCount}
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* 로그아웃 */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-slate-400 hover:text-white text-sm transition"
        >
          <span>🚪</span> 로그아웃
        </button>
      </div>
    </aside>
  );
}
