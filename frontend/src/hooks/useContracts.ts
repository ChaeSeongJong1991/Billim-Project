'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export type ContractType = 'MONTHLY_POST' | 'MONTHLY_PRE' | 'MONTHLY_PREPAID' | 'JEONSE';
export type RenewalStatus = 'ACTIVE' | 'RENEWED' | 'EXPIRED' | 'TERMINATED';
export type RenewType = 'KEEP' | 'MODIFY';

export interface ContractCreateRequest {
    buildingId: number;
    roomNumber: string;
    contractType: ContractType;
    tenantName: string;
    tenantPhone: string;
    deposit: number;
    monthlyRent: number;
    maintenanceFee: number;
    rentDay: number;
    startDate: string;
    endDate: string;
    householdCount: number;
    memo?: string;
}

export interface ContractResponse {
    id: number;
    buildingId: number;
    buildingName: string;
    roomNumber: string;
    contractType: ContractType;
    tenantName: string;
    tenantPhone: string;
    deposit: number;
    monthlyRent: number;
    maintenanceFee: number;
    rentDay: number;
    startDate: string;
    endDate: string;
    householdCount: number;
    memo?: string;
    renewalStatus: RenewalStatus;
    parentContractId?: number;
}

export interface ExpiringContractResponse {
    id: number;
    buildingId: number;
    buildingName: string;
    roomNumber: string;
    tenantName: string;
    tenantPhone: string;
    monthlyRent: number;
    deposit: number;
    startDate: string;
    endDate: string;
    daysLeft: number;
    contractType: ContractType;
    renewalStatus: RenewalStatus;
}

export interface ContractRenewRequest {
    renewType: RenewType;
    newEndDate: string;
    newStartDate?: string;
    monthlyRent?: number;
    deposit?: number;
    maintenanceFee?: number;
    rentDay?: number;
    memo?: string;
}

export interface ContractUpdateRequest {
    contractType: ContractType;
    tenantName: string;
    tenantPhone: string;
    deposit: number;
    monthlyRent: number;
    maintenanceFee: number;
    rentDay: number;
    startDate: string;
    endDate: string;
    householdCount: number;
    memo?: string;
}

export function useContracts(buildingId: number | null) {
    return useQuery({
        queryKey: ['contracts', buildingId],
        queryFn: async () => {
            const { data } = await api.get<ContractResponse[]>(`/contracts/building/${buildingId}`);
            return data;
        },
        enabled: buildingId !== null,
    });
}

export function useContractByRoom(buildingId: number | null, roomNumber: string | null) {
    return useQuery({
        queryKey: ['contract', buildingId, roomNumber],
        queryFn: async () => {
            const { data } = await api.get<ContractResponse>(`/contracts/building/${buildingId}/room/${encodeURIComponent(roomNumber!)}`);
            return data;
        },
        enabled: buildingId !== null && roomNumber !== null,
    });
}

export function useUpdateContract() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ contractId, req }: { contractId: number; req: ContractUpdateRequest }) =>
            api.put(`/contracts/${contractId}`, req),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contract'] });
            queryClient.invalidateQueries({ queryKey: ['contracts'] });
        },
    });
}

export function useCreateContract() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (req: ContractCreateRequest) => api.post('/contracts', req),
        onSuccess: (_, req) => {
            queryClient.invalidateQueries({ queryKey: ['contracts', req.buildingId] });
            queryClient.invalidateQueries({ queryKey: ['rooms', req.buildingId] });
        },
    });
}

export function useExpiringContracts(days: number = 30) {
    return useQuery({
        queryKey: ['contracts', 'expiring', days],
        queryFn: async () => {
            const { data } = await api.get<ExpiringContractResponse[]>(`/contracts/expiring?days=${days}`);
            return data;
        },
        staleTime: 5 * 60 * 1000, // 5분 캐싱 — 사이드바 배지 불필요한 재요청 방지
    });
}

export function useRenewContract() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ contractId, req }: { contractId: number; req: ContractRenewRequest }) =>
            api.post<number>(`/contracts/${contractId}/renew`, req),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contracts'] });
            queryClient.invalidateQueries({ queryKey: ['contracts', 'expiring'] });
        },
    });
}

export function useTerminateContract() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (contractId: number) => api.patch(`/contracts/${contractId}/terminate`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contracts'] });
            queryClient.invalidateQueries({ queryKey: ['contracts', 'expiring'] });
        },
    });
}
