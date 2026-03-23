'use client';

import React, { useState } from 'react';
import { useBuildings } from '@/hooks/useBuildings';
import { useLedger, useCollectPayment, useCreatePayment, useDeletePayment, PaymentResponse, PaymentStatus } from '@/hooks/usePayments';
import { useContracts } from '@/hooks/useContracts';
import { useRooms } from '@/hooks/useRooms';
import { useModal } from '@/app/context/ModalContext';

const STATUS_BADGE: Record<PaymentStatus, React.ReactNode> = {
    PAID: <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-bold">✅ 완납</span>,
    UNPAID: <span className="bg-red-100 text-red-600 px-2.5 py-0.5 rounded-full text-xs font-bold">🔴 미납</span>,
    PARTIAL: <span className="bg-orange-100 text-orange-600 px-2.5 py-0.5 rounded-full text-xs font-bold">⚠️ 부분납부</span>,
};

// ─── 수납 처리 모달 ───────────────────────────────────────────────────────────
function CollectModal({
    payment, buildingId, year, month, onClose
}: {
    payment: PaymentResponse; buildingId: number; year: number; month: number; onClose: () => void;
}) {
    const [paidAmount, setPaidAmount] = useState(payment.billedAmount - payment.paidAmount);
    const [method, setMethod] = useState('계좌이체');
    const [memo, setMemo] = useState('');
    const { mutate: collect, isPending } = useCollectPayment(buildingId, year, month);
    const { showAlert } = useModal();

    const handleSubmit = () => {
        collect({ paymentId: payment.id, req: { paidAmount, paymentMethod: method, memo: memo || undefined } }, {
            onSuccess: () => { showAlert({ title: '수납 완료', message: '수납 처리가 완료되었습니다.', variant: 'SUCCESS' }); onClose(); },
            onError: () => showAlert({ title: '오류', message: '수납 처리에 실패했습니다.', variant: 'DANGER' }),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800">💳 수납 처리</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="bg-slate-50 rounded-xl p-4 text-sm">
                        <div className="flex justify-between"><span className="text-slate-500">호실</span><span className="font-bold">{payment.roomNumber}</span></div>
                        <div className="flex justify-between mt-1"><span className="text-slate-500">세입자</span><span className="font-bold">{payment.tenantName}</span></div>
                        <div className="flex justify-between mt-1"><span className="text-slate-500">청구액</span><span className="font-bold text-slate-800">{payment.billedAmount.toLocaleString()}원</span></div>
                        {payment.paidAmount > 0 && (
                            <div className="flex justify-between mt-1"><span className="text-slate-500">기납부액</span><span className="font-bold text-green-600">{payment.paidAmount.toLocaleString()}원</span></div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">납부 금액 (원)</label>
                        <input type="number" min={1} value={paidAmount} onChange={e => setPaidAmount(Number(e.target.value))}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">납부 방법</label>
                        <select value={method} onChange={e => setMethod(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                            <option>계좌이체</option>
                            <option>현금</option>
                            <option>자동이체</option>
                            <option>카드</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">메모 (선택)</label>
                        <input type="text" placeholder="특이사항" value={memo} onChange={e => setMemo(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50">취소</button>
                    <button onClick={handleSubmit} disabled={isPending || paidAmount <= 0}
                        className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 disabled:opacity-50">
                        {isPending ? '처리 중...' : '수납 완료'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── 수납 기록 추가 모달 ───────────────────────────────────────────────────────
function PaymentCreateModal({
    buildingId, initialYear, initialMonth, onClose
}: {
    buildingId: number; initialYear: number; initialMonth: number; onClose: () => void;
}) {
    const [contractId, setContractId] = useState<number | ''>('');
    const [year, setYear] = useState(initialYear);
    const [month, setMonth] = useState(initialMonth);
    const { data: contracts = [] } = useContracts(buildingId);
    const { data: rooms = [] } = useRooms(buildingId);
    const { mutate: createPayment, isPending } = useCreatePayment(buildingId, initialYear, initialMonth);
    const { showAlert } = useModal();

    const getRoomStatusText = (roomNum: string) => {
        const room = rooms.find(r => r.roomNumber === roomNum);
        return room && room.status !== 'OCCUPIED' ? ' (퇴실)' : '';
    };

    const handleSubmit = () => {
        if (!contractId) {
            showAlert({ title: '알림', message: '계약을 선택해주세요.', variant: 'DANGER' });
            return;
        }
        createPayment({ contractId: Number(contractId), billingYear: year, billingMonth: month }, {
            onSuccess: () => { 
                showAlert({ title: '성공', message: '청구서가 생성되었습니다.', variant: 'SUCCESS' }); 
                onClose(); 
            },
            onError: () => showAlert({ title: '오류', message: '청구서 생성에 실패했습니다. (이미 존재할 수 있습니다)', variant: 'DANGER' }),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800">📝 수납 기록 추가</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">계약 (호실 / 세입자)</label>
                        <select value={contractId} onChange={e => setContractId(Number(e.target.value))}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                            <option value="">선택해주세요</option>
                            {contracts.map(c => (
                                <option key={c.id} value={c.id}>{c.roomNumber}호 - {c.tenantName}{getRoomStatusText(c.roomNumber)}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-slate-700 mb-1">청구 연도</label>
                            <input type="number" value={year} onChange={e => setYear(Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-slate-700 mb-1">청구 월</label>
                            <input type="number" min={1} max={12} value={month} onChange={e => setMonth(Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50">취소</button>
                    <button onClick={handleSubmit} disabled={isPending || !contractId}
                        className="flex-1 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 shadow-lg shadow-slate-500/30 disabled:opacity-50">
                        {isPending ? '처리 중...' : '추가하기'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────
export default function LedgerPage() {
    const now = new Date();
    const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [search, setSearch] = useState('');
    const [showUnpaidOnly, setShowUnpaidOnly] = useState(false);
    const [collectTarget, setCollectTarget] = useState<PaymentResponse | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data: buildings = [] } = useBuildings();
    const activeBuildingId = selectedBuildingId ?? buildings[0]?.id ?? null;
    const { data: ledger, isFetching } = useLedger(activeBuildingId, year, month);
    const { mutate: deletePayment } = useDeletePayment(activeBuildingId ?? 0, year, month);
    const { showConfirm, showAlert } = useModal();

    const prevMonth = () => { if (month === 1) { setYear(y => y - 1); setMonth(12); } else setMonth(m => m - 1); };
    const nextMonth = () => { if (month === 12) { setYear(y => y + 1); setMonth(1); } else setMonth(m => m + 1); };

    const filteredPayments = (ledger?.payments ?? []).filter(p => {
        const matchSearch = p.roomNumber.includes(search) || p.tenantName.includes(search);
        const matchUnpaid = !showUnpaidOnly || p.status !== 'PAID';
        return matchSearch && matchUnpaid;
    });

    const handleDelete = (payment: PaymentResponse) => {
        showConfirm({
            title: '수납 기록 삭제',
            message: `${payment.roomNumber} ${payment.tenantName}님의\n${year}년 ${month}월 수납 기록을 삭제하시겠습니까?`,
            variant: 'DANGER',
            confirmLabel: '삭제',
            onConfirm: () => deletePayment(payment.id, {
                onError: () => showAlert({ title: '오류', message: '삭제에 실패했습니다.', variant: 'DANGER' }),
            }),
        });
    };

    return (
        <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-screen">

            {/* 헤더: 건물 선택 + 월 선택 + 통계 */}
            <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* 건물 선택 */}
                    <select
                        value={activeBuildingId ?? ''}
                        onChange={e => setSelectedBuildingId(Number(e.target.value))}
                        className="bg-white border border-slate-300 text-slate-700 py-2 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                        {buildings.map(b => <option key={b.id} value={b.id}>🏢 {b.name}</option>)}
                        {buildings.length === 0 && <option value="">건물 없음</option>}
                    </select>

                    {/* 월 선택 */}
                    <div className="flex items-center gap-4">
                        <button onClick={prevMonth} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">◀</button>
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-slate-800">{year}년 {month}월</h2>
                            {ledger && <p className="text-xs text-slate-400">총 청구액: {ledger.totalBilled.toLocaleString()}원</p>}
                        </div>
                        <button onClick={nextMonth} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">▶</button>
                    </div>

                    {/* 통계 */}
                    {ledger ? (
                        <div className="flex gap-6 text-sm">
                            <div className="text-center">
                                <div className="text-slate-400 text-xs">징수율</div>
                                <div className="font-bold text-blue-600 text-lg">{ledger.collectionRate}%</div>
                            </div>
                            <div className="w-px h-8 bg-slate-200"></div>
                            <div className="text-center">
                                <div className="text-slate-400 text-xs">미수금</div>
                                <div className="font-bold text-red-500 text-lg">{(ledger.unpaidAmount / 10000).toFixed(0)}만원</div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-6 text-sm text-slate-300">데이터 없음</div>
                    )}
                </div>
            </div>

            {/* 필터 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <input type="text" placeholder="호실 또는 이름 검색" value={search} onChange={e => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm w-48 md:w-64" />
                        <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
                    </div>
                    <button onClick={() => setShowUnpaidOnly(v => !v)}
                        className={`px-3 py-2 rounded-lg text-sm font-bold border transition ${showUnpaidOnly ? 'bg-red-50 text-red-600 border-red-200' : 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100'}`}>
                        {showUnpaidOnly ? '전체 보기' : '미납만 보기'}
                    </button>
                </div>
                {activeBuildingId && (
                    <button onClick={() => setIsCreateModalOpen(true)}
                        className="px-4 py-2 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-900 shadow-sm whitespace-nowrap">
                        + 수납 기록 추가
                    </button>
                )}
            </div>

            {/* 로딩 */}
            {isFetching && (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="animate-pulse h-16 bg-white rounded-2xl border border-slate-200" />)}
                </div>
            )}

            {/* 데이터 없음 */}
            {!isFetching && !ledger && (
                <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                    <p className="text-slate-400">건물을 선택하면 장부가 표시됩니다.</p>
                </div>
            )}

            {/* 장부 없음 */}
            {!isFetching && ledger && ledger.payments.length === 0 && (
                <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                    <p className="text-slate-400 text-lg">{year}년 {month}월 수납 기록이 없습니다.</p>
                    <p className="text-slate-400 text-sm mt-2">계약에서 청구서를 생성하거나 직접 추가해주세요.</p>
                </div>
            )}

            {/* [모바일] 카드 리스트 */}
            {!isFetching && filteredPayments.length > 0 && (
                <div className="block md:hidden space-y-4">
                    {filteredPayments.map(item => (
                        <div key={item.id}
                            className={`bg-white p-5 rounded-xl shadow-sm border relative overflow-hidden ${item.status === 'UNPAID' ? 'border-red-200' : 'border-slate-200'}`}>
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.status === 'PAID' ? 'bg-green-500' : item.status === 'UNPAID' ? 'bg-red-500' : 'bg-orange-400'}`} />
                            <div className="flex justify-between items-start mb-3 pl-2">
                                <div>
                                    <span className="text-lg font-bold text-slate-800 mr-2">{item.roomNumber}</span>
                                    <span className="text-slate-600">{item.tenantName}</span>
                                </div>
                                {STATUS_BADGE[item.status]}
                            </div>
                            <div className="pl-2 space-y-1 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">청구액</span>
                                    <span className="font-medium">{item.billedAmount.toLocaleString()}원</span>
                                </div>
                                {item.status === 'PARTIAL' && (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">납부됨</span>
                                            <span className="text-green-600 font-bold">{item.paidAmount.toLocaleString()}원</span>
                                        </div>
                                        <div className="flex justify-between text-sm bg-red-50 p-1.5 rounded">
                                            <span className="text-red-500 font-bold">잔액</span>
                                            <span className="text-red-600 font-bold">{(item.billedAmount - item.paidAmount).toLocaleString()}원</span>
                                        </div>
                                    </>
                                )}
                                {item.overdueDays && (
                                    <div className="text-xs text-red-500 font-bold">⚠ {item.overdueDays}일 연체</div>
                                )}
                            </div>
                            <div className="pl-2">
                                {item.status !== 'PAID' ? (
                                    <button onClick={() => setCollectTarget(item)}
                                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">
                                        💳 수납 처리하기
                                    </button>
                                ) : (
                                    <button onClick={() => handleDelete(item)}
                                        className="w-full bg-slate-100 text-slate-500 py-2 rounded-xl font-medium text-sm hover:bg-red-50 hover:text-red-500">
                                        삭제
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* [PC] 테이블 */}
            {!isFetching && filteredPayments.length > 0 && (
                <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wide border-b border-slate-200">
                            <tr>
                                <th className="p-5 font-semibold">호실</th>
                                <th className="p-5 font-semibold">세입자</th>
                                <th className="p-5 font-semibold text-right">청구액</th>
                                <th className="p-5 font-semibold text-center">납부 상태</th>
                                <th className="p-5 font-semibold text-right">납부액 / 잔액</th>
                                <th className="p-5 font-semibold">납부일 / 방법</th>
                                <th className="p-5 font-semibold text-center">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                            {filteredPayments.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50 transition">
                                    <td className="p-5 font-bold text-slate-800">{item.roomNumber}</td>
                                    <td className="p-5 font-medium">{item.tenantName}</td>
                                    <td className="p-5 text-right font-medium text-slate-600">{item.billedAmount.toLocaleString()}원</td>
                                    <td className="p-5 text-center">
                                        {STATUS_BADGE[item.status]}
                                        {item.overdueDays && (
                                            <div className="text-xs text-red-500 font-bold mt-1">+{item.overdueDays}일 연체</div>
                                        )}
                                    </td>
                                    <td className="p-5 text-right">
                                        {item.status === 'PAID' ? (
                                            <span className="text-slate-400">-</span>
                                        ) : item.status === 'PARTIAL' ? (
                                            <div className="flex flex-col items-end">
                                                <span className="text-green-600 font-bold">{item.paidAmount.toLocaleString()}원</span>
                                                <span className="text-xs text-red-500 font-bold">(잔액: {(item.billedAmount - item.paidAmount).toLocaleString()})</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-300">0원</span>
                                        )}
                                    </td>
                                    <td className="p-5 text-slate-500 text-xs">
                                        {item.paymentDate ? (
                                            <div>
                                                <div>{item.paymentDate}</div>
                                                <div className="text-slate-400">{item.paymentMethod}</div>
                                            </div>
                                        ) : <span className="text-slate-300">-</span>}
                                        {item.memo && <div className="text-orange-500 mt-1">{item.memo}</div>}
                                    </td>
                                    <td className="p-5 text-center">
                                        {item.status !== 'PAID' ? (
                                            <button onClick={() => setCollectTarget(item)}
                                                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg font-bold text-xs hover:bg-blue-700 shadow-sm">
                                                수납 처리
                                            </button>
                                        ) : (
                                            <button onClick={() => handleDelete(item)}
                                                className="text-slate-400 hover:text-red-500 underline text-xs">
                                                삭제
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 수납 처리 모달 */}
            {collectTarget && activeBuildingId && (
                <CollectModal
                    payment={collectTarget}
                    buildingId={activeBuildingId}
                    year={year}
                    month={month}
                    onClose={() => setCollectTarget(null)}
                />
            )}

            {/* 수납 기록 추가 모달 */}
            {isCreateModalOpen && activeBuildingId && (
                <PaymentCreateModal
                    buildingId={activeBuildingId}
                    initialYear={year}
                    initialMonth={month}
                    onClose={() => setIsCreateModalOpen(false)}
                />
            )}
        </div>
    );
}
