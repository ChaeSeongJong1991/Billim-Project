'use client';

import React, { useMemo } from 'react';
import { useBuildings } from '@/hooks/useBuildings';
import { useRooms } from '@/hooks/useRooms';
import { useDashboardSummary } from '@/hooks/usePayments';
import { useAuthStore } from '@/store/useAuthStore';

function RoomStats({ buildingId }: { buildingId: number }) {
    const { data: rooms = [], isLoading } = useRooms(buildingId);
    const stats = useMemo(() => ({
        total: rooms.length,
        occupied: rooms.filter(r => r.status === 'OCCUPIED').length,
        vacant: rooms.filter(r => r.status === 'VACANT').length,
        maintenance: rooms.filter(r => r.status === 'MAINTENANCE').length,
    }), [rooms]);

    if (isLoading) return <div className="animate-pulse h-20 bg-slate-100 rounded-2xl" />;

    const occupancyRate = stats.total > 0 ? Math.round((stats.occupied / stats.total) * 100) : 0;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-slate-500 text-sm font-medium mb-1">총 관리 호실</div>
            <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-slate-800">{stats.total}개</span>
                <span className="text-sm text-slate-500 mb-1">입주율 {occupancyRate}%</span>
            </div>
            <div className="flex gap-2 mt-3 text-xs">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">🟢 {stats.occupied} 입주</span>
                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded">⚪ {stats.vacant} 공실</span>
                {stats.maintenance > 0 && (
                    <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded">🔧 {stats.maintenance} 수리중</span>
                )}
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const { data: buildings = [], isLoading: isBuildingsLoading } = useBuildings();
    const { data: summary } = useDashboardSummary();
    const user = useAuthStore((state) => state.user);
    const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });

    return (
        <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                        반갑습니다, {user?.name ?? '사용자'}님 👋
                    </h1>
                    <p className="text-slate-500 mt-1">오늘도 빌림과 함께 여유로운 하루 되세요.</p>
                </div>
                <div className="text-sm bg-white px-4 py-2 rounded-lg border border-slate-200 text-slate-600 shadow-sm">
                    📅 {today}
                </div>
            </div>

            {/* KPI 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 관리 건물 수 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-4 opacity-10"><span className="text-6xl">🏢</span></div>
                    <div className="text-slate-500 text-sm font-medium mb-1">관리 중인 건물</div>
                    {isBuildingsLoading
                        ? <div className="animate-pulse h-9 w-16 bg-slate-100 rounded mt-1" />
                        : <div className="text-3xl font-bold text-blue-600">{buildings.length}개</div>}
                    <div className="text-xs text-slate-400 mt-2">
                        {buildings.map(b => b.name).join(', ') || '등록된 건물 없음'}
                    </div>
                </div>

                {/* 호실 통계 */}
                {buildings.length > 0
                    ? <RoomStats buildingId={buildings[0].id} />
                    : (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="text-slate-500 text-sm font-medium mb-1">총 관리 호실</div>
                            <div className="text-3xl font-bold text-slate-300">-</div>
                            <div className="text-xs text-slate-400 mt-2">건물을 먼저 등록해주세요</div>
                        </div>
                    )}

                {/* 미납액 - 실데이터 연동 */}
                <a href="/admin/ledger" className="block bg-white p-6 rounded-2xl shadow-sm border-l-4 border-red-400 hover:shadow-md transition">
                    <div className="text-slate-500 text-sm font-medium mb-1">현재 미납액</div>
                    {summary ? (
                        <>
                            <div className={`text-3xl font-bold ${summary.unpaidAmount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                {summary.unpaidAmount > 0 ? `${(summary.unpaidAmount / 10000).toFixed(0)}만원` : '없음'}
                            </div>
                            <div className="text-xs text-slate-400 mt-2 font-medium">
                                {summary.unpaidCount > 0 ? `🚨 ${summary.unpaidCount}건의 미납이 있습니다` : '✅ 미납 없음'}
                            </div>
                        </>
                    ) : (
                        <div className="animate-pulse h-9 w-24 bg-slate-100 rounded mt-1" />
                    )}
                </a>

                {/* 계약 만료 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="text-slate-500 text-sm font-medium mb-1">계약 만료 (30일 내)</div>
                    <div className="text-3xl font-bold text-slate-300">-</div>
                    <div className="text-xs text-slate-400 mt-2">계약 알림 기능 개발 후 연동 예정</div>
                </div>
            </div>

            {/* 내 건물 목록 */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">🏢 내 건물 현황</h2>
                    <a href="/admin/units" className="text-sm text-blue-600 hover:underline">전체 관리 →</a>
                </div>

                {isBuildingsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => <div key={i} className="animate-pulse h-32 bg-white rounded-2xl border border-slate-100" />)}
                    </div>
                ) : buildings.length === 0 ? (
                    <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                        <p className="text-slate-400 text-lg mb-2">아직 등록된 건물이 없습니다.</p>
                        <a href="/admin/units" className="inline-block mt-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                            + 첫 번째 건물 등록하기
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {buildings.map(building => (
                            <a key={building.id} href="/admin/units" className="block bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition group">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition">{building.name}</h3>
                                        <p className="text-slate-400 text-sm mt-1 truncate">{building.address}</p>
                                    </div>
                                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">{building.type}</span>
                                </div>
                                <div className="mt-4 text-xs text-blue-500 font-bold">호실 관리 →</div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
