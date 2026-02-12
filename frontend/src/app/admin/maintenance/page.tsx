'use client';

import React, { useState } from 'react';

// 0. 더미 데이터 (티켓 목록)
const maintenanceData = [
    {
        id: 1,
        date: '2025-12-22',
        room: '201호',
        category: '배관/누수',
        description: '화장실 천장에서 물이 똑똑 떨어집니다. 곰팡이가 생기려고 해요.',
        priority: 'URGENT', // 긴급
        status: 'NEW',
        cost: 0,
        photos: 2
    },
    {
        id: 2,
        date: '2025-12-20',
        room: '101호',
        category: '전기/조명',
        description: '현관 센서등이 작동하지 않습니다. 전구 교체해도 안 되네요.',
        priority: 'NORMAL',
        status: 'IN_PROGRESS',
        cost: 0,
        photos: 1
    },
    {
        id: 3,
        date: '2025-12-15',
        room: '302호',
        category: '가전옵션',
        description: '세탁기 탈수 시 소음이 너무 심합니다.',
        priority: 'LOW',
        status: 'DONE',
        cost: 150000, // 수리비 발생
        photos: 0
    },
];

export default function MaintenancePage() {

    const [activeTab, setActiveTab] = useState('ALL'); // ALL, DOING, DONE
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 우선순위 배지
    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'URGENT': return <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">🔥 긴급</span>;
            case 'NORMAL': return <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-bold">보통</span>;
            case 'LOW': return <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs font-bold">낮음</span>;
            default: return null;
        }
    };

    // 상태 배지
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'NEW': return <span className="text-blue-600 font-bold text-xs">신규 접수</span>;
            case 'IN_PROGRESS': return <span className="text-orange-500 font-bold text-xs">처리 중...</span>;
            case 'DONE': return <span className="text-slate-400 font-bold text-xs line-through">처리 완료</span>;
            default: return null;
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-screen relative">

            {/* 1. 헤더 & 등록 버튼 */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">유지보수 / 민원</h1>
                    <p className="text-slate-500 text-sm mt-1">세입자 요청사항과 수리 내역을 관리합니다.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-slate-900 hover:bg-black text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-slate-500/20 flex items-center justify-center gap-2"
                >
                    <span>🛠️ 새 유지보수 기록</span>
                </button>
            </div>

            {/* 2. 상태 탭 (Filters) */}
            <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
                {['ALL', 'DOING', 'DONE'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-3 font-bold text-sm transition border-b-2 whitespace-nowrap \${
              activeTab === tab 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
                    >
                        {tab === 'ALL' && '전체 보기'}
                        {tab === 'DOING' && '처리 중 (2)'}
                        {tab === 'DONE' && '완료된 내역'}
                    </button>
                ))}
            </div>

            {/* 3. 리스트 영역 */}
            <div className="space-y-4">

                {/* [MOBILE] 카드형 리스트 (md:hidden) */}
                <div className="block md:hidden space-y-4">
                    {maintenanceData.map((item) => (
                        <div
                            key={item.id}
                            className={`bg-white p-5 rounded-2xl shadow-sm border relative \${
                item.priority === 'URGENT' && item.status !== 'DONE' ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'
              }`}
                        >
                            {/* 긴급일 때만 표시되는 상단 경고바 */}
                            {item.priority === 'URGENT' && item.status !== 'DONE' && (
                                <div className="absolute top-0 left-0 right-0 bg-red-500 h-1"></div>
                            )}

                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-slate-800">{item.room}</span>
                                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{item.category}</span>
                                </div>
                                {getPriorityBadge(item.priority)}
                            </div>

                            <p className="text-slate-700 text-sm mb-4 line-clamp-2 leading-relaxed">
                                {item.description}
                            </p>

                            <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                                <div className="flex items-center gap-2">
                                    {getStatusBadge(item.status)}
                                    <span className="text-xs text-slate-300">|</span>
                                    <span className="text-xs text-slate-400">{item.date}</span>
                                </div>
                                {item.status === 'DONE' ? (
                                    <span className="text-slate-800 font-bold text-sm">비용: {item.cost.toLocaleString()}원</span>
                                ) : (
                                    <button className="text-blue-600 text-sm font-bold hover:underline">상세 / 처리 &rarr;</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* [PC] 테이블형 리스트 (hidden md:block) */}
                <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                            <tr>
                                <th className="p-4 w-24">우선순위</th>
                                <th className="p-4 w-32">접수일</th>
                                <th className="p-4 w-24">호실</th>
                                <th className="p-4 w-32">카테고리</th>
                                <th className="p-4">요청 내용</th>
                                <th className="p-4 w-32 text-center">상태</th>
                                <th className="p-4 w-32 text-right">비용</th>
                                <th className="p-4 w-24 text-center">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                            {maintenanceData.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition group">
                                    <td className="p-4">{getPriorityBadge(item.priority)}</td>
                                    <td className="p-4 text-slate-500">{item.date}</td>
                                    <td className="p-4 font-bold text-slate-800">{item.room}</td>
                                    <td className="p-4">
                                        <span className="bg-slate-100 px-2 py-1 rounded text-xs text-slate-600">{item.category}</span>
                                    </td>
                                    <td className="p-4 max-w-md truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:bg-white group-hover:shadow-lg group-hover:z-10 relative">
                                        {item.description}
                                        {item.photos > 0 && <span className="ml-2 text-xs text-blue-500">📷 {item.photos}</span>}
                                    </td>
                                    <td className="p-4 text-center">{getStatusBadge(item.status)}</td>
                                    <td className="p-4 text-right font-medium">
                                        {item.cost > 0 ? `\${item.cost.toLocaleString()}원` : '-'}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button className="text-slate-400 hover:text-blue-600 border border-slate-200 hover:border-blue-400 px-3 py-1 rounded transition text-xs">
                                            보기
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ========================================================================
          [MODAL] 새 유지보수 티켓 등록 팝업
         ======================================================================== */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">

                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800">🛠️ 유지보수 기록 등록</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">대상 호실</label>
                                    <select className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                        <option>호실 선택</option>
                                        <option>101호</option>
                                        <option>102호</option>
                                        <option>공용 공간 (복도/주차장)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">카테고리</label>
                                    <select className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                        <option>선택하세요</option>
                                        <option>배관/누수</option>
                                        <option>전기/조명</option>
                                        <option>냉난방/가전</option>
                                        <option>기타</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">요청 내용</label>
                                <textarea
                                    rows={4}
                                    placeholder="예: 변기가 막혀서 물이 내려가지 않습니다."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">우선순위</label>
                                    <div className="flex gap-2">
                                        <label className="flex-1 cursor-pointer">
                                            <input type="radio" name="priority" className="peer hidden" />
                                            <div className="px-3 py-2 rounded-lg border border-slate-200 text-center text-sm peer-checked:bg-slate-800 peer-checked:text-white transition hover:bg-slate-50">보통</div>
                                        </label>
                                        <label className="flex-1 cursor-pointer">
                                            <input type="radio" name="priority" className="peer hidden" />
                                            <div className="px-3 py-2 rounded-lg border border-slate-200 text-center text-sm text-red-500 peer-checked:bg-red-500 peer-checked:text-white peer-checked:border-red-500 transition hover:bg-red-50 font-bold">긴급</div>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">사진 첨부</label>
                                    <button className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-slate-400 text-sm hover:border-blue-400 hover:text-blue-500 transition">
                                        + 이미지 추가
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                            <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50">취소</button>
                            <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black shadow-lg shadow-slate-500/30">기록 저장</button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
