import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-slate-50">

            {/* 1. PC용 사이드바 (md 이상에서만 보임) */}
            <aside className="hidden md:flex w-64 flex-col bg-slate-900 text-white fixed h-full z-10">
                <div className="h-16 flex items-center px-6 border-b border-slate-700 font-bold text-xl tracking-tight">
                    Billim <span className="text-blue-400 ml-1">Admin</span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {/* 활성화된 메뉴 스타일 예시 (bg-blue-600) */}
                    <a href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-xl text-white font-medium shadow-lg shadow-blue-900/50">
                        <span>📊</span> 대시보드
                    </a>
                    <a href="/admin/units" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition">
                        <span>🏢</span> 내 건물 관리
                    </a>
                    <a href="/admin/ledger" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition">
                        <span>💰</span> 수납 장부
                    </a>
                    <a href="/admin/maintenance" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition">
                        <span>🛠</span> 유지보수
                    </a>
                </nav>

                <div className="p-4 border-t border-slate-700">
                    <button className="flex items-center gap-3 text-slate-400 hover:text-white text-sm">
                        <span>🚪</span> 로그아웃
                    </button>
                </div>
            </aside>

            {/* 2. 메인 영역 Wrapper */}
            <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">

                {/* 모바일용 헤더 (md 미만에서만 보임) */}
                <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-20">
                    <span className="font-bold text-lg text-slate-800">Billim Admin</span>
                    <button className="text-slate-500">
                        {/* 햄버거 아이콘 */}
                        ☰
                    </button>
                </header>

                {/* 실제 페이지 내용이 들어가는 곳 */}
                <main className="flex-1">
                    {children}
                </main>

            </div>
        </div>
    );
}
