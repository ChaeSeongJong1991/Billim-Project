'use client';

import { useState } from 'react';
import { useBuildings } from '@/hooks/useBuildings';
import { useMonthlyReport, MonthlyRevenueItem } from '@/hooks/usePayments';

const MONTH_OPTIONS = [
    { value: 6,  label: '최근 6개월' },
    { value: 12, label: '최근 12개월' },
    { value: 24, label: '최근 24개월' },
];

function formatAmount(n: number) {
    if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}억`;
    if (n >= 10_000) return `${Math.floor(n / 10_000)}만`;
    return n.toLocaleString();
}

function KpiCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-5">
            <p className="text-xs text-slate-400 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
    );
}

function BarChart({ items }: { items: MonthlyRevenueItem[] }) {
    const maxBilled = Math.max(...items.map(i => i.totalBilled), 1);
    const BAR_H = 160;

    return (
        <div className="overflow-x-auto">
            <div className="min-w-max">
                <svg
                    viewBox={`0 0 ${items.length * 56 + 40} ${BAR_H + 50}`}
                    width={items.length * 56 + 40}
                    height={BAR_H + 50}
                    className="block"
                >
                    {/* 가이드 라인 */}
                    {[0.25, 0.5, 0.75, 1].map(ratio => {
                        const y = BAR_H - BAR_H * ratio + 10;
                        return (
                            <line key={ratio} x1="30" y1={y} x2={items.length * 56 + 30} y2={y}
                                stroke="#f1f5f9" strokeWidth="1" />
                        );
                    })}

                    {items.map((item, i) => {
                        const x = i * 56 + 40;
                        const billedH = maxBilled > 0 ? (item.totalBilled / maxBilled) * BAR_H : 0;
                        const paidH = maxBilled > 0 ? (item.totalPaid / maxBilled) * BAR_H : 0;

                        return (
                            <g key={`${item.year}-${item.month}`}>
                                {/* 청구 바 (연한 색) */}
                                <rect
                                    x={x - 12}
                                    y={BAR_H - billedH + 10}
                                    width={24}
                                    height={billedH}
                                    rx={4}
                                    fill="#bfdbfe"
                                />
                                {/* 수납 바 (진한 색) */}
                                {paidH > 0 && (
                                    <rect
                                        x={x - 12}
                                        y={BAR_H - paidH + 10}
                                        width={24}
                                        height={paidH}
                                        rx={4}
                                        fill="#3b82f6"
                                    />
                                )}
                                {/* 월 라벨 */}
                                <text x={x} y={BAR_H + 26} textAnchor="middle" fontSize={10} fill="#94a3b8">
                                    {item.month}월
                                </text>
                                {/* 징수율 */}
                                {item.totalBilled > 0 && (
                                    <text x={x} y={BAR_H - billedH + 5} textAnchor="middle" fontSize={9} fill="#64748b">
                                        {item.collectionRate}%
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* 범례 */}
                <div className="flex items-center gap-4 mt-2 px-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <div className="w-3 h-3 rounded bg-blue-200" /> 청구액
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <div className="w-3 h-3 rounded bg-blue-500" /> 수납액
                    </div>
                </div>
            </div>
        </div>
    );
}

function MonthTable({ items }: { items: MonthlyRevenueItem[] }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-xs">
                        <th className="text-left py-3 px-4 font-medium">기간</th>
                        <th className="text-right py-3 px-4 font-medium">청구액</th>
                        <th className="text-right py-3 px-4 font-medium">수납액</th>
                        <th className="text-right py-3 px-4 font-medium">미수액</th>
                        <th className="text-right py-3 px-4 font-medium">징수율</th>
                        <th className="text-right py-3 px-4 font-medium">건수</th>
                    </tr>
                </thead>
                <tbody>
                    {[...items].reverse().map(item => {
                        const rateColor = item.collectionRate >= 90
                            ? 'text-green-600'
                            : item.collectionRate >= 70
                            ? 'text-amber-600'
                            : 'text-red-500';
                        return (
                            <tr key={`${item.year}-${item.month}`} className="border-b border-slate-50 hover:bg-slate-50 transition">
                                <td className="py-3 px-4 font-medium text-slate-700">
                                    {item.year}.{String(item.month).padStart(2, '0')}
                                </td>
                                <td className="py-3 px-4 text-right text-slate-600">
                                    {item.totalBilled > 0 ? item.totalBilled.toLocaleString() + '원' : '—'}
                                </td>
                                <td className="py-3 px-4 text-right text-blue-600 font-medium">
                                    {item.totalPaid > 0 ? item.totalPaid.toLocaleString() + '원' : '—'}
                                </td>
                                <td className="py-3 px-4 text-right text-red-500">
                                    {item.unpaidAmount > 0 ? item.unpaidAmount.toLocaleString() + '원' : '—'}
                                </td>
                                <td className={`py-3 px-4 text-right font-semibold ${rateColor}`}>
                                    {item.totalBilled > 0 ? `${item.collectionRate}%` : '—'}
                                </td>
                                <td className="py-3 px-4 text-right text-slate-400">{item.paymentCount}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default function ReportsPage() {
    const { data: buildings = [] } = useBuildings();
    const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
    const [monthsRange, setMonthsRange] = useState(12);

    const buildingId = selectedBuildingId ?? (buildings[0]?.id ?? null);
    const { data: report, isLoading } = useMonthlyReport(buildingId, monthsRange);

    return (
        <div className="p-6 space-y-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">수익 리포트</h1>
                    <p className="text-sm text-slate-400 mt-0.5">월별 청구·수납 현황 분석</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* 건물 선택 */}
                    {buildings.length > 1 && (
                        <select
                            value={buildingId ?? ''}
                            onChange={e => setSelectedBuildingId(Number(e.target.value))}
                            className="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {buildings.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    )}

                    {/* 기간 선택 */}
                    <div className="flex bg-slate-100 rounded-lg p-1 gap-0.5">
                        {MONTH_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setMonthsRange(opt.value)}
                                className={`text-xs px-3 py-1.5 rounded-md font-medium transition ${
                                    monthsRange === opt.value
                                        ? 'bg-white text-slate-800 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {buildings.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <p className="text-lg font-medium">등록된 건물이 없습니다</p>
                    <p className="text-sm mt-1">건물을 먼저 등록해주세요.</p>
                </div>
            ) : isLoading || !report ? (
                <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
                    리포트를 불러오는 중...
                </div>
            ) : (
                <>
                    {/* 건물명 + 기간 표시 */}
                    <p className="text-sm text-slate-500">
                        <span className="font-medium text-slate-700">{report.buildingName}</span>
                        &nbsp;· 최근 {monthsRange}개월 합산
                    </p>

                    {/* KPI 카드 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <KpiCard
                            label="총 청구액"
                            value={`${formatAmount(report.totalBilled)}원`}
                            color="text-slate-800"
                        />
                        <KpiCard
                            label="총 수납액"
                            value={`${formatAmount(report.totalPaid)}원`}
                            color="text-blue-600"
                        />
                        <KpiCard
                            label="미수 합계"
                            value={`${formatAmount(report.totalBilled - report.totalPaid)}원`}
                            color="text-red-500"
                        />
                        <KpiCard
                            label="평균 징수율"
                            value={`${report.avgCollectionRate}%`}
                            sub={report.avgCollectionRate >= 90 ? '우수' : report.avgCollectionRate >= 70 ? '보통' : '주의'}
                            color={
                                report.avgCollectionRate >= 90
                                    ? 'text-green-600'
                                    : report.avgCollectionRate >= 70
                                    ? 'text-amber-600'
                                    : 'text-red-500'
                            }
                        />
                    </div>

                    {/* 바 차트 */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h2 className="text-sm font-semibold text-slate-700 mb-4">월별 청구 vs 수납</h2>
                        {report.months.every(m => m.totalBilled === 0) ? (
                            <p className="text-sm text-slate-400 py-8 text-center">이 기간에 청구 데이터가 없습니다.</p>
                        ) : (
                            <BarChart items={report.months} />
                        )}
                    </div>

                    {/* 상세 테이블 */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h2 className="text-sm font-semibold text-slate-700">월별 상세 내역</h2>
                        </div>
                        <MonthTable items={report.months} />
                    </div>
                </>
            )}
        </div>
    );
}
