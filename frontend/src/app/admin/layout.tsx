import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-slate-50">

            {/* PC용 사이드바 */}
            <AdminSidebar />

            {/* 메인 영역 */}
            <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">

                {/* 모바일 헤더 */}
                <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-20">
                    <span className="font-bold text-lg text-slate-800">Billim Admin</span>
                    <button className="text-slate-500">☰</button>
                </header>

                <main className="flex-1">
                    {children}
                </main>

            </div>
        </div>
    );
}
