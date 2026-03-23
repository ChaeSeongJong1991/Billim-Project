'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export interface LandlordDashboard {
    expiringContractCount: number;
    totalRooms: number;
    occupiedRooms: number;
    occupancyRate: number;
    unpaidCount: number;
    unpaidAmount: number;
}

const fetchLandlordDashboard = async (): Promise<LandlordDashboard> => {
    const { data } = await api.get('/dashboard/landlord');
    return data;
};

export function useLandlordDashboard() {
    return useQuery({
        queryKey: ['dashboard', 'landlord'],
        queryFn: fetchLandlordDashboard,
    });
}

export interface DailyPaymentStatus {
    date: string;
    expectedAmount: number;
    paidAmount: number;
    status: 'PAID' | 'WAITING' | 'OVERDUE';
}

export interface DashboardCalendarResponse {
    year: number;
    month: number;
    dailyStatuses: DailyPaymentStatus[];
}

export function useDashboardCalendar(year: number, month: number) {
    return useQuery({
        queryKey: ['dashboard', 'calendar', year, month],
        queryFn: async () => {
            const { data } = await api.get<DashboardCalendarResponse>('/dashboard/calendar', {
                params: { year, month }
            });
            return data;
        }
    });
}
