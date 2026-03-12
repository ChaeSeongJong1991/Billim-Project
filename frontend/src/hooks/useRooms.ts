'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export type PropertyType = 'ONE_ROOM' | 'TWO_ROOM' | 'THREE_ROOM' | 'APT' | 'OFFICE' | 'SHOP' | 'ETC';
export type RoomStatus = 'VACANT' | 'OCCUPIED' | 'MAINTENANCE';

export interface Room {
    id: number;
    roomNumber: string;
    managementNumber: string | null;
    propertyType: PropertyType;
    floor: number;
    status: RoomStatus;
    buildingId: number;
    buildingName: string;
}

export interface RoomCreateRequest {
    roomNumber: string;
    managementNumber?: string;
    propertyType: PropertyType;
    floor: number;
}

export interface RoomUpdateRequest {
    roomNumber: string;
    managementNumber?: string;
    propertyType: PropertyType;
    floor: number;
}

const fetchRooms = async (buildingId: number): Promise<Room[]> => {
    const { data } = await api.get(`/buildings/${buildingId}/rooms`);
    return data;
};

export function useRooms(buildingId: number | null) {
    return useQuery({
        queryKey: ['rooms', buildingId],
        queryFn: () => fetchRooms(buildingId!),
        enabled: buildingId !== null,
    });
}

export function useCreateRoom(buildingId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (req: RoomCreateRequest) => api.post(`/buildings/${buildingId}/rooms`, req),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms', buildingId] }),
    });
}

export function useUpdateRoom(buildingId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ roomId, req }: { roomId: number; req: RoomUpdateRequest }) =>
            api.put(`/buildings/${buildingId}/rooms/${roomId}`, req),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms', buildingId] }),
    });
}

export function useUpdateRoomStatus(buildingId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ roomId, status }: { roomId: number; status: RoomStatus }) =>
            api.patch(`/buildings/${buildingId}/rooms/${roomId}/status`, { status }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms', buildingId] }),
    });
}

export function useDeleteRoom(buildingId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (roomId: number) => api.delete(`/buildings/${buildingId}/rooms/${roomId}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms', buildingId] }),
    });
}
