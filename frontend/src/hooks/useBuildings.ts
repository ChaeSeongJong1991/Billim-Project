'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export type BuildingType = 'APARTMENT' | 'VILLA' | 'OFFICE' | 'SHOP' | 'ETC';

export interface Building {
    id: number;
    name: string;
    address: string;
    type: BuildingType;
}

export interface BuildingCreateRequest {
    name: string;
    address: string;
    type: BuildingType;
}

const fetchBuildings = async (): Promise<Building[]> => {
    const { data } = await api.get('/buildings');
    return data;
};

export function useBuildings() {
    return useQuery({
        queryKey: ['buildings'],
        queryFn: fetchBuildings,
    });
}

export function useCreateBuilding() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (req: BuildingCreateRequest) => api.post('/buildings', req),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['buildings'] }),
    });
}

export function useDeleteBuilding() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.delete(`/buildings/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['buildings'] }),
    });
}
