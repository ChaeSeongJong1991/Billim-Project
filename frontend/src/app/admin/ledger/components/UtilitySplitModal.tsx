import React, { useState } from 'react';
import { useSplitUtilityBill } from '@/hooks/usePayments';
import { useModal } from '@/app/context/ModalContext';
import { formatMoneyInput, parseMoneyInput } from '@/lib/utils';

interface UtilitySplitModalProps {
    buildingId: number;
    year: number;
    month: number;
    onClose: () => void;
}

export function UtilitySplitModal({ buildingId, year, month, onClose }: UtilitySplitModalProps) {
    const [type, setType] = useState('ELECTRICITY');
    const [totalAmountRaw, setTotalAmountRaw] = useState('');
    const { mutate, isPending } = useSplitUtilityBill(buildingId, year, month);
    const { showAlert } = useModal();

    const handleSubmit = () => {
        const totalAmount = parseMoneyInput(totalAmountRaw);
        if (totalAmount <= 0) {
            showAlert({ title: '알림', message: '총 발생 금액을 입력해주세요.', variant: 'DANGER' });
            return;
        }

        mutate({
            buildingId,
            year,
            month,
            type,
            totalAmount
        }, {
            onSuccess: () => {
                showAlert({ title: '공과금 분납 완료', message: `해당 월 관리비에 공과금이 일괄 청구되었습니다.`, variant: 'SUCCESS' });
                onClose();
            },
            onError: (err: any) => {
                const msg = err.response?.data?.message || '공과금 배분에 실패했습니다.';
                showAlert({ title: '오류', message: msg, variant: 'DANGER' });
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800">🧾 공과금 일괄 부과 (N빵)</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="bg-blue-50 text-blue-800 p-3 rounded-xl text-sm mb-4 leading-relaxed">
                        💡 입력한 금액은 <strong>{year}년 {month}월</strong>에 생성된 모든 활성 청구서에 <span className="font-bold">1/N</span> 비율로 일괄 분배되어 부과됩니다.
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">공과금 항목</label>
                        <select value={type} onChange={e => setType(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                            <option value="ELECTRICITY">전기요금</option>
                            <option value="WATER">수도요금</option>
                            <option value="GAS">가스요금</option>
                            <option value="ETC">기타 관리비</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">총 발생 금액 (원)</label>
                        <input type="text" inputMode="numeric" value={totalAmountRaw}
                            placeholder="예) 50,000"
                            onChange={e => setTotalAmountRaw(formatMoneyInput(e.target.value))}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50">취소</button>
                    <button onClick={handleSubmit} disabled={isPending || !totalAmountRaw}
                        className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 disabled:opacity-50 transition-all">
                        {isPending ? '처리 중...' : '1/N 부과하기'}
                    </button>
                </div>
            </div>
        </div>
    );
}
