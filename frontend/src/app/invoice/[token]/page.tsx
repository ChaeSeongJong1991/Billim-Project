'use client';

import { useParams } from 'next/navigation';
import { usePublicPayment } from '@/hooks/usePayments';

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
    PAID: { text: '완납', color: 'text-green-600 bg-green-50 border-green-200' },
    PARTIAL: { text: '부분 납부', color: 'text-orange-600 bg-orange-50 border-orange-200' },
    UNPAID: { text: '미납', color: 'text-red-600 bg-red-50 border-red-200' },
};

export default function InvoicePage() {
    const params = useParams();
    const token = typeof params.token === 'string' ? params.token : '';
    const { data: payment, isLoading, isError } = usePublicPayment(token);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-slate-400 text-sm">청구서를 불러오는 중...</div>
            </div>
        );
    }

    if (isError || !payment) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center space-y-2">
                    <p className="text-slate-600 font-medium">유효하지 않은 청구서 링크입니다.</p>
                    <p className="text-slate-400 text-sm">링크가 만료되었거나 잘못된 주소입니다.</p>
                </div>
            </div>
        );
    }

    const status = STATUS_LABEL[payment.status] ?? STATUS_LABEL.UNPAID;
    const remainingAmount = payment.billedAmount - payment.paidAmount;

    return (
        <div className="min-h-screen bg-slate-50 flex items-start justify-center py-12 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* 헤더 */}
                <div className="bg-[#0F3460] px-6 py-5 text-white">
                    <p className="text-xs text-blue-200 mb-1">BILLIM 청구서</p>
                    <h1 className="text-xl font-bold">{payment.billingYear}년 {payment.billingMonth}월 청구서</h1>
                    <p className="text-blue-200 text-sm mt-1">{payment.buildingName} {payment.roomNumber}호</p>
                </div>

                {/* 납부 상태 배지 */}
                <div className="px-6 py-4 border-b border-slate-100">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${status.color}`}>
                        {status.text}
                    </span>
                </div>

                {/* 임차인 정보 */}
                <div className="px-6 py-4 border-b border-slate-100 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-500">임차인</span>
                        <span className="font-medium text-slate-800">{payment.tenantName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">건물</span>
                        <span className="font-medium text-slate-800">{payment.buildingName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">호실</span>
                        <span className="font-medium text-slate-800">{payment.roomNumber}호</span>
                    </div>
                </div>

                {/* 금액 정보 */}
                <div className="px-6 py-4 border-b border-slate-100 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">청구 금액</span>
                        <span className="font-semibold text-slate-800">{payment.billedAmount.toLocaleString()}원</span>
                    </div>
                    {payment.paidAmount > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">납부 금액</span>
                            <span className="font-semibold text-green-600">{payment.paidAmount.toLocaleString()}원</span>
                        </div>
                    )}
                    {payment.status !== 'PAID' && remainingAmount > 0 && (
                        <div className="flex justify-between text-sm bg-red-50 rounded-lg px-3 py-2">
                            <span className="text-red-600 font-semibold">미납 잔액</span>
                            <span className="font-bold text-red-600">{remainingAmount.toLocaleString()}원</span>
                        </div>
                    )}
                </div>

                {/* 납부 이력 */}
                {payment.paymentDate && (
                    <div className="px-6 py-4 border-b border-slate-100 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-500">납부일</span>
                            <span className="font-medium text-slate-800">{payment.paymentDate}</span>
                        </div>
                        {payment.paymentMethod && (
                            <div className="flex justify-between">
                                <span className="text-slate-500">납부 방법</span>
                                <span className="font-medium text-slate-800">{payment.paymentMethod}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* 푸터 */}
                <div className="px-6 py-4 text-center">
                    <p className="text-xs text-slate-400">BILLIM 임대 관리 플랫폼에서 발행된 청구서입니다.</p>
                </div>
            </div>
        </div>
    );
}
