export type UserRole = 'admin' | 'tenant' | 'vendor'

export type WorkOrderStatus = 'pending' | 'in_progress' | 'completed'

export type WorkOrderPriority = 'low' | 'normal' | 'high' | 'urgent'

export type VendorStatus = 'active' | 'inactive' | 'suspended'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

export interface WorkOrder {
  id: string
  title: string
  description: string
  category: string
  priority: WorkOrderPriority
  status: WorkOrderStatus
  tenantId: string
  vendorId?: string
  createdAt: string
  updatedAt: string
}

export interface Vendor {
  id: string
  name: string
  category: string
  phone: string
  email?: string
  address?: string
  status: VendorStatus
  rating?: number
  createdAt: string
}

export interface Tenant {
  id: string
  name: string
  email: string
  phone?: string
  roomId: string
  contractStartDate: string
  contractEndDate: string
  status: string
  createdAt: string
}

export interface MaintenanceGuide {
  id: string
  title: string
  description?: string
  category: string
  content: string
  createdAt: string
  updatedAt?: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

export interface ApiError {
  message: string
  status: number
  code?: string
}
