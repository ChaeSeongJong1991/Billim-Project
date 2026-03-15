'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface Vendor {
  id: string
  name: string
  category?: string
  phone?: string
  email?: string
  address?: string
  status?: string
  description?: string
  rating?: number
  createdAt?: string
}

interface CreateVendorData {
  name: string
  category: string
  phone: string
  email?: string
  address?: string
}

export function useVendors() {
  return useQuery<Vendor[]>({
    queryKey: ['vendors'],
    queryFn: async () => {
      const response = await api.get('/api/vendors')
      return response.data
    },
  })
}

export function useVendor(id: string) {
  return useQuery<Vendor>({
    queryKey: ['vendors', id],
    queryFn: async () => {
      const response = await api.get(`/api/vendors/${id}`)
      return response.data
    },
  })
}

export function useCreateVendor() {
  return useMutation({
    mutationFn: async (data: CreateVendorData) => {
      const response = await api.post('/api/vendors', data)
      return response.data
    },
  })
}

export function useUpdateVendor(id: string) {
  return useMutation({
    mutationFn: async (data: Partial<Vendor>) => {
      const response = await api.patch(`/api/vendors/${id}`, data)
      return response.data
    },
  })
}
