'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export type PaymentStatus = 'UNPAID' | 'PARTIAL' | 'PAID';

export interface PaymentResponse {
    id: number;
    contractId: number;
    roomNumber: string;
    tenantName: string;
    billingYear: number;
    billingMonth: number;
    billedAmount: number;
    paidAmount: number;
    status: PaymentStatus;
    paymentDate: string | null;
    paymentMethod: string | null;
    memo: string | null;
    overdueDays: number | null;
}

export interface LedgerSummary {
    totalBilled: number;
    totalPaid: number;
    collectionRate: number;
    unpaidAmount: number;
    payments: PaymentResponse[];
}

export interface DashboardSummary {
    unpaidCount: number;
    unpaidAmount: number;
}

export interface PaymentCreateRequest {
    contractId: number;
    billingYear: number;
    billingMonth: number;
}

export interface PaymentCollectRequest {
    paidAmount: number;
    paymentMethod?: string;
    memo?: string;
}

export interface ShareLinkResponse {
    paymentId: number;
    shareToken: string;
    shareUrl: string;
}

export interface PublicPaymentResponse {
    id: number;
    buildingName: string;
    roomNumber: string;
    tenantName: string;
    billingYear: number;
    billingMonth: number;
    billedAmount: number;
    paidAmount: number;
    status: PaymentStatus;
    paymentDate: string | null;
    paymentMethod: string | null;
}

// 월별 장부 조회
export function useLedger(buildingId: number | null, year: number, month: number) {
    return useQuery({
        queryKey: ['ledger', buildingId, year, month],
        queryFn: async (): Promise<LedgerSummary> => {
            const { data } = await api.get('/payments/ledger', {
                params: { buildingId, year, month }
            });
            return data;
        },
        enabled: buildingId !== null,
    });
}

// 대시보드 미납 요약
export function useDashboardSummary() {
    return useQuery({
        queryKey: ['dashboard-summary'],
        queryFn: async (): Promise<DashboardSummary> => {
            const { data } = await api.get('/payments/dashboard-summary');
            return data;
        },
    });
}

// 청구서 생성
export function useCreatePayment(buildingId: number, year: number, month: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (req: PaymentCreateRequest) => api.post('/payments', req),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ledger', buildingId, year, month] }),
    });
}

// 수납 처리
export function useCollectPayment(buildingId: number, year: number, month: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ paymentId, req }: { paymentId: number; req: PaymentCollectRequest }) =>
            api.patch(`/payments/${paymentId}/collect`, req),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ledger', buildingId, year, month] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
        },
    });
}

// 수납 기록 삭제
export function useDeletePayment(buildingId: number, year: number, month: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (paymentId: number) => api.delete(`/payments/${paymentId}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ledger', buildingId, year, month] }),
    });
}

// 공유 링크 생성
export function useSharePayment() {
    return useMutation({
        mutationFn: async (paymentId: number): Promise<ShareLinkResponse> => {
            const { data } = await api.post(`/payments/${paymentId}/share`);
            return data;
        },
    });
}

// 공개 청구서 조회 (인증 불필요 — publicApi 사용)
import publicApi from '@/lib/axiosPublic';

export function usePublicPayment(token: string) {
    return useQuery({
        queryKey: ['public-payment', token],
        queryFn: async (): Promise<PublicPaymentResponse> => {
            const { data } = await publicApi.get(`/payments/public/${token}`);
            return data;
        },
        enabled: !!token,
    });
}
