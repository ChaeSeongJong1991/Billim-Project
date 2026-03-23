import React, { useState } from 'react';
import { useExpenses, useCreateExpense, useDeleteExpense } from '@/hooks/useExpenses';
import { useModal } from '@/app/context/ModalContext';
import { formatMoneyInput, parseMoneyInput } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

interface ExpenseLedgerProps {
    buildingId: number;
    year: number;
    month: number;
}

const CATEGORY_LABELS: Record<string, string> = {
    REPAIR: '수선유지비',
    TAX: '세금/공과금',
    INTEREST: '대출이자',
    INSURANCE: '보험료',
    UTILITY: '공동전기/수도',
    MAINTENANCE: '청소/용역비',
    ETC: '기타 지출'
};

export function ExpenseLedger({ buildingId, year, month }: ExpenseLedgerProps) {
    const { data: expenses, isLoading } = useExpenses(year, month);
    const { mutate: createExpense, isPending: isCreating } = useCreateExpense(year, month);
    const { mutate: deleteExpense } = useDeleteExpense(year, month);
    const { showConfirm, showAlert } = useModal();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [dateDay, setDateDay] = useState<string>('1');
    const [category, setCategory] = useState<string>('REPAIR');
    const [amountRaw, setAmountRaw] = useState('');
    const [description, setDescription] = useState('');

    const filteredExpenses = (expenses || []).filter(e => e.buildingId === buildingId);
    const totalExpense = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

    const handleCreate = () => {
        const amount = parseMoneyInput(amountRaw);
        if (amount <= 0) {
            showAlert({ title: '입력 오류', message: '올바른 금액을 입력해주세요.', variant: 'DANGER' });
            return;
        }
        
        // Construct YYYY-MM-DD
        const formattedMonth = month.toString().padStart(2, '0');
        const formattedDay = dateDay.toString().padStart(2, '0');
        const expenseDate = `${year}-${formattedMonth}-${formattedDay}`;

        createExpense({
            buildingId,
            expenseDate,
            category,
            amount,
            description
        }, {
            onSuccess: () => {
                setAmountRaw('');
                setDescription('');
                setIsFormOpen(false);
                showAlert({ title: '성공', message: '지출 내역이 등록되었습니다.', variant: 'SUCCESS' });
            }
        });
    };

    const handleDelete = (id: number) => {
        showConfirm({
            title: '지출 내역 삭제',
            message: '이 지출 내역을 삭제하시겠습니까?',
            variant: 'DANGER',
            confirmLabel: '삭제하기',
            onConfirm: () => {
                deleteExpense(id, {
                    onSuccess: () => showAlert({ title: '삭제됨', message: '지출 내역이 삭제되었습니다.', variant: 'SUCCESS' })
                });
            }
        });
    };

    if (isLoading) return <div className="p-8 text-center text-slate-400">지출 내역을 불러오는 중...</div>;

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl mb-2 shadow-sm border border-slate-100/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative z-10">
                    <h3 className="font-extrabold text-slate-800 text-xl tracking-tight">이번 달 총 지출</h3>
                    <p className="text-sm text-slate-500 font-medium tracking-wide">{year}년 {month}월</p>
                </div>
                <div className="text-right relative z-10">
                    <p className="text-3xl md:text-4xl font-extrabold text-red-500 tracking-tight">{totalExpense.toLocaleString()}<span className="text-lg md:text-xl font-bold ml-1 text-red-400">원</span></p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        지출 상세 내역
                    </h3>
                    <button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200">
                        {isFormOpen ? '등록 폼 닫기' : '+ 새 지출 등록'}
                    </button>
                </div>

                {isFormOpen && (
                    <div className="p-6 bg-slate-50 border-t border-b border-slate-100 grid grid-cols-1 md:grid-cols-5 gap-4 items-end animate-in fade-in slide-in-from-top-4 duration-300">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">발생 일(Day)</label>
                            <input type="number" min="1" max="31" value={dateDay} onChange={e => setDateDay(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white font-medium" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">지출 분류</label>
                            <select value={category} onChange={e => setCategory(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 font-medium">
                                {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">금액 (원)</label>
                            <input type="text" inputMode="numeric" value={amountRaw} placeholder="예: 50,000"
                                onChange={e => setAmountRaw(formatMoneyInput(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 font-bold text-red-500" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">적요 (선택)</label>
                            <input type="text" value={description} placeholder="수도 배관 수리"
                                onChange={e => setDescription(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 font-medium" />
                        </div>
                        <button onClick={handleCreate} disabled={isCreating || !amountRaw}
                            className="w-full md:col-span-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 disabled:opacity-50 h-[48px] shadow-lg shadow-red-500/30 transition-all active:scale-95">
                            {isCreating ? '저장 중...' : '지출 등록'}
                        </button>
                    </div>
                )}

                {filteredExpenses.length === 0 ? (
                    <div className="p-16 flex flex-col items-center justify-center text-slate-400">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                            <span className="text-2xl opacity-50">💸</span>
                        </div>
                        <p className="font-medium text-slate-500">등록된 지출 내역이 없습니다.</p>
                        <p className="text-sm mt-1">유지보수, 세금 등 건물 운영에 쓰인 비용을 등록해 보세요.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="text-slate-500 border-b border-slate-100 bg-white">
                                <tr>
                                    <th className="px-8 py-4 font-bold text-xs uppercase tracking-wider">일자</th>
                                    <th className="px-8 py-4 font-bold text-xs uppercase tracking-wider">분류</th>
                                    <th className="px-8 py-4 font-bold text-xs uppercase tracking-wider text-right">금액</th>
                                    <th className="px-8 py-4 font-bold text-xs uppercase tracking-wider w-full">적요</th>
                                    <th className="px-8 py-4 font-bold text-xs uppercase tracking-wider text-center">관리</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredExpenses.map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-8 py-5 text-slate-600 font-medium">{item.expenseDate}</td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold tracking-tight">
                                                {CATEGORY_LABELS[item.category] || item.category}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right font-extrabold text-red-500">- {item.amount.toLocaleString()}원</td>
                                        <td className="px-8 py-5 text-slate-600 font-medium">{item.description || '-'}</td>
                                        <td className="px-8 py-5 text-center">
                                            <button onClick={() => handleDelete(item.id)} className="text-slate-300 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
