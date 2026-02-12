'use client'; // ★ 중요: 팝업(Modal) 상태 관리를 위해 클라이언트 컴포넌트로 전환

import React, { useState } from 'react';

// 0. 더미 데이터
const unitsData = [
    { id: 1, roomNumber: '101호', floor: 1, type: 'ONE_ROOM', status: 'OCCUPIED', tenant: '박민수', rent: 550000, deposit: 5000000, nextPayment: '2025-01-01' },
    { id: 2, roomNumber: '102호', floor: 1, type: 'ONE_ROOM', status: 'LATE', tenant: '최유리', rent: 500000, deposit: 5000000, nextPayment: '2024-12-20', overdueDays: 5 },
    { id: 3, roomNumber: '201호', floor: 2, type: 'TWO_ROOM', status: 'VACANT', tenant: null, rent: 0, deposit: 0, nextPayment: null },
    { id: 4, roomNumber: '202호', floor: 2, type: 'TWO_ROOM', status: 'MAINTENANCE', tenant: null, rent: 0, deposit: 0, nextPayment: null, note: '도배/장판 시공 중' },
    { id: 5, roomNumber: '203호', floor: 2, type: 'TWO_ROOM', status: 'VACANT', tenant: null, rent: 0, deposit: 0, nextPayment: null },
    { id: 6, roomNumber: '301호', floor: 3, type: 'THREE_ROOM', status: 'OCCUPIED', tenant: '김철수', rent: 800000, deposit: 10000000, nextPayment: '2025-01-05' },
];

export default function UnitsPage() {

    // ★ 건물 추가 모달 상태 관리
    const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);

    // 상태별 배지
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'OCCUPIED': return <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-xs font-bold">🟢 입주중</span>;
            case 'VACANT': return <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md text-xs font-bold border border-slate-200">⚪ 공실</span>;
            case 'LATE': return <span className="bg-red-100 text-red-600 px-2.5 py-1 rounded-md text-xs font-bold animate-pulse">🔴 체납중</span>;
            case 'MAINTENANCE': return <span className="bg-orange-100 text-orange-600 px-2.5 py-1 rounded-md text-xs font-bold">🔧 수리중</span>;
            default: return null;
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-screen relative">

            {/* 1. 헤더 & 액션 영역 */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">내 건물 관리</h1>
                    <p className="text-slate-500 text-sm mt-1">호실 상태를 확인하고 계약을 등록합니다.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">

                    {/* [수정됨] 건물 선택 영역 + 건물 추가 버튼 */}
                    <div className="flex gap-2">
                        <select className="flex-1 bg-white border border-slate-300 text-slate-700 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium shadow-sm">
                            <option>🏢 빌림빌라 A동 (총 8세대)</option>
                            <option>🏢 강남 오피스텔 (총 20세대)</option>
                        </select>
                        {/* 건물 추가 버튼 (아이콘) */}
                        <button
                            onClick={() => setIsBuildingModalOpen(true)}
                            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 px-3 rounded-xl shadow-sm tooltip-trigger"
                            title="새 건물 추가"
                        >
                            🏢+
                        </button>
                    </div>

                    {/* 호실 추가 버튼 */}
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2">
                        <span>+ 호실 추가</span>
                    </button>
                </div>
            </div>

            {/* 2. 요약 통계 */}
            <div className="flex gap-4 overflow-x-auto pb-2">
                <div className="flex-shrink-0 bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                    <span className="text-slate-500 text-sm font-medium">총 호실</span>
                    <span className="text-xl font-bold text-slate-800">6개</span>
                </div>
                <div className="flex-shrink-0 bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                    <span className="text-slate-500 text-sm font-medium">입주율</span>
                    <span className="text-xl font-bold text-blue-600">50%</span>
                </div>
                <div className="flex-shrink-0 bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                    <span className="text-slate-500 text-sm font-medium">공실</span>
                    <span className="text-xl font-bold text-slate-400">2개</span>
                </div>
            </div>

            {/* 3. 호실 리스트 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {unitsData.map((unit) => (
                    <div
                        key={unit.id}
                        className={`
              relative bg-white rounded-2xl p-6 shadow-sm border transition hover:shadow-md cursor-pointer group
              \${unit.status === 'LATE' ? 'border-red-200 ring-1 ring-red-100' : 'border-slate-200'}
            `}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-slate-800">{unit.roomNumber}</span>
                                    <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{unit.type === 'ONE_ROOM' ? '원룸' : '투룸'}</span>
                                </div>
                                <div className="text-xs text-slate-400 mt-1">{unit.floor}층</div>
                            </div>
                            {getStatusBadge(unit.status)}
                        </div>

                        <div className="space-y-3 min-h-[80px]">
                            {(unit.status === 'OCCUPIED' || unit.status === 'LATE') && (
                                <>
                                    <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                                        <span className="text-slate-500 text-sm">세입자</span>
                                        <span className="font-bold text-slate-800">{unit.tenant}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 text-sm">월 임대료</span>
                                        <span className="font-medium text-slate-800">{unit.rent.toLocaleString()}원</span>
                                    </div>
                                    {unit.status === 'LATE' && (
                                        <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg font-bold text-center mt-2">
                                            ⚠ {unit.overdueDays}일째 미납 중입니다
                                        </div>
                                    )}
                                </>
                            )}
                            {unit.status === 'VACANT' && (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-1 py-2">
                                    <span className="text-3xl opacity-30">🏚️</span>
                                    <span className="text-sm">현재 비어있는 방입니다.</span>
                                </div>
                            )}
                            {unit.status === 'MAINTENANCE' && (
                                <div className="bg-orange-50 rounded-lg p-3">
                                    <p className="text-orange-700 text-sm font-bold mb-1">작업 내용</p>
                                    <p className="text-orange-600 text-xs">{unit.note}</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                            {unit.status === 'VACANT' ? (
                                <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition">
                                    입주 등록하기
                                </button>
                            ) : (
                                <>
                                    <button className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-sm font-bold transition border border-slate-200">
                                        상세 정보
                                    </button>
                                    {unit.status === 'LATE' && (
                                        <button className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition">
                                            독촉 문자
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))}

                {/* 빈 카드 (호실 추가) */}
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition cursor-pointer min-h-[250px] group">
                    <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-blue-200 flex items-center justify-center text-2xl mb-3 transition">
                        +
                    </div>
                    <span className="font-bold">새 호실 등록</span>
                </div>
            </div>

            {/* ========================================================================
        4. [NEW] 건물 추가 모달 (Modal)
        ======================================================================== 
      */}
            {isBuildingModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">

                        {/* 모달 헤더 */}
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800">새 건물 등록</h3>
                            <button onClick={() => setIsBuildingModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl">
                                &times;
                            </button>
                        </div>

                        {/* 모달 본문 (폼) */}
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">건물 이름</label>
                                <input
                                    type="text"
                                    placeholder="예: 빌림빌라, 강남타워"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">건물 주소</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="도로명 주소 검색"
                                        className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button className="bg-slate-800 text-white px-4 rounded-xl text-sm font-bold">검색</button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">상세 주소 (선택)</label>
                                <input
                                    type="text"
                                    placeholder="동/호수 제외 (건물 전체 주소)"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* 모달 푸터 (버튼) */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                            <button
                                onClick={() => setIsBuildingModalOpen(false)}
                                className="flex-1 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition"
                            >
                                취소
                            </button>
                            <button
                                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition"
                            >
                                등록하기
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
