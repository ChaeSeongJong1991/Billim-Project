export interface ExpenseResponse {
    id: number;
    buildingId: number;
    buildingName: string;
    expenseDate: string;
    category: string;
    amount: number;
    description: string | null;
}

export interface ExpenseCreateRequest {
    buildingId: number;
    expenseDate: string;
    category: string;
    amount: number;
    description?: string;
}

export interface ProfitabilityResponse {
    year: number;
    month: number;
    revenue: number;
    expense: number;
    netProfit: number;
    margin: number;
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export function useExpenses(year: number, month: number) {
    return useQuery({
        queryKey: ['expenses', year, month],
        queryFn: async (): Promise<ExpenseResponse[]> => {
            const { data } = await api.get('/expenses', { params: { year, month } });
            return data;
        },
    });
}

export function useCreateExpense(year: number, month: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (req: ExpenseCreateRequest) => api.post('/expenses', req),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses', year, month] });
            queryClient.invalidateQueries({ queryKey: ['profitability'] });
        },
    });
}

export function useDeleteExpense(year: number, month: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.delete(`/expenses/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses', year, month] });
            queryClient.invalidateQueries({ queryKey: ['profitability'] });
        },
    });
}

export function useProfitability(year: number) {
    return useQuery({
        queryKey: ['profitability', year],
        queryFn: async (): Promise<ProfitabilityResponse[]> => {
            const { data } = await api.get('/expenses/profitability', { params: { year } });
            return data;
        },
    });
}
