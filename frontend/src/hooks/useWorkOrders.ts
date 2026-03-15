'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface WorkOrder {
  id: string
  title: string
  description?: string
  category: string
  priority: string
  status: string
  tenantId?: string
  vendorId?: string
  createdAt: string
  updatedAt?: string
}

interface CreateWorkOrderData {
  title: string
  description: string
  category: string
  priority: string
}

export function useWorkOrders() {
  return useQuery<WorkOrder[]>({
    queryKey: ['workOrders'],
    queryFn: async () => {
      const response = await api.get('/api/work-orders')
      return response.data
    },
  })
}

export function useWorkOrder(id: string) {
  return useQuery<WorkOrder>({
    queryKey: ['workOrders', id],
    queryFn: async () => {
      const response = await api.get(`/api/work-orders/${id}`)
      return response.data
    },
  })
}

export function useCreateWorkOrder() {
  return useMutation({
    mutationFn: async (data: CreateWorkOrderData) => {
      const response = await api.post('/api/work-orders', data)
      return response.data
    },
  })
}

export function useUpdateWorkOrder(id: string) {
  return useMutation({
    mutationFn: async (data: Partial<WorkOrder>) => {
      const response = await api.patch(`/api/work-orders/${id}`, data)
      return response.data
    },
  })
}
