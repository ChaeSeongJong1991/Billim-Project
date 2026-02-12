import React from 'react';

export default function DashboardPage() {
    return (
        <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-screen">

            {/* 1. 상단 타이틀 & 날짜 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                        반갑습니다, 김건물님 👋
                    </h1>
                    <p className="text-slate-500 mt-1">오늘도 빌림과 함께 여유로운 하루 되세요.</p>
                </div>
                <div className="text-sm bg-white px-4 py-2 rounded-lg border border-slate-200 text-slate-600 shadow-sm">
                    📅 2025년 12월 22일 (월)
                </div>
            </div>

            {/* 2. 주요 지표 카드 (KPI) - 반응형 (모바일 1열 -> PC 4열) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Card 1: 수납 현황 (가장 중요) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-4 opacity-10">
                        <span className="text-6xl">💰</span>
                    </div>
                    <div className="text-slate-500 text-sm font-medium mb-1">이번 달 수납률</div>
                    <div className="text-3xl font-bold text-blue-600">85%</div>
                    <div className="text-xs text-slate-400 mt-2">
                        전체 1,000만원 중 <span className="text-slate-800 font-bold">850만원</span> 완료
                    </div>
                </div>

                {/* Card 2: 미납 금액 (경고) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-red-500">
                    <div className="text-slate-500 text-sm font-medium mb-1">현재 미납액</div>
                    <div className="text-3xl font-bold text-red-500">150만원</div>
                    <div className="text-xs text-red-400 mt-2 font-medium">
                        🚨 3건의 미납이 있습니다
                    </div>
                </div>

                {/* Card 3: 공실 현황 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="text-slate-500 text-sm font-medium mb-1">총 관리 호실</div>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-slate-800">20개</span>
                        <span className="text-sm text-slate-500 mb-1">중</span>
                    </div>
                    <div className="flex gap-2 mt-3 text-xs">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded">🟢 19 입주</span>
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded">⚪ 1 공실</span>
                    </div>
                </div>

                {/* Card 4: 계약 만료 예정 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="text-slate-500 text-sm font-medium mb-1">계약 만료 (30일 내)</div>
                    <div className="text-3xl font-bold text-orange-500">1건</div>
                    <div className="text-xs text-slate-400 mt-2">
                        102호 이영희 (D-24)
                    </div>
                </div>
            </div>

            {/* 3. 메인 콘텐츠 영역 (2단 레이아웃: 왼쪽 큰 영역, 오른쪽 사이드) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 왼쪽: 미납자 리스트 (Quick Action) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-800">⚠️ 미납 관리 필요 (3건)</h2>
                        <button className="text-sm text-blue-600 hover:underline">전체 장부 보기 →</button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                                <tr>
                                    <th className="p-4">호실/세입자</th>
                                    <th className="p-4 text-right">미납금액</th>
                                    <th className="p-4 text-center">상태</th>
                                    <th className="p-4 text-right hidden sm:table-cell">조치</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr className="hover:bg-slate-50">
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800">201호 홍길동</div>
                                        <div className="text-xs text-slate-400">연체 +5일</div>
                                    </td>
                                    <td className="p-4 text-right font-medium text-red-600">500,000원</td>
                                    <td className="p-4 text-center">
                                        <span className="inline-block px-2 py-1 bg-red-100 text-red-600 text-xs rounded-md font-bold">미납</span>
                                    </td>
                                    <td className="p-4 text-right hidden sm:table-cell">
                                        <button className="bg-blue-600 text-white text-xs px-3 py-2 rounded hover:bg-blue-700">수납처리</button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50">
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800">304호 김철수</div>
                                        <div className="text-xs text-slate-400">연체 +2일</div>
                                    </td>
                                    <td className="p-4 text-right font-medium text-red-600">450,000원</td>
                                    <td className="p-4 text-center">
                                        <span className="inline-block px-2 py-1 bg-red-100 text-red-600 text-xs rounded-md font-bold">미납</span>
                                    </td>
                                    <td className="p-4 text-right hidden sm:table-cell">
                                        <button className="bg-blue-600 text-white text-xs px-3 py-2 rounded hover:bg-blue-700">수납처리</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {/* 모바일용 버튼 (테이블 밖으로 뺌) */}
                        <div className="p-4 sm:hidden border-t border-slate-100 bg-slate-50 text-center">
                            <span className="text-xs text-slate-500">→ 모바일에서는 상세 페이지에서 처리하세요</span>
                        </div>
                    </div>
                </div>

                {/* 오른쪽: 최근 활동 & 알림 */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-800">🔔 최근 활동</h2>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                                <div>
                                    <p className="text-sm text-slate-800 font-medium">101호 박민수님 입금 완료</p>
                                    <p className="text-xs text-slate-400">방금 전</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-2 h-2 mt-2 rounded-full bg-orange-500 flex-shrink-0"></div>
                                <div>
                                    <p className="text-sm text-slate-800 font-medium">202호 유지보수 요청 (도배)</p>
                                    <p className="text-xs text-slate-400">1시간 전</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-2 h-2 mt-2 rounded-full bg-slate-300 flex-shrink-0"></div>
                                <div>
                                    <p className="text-sm text-slate-800 font-medium">301호 계약서 생성됨</p>
                                    <p className="text-xs text-slate-400">어제</p>
                                </div>
                            </li>
                        </ul>
                        <button className="w-full mt-6 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                            모든 알림 보기
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
