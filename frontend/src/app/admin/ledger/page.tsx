import React from 'react';

// 0. 더미 데이터 (백엔드 연동 전 UI 확인용)
// PAYMENT_RECORDS 테이블 + TENANTS 정보를 합친 형태
const ledgerData = [
    {
        id: 1,
        room: '101호',
        tenant: '박민수',
        amount: 550000,
        status: 'PAID',
        paymentDate: '2025-12-01',
        method: '자동이체',
        memo: ''
    },
    {
        id: 2,
        room: '102호',
        tenant: '최유리',
        amount: 500000,
        status: 'UNPAID',
        paymentDate: null,
        method: null,
        memo: '',
        overdueDays: 5
    },
    {
        id: 3,
        room: '201호',
        tenant: '김지성',
        amount: 600000,
        status: 'PARTIAL',
        paidAmount: 300000, // 30만원만 냄
        paymentDate: '2025-12-05',
        method: '계좌이체',
        memo: '나머지는 10일에 입금 예정'
    },
    {
        id: 4,
        room: '301호',
        tenant: '이영희',
        amount: 800000,
        status: 'PAID',
        paymentDate: '2025-11-30',
        method: '현금',
        memo: ''
    },
];

export default function LedgerPage() {

    // 상태 배지 렌더링 함수
    const renderStatusBadge = (status: string) => {
        switch (status) {
            case 'PAID':
                return <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-bold">✅ 완납</span>;
            case 'UNPAID':
                return <span className="bg-red-100 text-red-600 px-2.5 py-0.5 rounded-full text-xs font-bold">🔴 미납</span>;
            case 'PARTIAL':
                return <span className="bg-orange-100 text-orange-600 px-2.5 py-0.5 rounded-full text-xs font-bold">⚠️ 부분납부</span>;
            default:
                return null;
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-screen">

            {/* 1. 상단 헤더 (월 선택 & 통계) */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">

                {/* 월 선택기 */}
                <div className="flex items-center gap-4">
                    <button className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">◀</button>
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-slate-800">2025년 12월</h2>
                        <p className="text-xs text-slate-400">총 청구액: 2,450,000원</p>
                    </div>
                    <button className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">▶</button>
                </div>

                {/* 요약 통계 */}
                <div className="flex gap-6 text-sm">
                    <div className="text-center">
                        <div className="text-slate-400 text-xs">징수율</div>
                        <div className="font-bold text-blue-600 text-lg">65%</div>
                    </div>
                    <div className="w-px h-8 bg-slate-200"></div>
                    <div className="text-center">
                        <div className="text-slate-400 text-xs">미수금</div>
                        <div className="font-bold text-red-500 text-lg">80만원</div>
                    </div>
                </div>
            </div>

            {/* 2. 필터 바 */}
            <div className="flex justify-between items-center">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="호실 또는 이름 검색"
                        className="pl-9 pr-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm w-48 md:w-64"
                    />
                    <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
                </div>

                <div className="flex gap-2">
                    <button className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm">
                        📥 엑셀 다운로드
                    </button>
                    <button className="px-3 py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-sm font-bold hover:bg-blue-100">
                        미납만 보기
                    </button>
                </div>
            </div>

            {/* ==================================================================================== */}
            {/* 3-A. [MOBILE VIEW] 모바일용 카드 리스트 (md:hidden)                                     */}
            {/* ==================================================================================== */}
            <div className="block md:hidden space-y-4">
                {ledgerData.map((item) => (
                    <div
                        key={item.id}
                        className={`bg-white p-5 rounded-xl shadow-sm border relative overflow-hidden \${item.status === 'UNPAID' ? 'border-red-200' : 'border-slate-200'}`}
                    >
                        {/* 왼쪽 띠 (상태 표시용) */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 \${item.status === 'PAID' ? 'bg-green-500' : item.status === 'UNPAID' ? 'bg-red-500' : 'bg-orange-400'}`}></div>

                        <div className="flex justify-between items-start mb-3 pl-2">
                            <div>
                                <span className="text-lg font-bold text-slate-800 mr-2">{item.room}</span>
                                <span className="text-slate-600">{item.tenant}</span>
                            </div>
                            {renderStatusBadge(item.status)}
                        </div>

                        <div className="pl-2 space-y-1 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">청구 금액</span>
                                <span className="font-medium text-slate-800">{item.amount.toLocaleString()}원</span>
                            </div>

                            {/* 부분 납부일 때 잔액 표시 */}
                            {item.status === 'PARTIAL' && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">납부됨</span>
                                    <span className="text-green-600 font-bold">{item.paidAmount?.toLocaleString()}원</span>
                                </div>
                            )}
                            {item.status === 'PARTIAL' && (
                                <div className="flex justify-between text-sm bg-red-50 p-1.5 rounded">
                                    <span className="text-red-500 font-bold">남은 금액</span>
                                    <span className="text-red-600 font-bold">{((item.amount) - (item.paidAmount || 0)).toLocaleString()}원</span>
                                </div>
                            )}

                            {/* 완납일 때 날짜 표시 */}
                            {item.status === 'PAID' && (
                                <div className="flex justify-between text-xs text-slate-400 mt-1">
                                    <span>납부일: {item.paymentDate}</span>
                                    <span>({item.method})</span>
                                </div>
                            )}
                        </div>

                        {/* 액션 버튼 */}
                        <div className="pl-2">
                            {item.status !== 'PAID' ? (
                                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-95 transition">
                                    💳 수납 처리하기
                                </button>
                            ) : (
                                <button className="w-full bg-slate-100 text-slate-500 py-2 rounded-xl font-medium text-sm hover:bg-slate-200">
                                    수정 / 상세
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* ==================================================================================== */}
            {/* 3-B. [PC VIEW] PC용 테이블 뷰 (hidden md:block)                                         */}
            {/* ==================================================================================== */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wide border-b border-slate-200">
                        <tr>
                            <th className="p-5 font-semibold">호실</th>
                            <th className="p-5 font-semibold">세입자</th>
                            <th className="p-5 font-semibold text-right">청구 금액</th>
                            <th className="p-5 font-semibold text-center">납부 상태</th>
                            <th className="p-5 font-semibold text-right">실납부액 / 잔액</th>
                            <th className="p-5 font-semibold">납부일/메모</th>
                            <th className="p-5 font-semibold text-center">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                        {ledgerData.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition">
                                <td className="p-5 font-bold text-slate-800">{item.room}</td>
                                <td className="p-5 font-medium">{item.tenant}</td>
                                <td className="p-5 text-right font-medium text-slate-600">{item.amount.toLocaleString()}원</td>

                                {/* 상태 */}
                                <td className="p-5 text-center">
                                    {renderStatusBadge(item.status)}
                                    {item.overdueDays && (
                                        <div className="text-xs text-red-500 font-bold mt-1">+{item.overdueDays}일 연체</div>
                                    )}
                                </td>

                                {/* 실납부/잔액 */}
                                <td className="p-5 text-right">
                                    {item.status === 'PAID' ? (
                                        <span className="text-slate-400">-</span>
                                    ) : item.status === 'PARTIAL' ? (
                                        <div className="flex flex-col items-end">
                                            <span className="text-green-600 font-bold">{item.paidAmount?.toLocaleString()}원</span>
                                            <span className="text-xs text-red-500 font-bold">(잔액: {((item.amount) - (item.paidAmount || 0)).toLocaleString()})</span>
                                        </div>
                                    ) : (
                                        <span className="text-slate-300">0원</span>
                                    )}
                                </td>

                                {/* 납부일/메모 */}
                                <td className="p-5 text-slate-500 text-xs">
                                    {item.paymentDate ? (
                                        <div>
                                            <div>{item.paymentDate}</div>
                                            <div className="text-slate-400">{item.method}</div>
                                        </div>
                                    ) : (
                                        <span className="text-slate-300">-</span>
                                    )}
                                    {item.memo && <div className="text-orange-500 mt-1">memo: {item.memo}</div>}
                                </td>

                                {/* 관리 버튼 */}
                                <td className="p-5 text-center">
                                    {item.status !== 'PAID' ? (
                                        <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg font-bold text-xs hover:bg-blue-700 shadow-sm transition transform hover:-translate-y-0.5">
                                            수납 처리
                                        </button>
                                    ) : (
                                        <button className="text-slate-400 hover:text-blue-600 underline text-xs">
                                            수정
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
