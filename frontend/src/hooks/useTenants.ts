'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export interface Tenant {
    id: number;
    name: string;
    phoneNumber: string;
    isAppUser: boolean;
}

export interface TenantCreateRequest {
    name: string;
    phoneNumber: string;
}

const fetchTenants = async (): Promise<Tenant[]> => {
    const { data } = await api.get('/tenants');
    return data;
};

export function useTenants() {
    return useQuery({
        queryKey: ['tenants'],
        queryFn: fetchTenants,
    });
}

export function useCreateTenant() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (req: TenantCreateRequest) => api.post('/tenants', req),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tenants'] }),
    });
}

export function useUpdateTenant() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, req }: { id: number; req: TenantCreateRequest }) =>
            api.put(`/tenants/${id}`, req),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tenants'] }),
    });
}

export function useDeleteTenant() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.delete(`/tenants/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tenants'] }),
    });
}
