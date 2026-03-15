'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface MaintenanceGuide {
  id: string
  title: string
  description?: string
  category: string
  content: string
  createdAt?: string
  updatedAt?: string
}

interface CreateGuideData {
  title: string
  description?: string
  category: string
  content: string
}

export function usePreventiveMaintenance() {
  return useQuery<MaintenanceGuide[]>({
    queryKey: ['maintenance-guides'],
    queryFn: async () => {
      const response = await api.get('/api/maintenance-guides')
      return response.data
    },
  })
}

export function useMaintenanceGuide(id: string) {
  return useQuery<MaintenanceGuide>({
    queryKey: ['maintenance-guides', id],
    queryFn: async () => {
      const response = await api.get(`/api/maintenance-guides/${id}`)
      return response.data
    },
  })
}

export function useCreateGuide() {
  return useMutation({
    mutationFn: async (data: CreateGuideData) => {
      const response = await api.post('/api/maintenance-guides', data)
      return response.data
    },
  })
}

export function useUpdateGuide(id: string) {
  return useMutation({
    mutationFn: async (data: Partial<MaintenanceGuide>) => {
      const response = await api.patch(`/api/maintenance-guides/${id}`, data)
      return response.data
    },
  })
}
